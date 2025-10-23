<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $rating = $this->faker->numberBetween(3, 5);
        $detailed = fn() => $this->faker->optional(0.7)->numberBetween(3, 5);

        return [
            'property_id' => Property::factory(),
            'user_id' => User::factory()->state(['role' => 'guest']),
            'booking_id' => $this->faker->optional(0.7)->randomElement([null, Booking::factory()]),
            'rating' => $rating,
            'cleanliness_rating' => $detailed(),
            'location_rating' => $detailed(),
            'value_rating' => $detailed(),
            'communication_rating' => $detailed(),
            'checkin_rating' => $detailed(),
            'accuracy_rating' => $detailed(),
            'comment' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['pending','approved','rejected']),
            'is_featured' => $this->faker->boolean(5),
        ];
    }
}
