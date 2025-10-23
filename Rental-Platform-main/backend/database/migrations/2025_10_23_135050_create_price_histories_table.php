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
        Schema::create('price_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->decimal('old_price', 10, 2);
            $table->decimal('new_price', 10, 2);
            $table->enum('price_type', ['per_night', 'per_month', 'cleaning_fee', 'security_deposit'])->default('per_night');
            $table->foreignId('changed_by_id')->constrained('users')->onDelete('cascade');
            $table->string('reason')->nullable();
            $table->timestamp('effective_date');
            $table->decimal('price_change_percentage', 5, 2)->nullable(); // Auto-calculated
            $table->timestamps();
            
            $table->index('property_id');
            $table->index('effective_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('price_histories');
    }
};
