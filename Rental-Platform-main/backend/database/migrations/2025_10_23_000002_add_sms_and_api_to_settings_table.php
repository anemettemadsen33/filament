<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            // Public site API connectivity
            $table->string('public_site_api_base_url')->nullable()->after('public_site_url');
            $table->string('public_site_api_key')->nullable()->after('public_site_api_base_url');
            // SMS settings
            $table->enum('sms_provider', ['twilio', 'vonage', 'other'])->nullable()->after('public_site_api_key');
            $table->string('sms_from')->nullable()->after('sms_provider');
            $table->string('twilio_sid')->nullable()->after('sms_from');
            $table->string('twilio_token')->nullable()->after('twilio_sid');
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn([
                'public_site_api_base_url',
                'public_site_api_key',
                'sms_provider',
                'sms_from',
                'twilio_sid',
                'twilio_token',
            ]);
        });
    }
};
