<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
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
            'user_id' => $this->user_id,
            'booking_id' => $this->booking_id,
            'rating' => $this->rating,
            'cleanliness_rating' => $this->cleanliness_rating,
            'location_rating' => $this->location_rating,
            'value_rating' => $this->value_rating,
            'communication_rating' => $this->communication_rating,
            'checkin_rating' => $this->checkin_rating,
            'accuracy_rating' => $this->accuracy_rating,
            'comment' => $this->comment,
            'status' => $this->status,
            'is_featured' => (bool) $this->is_featured,
            'user' => new UserResource($this->whenLoaded('user')),
            'property' => new PropertyResource($this->whenLoaded('property')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
