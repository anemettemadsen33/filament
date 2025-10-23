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
        Schema::create('lease_agreements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('landlord_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('tenant_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('booking_id')->nullable()->constrained()->onDelete('set null');
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('rent_amount', 10, 2);
            $table->decimal('deposit_amount', 10, 2);
            $table->enum('payment_frequency', ['monthly', 'weekly', 'bi-weekly', 'quarterly'])->default('monthly');
            $table->text('terms'); // Full lease terms and conditions
            $table->json('additional_clauses')->nullable(); // Custom clauses
            $table->enum('status', ['draft', 'pending_signatures', 'active', 'expired', 'terminated', 'renewed'])->default('draft');
            $table->string('document_url')->nullable(); // PDF of the lease
            $table->timestamp('signed_by_landlord_at')->nullable();
            $table->timestamp('signed_by_tenant_at')->nullable();
            $table->text('signature_landlord')->nullable(); // Base64 encoded signature
            $table->text('signature_tenant')->nullable();
            $table->boolean('auto_renew')->default(false);
            $table->integer('renewal_notice_days')->default(30);
            $table->text('termination_reason')->nullable();
            $table->timestamp('terminated_at')->nullable();
            $table->timestamps();
            
            $table->index('property_id');
            $table->index('landlord_id');
            $table->index('tenant_id');
            $table->index('status');
            $table->index(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lease_agreements');
    }
};
