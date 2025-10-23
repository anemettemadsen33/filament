<?php

namespace App\Providers;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class SettingsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        if (! Schema::hasTable('settings')) {
            return;
        }
        // Load settings and apply to config (cache for 5 minutes to avoid frequent queries)
        $settings = Cache::remember('app.settings', 300, function () {
            return Setting::query()->first();
        });

        if (!$settings) {
            return;
        }

        // Apply Mailer config if provided
        $mailConfig = [];

        if (!empty($settings->smtp_host)) {
            $mailConfig['mail.mailers.smtp.host'] = $settings->smtp_host;
        }
        if (!empty($settings->smtp_port)) {
            $mailConfig['mail.mailers.smtp.port'] = (int) $settings->smtp_port;
        }
        if (!empty($settings->smtp_username)) {
            $mailConfig['mail.mailers.smtp.username'] = $settings->smtp_username;
        }
        if (!empty($settings->smtp_password)) {
            $mailConfig['mail.mailers.smtp.password'] = $settings->smtp_password;
        }
        if (!empty($settings->smtp_encryption)) {
            $mailConfig['mail.mailers.smtp.encryption'] = $settings->smtp_encryption;
        }
        if (!empty($settings->mail_from_address)) {
            $mailConfig['mail.from.address'] = $settings->mail_from_address;
        }
        if (!empty($settings->mail_from_name)) {
            $mailConfig['mail.from.name'] = $settings->mail_from_name;
        }

        if (!empty($mailConfig)) {
            foreach ($mailConfig as $key => $value) {
                config([$key => $value]);
            }
        }

        // Optionally expose public_site_url in config so app can use it
        if (!empty($settings->public_site_url)) {
            config(['app-info.public_site_url' => $settings->public_site_url]);
        }

        // Expose public site API connectivity in services config
        $publicSite = [];
        if (!empty($settings->public_site_api_base_url)) {
            $publicSite['services.public_site.api_base_url'] = rtrim($settings->public_site_api_base_url, '/');
        }
        if (!empty($settings->public_site_api_key)) {
            $publicSite['services.public_site.api_key'] = $settings->public_site_api_key;
        }
        if (!empty($publicSite)) {
            foreach ($publicSite as $key => $value) {
                config([$key => $value]);
            }
        }

        // Add CORS allowed origins dynamically based on public site URLs
        $origins = config('cors.allowed_origins', []);
        $urlsToConsider = array_filter([
            $settings->public_site_url,
            $settings->public_site_api_base_url,
        ]);
        foreach ($urlsToConsider as $u) {
            $origin = null;
            $parts = parse_url($u);
            if (isset($parts['scheme'], $parts['host'])) {
                $origin = $parts['scheme'] . '://' . $parts['host'] . (isset($parts['port']) ? (':' . $parts['port']) : '');
            }
            if ($origin && !in_array($origin, $origins, true)) {
                $origins[] = $origin;
            }
        }
        if (!empty($origins)) {
            config(['cors.allowed_origins' => $origins]);
        }

        // Configure SMS provider settings (currently Twilio supported)
        if (!empty($settings->sms_provider)) {
            config(['services.sms.provider' => $settings->sms_provider]);
        }
        if (!empty($settings->sms_from)) {
            config(['services.sms.from' => $settings->sms_from]);
        }
        if (!empty($settings->twilio_sid)) {
            config(['services.twilio.sid' => $settings->twilio_sid]);
        }
        if (!empty($settings->twilio_token)) {
            config(['services.twilio.token' => $settings->twilio_token]);
        }
    }
}
