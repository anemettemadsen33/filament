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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('booking_id')->nullable()->constrained()->onDelete('set null');
            
            // Ratings (1-5)
            $table->tinyInteger('rating'); // Overall rating
            $table->tinyInteger('cleanliness_rating')->nullable();
            $table->tinyInteger('location_rating')->nullable();
            $table->tinyInteger('value_rating')->nullable();
            $table->tinyInteger('communication_rating')->nullable();
            $table->tinyInteger('checkin_rating')->nullable();
            $table->tinyInteger('accuracy_rating')->nullable();
            
            // Review Content
            $table->text('comment');
            $table->text('response')->nullable(); // Owner's response
            $table->timestamp('responded_at')->nullable();
            
            // Status
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->boolean('is_featured')->default(false);
            
            $table->timestamps();
            
            // Indexes
            $table->index(['property_id', 'status']);
            $table->index('user_id');
            $table->index('rating');
            
            // Ensure one review per booking
            $table->unique(['booking_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
