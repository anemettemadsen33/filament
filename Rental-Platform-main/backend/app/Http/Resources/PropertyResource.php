<?php

namespace App\Http\Resources;

use App\Services\CurrencyService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $currencyService = app(CurrencyService::class);
        $userCurrency = $request->hasSession() 
            ? $request->session()->get('user_currency', 'EUR')
            : 'EUR';
        
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
            'postal_code' => $this->postal_code,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'property_type' => $this->property_type,
            'rental_type' => $this->rental_type,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'max_guests' => $this->max_guests,
            'area_sqm' => $this->area_sqm,
            
            // Original prices in EUR
            'price_per_night' => $this->price_per_night,
            'price_per_month' => $this->price_per_month,
            'cleaning_fee' => $this->cleaning_fee,
            'security_deposit' => $this->security_deposit,
            
            // Converted prices
            'pricing' => [
                'currency' => $userCurrency,
                'price_per_night' => $currencyService->convert($this->price_per_night ?? 0, $userCurrency),
                'price_per_month' => $currencyService->convert($this->price_per_month ?? 0, $userCurrency),
                'cleaning_fee' => $currencyService->convert($this->cleaning_fee ?? 0, $userCurrency),
                'security_deposit' => $currencyService->convert($this->security_deposit ?? 0, $userCurrency),
                'formatted' => [
                    'price_per_night' => $currencyService->convertAndFormat($this->price_per_night ?? 0, $userCurrency),
                    'price_per_month' => $currencyService->convertAndFormat($this->price_per_month ?? 0, $userCurrency),
                    'cleaning_fee' => $currencyService->convertAndFormat($this->cleaning_fee ?? 0, $userCurrency),
                    'security_deposit' => $currencyService->convertAndFormat($this->security_deposit ?? 0, $userCurrency),
                ],
            ],
            
            'status' => $this->status,
            'is_featured' => (bool) $this->is_featured,
            'available_from' => $this->available_from,
            'available_to' => $this->available_to,
            'owner' => new UserResource($this->whenLoaded('owner')),
            'amenities' => $this->whenLoaded('amenities', function () {
                return $this->amenities->map(fn($a) => [
                    'id' => $a->id,
                    'name' => $a->name,
                    'icon' => $a->icon,
                    'category' => $a->category,
                ]);
            }),
            'images' => $this->whenLoaded('images', function () {
                return $this->images->map(fn($img) => [
                    'id' => $img->id,
                    'path' => $img->path,
                    'url' => $img->url,
                    'thumbnail_url' => $img->thumbnail_url,
                    'is_primary' => (bool) $img->is_primary,
                    'sort_order' => $img->sort_order,
                    'caption' => $img->caption,
                ]);
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
