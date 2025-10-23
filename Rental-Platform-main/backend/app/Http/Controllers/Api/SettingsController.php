<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    /**
     * Get all public settings for the frontend
     */
    public function index(): JsonResponse
    {
        $settings = Setting::first();
        
        if (!$settings) {
            return response()->json([
                'message' => 'Settings not found'
            ], 404);
        }

        // Return only public settings (exclude sensitive data)
        $publicSettings = [
            // Website Information
            'website_name' => $settings->website_name,
            'website_description' => $settings->website_description,
            'website_logo_url' => $settings->website_logo_url,
            'website_favicon_url' => $settings->website_favicon_url,
            
            // Company Information
            'company_legal_name' => $settings->company_legal_name,
            'company_trade_name' => $settings->company_trade_name,
            'company_registration_number' => $settings->company_registration_number,
            'company_tax_number' => $settings->company_tax_number,
            'company_vat_number' => $settings->company_vat_number,
            
            // Company Address
            'company_address' => [
                'street' => $settings->company_address_street,
                'city' => $settings->company_address_city,
                'state' => $settings->company_address_state,
                'postal_code' => $settings->company_address_postal_code,
                'country' => $settings->company_address_country,
                'full_address' => $settings->contact_address,
            ],
            
            // Contact Information
            'contact' => [
                'email' => $settings->contact_email,
                'phone' => $settings->contact_phone,
                'whatsapp' => $settings->company_whatsapp,
                'skype' => $settings->company_skype,
                'telegram' => $settings->company_telegram,
            ],
            
            // Emergency Contact
            'emergency_contact' => [
                'name' => $settings->emergency_contact_name,
                'phone' => $settings->emergency_contact_phone,
            ],
            
            // Business Hours
            'business_hours' => [
                'monday' => $settings->business_hours_monday,
                'tuesday' => $settings->business_hours_tuesday,
                'wednesday' => $settings->business_hours_wednesday,
                'thursday' => $settings->business_hours_thursday,
                'friday' => $settings->business_hours_friday,
                'saturday' => $settings->business_hours_saturday,
                'sunday' => $settings->business_hours_sunday,
            ],
            
            // Social Media
            'social_media' => [
                'facebook' => $settings->social_facebook,
                'twitter' => $settings->social_twitter,
                'instagram' => $settings->social_instagram,
                'linkedin' => $settings->social_linkedin,
                'youtube' => $settings->youtube_url,
                'tiktok' => $settings->tiktok_url,
                'pinterest' => $settings->pinterest_url,
                'whatsapp_business' => $settings->whatsapp_business_url,
            ],
            
            // Google Maps
            'google_maps' => [
                'embed_url' => $settings->google_maps_embed_url,
                'latitude' => $settings->company_latitude,
                'longitude' => $settings->company_longitude,
            ],
            
            // Rental Business Settings
            'rental_business' => [
                'short_term_enabled' => $settings->short_term_rentals_enabled,
                'long_term_enabled' => $settings->long_term_rentals_enabled,
                'minimum_stay_short_term' => $settings->minimum_stay_short_term,
                'minimum_stay_long_term' => $settings->minimum_stay_long_term,
                'default_currency' => $settings->default_currency,
                'accepted_currencies' => $settings->accepted_currencies,
            ],
            
            // Policies
            'policies' => [
                'cancellation_short_term' => $settings->cancellation_policy_short_term,
                'cancellation_long_term' => $settings->cancellation_policy_long_term,
                'house_rules' => $settings->house_rules,
                'check_in_instructions' => $settings->check_in_instructions,
                'check_out_instructions' => $settings->check_out_instructions,
                'privacy_policy_url' => $settings->privacy_policy_url,
                'terms_of_service_url' => $settings->terms_of_service_url,
            ],
            
            // Support
            'support' => [
                'hours' => $settings->support_hours,
                'email_enabled' => $settings->email_notifications_enabled,
                'sms_enabled' => $settings->sms_notifications_enabled,
            ],
            
            // SEO
            'seo' => [
                'meta_keywords' => $settings->meta_keywords,
                'google_analytics_id' => $settings->google_analytics_id,
                'google_tag_manager_id' => $settings->google_tag_manager_id,
                'facebook_pixel_id' => $settings->facebook_pixel_id,
            ],
            
            // System Status
            'maintenance_mode' => $settings->maintenance_mode,
            'maintenance_message' => $settings->maintenance_message,
        ];

        return response()->json([
            'success' => true,
            'data' => $publicSettings,
        ]);
    }

    /**
     * Get company details only
     */
    public function company(): JsonResponse
    {
        $settings = Setting::first();
        
        if (!$settings) {
            return response()->json([
                'message' => 'Company settings not found'
            ], 404);
        }

        $companyData = [
            'legal_name' => $settings->company_legal_name,
            'trade_name' => $settings->company_trade_name,
            'registration_number' => $settings->company_registration_number,
            'tax_number' => $settings->company_tax_number,
            'vat_number' => $settings->company_vat_number,
            'address' => [
                'street' => $settings->company_address_street,
                'city' => $settings->company_address_city,
                'state' => $settings->company_address_state,
                'postal_code' => $settings->company_address_postal_code,
                'country' => $settings->company_address_country,
            ],
            'contact' => [
                'email' => $settings->contact_email,
                'phone' => $settings->contact_phone,
                'whatsapp' => $settings->company_whatsapp,
                'skype' => $settings->company_skype,
                'telegram' => $settings->company_telegram,
            ],
            'business_hours' => [
                'monday' => $settings->business_hours_monday,
                'tuesday' => $settings->business_hours_tuesday,
                'wednesday' => $settings->business_hours_wednesday,
                'thursday' => $settings->business_hours_thursday,
                'friday' => $settings->business_hours_friday,
                'saturday' => $settings->business_hours_saturday,
                'sunday' => $settings->business_hours_sunday,
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $companyData,
        ]);
    }

    /**
     * Get social media links only
     */
    public function socialMedia(): JsonResponse
    {
        $settings = Setting::first();
        
        if (!$settings) {
            return response()->json([
                'message' => 'Social media settings not found'
            ], 404);
        }

        $socialData = [
            'facebook' => $settings->social_facebook,
            'twitter' => $settings->social_twitter,
            'instagram' => $settings->social_instagram,
            'linkedin' => $settings->social_linkedin,
            'youtube' => $settings->youtube_url,
            'tiktok' => $settings->tiktok_url,
            'pinterest' => $settings->pinterest_url,
            'whatsapp_business' => $settings->whatsapp_business_url,
        ];

        return response()->json([
            'success' => true,
            'data' => $socialData,
        ]);
    }

    /**
     * Get Google Maps configuration
     */
    public function googleMaps(): JsonResponse
    {
        $settings = Setting::first();
        
        if (!$settings) {
            return response()->json([
                'message' => 'Google Maps settings not found'
            ], 404);
        }

        $mapsData = [
            'embed_url' => $settings->google_maps_embed_url,
            'latitude' => $settings->company_latitude,
            'longitude' => $settings->company_longitude,
            'address' => [
                'street' => $settings->company_address_street,
                'city' => $settings->company_address_city,
                'state' => $settings->company_address_state,
                'postal_code' => $settings->company_address_postal_code,
                'country' => $settings->company_address_country,
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $mapsData,
        ]);
    }
}