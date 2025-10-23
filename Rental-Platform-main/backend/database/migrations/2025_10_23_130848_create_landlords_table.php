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
        Schema::create('landlords', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('avatar')->nullable();
            $table->text('bio')->nullable();
            $table->json('languages')->nullable(); // ['English', 'Spanish', 'French']
            $table->timestamp('joined_at')->useCurrent();
            
            // Verification fields
            $table->boolean('verified')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->boolean('identity_verified')->default(false);
            $table->boolean('email_verified')->default(false);
            $table->boolean('phone_verified')->default(false);
            $table->boolean('business_license')->default(false);
            $table->boolean('background_check')->default(false);
            $table->string('tax_id')->nullable();
            $table->boolean('proof_of_ownership')->default(false);
            
            // Stats fields
            $table->integer('total_properties')->default(0);
            $table->integer('active_listings')->default(0);
            $table->integer('total_bookings')->default(0);
            $table->integer('response_time_hours')->default(24); // average hours
            $table->integer('response_rate')->default(100); // percentage
            $table->decimal('average_rating', 3, 2)->default(0.00);
            $table->integer('review_count')->default(0);
            $table->integer('years_on_platform')->default(0);
            $table->integer('completion_rate')->default(100); // percentage
            $table->integer('repeat_guest_rate')->default(0); // percentage
            
            // Badges (stored as JSON array of badge objects)
            $table->json('badges')->nullable();
            
            // Superhost status
            $table->boolean('is_superhost')->default(false);
            $table->timestamp('superhost_since')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('user_id');
            $table->index('verified');
            $table->index('is_superhost');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('landlords');
    }
};
