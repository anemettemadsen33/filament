<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        // Email settings
        'smtp_host',
        'smtp_port',
        'smtp_username',
        'smtp_password',
        'smtp_encryption',
        'mail_from_address',
        'mail_from_name',
        
        // Public site settings
        'public_site_url',
        'public_site_api_base_url',
        'public_site_api_key',
        
        // SMS settings
        'sms_provider',
        'sms_from',
        'twilio_sid',
        'twilio_token',
        
        // Frontend configuration
        'frontend_domain',
        'frontend_api_endpoint',
        'cors_enabled',
        'cors_allowed_origins',
        
        // Website branding
        'website_name',
        'website_logo_url',
        'website_favicon_url',
        'website_description',
        
        // Contact information
        'contact_email',
        'contact_phone',
        'contact_address',
        
        // Social media
        'social_facebook',
        'social_twitter',
        'social_instagram',
        'social_linkedin',
        
        // Notifications
        'email_notifications_enabled',
        'sms_notifications_enabled',
        
        // Maintenance
        'maintenance_mode',
        'maintenance_message',
        
        // Company Basic Information
        'company_legal_name',
        'company_trade_name',
        'company_registration_number',
        'company_tax_number',
        'company_vat_number',
        
        // Company Address Details
        'company_address_street',
        'company_address_city',
        'company_address_state',
        'company_address_postal_code',
        'company_address_country',
        
        // Google Maps Integration
        'google_maps_api_key',
        'google_maps_embed_url',
        'company_latitude',
        'company_longitude',
        
        // Additional Contact Methods
        'company_whatsapp',
        'company_skype',
        'company_telegram',
        
        // Business Hours
        'business_hours_monday',
        'business_hours_tuesday',
        'business_hours_wednesday',
        'business_hours_thursday',
        'business_hours_friday',
        'business_hours_saturday',
        'business_hours_sunday',
        
        // Additional Social Media
        'youtube_url',
        'tiktok_url',
        'pinterest_url',
        'whatsapp_business_url',
        
        // Rental Business Specific
        'short_term_rentals_enabled',
        'long_term_rentals_enabled',
        'minimum_stay_short_term',
        'minimum_stay_long_term',
        'short_term_commission_rate',
        'long_term_commission_rate',
        
        // Booking Policies
        'cancellation_policy_short_term',
        'cancellation_policy_long_term',
        'house_rules',
        'check_in_instructions',
        'check_out_instructions',
        
        // Emergency & Support
        'emergency_contact_name',
        'emergency_contact_phone',
        'support_hours',
        
        // SEO & Analytics
        'google_analytics_id',
        'google_tag_manager_id',
        'facebook_pixel_id',
        'meta_keywords',
        
        // Currency & Pricing
        'default_currency',
        'accepted_currencies',
        'cleaning_fee_short_term',
        'security_deposit_short_term',
        'security_deposit_long_term',
        
        // Legal & Compliance
        'privacy_policy_url',
        'terms_of_service_url',
        'license_number',
        'insurance_policy_number',

        // Banking & Invoice instructions (new)
        'bank_name',
        'bank_account_name',
        'bank_account_number',
        'bank_iban',
        'bank_swift_bic',
        'bank_address',
        'payment_instructions',
    ];

    protected $casts = [
        // Encrypt sensitive fields at rest
        'smtp_password' => 'encrypted',
        'twilio_token' => 'encrypted',
        'public_site_api_key' => 'encrypted',
        'google_maps_api_key' => 'encrypted',
        
        // Boolean fields
        'cors_enabled' => 'boolean',
        'email_notifications_enabled' => 'boolean',
        'sms_notifications_enabled' => 'boolean',
        'maintenance_mode' => 'boolean',
        'short_term_rentals_enabled' => 'boolean',
        'long_term_rentals_enabled' => 'boolean',
        
        // Integer fields
        'smtp_port' => 'integer',
        'minimum_stay_short_term' => 'integer',
        'minimum_stay_long_term' => 'integer',
        
        // Decimal fields
        'company_latitude' => 'decimal:8',
        'company_longitude' => 'decimal:8',
        'short_term_commission_rate' => 'decimal:2',
        'long_term_commission_rate' => 'decimal:2',
        'cleaning_fee_short_term' => 'decimal:2',
        'security_deposit_short_term' => 'decimal:2',
        'security_deposit_long_term' => 'decimal:2',
        
        // JSON fields
        'accepted_currencies' => 'array',
    ];

    /**
     * Get a setting value by key
     */
    public static function get(string $key, $default = null)
    {
        return Cache::remember("setting.{$key}", 3600, function () use ($key, $default) {
            $setting = static::first();
            return $setting ? $setting->{$key} : $default;
        });
    }

    /**
     * Set a setting value
     */
    public static function set(string $key, $value): void
    {
        $setting = static::firstOrCreate([]);
        $setting->update([$key => $value]);
        
        // Clear cache
        Cache::forget("setting.{$key}");
    }

    /**
     * Get all settings as array
     */
    public static function getAll(): array
    {
        $setting = static::first();
        return $setting ? $setting->toArray() : [];
    }

    /**
     * Get CORS allowed origins as array
     */
    public function getCorsAllowedOriginsArrayAttribute()
    {
        return $this->cors_allowed_origins ? explode(',', $this->cors_allowed_origins) : [];
    }

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        // Clear cache when settings are updated
        static::saved(function () {
            Cache::flush();
        });
    }
}
