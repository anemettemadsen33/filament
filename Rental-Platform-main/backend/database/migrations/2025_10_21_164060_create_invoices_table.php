<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->string('invoice_number')->unique();
            $table->date('issue_date');
            $table->date('due_date')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 8)->default(config('billing.currency'));
            $table->enum('status', ['draft','sent','paid','cancelled'])->default('sent');
            $table->string('pdf_path')->nullable();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_address')->nullable();
            $table->timestamps();
        });
        if (Schema::hasTable('bookings')) {
            Schema::table('bookings', function (Blueprint $table) {
                if (!Schema::hasColumn('bookings', 'invoice_id')) {
                    $table->foreignId('invoice_id')->nullable()->constrained('invoices')->nullOnDelete();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('bookings')) {
            Schema::table('bookings', function (Blueprint $table) {
                if (Schema::hasColumn('bookings', 'invoice_id')) {
                    $table->dropConstrainedForeignId('invoice_id');
                }
            });
        }
        Schema::dropIfExists('invoices');
    }
};
