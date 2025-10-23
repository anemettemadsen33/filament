<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = Setting::firstOrCreate([]);
        
        $defaultSettings = [
            // Basic Website Settings
            'website_name' => 'RentHub',
            'website_description' => 'Modern rental platform for short and long-term accommodations in Romania. Find your perfect home away from home.',
            'frontend_domain' => 'http://localhost:3000',
            'cors_enabled' => true,
            'cors_allowed_origins' => 'http://localhost:3000,http://127.0.0.1:3000',
            
            // Company Information
            'company_legal_name' => 'RentHub Solutions SRL',
            'company_trade_name' => 'RentHub',
            'company_registration_number' => 'J40/12345/2023',
            'company_tax_number' => 'RO12345678',
            'company_vat_number' => 'RO12345678',
            
            // Company Address
            'company_address_street' => 'Strada Victoriei 123, Bloc A, Ap. 4',
            'company_address_city' => 'București',
            'company_address_state' => 'Ilfov',
            'company_address_postal_code' => '010001',
            'company_address_country' => 'România',
            
            // Contact Information
            'contact_email' => 'contact@renthub.ro',
            'contact_phone' => '+40 123 456 789',
            'contact_address' => 'Strada Victoriei 123, București, România',
            
            // Additional Contact Methods
            'company_whatsapp' => '+40 123 456 789',
            'company_skype' => 'renthub.support',
            'company_telegram' => '@renthub_support',
            
            // Business Hours (Romanian business hours)
            'business_hours_monday' => '9:00 - 18:00',
            'business_hours_tuesday' => '9:00 - 18:00',
            'business_hours_wednesday' => '9:00 - 18:00',
            'business_hours_thursday' => '9:00 - 18:00',
            'business_hours_friday' => '9:00 - 18:00',
            'business_hours_saturday' => '10:00 - 16:00',
            'business_hours_sunday' => 'Închis',
            
            // Social Media
            'social_facebook' => 'https://facebook.com/renthub.ro',
            'social_twitter' => 'https://twitter.com/renthub_ro',
            'social_instagram' => 'https://instagram.com/renthub.ro',
            'social_linkedin' => 'https://linkedin.com/company/renthub-romania',
            'youtube_url' => 'https://youtube.com/@renthub_romania',
            'tiktok_url' => 'https://tiktok.com/@renthub.ro',
            'pinterest_url' => 'https://pinterest.com/renthub_ro',
            'whatsapp_business_url' => 'https://wa.me/40123456789',
            
            // Rental Business Settings
            'short_term_rentals_enabled' => true,
            'long_term_rentals_enabled' => true,
            'minimum_stay_short_term' => 1, // 1 day minimum for short-term
            'minimum_stay_long_term' => 30, // 30 days minimum for long-term
            'short_term_commission_rate' => 15.00, // 15% commission for short-term
            'long_term_commission_rate' => 10.00, // 10% commission for long-term
            
            // Pricing & Fees (in EUR)
            'default_currency' => 'EUR',
            'accepted_currencies' => ['EUR', 'RON', 'USD'],
            'cleaning_fee_short_term' => 50.00,
            'security_deposit_short_term' => 200.00,
            'security_deposit_long_term' => 500.00,
            
            // Policies
            'cancellation_policy_short_term' => 'Anulare gratuită cu până la 24 de ore înainte de check-in. Pentru anulări în ultimele 24 de ore, se aplică o taxă de 50% din prima noapte.',
            'cancellation_policy_long_term' => 'Pentru închirierile pe termen lung, este necesară o notificare de 30 de zile pentru anulare. Depozitul de garanție va fi returnat în 14 zile lucrătoare.',
            'house_rules' => 'Nu se permite fumatul în interior. Programul de liniște: 22:00 - 8:00. Petrecerile nu sunt permise. Respectați proprietatea și vecinii.',
            'check_in_instructions' => 'Check-in: 15:00 - 22:00. Cheile se află în cutia cu cod de la intrare. Codul vă va fi trimis cu o oră înainte de sosire.',
            'check_out_instructions' => 'Check-out: până la 11:00. Lăsați cheile în cutia cu cod. Scoateți gunoiul și închideți toate ferestrele.',
            
            // Emergency & Support
            'emergency_contact_name' => 'Support RentHub',
            'emergency_contact_phone' => '+40 123 456 789',
            'support_hours' => '24/7 disponibil pentru urgențe',
            
            // Email Configuration
            'smtp_host' => 'smtp.gmail.com',
            'smtp_port' => 587,
            'smtp_encryption' => 'tls',
            'mail_from_address' => 'noreply@renthub.ro',
            'mail_from_name' => 'RentHub România',
            
            // Notifications
            'email_notifications_enabled' => true,
            'sms_notifications_enabled' => false,
            
            // SEO
            'meta_keywords' => 'închiriere, cazare, booking, termen scurt, termen lung, apartamente, case, România, București',
            
            // Legal
            'privacy_policy_url' => 'https://renthub.ro/privacy',
            'terms_of_service_url' => 'https://renthub.ro/terms',
            
            // Maintenance
            'maintenance_mode' => false,
            'maintenance_message' => 'Actualizăm sistemul nostru pentru o experiență mai bună. Vă rugăm să reveniți în curând!',
        ];
        
        foreach ($defaultSettings as $key => $value) {
            if (!$settings->$key) {
                $settings->$key = $value;
            }
        }
        
        $settings->save();
        
        $this->command->info('Settings seeded successfully with Romanian company details!');
    }
}
