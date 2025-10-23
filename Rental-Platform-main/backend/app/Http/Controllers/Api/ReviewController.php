<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::query()->with(['property', 'user']);
        if ($propertyId = $request->integer('property_id')) {
            $query->where('property_id', $propertyId);
        }
        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }
        $reviews = $query->latest()->paginate($request->integer('per_page', 15));
        return ReviewResource::collection($reviews);
    }

    public function show(Review $review)
    {
        $review->load(['property', 'user']);
        return new ReviewResource($review);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'property_id' => ['required', 'exists:properties,id'],
            'booking_id' => ['nullable', 'exists:bookings,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string'],
        ]);

        // Ensure user can only review own booking when booking_id provided
        if (!empty($data['booking_id'])) {
            $booking = Booking::findOrFail($data['booking_id']);
            abort_unless($booking->guest_id === $request->user()->id, 403);
            abort_unless($booking->property_id === (int) $data['property_id'], 422, 'Booking/property mismatch');
        }

        $review = Review::create([
            'property_id' => $data['property_id'],
            'user_id' => $request->user()->id,
            'booking_id' => $data['booking_id'] ?? null,
            'rating' => $data['rating'],
            'comment' => $data['comment'],
            'status' => 'pending',
        ]);

        return new ReviewResource($review->load(['property', 'user']));
    }

    public function update(Request $request, Review $review)
    {
    $this->authorize('update', $review);
        $data = $request->validate([
            'rating' => ['sometimes', 'integer', 'min:1', 'max:5'],
            'comment' => ['sometimes', 'string'],
        ]);
        $review->fill($data)->save();
        return new ReviewResource($review->fresh(['property','user']));
    }

    public function respond(Request $request, Review $review)
    {
        // Only property owner can respond to reviews
        $this->authorize('respond', $review);
        
        $data = $request->validate([
            'response' => ['required', 'string', 'max:1000'],
        ]);
        
        $review->update([
            'response' => $data['response'],
            'responded_at' => now(),
        ]);
        
        return new ReviewResource($review->fresh(['property', 'user']));
    }

    public function destroy(Review $review)
    {
        $this->authorize('delete', $review);
        $review->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
