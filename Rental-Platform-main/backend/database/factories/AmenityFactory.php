<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Amenity>
 */
class AmenityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['basic', 'comfort', 'safety', 'facilities'];

        return [
            'name' => ucfirst($this->faker->unique()->words(nb: 2, asText: true)),
            'icon' => $this->faker->optional()->randomElement([
                'heroicon-o-bolt', 'heroicon-o-fire', 'heroicon-o-wifi', 'heroicon-o-tv',
                'heroicon-o-key', 'heroicon-o-sparkles', 'heroicon-o-home-modern', 'heroicon-o-shield-check',
            ]),
            'category' => $this->faker->randomElement($categories),
            'description' => $this->faker->optional()->sentence(),
            'is_active' => $this->faker->boolean(90),
            'sort_order' => $this->faker->numberBetween(0, 100),
        ];
    }
}
