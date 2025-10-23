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
        Schema::create('roommate_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->text('bio')->nullable();
            $table->integer('age')->nullable();
            $table->enum('gender', ['male', 'female', 'non-binary', 'prefer_not_to_say'])->nullable();
            $table->string('occupation')->nullable();
            $table->decimal('budget_min', 10, 2)->nullable();
            $table->decimal('budget_max', 10, 2)->nullable();
            $table->json('preferred_locations')->nullable(); // [city, neighborhood, zip codes]
            $table->enum('lifestyle', ['quiet', 'social', 'party', 'balanced'])->default('balanced');
            $table->enum('cleanliness', ['very_clean', 'clean', 'average', 'relaxed'])->default('average');
            $table->boolean('has_pets')->default(false);
            $table->string('pet_types')->nullable(); // "Dog, Cat"
            $table->boolean('pet_friendly')->default(true);
            $table->boolean('smoker')->default(false);
            $table->boolean('smoking_friendly')->default(false);
            $table->enum('work_schedule', ['9-5', 'night_shift', 'flexible', 'student'])->nullable();
            $table->json('interests')->nullable(); // ["cooking", "gaming", "sports", "reading"]
            $table->integer('looking_for_roommates_count')->default(1);
            $table->date('move_in_date')->nullable();
            $table->enum('match_status', ['active', 'inactive', 'matched', 'on_hold'])->default('active');
            $table->json('current_matches')->nullable(); // [{user_id, compatibility_score, matched_at}]
            $table->boolean('verified')->default(false);
            $table->timestamp('last_active_at')->nullable();
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('match_status');
            $table->index(['budget_min', 'budget_max']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roommate_profiles');
    }
};
