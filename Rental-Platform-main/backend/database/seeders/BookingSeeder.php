<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Booking;
use App\Models\Property;
use App\Models\User;
use Illuminate\Support\Arr;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $properties = Property::pluck('id');
        $guests = User::where('role', 'guest')->pluck('id');

        if ($properties->isEmpty() || $guests->isEmpty()) {
            return; // nothing to seed
        }

        // Create random bookings
        for ($i = 0; $i < 120; $i++) {
            $checkIn = fake()->dateTimeBetween('-1 months', '+3 months');
            $nights = rand(1, 14);
            $checkOut = (clone $checkIn)->modify("+{$nights} days");
            $pricePerNight = fake()->randomFloat(2, 30, 450);
            $subtotal = $pricePerNight * $nights;
            $cleaningFee = fake()->randomFloat(2, 0, 120);
            $serviceFee = round($subtotal * 0.12, 2);
            $total = $subtotal + $cleaningFee + $serviceFee;

            Booking::create([
                'property_id' => $properties->random(),
                'guest_id' => $guests->random(),
                'check_in' => $checkIn->format('Y-m-d'),
                'check_out' => $checkOut->format('Y-m-d'),
                'guests_count' => rand(1, 6),
                'nights' => $nights,
                'price_per_night' => $pricePerNight,
                'subtotal' => $subtotal,
                'cleaning_fee' => $cleaningFee,
                'service_fee' => $serviceFee,
                'total_price' => $total,
                'status' => Arr::random(['pending','confirmed','cancelled','completed']),
                'payment_status' => Arr::random(['pending','paid','refunded']),
                'special_requests' => fake()->optional()->sentence(),
            ]);
        }
    }
}
