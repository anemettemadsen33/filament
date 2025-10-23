<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Amenity;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\User;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owners = User::where('role', 'owner')->pluck('id');
        $amenities = Amenity::pluck('id');

        // Create properties for owners
        $properties = Property::factory()->count(50)->make()->each(function ($property) use ($owners) {
            // Assign owner from existing owners
            if ($owners->isNotEmpty()) {
                $property->owner_id = $owners->random();
            }
            $property->save();
        });

        // Attach amenities and images
        Property::all()->each(function (Property $property) use ($amenities) {
            // Attach 5-10 random amenities
            if ($amenities->isNotEmpty()) {
                $property->amenities()->sync($amenities->random(rand(5, min(10, $amenities->count())))->toArray());
            }

            // Create 3-6 images (first is primary)
            $count = rand(3, 6);
            for ($i = 0; $i < $count; $i++) {
                PropertyImage::create([
                    'property_id' => $property->id,
                    'path' => 'photos/property_'.$property->id.'_'.$i.'.jpg',
                    'is_primary' => $i === 0,
                    'sort_order' => $i,
                    'caption' => null,
                ]);
            }
        });
    }
}
