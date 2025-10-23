<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'property_id' => $this->property_id,
            'guest_id' => $this->guest_id,
            'check_in' => $this->check_in,
            'check_out' => $this->check_out,
            'guests_count' => $this->guests_count,
            'nights' => $this->nights,
            'price_per_night' => $this->price_per_night,
            'subtotal' => $this->subtotal,
            'cleaning_fee' => $this->cleaning_fee,
            'service_fee' => $this->service_fee,
            'total_price' => $this->total_price,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'special_requests' => $this->special_requests,
            'property' => new PropertyResource($this->whenLoaded('property')),
            'guest' => new UserResource($this->whenLoaded('guest')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
