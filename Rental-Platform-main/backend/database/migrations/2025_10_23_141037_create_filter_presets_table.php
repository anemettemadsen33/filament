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
        Schema::create('filter_presets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name'); // "Beach condos under $2000", "Downtown studios"
            $table->json('filters'); // Complete filter object matching frontend FilterState
            $table->boolean('is_active')->default(true);
            $table->boolean('notification_enabled')->default(false); // Alert on new matches
            $table->integer('match_count')->default(0); // Cached count of matching properties
            $table->timestamp('last_checked_at')->nullable();
            $table->integer('new_matches_count')->default(0); // Since last check
            $table->boolean('is_favorite')->default(false);
            $table->integer('usage_count')->default(0); // How many times applied
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('is_active');
            $table->index('notification_enabled');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('filter_presets');
    }
};
