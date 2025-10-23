<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user (idempotent)
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'role' => 'admin',
                'password' => Hash::make('password'),
                'is_verified' => true,
            ]
        );

        // Owners
        User::factory()->count(10)->create([
            'role' => 'owner',
        ]);

        // Guests
        User::factory()->count(20)->create([
            'role' => 'guest',
        ]);
    }
}
