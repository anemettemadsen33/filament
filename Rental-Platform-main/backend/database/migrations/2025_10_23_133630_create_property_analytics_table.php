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
        Schema::create('property_analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->unique()->constrained()->onDelete('cascade');
            $table->integer('views_total')->default(0);
            $table->integer('views_today')->default(0);
            $table->integer('views_week')->default(0);
            $table->integer('views_month')->default(0);
            $table->integer('favorites_count')->default(0);
            $table->integer('contact_requests')->default(0);
            $table->integer('booking_requests')->default(0);
            $table->integer('tour_requests')->default(0);
            $table->decimal('conversion_rate', 5, 2)->default(0.00);
            $table->timestamp('last_viewed_at')->nullable();
            $table->json('viewer_demographics')->nullable(); // {countries: [], cities: [], devices: []}
            $table->json('traffic_sources')->nullable(); // {direct: 0, search: 0, social: 0, referral: 0}
            $table->timestamps();
            
            $table->index('property_id');
            $table->index('views_total');
            $table->index('last_viewed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_analytics');
    }
};
