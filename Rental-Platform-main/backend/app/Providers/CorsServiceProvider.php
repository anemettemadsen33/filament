<?php

namespace App\Providers;

use App\Models\Setting;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Config;

class CorsServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        try {
            // Only configure CORS if database exists and has settings
            if ($this->databaseExists()) {
                $this->configureCorsFromSettings();
            }
        } catch (\Exception $e) {
            // Fail silently during migrations or when database is not ready
        }
    }

    private function databaseExists(): bool
    {
        try {
            \DB::connection()->getPdo();
            return \Schema::hasTable('settings');
        } catch (\Exception $e) {
            return false;
        }
    }

    private function configureCorsFromSettings(): void
    {
        $corsEnabled = Setting::get('cors_enabled', true);
        $allowedOrigins = Setting::get('cors_allowed_origins', '');
        $frontendDomain = Setting::get('frontend_domain', '');

        if (!$corsEnabled) {
            return;
        }

        $origins = [];

        // Add origins from settings
        if ($allowedOrigins) {
            $origins = array_merge($origins, array_map('trim', explode(',', $allowedOrigins)));
        }

        // Add frontend domain if set
        if ($frontendDomain) {
            $origins[] = rtrim($frontendDomain, '/');
        }

        // Add local development origins
        $origins = array_merge($origins, [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5173',
        ]);

        // Remove empty values and duplicates
        $origins = array_unique(array_filter($origins));

        // Update CORS configuration
        Config::set('cors.allowed_origins', $origins);
    }
}
