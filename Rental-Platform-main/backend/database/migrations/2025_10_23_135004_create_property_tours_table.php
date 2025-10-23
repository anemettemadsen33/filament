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
        Schema::create('property_tours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Prospective tenant
            $table->foreignId('landlord_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('tour_type', ['in-person', 'virtual', 'self-guided'])->default('in-person');
            $table->timestamp('scheduled_at');
            $table->integer('duration')->default(30); // Duration in minutes
            $table->enum('status', ['requested', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'])->default('requested');
            $table->text('user_notes')->nullable();
            $table->text('landlord_notes')->nullable();
            $table->string('meeting_url')->nullable(); // For virtual tours (Zoom, Google Meet, etc.)
            $table->string('confirmation_code', 8)->unique()->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->string('cancellation_reason')->nullable();
            $table->timestamps();
            
            $table->index('property_id');
            $table->index('user_id');
            $table->index('landlord_id');
            $table->index('status');
            $table->index('scheduled_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_tours');
    }
};
