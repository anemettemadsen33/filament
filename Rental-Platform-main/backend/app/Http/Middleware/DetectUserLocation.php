<?php

namespace App\Http\Middleware;

use App\Services\GeolocationService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DetectUserLocation
{
    public function __construct(
        private GeolocationService $geolocationService
    ) {}

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if session is available (not for stateless API requests)
        if (!$request->hasSession()) {
            return $next($request);
        }
        
        // Check if location is already detected in session
        if (!$request->session()->has('user_location')) {
            $geolocationService = app(GeolocationService::class);
            
            // Get user's IP address
            $ipAddress = $request->ip();
            
            // Allow manual override via query parameters
            $locale = $request->query('locale');
            $currency = $request->query('currency');
            
            if ($locale || $currency) {
                $request->session()->put('user_locale', $locale ?? app()->getLocale());
                $request->session()->put('user_currency', $currency ?? config('app.default_currency'));
            } else {
                // Detect location from IP
                $location = $geolocationService->getLocationFromIp($ipAddress);
                
                // Store in session
                $request->session()->put('user_location', $location);
                $request->session()->put('user_locale', $location['language']);
                $request->session()->put('user_currency', $location['currency']);
            }
        }
        
        // Set application locale
        $locale = $request->session()->get('user_locale', config('app.default_locale'));
        if ($locale && in_array($locale, config('app.supported_locales'))) {
            app()->setLocale($locale);
        }
        
        // Also check Accept-Language header if locale is not set
        if (!$request->session()->has('user_locale')) {
            $acceptLanguage = $request->header('Accept-Language');
            if ($acceptLanguage) {
                $locale = substr($acceptLanguage, 0, 2);
                if (in_array($locale, config('app.supported_locales'))) {
                    $request->session()->put('user_locale', $locale);
                    app()->setLocale($locale);
                }
            }
        }
        
        return $next($request);
    }
}
