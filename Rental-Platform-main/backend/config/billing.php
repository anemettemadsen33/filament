<?php

return [
    // Issuer (platform) details
    'company_name' => env('BILLING_COMPANY_NAME', 'Rental Platform SRL'),
    'company_vat' => env('BILLING_COMPANY_VAT', null),
    'company_reg' => env('BILLING_COMPANY_REG', null),
    'company_address' => env('BILLING_COMPANY_ADDRESS', 'Str. Exemplu 1, București, RO'),
    'company_email' => env('BILLING_COMPANY_EMAIL', 'billing@example.test'),
    'company_phone' => env('BILLING_COMPANY_PHONE', '+40 700 000 000'),

    // Bank details for wire transfer
    'bank_name' => env('BILLING_BANK_NAME', 'Banca Exemplu'),
    'bank_account_iban' => env('BILLING_BANK_IBAN', 'RO00BANK0000000000000000'),
    'bank_swift' => env('BILLING_BANK_SWIFT', 'BANKROBU'),
    'currency' => env('BILLING_CURRENCY', 'RON'),

    // Invoice numbering
    'number_prefix' => env('BILLING_INV_PREFIX', date('Y').'-'),
    'number_padding' => (int) env('BILLING_INV_PADDING', 4),
];
