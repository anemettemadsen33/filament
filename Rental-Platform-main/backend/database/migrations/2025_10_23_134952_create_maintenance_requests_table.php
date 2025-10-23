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
        Schema::create('maintenance_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('tenant_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('landlord_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null'); // Maintenance worker
            $table->enum('category', ['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'pest', 'cleaning', 'landscaping', 'other'])->default('other');
            $table->enum('priority', ['low', 'medium', 'high', 'emergency'])->default('medium');
            $table->enum('status', ['pending', 'acknowledged', 'scheduled', 'in_progress', 'completed', 'cancelled'])->default('pending');
            $table->string('title');
            $table->text('description');
            $table->json('attachments')->nullable(); // Photos/videos of the issue
            $table->timestamp('scheduled_date')->nullable();
            $table->timestamp('completed_date')->nullable();
            $table->decimal('estimated_cost', 10, 2)->nullable();
            $table->decimal('actual_cost', 10, 2)->nullable();
            $table->text('landlord_notes')->nullable();
            $table->text('tenant_notes')->nullable();
            $table->text('resolution_details')->nullable();
            $table->timestamps();
            
            $table->index('property_id');
            $table->index('tenant_id');
            $table->index('landlord_id');
            $table->index('status');
            $table->index('priority');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_requests');
    }
};
