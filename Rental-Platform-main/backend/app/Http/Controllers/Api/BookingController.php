<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Property;
use Illuminate\Http\Request;
use App\Notifications\BookingRequestedNotification;
use App\Notifications\BookingConfirmedNotification;
use App\Notifications\BookingCancelledNotification;
use App\Services\InvoiceService;
use App\Notifications\InvoiceIssuedNotification;

class BookingController extends Controller
{
    use AuthorizesRequests;
    
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $user = $request->user();

        $query = Booking::query()->with(['property', 'guest']);

        // If user is guest, only their bookings; if owner/admin, allow filter
        if ($user->role === 'guest') {
            $query->where('guest_id', $user->id);
        } else {
            if ($request->boolean('mine')) {
                // Owner bookings for their properties
                $query->whereIn('property_id', Property::where('owner_id', $user->id)->pluck('id'));
            }
        }

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        $bookings = $query->latest()->paginate($request->integer('per_page', 15));
        return BookingResource::collection($bookings);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $data = $request->validate([
            'property_id' => ['required', 'exists:properties,id'],
            'check_in' => ['required', 'date'],
            'check_out' => ['required', 'date', 'after:check_in'],
            'guests_count' => ['required', 'integer', 'min:1'],
        ]);

        $property = Property::findOrFail($data['property_id']);

        // Basic pricing (no complex availability rules here)
        $nights = (new \DateTime($data['check_in']))->diff(new \DateTime($data['check_out']))->days;

        // Business rules
        // 1) Guests must not exceed property capacity
        abort_if((int)$data['guests_count'] > (int)$property->max_guests, 422, 'Too many guests for this property.');

        // 2) Respect property availability window if set
        if (!empty($property->available_from) && $data['check_in'] < $property->available_from) {
            abort(422, 'Property is not available yet.');
        }
        if (!empty($property->available_to) && $data['check_out'] > $property->available_to) {
            abort(422, 'Property is not available for the entire selected period.');
        }

        // 3) Minimum/maximum stay
        if (!empty($property->minimum_stay_nights) && $nights < (int)$property->minimum_stay_nights) {
            abort(422, 'Stay is shorter than the minimum allowed nights.');
        }
        if (!empty($property->maximum_stay_nights) && $nights > (int)$property->maximum_stay_nights) {
            abort(422, 'Stay is longer than the maximum allowed nights.');
        }

        // 4) Rental type compatibility
        // Assumption: short_term <= 27 nights, long_term >= 28 nights, both = any
        if ($property->rental_type === 'short_term' && $nights >= 28) {
            abort(422, 'This property only accepts short-term stays.');
        }
        if ($property->rental_type === 'long_term' && $nights < 28) {
            abort(422, 'This property only accepts long-term stays.');
        }

        // 5) No overlapping bookings for same property (block pending/confirmed/completed)
        $overlapExists = \App\Models\Booking::where('property_id', $property->id)
            ->whereIn('status', ['pending','confirmed','completed'])
            ->where(function ($q) use ($data) {
                $q->where('check_in', '<', $data['check_out'])
                  ->where('check_out', '>', $data['check_in']);
            })
            ->exists();
        abort_if($overlapExists, 422, 'Selected dates overlap with an existing booking.');
        $pricePerNight = (float) ($property->price_per_night ?? 0);
        $subtotal = $pricePerNight * $nights;
        $cleaningFee = (float) ($property->cleaning_fee ?? 0);
        $serviceFee = round($subtotal * 0.12, 2);
        $total = $subtotal + $cleaningFee + $serviceFee;

        $booking = Booking::create([
            'property_id' => $property->id,
            'guest_id' => $request->user()->id,
            'check_in' => $data['check_in'],
            'check_out' => $data['check_out'],
            'guests_count' => $data['guests_count'],
            'nights' => $nights,
            'price_per_night' => $pricePerNight,
            'subtotal' => $subtotal,
            'cleaning_fee' => $cleaningFee,
            'service_fee' => $serviceFee,
            'total_price' => $total,
            'status' => 'pending',
            'payment_status' => 'pending',
        ]);

        // Notify both owner and guest about the booking request
        $booking->load(['property.owner', 'guest']);
        if ($booking->property && $booking->property->owner) {
            $booking->property->owner->notify(new BookingRequestedNotification($booking));
        }
        $booking->guest?->notify(new BookingRequestedNotification($booking));

        return new BookingResource($booking->load(['property', 'guest']));
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
    $this->authorize('view', $booking);
        $booking->load(['property', 'guest']);
        return new BookingResource($booking);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Booking $booking)
    {
    $this->authorize('update', $booking);
        $data = $request->validate([
            'status' => ['sometimes', 'in:pending,confirmed,cancelled,completed,rejected'],
            'payment_status' => ['sometimes', 'in:pending,paid,refunded,failed'],
            'special_requests' => ['nullable', 'string'],
        ]);
        $originalStatus = $booking->status;
        $booking->fill($data);

        if (isset($data['status']) && $data['status'] === 'confirmed' && $originalStatus !== 'confirmed') {
            $booking->confirmed_at = now();
        }
        if (isset($data['status']) && $data['status'] === 'cancelled' && $originalStatus !== 'cancelled') {
            $booking->cancelled_at = now();
        }

        $booking->save();

        // Reload relations for notifications
        $booking->load(['property.owner', 'guest']);

        if (isset($data['status']) && $data['status'] === 'confirmed' && $originalStatus !== 'confirmed') {
            // Notify both parties of confirmation
            $booking->guest?->notify(new BookingConfirmedNotification($booking));
            $booking->property?->owner?->notify(new BookingConfirmedNotification($booking));

            // Create and send invoice for bank transfer
            $invoice = app(InvoiceService::class)->createForBooking($booking);
            $booking->guest?->notify(new InvoiceIssuedNotification($invoice));
        }

        if (isset($data['status']) && $data['status'] === 'cancelled' && $originalStatus !== 'cancelled') {
            // Notify both parties of cancellation
            $booking->guest?->notify(new BookingCancelledNotification($booking));
            $booking->property?->owner?->notify(new BookingCancelledNotification($booking));

            // If there is an invoice, mark it cancelled
            if ($booking->invoice) {
                $booking->invoice->status = 'cancelled';
                $booking->invoice->save();
            }
        }

        // If payment marked as paid, mark invoice paid as well
        if (isset($data['payment_status']) && $data['payment_status'] === 'paid' && $booking->invoice) {
            $booking->invoice->status = 'paid';
            $booking->invoice->save();
        }

        return new BookingResource($booking->fresh(['property','guest']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        $this->authorize('delete', $booking);
        $booking->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
