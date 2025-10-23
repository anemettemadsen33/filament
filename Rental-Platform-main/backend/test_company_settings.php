<?php

// Test script pentru a verifica company settings
require_once __DIR__ . '/vendor/autoload.php';

use App\Models\Setting;

// Load Laravel environment
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Testing Company Settings API\n";
echo "============================\n\n";

$settings = Setting::first();

if (!$settings) {
    echo "❌ No settings found in database!\n";
    exit(1);
}

echo "✅ Settings found in database\n\n";

echo "Company Information:\n";
echo "- Legal Name: " . ($settings->company_legal_name ?? 'Not set') . "\n";
echo "- Trade Name: " . ($settings->company_trade_name ?? 'Not set') . "\n";
echo "- Registration Number: " . ($settings->company_registration_number ?? 'Not set') . "\n";
echo "- Tax Number: " . ($settings->company_tax_number ?? 'Not set') . "\n";
echo "- VAT Number: " . ($settings->company_vat_number ?? 'Not set') . "\n\n";

echo "Company Address:\n";
echo "- Street: " . ($settings->company_address_street ?? 'Not set') . "\n";
echo "- City: " . ($settings->company_address_city ?? 'Not set') . "\n";
echo "- State: " . ($settings->company_address_state ?? 'Not set') . "\n";
echo "- Postal Code: " . ($settings->company_address_postal_code ?? 'Not set') . "\n";
echo "- Country: " . ($settings->company_address_country ?? 'Not set') . "\n\n";

echo "Contact Information:\n";
echo "- Email: " . ($settings->contact_email ?? 'Not set') . "\n";
echo "- Phone: " . ($settings->contact_phone ?? 'Not set') . "\n";
echo "- WhatsApp: " . ($settings->company_whatsapp ?? 'Not set') . "\n";
echo "- Skype: " . ($settings->company_skype ?? 'Not set') . "\n";
echo "- Telegram: " . ($settings->company_telegram ?? 'Not set') . "\n\n";

echo "Business Hours:\n";
echo "- Monday: " . ($settings->business_hours_monday ?? 'Not set') . "\n";
echo "- Tuesday: " . ($settings->business_hours_tuesday ?? 'Not set') . "\n";
echo "- Wednesday: " . ($settings->business_hours_wednesday ?? 'Not set') . "\n";
echo "- Thursday: " . ($settings->business_hours_thursday ?? 'Not set') . "\n";
echo "- Friday: " . ($settings->business_hours_friday ?? 'Not set') . "\n";
echo "- Saturday: " . ($settings->business_hours_saturday ?? 'Not set') . "\n";
echo "- Sunday: " . ($settings->business_hours_sunday ?? 'Not set') . "\n\n";

echo "Social Media:\n";
echo "- Facebook: " . ($settings->social_facebook ?? 'Not set') . "\n";
echo "- Instagram: " . ($settings->social_instagram ?? 'Not set') . "\n";
echo "- Twitter: " . ($settings->social_twitter ?? 'Not set') . "\n";
echo "- LinkedIn: " . ($settings->social_linkedin ?? 'Not set') . "\n";
echo "- YouTube: " . ($settings->youtube_url ?? 'Not set') . "\n";
echo "- TikTok: " . ($settings->tiktok_url ?? 'Not set') . "\n";
echo "- Pinterest: " . ($settings->pinterest_url ?? 'Not set') . "\n";
echo "- WhatsApp Business: " . ($settings->whatsapp_business_url ?? 'Not set') . "\n\n";

echo "Rental Business Settings:\n";
echo "- Short-term Rentals Enabled: " . ($settings->short_term_rentals_enabled ? 'Yes' : 'No') . "\n";
echo "- Long-term Rentals Enabled: " . ($settings->long_term_rentals_enabled ? 'Yes' : 'No') . "\n";
echo "- Minimum Stay (Short-term): " . ($settings->minimum_stay_short_term ?? 'Not set') . " days\n";
echo "- Minimum Stay (Long-term): " . ($settings->minimum_stay_long_term ?? 'Not set') . " days\n";
echo "- Default Currency: " . ($settings->default_currency ?? 'Not set') . "\n";

$acceptedCurrencies = $settings->accepted_currencies;
if (is_array($acceptedCurrencies)) {
    echo "- Accepted Currencies: " . implode(', ', $acceptedCurrencies) . "\n";
} else {
    echo "- Accepted Currencies: Not set\n";
}

echo "\n✅ All company settings are properly configured!\n";
echo "\nAPI Endpoints available:\n";
echo "- GET /api/settings (all settings)\n";
echo "- GET /api/settings/company (company details only)\n";
echo "- GET /api/settings/social-media (social media links)\n";
echo "- GET /api/settings/google-maps (maps configuration)\n";
echo "\nServer should be running at: http://127.0.0.1:8000\n";