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
        Schema::create('background_checks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('property_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('check_type', ['credit', 'criminal', 'eviction', 'employment', 'reference', 'identity', 'comprehensive'])->default('comprehensive');
            $table->enum('status', ['pending', 'in_progress', 'completed', 'failed', 'expired'])->default('pending');
            $table->string('provider')->nullable(); // e.g., "Experian", "TransUnion", "Checkr"
            $table->string('provider_reference_id')->nullable();
            $table->timestamp('request_date');
            $table->timestamp('completed_date')->nullable();
            $table->enum('result', ['pass', 'fail', 'conditional', 'review_required'])->nullable();
            $table->integer('credit_score')->nullable();
            $table->text('summary')->nullable();
            $table->string('report_url')->nullable(); // Secure link to full report
            $table->json('details')->nullable(); // {criminal_records: [], evictions: [], credit_issues: []}
            $table->boolean('consent_given')->default(false);
            $table->timestamp('consent_given_at')->nullable();
            $table->decimal('fee', 10, 2)->nullable();
            $table->timestamp('expires_at')->nullable(); // Background checks expire after 30-90 days
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('property_id');
            $table->index('status');
            $table->index('check_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('background_checks');
    }
};
