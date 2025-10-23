<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CurrencyService;
use App\Services\GeolocationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocalizationController extends Controller
{
    public function __construct(
        private GeolocationService $geolocationService,
        private CurrencyService $currencyService
    ) {}

    /**
     * Get current localization info
     */
    public function info(Request $request)
    {
        $geolocationService = app(GeolocationService::class);
        
        // Get location info from IP if session not available
        $ipAddress = $request->ip();
        $location = $geolocationService->getLocationFromIp($ipAddress);
        
        return response()->json([
            'location' => $location,
            'currency' => $location['currency'] ?? config('app.default_currency'),
            'locale' => $location['language'] ?? app()->getLocale(),
            'supported_currencies' => $geolocationService->getSupportedCurrencies(),
            'supported_locales' => config('app.supported_locales'),
        ]);
    }

    /**
     * Set user locale
     */
    public function setLocale(Request $request): JsonResponse
    {
        $request->validate([
            'locale' => 'required|string|in:en,ro,fr,de,es,it,pt,nl,pl,ru,uk,tr,el,bg,hu,cs,sk,hr,sr,sl',
        ]);

        $locale = $request->input('locale');
        $request->session()->put('user_locale', $locale);
        app()->setLocale($locale);

        return response()->json([
            'success' => true,
            'locale' => $locale,
            'message' => __('Locale updated successfully'),
        ]);
    }

    /**
     * Set user currency
     */
    public function setCurrency(Request $request): JsonResponse
    {
        $request->validate([
            'currency' => 'required|string|size:3',
        ]);

        $currency = strtoupper($request->input('currency'));
        $supported = array_keys($this->geolocationService->getSupportedCurrencies());

        if (!in_array($currency, $supported)) {
            return response()->json([
                'success' => false,
                'message' => 'Currency not supported',
                'supported_currencies' => $supported,
            ], 400);
        }

        $request->session()->put('user_currency', $currency);

        return response()->json([
            'success' => true,
            'currency' => $currency,
            'symbol' => $this->geolocationService->getCurrencySymbol($currency),
            'exchange_rate' => $this->currencyService->getExchangeRate($currency),
            'message' => __('Currency updated successfully'),
        ]);
    }
}
