<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Booking;
use App\Models\Property;
use App\Models\Review as ReviewModel;
use App\Models\User;
use Illuminate\Support\Arr;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $properties = Property::pluck('id');
        $guests = User::where('role', 'guest')->pluck('id');

        if ($properties->isEmpty() || $guests->isEmpty()) {
            return;
        }

        $completedBookings = Booking::where('status', 'completed')->get();

        // First, for each completed booking, optionally create exactly one review (to satisfy unique constraint)
        foreach ($completedBookings as $booking) {
            if (!fake()->boolean(70)) {
                continue;
            }
            ReviewModel::updateOrCreate(
                ['booking_id' => $booking->id, 'user_id' => $booking->guest_id],
                [
                    'property_id' => $booking->property_id,
                    'rating' => rand(3, 5),
                    'cleanliness_rating' => rand(3, 5),
                    'location_rating' => rand(3, 5),
                    'value_rating' => rand(3, 5),
                    'communication_rating' => rand(3, 5),
                    'checkin_rating' => rand(3, 5),
                    'accuracy_rating' => rand(3, 5),
                    'comment' => fake()->paragraph(),
                    'status' => Arr::random(['approved','pending','rejected']),
                    'is_featured' => (bool) random_int(0, 20) === 0,
                ]
            );
        }

        // Then, add some free-form reviews not tied to a booking
        for ($i = 0; $i < 60; $i++) {
            ReviewModel::create([
                'property_id' => $properties->random(),
                'user_id' => $guests->random(),
                'booking_id' => null,
                'rating' => rand(3, 5),
                'cleanliness_rating' => rand(3, 5),
                'location_rating' => rand(3, 5),
                'value_rating' => rand(3, 5),
                'communication_rating' => rand(3, 5),
                'checkin_rating' => rand(3, 5),
                'accuracy_rating' => rand(3, 5),
                'comment' => fake()->paragraph(),
                'status' => Arr::random(['approved','pending','rejected']),
                'is_featured' => (bool) random_int(0, 20) === 0,
            ]);
        }
    }
}
