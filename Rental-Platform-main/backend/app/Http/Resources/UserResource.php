<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'phone' => $this->phone,
            'bio' => $this->bio,
            'profile_photo' => $this->profile_photo,
            'photo_url' => $this->photo_url,
            'is_verified' => (bool) $this->is_verified,
            'verified_at' => $this->verified_at,
            'created_at' => $this->created_at,
        ];
    }
}
