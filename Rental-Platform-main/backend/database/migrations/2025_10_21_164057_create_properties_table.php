<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            
            // Basic Info
            $table->string('title');
            $table->text('description');
            
            // Location
            $table->string('address');
            $table->string('city');
            $table->string('state')->nullable();
            $table->string('country');
            $table->string('postal_code');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            // Property Details
            $table->enum('property_type', ['apartment', 'house', 'villa', 'room', 'studio', 'condo', 'other']);
            $table->enum('rental_type', ['short_term', 'long_term', 'both'])->default('both');
            $table->integer('bedrooms')->default(1);
            $table->integer('bathrooms')->default(1);
            $table->integer('max_guests')->default(2);
            $table->integer('area_sqm')->nullable();
            
            // Pricing
            $table->decimal('price_per_night', 10, 2)->nullable();
            $table->decimal('price_per_month', 10, 2)->nullable();
            $table->decimal('cleaning_fee', 10, 2)->nullable();
            $table->decimal('security_deposit', 10, 2)->nullable();
            
            // Availability
            $table->date('available_from')->nullable();
            $table->date('available_to')->nullable();
            $table->integer('minimum_stay_nights')->default(1);
            $table->integer('maximum_stay_nights')->nullable();
            
            // Status
            $table->enum('status', ['draft', 'published', 'unavailable', 'archived'])->default('draft');
            $table->boolean('is_featured')->default(false);
            
            // Additional Info
            $table->json('house_rules')->nullable();
            $table->text('cancellation_policy')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['city', 'country']);
            $table->index('status');
            $table->index('property_type');
            $table->index(['price_per_night', 'price_per_month']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
