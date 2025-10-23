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
        Schema::table('settings', function (Blueprint $table) {
            // Company Basic Information
            $table->text('company_legal_name')->nullable()->after('website_description');
            $table->text('company_trade_name')->nullable()->after('company_legal_name');
            $table->text('company_registration_number')->nullable()->after('company_trade_name');
            $table->text('company_tax_number')->nullable()->after('company_registration_number');
            $table->text('company_vat_number')->nullable()->after('company_tax_number');
            
            // Company Address Details
            $table->text('company_address_street')->nullable()->after('contact_address');
            $table->text('company_address_city')->nullable()->after('company_address_street');
            $table->text('company_address_state')->nullable()->after('company_address_city');
            $table->text('company_address_postal_code')->nullable()->after('company_address_state');
            $table->text('company_address_country')->nullable()->after('company_address_postal_code');
            
            // Google Maps Integration
            $table->text('google_maps_api_key')->nullable()->after('company_address_country');
            $table->text('google_maps_embed_url')->nullable()->after('google_maps_api_key');
            $table->decimal('company_latitude', 10, 8)->nullable()->after('google_maps_embed_url');
            $table->decimal('company_longitude', 11, 8)->nullable()->after('company_latitude');
            
            // Additional Contact Methods
            $table->text('company_whatsapp')->nullable()->after('contact_phone');
            $table->text('company_skype')->nullable()->after('company_whatsapp');
            $table->text('company_telegram')->nullable()->after('company_skype');
            
            // Business Hours
            $table->text('business_hours_monday')->nullable()->after('company_telegram');
            $table->text('business_hours_tuesday')->nullable()->after('business_hours_monday');
            $table->text('business_hours_wednesday')->nullable()->after('business_hours_tuesday');
            $table->text('business_hours_thursday')->nullable()->after('business_hours_wednesday');
            $table->text('business_hours_friday')->nullable()->after('business_hours_thursday');
            $table->text('business_hours_saturday')->nullable()->after('business_hours_friday');
            $table->text('business_hours_sunday')->nullable()->after('business_hours_saturday');
            
            // Additional Social Media
            $table->text('youtube_url')->nullable()->after('linkedin_url');
            $table->text('tiktok_url')->nullable()->after('youtube_url');
            $table->text('pinterest_url')->nullable()->after('tiktok_url');
            $table->text('whatsapp_business_url')->nullable()->after('pinterest_url');
            
            // Rental Business Specific
            $table->boolean('short_term_rentals_enabled')->default(true)->after('whatsapp_business_url');
            $table->boolean('long_term_rentals_enabled')->default(true)->after('short_term_rentals_enabled');
            $table->integer('minimum_stay_short_term')->default(1)->after('long_term_rentals_enabled'); // days
            $table->integer('minimum_stay_long_term')->default(30)->after('minimum_stay_short_term'); // days
            $table->decimal('short_term_commission_rate', 5, 2)->default(15.00)->after('minimum_stay_long_term'); // percentage
            $table->decimal('long_term_commission_rate', 5, 2)->default(10.00)->after('short_term_commission_rate'); // percentage
            
            // Booking Policies
            $table->text('cancellation_policy_short_term')->nullable()->after('long_term_commission_rate');
            $table->text('cancellation_policy_long_term')->nullable()->after('cancellation_policy_short_term');
            $table->text('house_rules')->nullable()->after('cancellation_policy_long_term');
            $table->text('check_in_instructions')->nullable()->after('house_rules');
            $table->text('check_out_instructions')->nullable()->after('check_in_instructions');
            
            // Emergency & Support
            $table->text('emergency_contact_name')->nullable()->after('check_out_instructions');
            $table->text('emergency_contact_phone')->nullable()->after('emergency_contact_name');
            $table->text('support_hours')->nullable()->after('emergency_contact_phone');
            
            // SEO & Analytics
            $table->text('google_analytics_id')->nullable()->after('support_hours');
            $table->text('google_tag_manager_id')->nullable()->after('google_analytics_id');
            $table->text('facebook_pixel_id')->nullable()->after('google_tag_manager_id');
            $table->text('meta_keywords')->nullable()->after('facebook_pixel_id');
            
            // Currency & Pricing
            $table->text('default_currency')->default('EUR')->after('meta_keywords');
            $table->text('accepted_currencies')->nullable()->after('default_currency'); // JSON array
            $table->decimal('cleaning_fee_short_term', 8, 2)->default(0)->after('accepted_currencies');
            $table->decimal('security_deposit_short_term', 8, 2)->default(0)->after('cleaning_fee_short_term');
            $table->decimal('security_deposit_long_term', 8, 2)->default(0)->after('security_deposit_short_term');
            
            // Legal & Compliance
            $table->text('privacy_policy_url')->nullable()->after('security_deposit_long_term');
            $table->text('terms_of_service_url')->nullable()->after('privacy_policy_url');
            $table->text('license_number')->nullable()->after('terms_of_service_url');
            $table->text('insurance_policy_number')->nullable()->after('license_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn([
                'company_legal_name',
                'company_trade_name', 
                'company_registration_number',
                'company_tax_number',
                'company_vat_number',
                'company_address_street',
                'company_address_city',
                'company_address_state',
                'company_address_postal_code',
                'company_address_country',
                'google_maps_api_key',
                'google_maps_embed_url',
                'company_latitude',
                'company_longitude',
                'company_whatsapp',
                'company_skype',
                'company_telegram',
                'business_hours_monday',
                'business_hours_tuesday',
                'business_hours_wednesday',
                'business_hours_thursday',
                'business_hours_friday',
                'business_hours_saturday',
                'business_hours_sunday',
                'youtube_url',
                'tiktok_url',
                'pinterest_url',
                'whatsapp_business_url',
                'short_term_rentals_enabled',
                'long_term_rentals_enabled',
                'minimum_stay_short_term',
                'minimum_stay_long_term',
                'short_term_commission_rate',
                'long_term_commission_rate',
                'cancellation_policy_short_term',
                'cancellation_policy_long_term',
                'house_rules',
                'check_in_instructions',
                'check_out_instructions',
                'emergency_contact_name',
                'emergency_contact_phone',
                'support_hours',
                'google_analytics_id',
                'google_tag_manager_id',
                'facebook_pixel_id',
                'meta_keywords',
                'default_currency',
                'accepted_currencies',
                'cleaning_fee_short_term',
                'security_deposit_short_term',
                'security_deposit_long_term',
                'privacy_policy_url',
                'terms_of_service_url',
                'license_number',
                'insurance_policy_number',
            ]);
        });
    }
};
