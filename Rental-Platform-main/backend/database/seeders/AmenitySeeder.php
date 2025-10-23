<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Amenity;

class AmenitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $amenities = [
            // Basic
            ['name' => 'Wi‑Fi', 'icon' => 'heroicon-o-wifi', 'category' => 'basic'],
            ['name' => 'Air conditioning', 'icon' => 'heroicon-o-sparkles', 'category' => 'basic'],
            ['name' => 'Heating', 'icon' => 'heroicon-o-fire', 'category' => 'basic'],
            ['name' => 'Hot water', 'icon' => 'heroicon-o-bolt', 'category' => 'basic'],
            ['name' => 'Dedicated workspace', 'icon' => 'heroicon-o-computer-desktop', 'category' => 'basic'],

            // Comfort
            ['name' => 'TV', 'icon' => 'heroicon-o-tv', 'category' => 'comfort'],
            ['name' => 'Washer', 'icon' => 'heroicon-o-sparkles', 'category' => 'comfort'],
            ['name' => 'Dryer', 'icon' => 'heroicon-o-sparkles', 'category' => 'comfort'],
            ['name' => 'Kitchen', 'icon' => 'heroicon-o-home-modern', 'category' => 'comfort'],
            ['name' => 'Free parking', 'icon' => 'heroicon-o-key', 'category' => 'comfort'],

            // Facilities
            ['name' => 'Pool', 'icon' => 'heroicon-o-sparkles', 'category' => 'facilities'],
            ['name' => 'Gym', 'icon' => 'heroicon-o-bolt', 'category' => 'facilities'],
            ['name' => 'Elevator', 'icon' => 'heroicon-o-arrow-up', 'category' => 'facilities'],
            ['name' => 'BBQ grill', 'icon' => 'heroicon-o-fire', 'category' => 'facilities'],

            // Safety
            ['name' => 'Smoke alarm', 'icon' => 'heroicon-o-shield-check', 'category' => 'safety'],
            ['name' => 'Fire extinguisher', 'icon' => 'heroicon-o-fire', 'category' => 'safety'],
            ['name' => 'First aid kit', 'icon' => 'heroicon-o-shield-check', 'category' => 'safety'],
            ['name' => 'Carbon monoxide alarm', 'icon' => 'heroicon-o-shield-check', 'category' => 'safety'],
        ];

        foreach ($amenities as $i => $data) {
            Amenity::updateOrCreate(
                ['name' => $data['name']],
                [
                    'icon' => $data['icon'] ?? null,
                    'category' => $data['category'],
                    'description' => null,
                    'is_active' => true,
                    'sort_order' => $i,
                ]
            );
        }
    }
}
