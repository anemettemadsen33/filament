<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $checkIn = $this->faker->dateTimeBetween('-2 months', '+2 months');
        $nights = $this->faker->numberBetween(1, 14);
        $checkOut = (clone $checkIn)->modify("+{$nights} days");

        $pricePerNight = $this->faker->randomFloat(2, 30, 450);
        $subtotal = $pricePerNight * $nights;
        $cleaningFee = $this->faker->randomFloat(2, 0, 120);
        $serviceFee = round($subtotal * 0.12, 2);
        $total = $subtotal + $cleaningFee + $serviceFee;

        return [
            'property_id' => Property::factory(),
            'guest_id' => User::factory()->state(['role' => 'guest']),
            'check_in' => $checkIn->format('Y-m-d'),
            'check_out' => $checkOut->format('Y-m-d'),
            'guests_count' => $this->faker->numberBetween(1, 6),
            'nights' => $nights,

            'price_per_night' => $pricePerNight,
            'subtotal' => $subtotal,
            'cleaning_fee' => $cleaningFee,
            'service_fee' => $serviceFee,
            'total_price' => $total,

            'status' => $this->faker->randomElement(['pending','confirmed','cancelled','completed']),
            'payment_status' => $this->faker->randomElement(['pending','paid','refunded']),
            'special_requests' => $this->faker->optional()->sentence(),
        ];
    }
}
