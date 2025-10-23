<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CurrencyService
{
    private string $baseCurrency = 'EUR';

    /**
     * Convert amount from base currency to target currency
     */
    public function convert(float $amount, string $toCurrency): float
    {
        if ($toCurrency === $this->baseCurrency) {
            return $amount;
        }

        $rate = $this->getExchangeRate($toCurrency);
        return round($amount * $rate, 2);
    }

    /**
     * Get exchange rate for a currency (relative to EUR)
     */
    public function getExchangeRate(string $currency): float
    {
        $rates = $this->getExchangeRates();
        return $rates[$currency] ?? 1.0;
    }

    /**
     * Get all exchange rates (cached for 1 hour)
     */
    public function getExchangeRates(): array
    {
        return Cache::remember('exchange_rates', 3600, function () {
            try {
                // Using European Central Bank API (free, no key required)
                $response = Http::get('https://api.exchangerate-api.com/v4/latest/EUR');

                if ($response->successful()) {
                    $data = $response->json();
                    return $data['rates'] ?? $this->getStaticRates();
                }
            } catch (\Exception $e) {
                Log::warning('Exchange rate API error: ' . $e->getMessage());
            }

            return $this->getStaticRates();
        });
    }

    /**
     * Static fallback exchange rates (updated periodically)
     * These are approximate rates as of January 2025
     */
    private function getStaticRates(): array
    {
        return [
            'EUR' => 1.0,
            'USD' => 1.11,
            'GBP' => 0.85,
            'RON' => 4.97,
            'PLN' => 4.28,
            'CZK' => 25.15,
            'HUF' => 395.50,
            'CHF' => 0.93,
            'SEK' => 11.45,
            'NOK' => 11.68,
            'DKK' => 7.46,
            'CAD' => 1.51,
            'AUD' => 1.69,
            'JPY' => 163.50,
            'CNY' => 7.89,
            'BRL' => 5.58,
            'MXN' => 22.15,
            'INR' => 92.45,
            'RUB' => 103.50,
            'TRY' => 32.50,
            'ZAR' => 19.85,
        ];
    }

    /**
     * Format amount with currency symbol
     */
    public function format(float $amount, string $currency, ?GeolocationService $geoService = null): string
    {
        $geoService = $geoService ?? app(GeolocationService::class);
        $symbol = $geoService->getCurrencySymbol($currency);

        // Determine decimal places based on currency
        $decimals = in_array($currency, ['JPY', 'KRW', 'VND']) ? 0 : 2;

        // Format number
        $formatted = number_format($amount, $decimals, '.', ',');

        // Currency-specific formatting
        return match ($currency) {
            'USD', 'GBP', 'CAD', 'AUD' => "{$symbol}{$formatted}",
            'EUR' => "{$formatted} {$symbol}",
            'RON' => "{$formatted} {$symbol}",
            default => "{$formatted} {$symbol}",
        };
    }

    /**
     * Convert and format amount
     */
    public function convertAndFormat(float $amount, string $toCurrency): string
    {
        $converted = $this->convert($amount, $toCurrency);
        return $this->format($converted, $toCurrency);
    }

    /**
     * Get currency info
     */
    public function getCurrencyInfo(string $currency): ?array
    {
        $geoService = app(GeolocationService::class);
        $supported = $geoService->getSupportedCurrencies();
        
        return $supported[$currency] ?? null;
    }

    /**
     * Refresh exchange rates (can be called via cron job)
     */
    public function refreshRates(): void
    {
        Cache::forget('exchange_rates');
        $this->getExchangeRates();
    }
}
