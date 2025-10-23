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
        Schema::create('check_ins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('booking_id')->nullable()->constrained()->onDelete('cascade');
            $table->enum('access_method', ['keypad', 'smart_lock', 'lockbox', 'key_exchange', 'doorman'])->default('key_exchange');
            $table->string('access_code')->nullable(); // For keypad/smart lock
            $table->string('lockbox_location')->nullable();
            $table->text('check_in_instructions');
            $table->timestamp('valid_from')->nullable();
            $table->timestamp('valid_until')->nullable();
            $table->string('wifi_name')->nullable();
            $table->string('wifi_password')->nullable();
            $table->text('parking_details')->nullable();
            $table->text('building_access_instructions')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->json('additional_info')->nullable(); // {trash_day, noise_policy, etc.}
            $table->timestamps();
            
            $table->index('property_id');
            $table->index('booking_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('check_ins');
    }
};
