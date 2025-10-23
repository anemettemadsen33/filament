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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->enum('type', ['percentage', 'fixed', 'free-nights'])->default('percentage');
            $table->decimal('value', 10, 2);
            $table->text('description')->nullable();
            $table->foreignId('property_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('landlord_id')->nullable()->constrained()->onDelete('cascade');
            $table->enum('category', ['early-bird', 'long-stay', 'first-booking', 'referral', 'seasonal', 'loyalty', 'custom'])->default('custom');
            $table->timestamp('valid_from');
            $table->timestamp('valid_until');
            $table->integer('max_uses')->default(1);
            $table->integer('current_uses')->default(0);
            $table->integer('max_uses_per_user')->default(1);
            $table->integer('min_booking_days')->nullable();
            $table->integer('min_booking_months')->nullable();
            $table->enum('rental_term_restriction', ['short-term', 'long-term', 'both'])->default('both');
            $table->json('property_type_restriction')->nullable();
            $table->decimal('min_booking_value', 10, 2)->nullable();
            $table->boolean('active')->default(true);
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->json('used_by')->nullable();
            $table->boolean('is_public')->default(false);
            $table->boolean('auto_apply')->default(false);
            $table->boolean('stackable')->default(false);
            $table->integer('priority')->default(0);
            $table->timestamps();
            
            $table->index('code');
            $table->index('active');
            $table->index(['valid_from', 'valid_until']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
