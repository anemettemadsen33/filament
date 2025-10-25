<?php

namespace App\Actions\Properties;

use App\Models\Property;

class CreatePropertyAction
{
    /**
     * Create a new property with the given data.
     */
    public function execute(array $data): Property
    {
        // Set owner_id to current user if not provided
        if (!isset($data['owner_id'])) {
            $data['owner_id'] = auth()->id();
        }

        // Set default values
        $data['status'] = $data['status'] ?? 'draft';
        $data['is_featured'] = $data['is_featured'] ?? false;

        // Create property
        $property = Property::create($data);

        // Attach amenities if provided
        if (isset($data['amenities']) && is_array($data['amenities'])) {
            $property->amenities()->sync($data['amenities']);
        }

        // Log activity
        activity()
            ->causedBy(auth()->user())
            ->performedOn($property)
            ->log('Property created');

        return $property;
    }
}
