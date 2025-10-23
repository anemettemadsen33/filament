<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter([
        // Local development - common frontend ports
        'http://localhost:3000',  // React/Next.js default
        'http://localhost:5173',  // Vite default
        'http://localhost:5174',  // Vite alternative
        'http://localhost:4200',  // Angular default
        'http://localhost:8080',  // Vue CLI default
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:4200',
        'http://127.0.0.1:8080',
        // Production frontend URL from settings (will be set via env or admin)
        env('FRONTEND_URL'),
    ]),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
