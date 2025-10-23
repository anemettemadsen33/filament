<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeolocationService
{
    private string $apiKey;
    private string $baseUrl = 'http://api.ipstack.com';

    public function __construct()
    {
        $this->apiKey = config('services.ipstack.api_key');
    }

    /**
     * Get location data from IP address
     */
    public function getLocationFromIp(?string $ip = null): ?array
    {
        if (!$ip) {
            $ip = request()->ip();
        }

        // Skip for local development IPs
        if ($this->isLocalIp($ip)) {
            return $this->getDefaultLocation();
        }

        // Cache the result for 24 hours
        $cacheKey = "geolocation:{$ip}";
        
        return Cache::remember($cacheKey, 86400, function () use ($ip) {
            try {
                $response = Http::get("{$this->baseUrl}/{$ip}", [
                    'access_key' => $this->apiKey,
                    'fields' => 'country_code,country_name,region_name,city,currency,location',
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    
                    return [
                        'country_code' => $data['country_code'] ?? null,
                        'country_name' => $data['country_name'] ?? null,
                        'region' => $data['region_name'] ?? null,
                        'city' => $data['city'] ?? null,
                        'currency' => $data['currency']['code'] ?? 'EUR',
                        'latitude' => $data['latitude'] ?? null,
                        'longitude' => $data['longitude'] ?? null,
                        'language' => $this->getLanguageFromCountry($data['country_code'] ?? null),
                    ];
                }
            } catch (\Exception $e) {
                Log::error('IPStack API error: ' . $e->getMessage());
            }

            return $this->getDefaultLocation();
        });
    }

    /**
     * Get default location (for local development or API failures)
     */
    private function getDefaultLocation(): array
    {
        return [
            'country_code' => 'RO',
            'country_name' => 'Romania',
            'region' => null,
            'city' => null,
            'currency' => config('services.ipstack.default_currency', 'EUR'),
            'latitude' => null,
            'longitude' => null,
            'language' => config('app.locale', 'en'),
        ];
    }

    /**
     * Check if IP is local/private
     */
    private function isLocalIp(string $ip): bool
    {
        return in_array($ip, ['127.0.0.1', 'localhost', '::1']) ||
               str_starts_with($ip, '192.168.') ||
               str_starts_with($ip, '10.') ||
               str_starts_with($ip, '172.');
    }

    /**
     * Map country code to preferred language
     */
    private function getLanguageFromCountry(?string $countryCode): string
    {
        $languageMap = [
            'RO' => 'ro',
            'MD' => 'ro',
            'US' => 'en',
            'GB' => 'en',
            'CA' => 'en',
            'AU' => 'en',
            'NZ' => 'en',
            'IE' => 'en',
            'FR' => 'fr',
            'DE' => 'de',
            'ES' => 'es',
            'IT' => 'it',
            'PT' => 'pt',
            'BR' => 'pt',
            'NL' => 'nl',
            'BE' => 'nl',
            'PL' => 'pl',
            'RU' => 'ru',
            'UA' => 'uk',
            'TR' => 'tr',
            'GR' => 'el',
            'BG' => 'bg',
            'HU' => 'hu',
            'CZ' => 'cs',
            'SK' => 'sk',
            'HR' => 'hr',
            'RS' => 'sr',
            'SI' => 'sl',
        ];

        return $languageMap[$countryCode] ?? config('app.fallback_locale', 'en');
    }

    /**
     * Get currency symbol
     */
    public function getCurrencySymbol(string $currency): string
    {
        $symbols = [
            'USD' => '$',
            'EUR' => '€',
            'GBP' => '£',
            'RON' => 'lei',
            'JPY' => '¥',
            'CNY' => '¥',
            'CAD' => 'C$',
            'AUD' => 'A$',
            'CHF' => 'CHF',
            'SEK' => 'kr',
            'NOK' => 'kr',
            'DKK' => 'kr',
            'PLN' => 'zł',
            'CZK' => 'Kč',
            'HUF' => 'Ft',
            'RUB' => '₽',
            'TRY' => '₺',
            'INR' => '₹',
            'BRL' => 'R$',
            'MXN' => 'Mex$',
            'ZAR' => 'R',
        ];

        return $symbols[$currency] ?? $currency;
    }

    /**
     * Get list of supported currencies
     */
    public function getSupportedCurrencies(): array
    {
        return [
            'EUR' => ['name' => 'Euro', 'symbol' => '€', 'countries' => ['AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES']],
            'USD' => ['name' => 'US Dollar', 'symbol' => '$', 'countries' => ['US']],
            'GBP' => ['name' => 'British Pound', 'symbol' => '£', 'countries' => ['GB']],
            'RON' => ['name' => 'Romanian Leu', 'symbol' => 'lei', 'countries' => ['RO']],
            'PLN' => ['name' => 'Polish Złoty', 'symbol' => 'zł', 'countries' => ['PL']],
            'CZK' => ['name' => 'Czech Koruna', 'symbol' => 'Kč', 'countries' => ['CZ']],
            'HUF' => ['name' => 'Hungarian Forint', 'symbol' => 'Ft', 'countries' => ['HU']],
            'CHF' => ['name' => 'Swiss Franc', 'symbol' => 'CHF', 'countries' => ['CH']],
            'SEK' => ['name' => 'Swedish Krona', 'symbol' => 'kr', 'countries' => ['SE']],
            'NOK' => ['name' => 'Norwegian Krone', 'symbol' => 'kr', 'countries' => ['NO']],
            'DKK' => ['name' => 'Danish Krone', 'symbol' => 'kr', 'countries' => ['DK']],
            'CAD' => ['name' => 'Canadian Dollar', 'symbol' => 'C$', 'countries' => ['CA']],
            'AUD' => ['name' => 'Australian Dollar', 'symbol' => 'A$', 'countries' => ['AU']],
        ];
    }
}
