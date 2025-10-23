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
        Schema::create('insurances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Policy holder
            $table->enum('policy_type', ['renters', 'landlord', 'liability', 'property', 'flood', 'earthquake'])->default('renters');
            $table->string('provider'); // e.g., "State Farm", "Lemonade", "Geico"
            $table->string('policy_number')->unique();
            $table->decimal('coverage_amount', 12, 2);
            $table->decimal('deductible', 10, 2)->nullable();
            $table->decimal('premium_amount', 10, 2);
            $table->enum('premium_frequency', ['monthly', 'quarterly', 'semi-annually', 'annually'])->default('monthly');
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['active', 'pending', 'expired', 'cancelled', 'lapsed'])->default('pending');
            $table->string('document_url')->nullable(); // Insurance certificate/policy PDF
            $table->json('covered_items')->nullable(); // For renters insurance: electronics, jewelry, etc.
            $table->text('additional_coverage')->nullable();
            $table->boolean('auto_renew')->default(true);
            $table->timestamp('last_payment_date')->nullable();
            $table->timestamp('next_payment_date')->nullable();
            $table->timestamps();
            
            $table->index('property_id');
            $table->index('user_id');
            $table->index('status');
            $table->index('policy_number');
            $table->index(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('insurances');
    }
};
