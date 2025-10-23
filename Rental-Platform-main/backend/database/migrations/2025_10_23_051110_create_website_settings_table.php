<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            // Frontend configuration
            $table->string('frontend_domain')->nullable()->after('twilio_token');
            $table->string('frontend_api_endpoint')->nullable()->after('frontend_domain');
            $table->boolean('cors_enabled')->default(true)->after('frontend_api_endpoint');
            $table->text('cors_allowed_origins')->nullable()->after('cors_enabled');
            
            // Website branding
            $table->string('website_name')->default('RentHub')->after('cors_allowed_origins');
            $table->string('website_logo_url')->nullable()->after('website_name');
            $table->string('website_favicon_url')->nullable()->after('website_logo_url');
            $table->text('website_description')->nullable()->after('website_favicon_url');
            
            // Contact information
            $table->string('contact_email')->nullable()->after('website_description');
            $table->string('contact_phone')->nullable()->after('contact_email');
            $table->text('contact_address')->nullable()->after('contact_phone');
            
            // Social media links
            $table->string('social_facebook')->nullable()->after('contact_address');
            $table->string('social_twitter')->nullable()->after('social_facebook');
            $table->string('social_instagram')->nullable()->after('social_twitter');
            $table->string('social_linkedin')->nullable()->after('social_instagram');
            
            // Notification settings
            $table->boolean('email_notifications_enabled')->default(true)->after('social_linkedin');
            $table->boolean('sms_notifications_enabled')->default(false)->after('email_notifications_enabled');
            
            // Maintenance mode
            $table->boolean('maintenance_mode')->default(false)->after('sms_notifications_enabled');
            $table->text('maintenance_message')->nullable()->after('maintenance_mode');
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn([
                'frontend_domain',
                'frontend_api_endpoint',
                'cors_enabled',
                'cors_allowed_origins',
                'website_name',
                'website_logo_url',
                'website_favicon_url',
                'website_description',
                'contact_email',
                'contact_phone',
                'contact_address',
                'social_facebook',
                'social_twitter',
                'social_instagram',
                'social_linkedin',
                'email_notifications_enabled',
                'sms_notifications_enabled',
                'maintenance_mode',
                'maintenance_message',
            ]);
        });
    }
};
