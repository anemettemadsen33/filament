<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Property>
 */
class PropertyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $city = $this->faker->city();
        $country = $this->faker->country();
        $priceNight = $this->faker->randomFloat(2, 30, 450);
        $priceMonth = $this->faker->optional()->randomFloat(2, 600, 4500);

        $propertyTypes = ['apartment', 'house', 'villa', 'room', 'studio', 'condo', 'other'];
        $rentalTypes = ['short_term', 'long_term', 'both'];

    $availableFromDt = $this->faker->optional()->dateTimeBetween('-1 month', '+1 month');
    $availableToDt = $this->faker->optional()->dateTimeBetween('+2 months', '+12 months');

    return [
            'owner_id' => User::factory()->state(['role' => 'owner']),
            'title' => $this->faker->streetName().' '.$this->faker->randomElement(['Retreat','Getaway','Residence','Suites','Loft']),
            'description' => $this->faker->paragraphs(asText: true),

            // Location
            'address' => $this->faker->streetAddress(),
            'city' => $city,
            'state' => $this->faker->optional()->state(),
            'country' => $country,
            'postal_code' => $this->faker->postcode(),
            'latitude' => $this->faker->optional()->latitude(),
            'longitude' => $this->faker->optional()->longitude(),

            // Details
            'property_type' => $this->faker->randomElement($propertyTypes),
            'rental_type' => $this->faker->randomElement($rentalTypes),
            'bedrooms' => $this->faker->numberBetween(1, 5),
            'bathrooms' => $this->faker->numberBetween(1, 3),
            'max_guests' => $this->faker->numberBetween(1, 8),
            'area_sqm' => $this->faker->optional()->numberBetween(20, 220),

            // Pricing
            'price_per_night' => $priceNight,
            'price_per_month' => $priceMonth,
            'cleaning_fee' => $this->faker->optional(0.7)->randomFloat(2, 0, 120),
            'security_deposit' => $this->faker->optional(0.5)->randomFloat(2, 100, 800),

            // Availability
            'available_from' => $availableFromDt ? $availableFromDt->format('Y-m-d') : null,
            'available_to' => $availableToDt ? $availableToDt->format('Y-m-d') : null,
            'minimum_stay_nights' => $this->faker->numberBetween(1, 7),
            'maximum_stay_nights' => $this->faker->optional()->numberBetween(14, 90),

            // Status
            'status' => $this->faker->randomElement(['draft', 'published', 'unavailable']),
            'is_featured' => $this->faker->boolean(10),

            'house_rules' => $this->faker->optional()->randomElements([
                'no-smoking', 'no-parties', 'no-pets', 'quiet-hours', 'id-required', 'security-deposit'
            ], $this->faker->numberBetween(1, 3)),
            'cancellation_policy' => $this->faker->optional()->sentences(nb: 3, asText: true),
        ];
    }
}
