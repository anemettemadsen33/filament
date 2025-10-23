<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Application Information
    |--------------------------------------------------------------------------
    |
    | Configuration for branding and contact information used in emails,
    | invoices, and other customer-facing communications.
    |
    */

    'name' => env('APP_NAME', 'RentalPlatform'),
    'url' => env('APP_URL', 'http://localhost'),
    // Optional: domain for the Filament admin panel (e.g. admin.example.com)
    'admin_domain' => env('FILAMENT_ADMIN_DOMAIN', null),
    
    'logo_url' => env('APP_LOGO_URL', null),
    'primary_color' => env('APP_PRIMARY_COLOR', '#3b82f6'),
    
    'contact' => [
        'email' => env('CONTACT_EMAIL', 'contact@rentalplatform.com'),
        'phone' => env('CONTACT_PHONE', '+40 123 456 789'),
        'address' => env('CONTACT_ADDRESS', 'Bucharest, Romania'),
    ],
    
    'social' => [
        'facebook' => env('SOCIAL_FACEBOOK', null),
        'instagram' => env('SOCIAL_INSTAGRAM', null),
        'twitter' => env('SOCIAL_TWITTER', null),
    ],

    // Public site base URL that users access (can be overridden from Settings page as well)
    'public_site_url' => env('PUBLIC_SITE_URL', env('APP_URL', 'http://localhost')),
];
