<?php

namespace Database\Factories;

use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PropertyImage>
 */
class PropertyImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'property_id' => Property::factory(),
            'path' => 'photos/'.uniqid('property_').'.jpg',
            'original_name' => $this->faker->optional()->filePath(),
            'is_primary' => false,
            'sort_order' => $this->faker->numberBetween(0, 10),
            'caption' => $this->faker->optional()->sentence(),
        ];
    }
}
