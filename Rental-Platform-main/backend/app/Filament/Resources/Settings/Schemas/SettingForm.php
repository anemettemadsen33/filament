<?php

namespace App\Filament\Resources\Settings\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SettingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Email (SMTP)')
                    ->description('Configurare trimitere email-uri')
                    ->schema([
                        TextInput::make('smtp_host')->label('SMTP Host'),
                        TextInput::make('smtp_port')->numeric()->label('SMTP Port'),
                        TextInput::make('smtp_username')->label('SMTP Username'),
                        TextInput::make('smtp_password')->password()->revealable()->label('SMTP Password'),
                        TextInput::make('smtp_encryption')->placeholder('tls / ssl')->label('Encryption'),
                        TextInput::make('mail_from_address')->label('From Address'),
                        TextInput::make('mail_from_name')->label('From Name'),
                    ])
                    ->columns(2),

                Section::make('Public Site')
                    ->description('Integrare frontend public (SPA)')
                    ->schema([
                        TextInput::make('public_site_url')->url()->label('Public Site URL'),
                        TextInput::make('public_site_api_base_url')->url()->label('Public API Base URL'),
                    ])
                    ->columns(2),

                Section::make('Facturare & Detalii bancare')
                    ->description('Detalii transfer bancar pentru facturi (fără plăți online)')
                    ->schema([
                        TextInput::make('default_currency')->maxLength(3)->hint('Ex: RON, EUR, USD')->label('Monedă implicită'),
                        TextInput::make('bank_name')->label('Banca'),
                        TextInput::make('bank_account_name')->label('Titular cont'),
                        TextInput::make('bank_account_number')->label('Număr cont'),
                        TextInput::make('bank_iban')->label('IBAN'),
                        TextInput::make('bank_swift_bic')->label('SWIFT/BIC'),
                        TextInput::make('bank_address')->label('Adresă bancă'),
                        Textarea::make('payment_instructions')->rows(3)->label('Instrucțiuni plată'),
                    ])
                    ->columns(2),

                Section::make('Politici Booking')
                    ->description('Reguli generale pentru rezervări')
                    ->schema([
                        TextInput::make('minimum_stay_short_term')->numeric()->label('Minimum nopți (short-term)'),
                        TextInput::make('minimum_stay_long_term')->numeric()->label('Minimum nopți (long-term)'),
                        Textarea::make('cancellation_policy_short_term')->rows(4)->label('Politică anulare (short-term)'),
                        Textarea::make('cancellation_policy_long_term')->rows(4)->label('Politică anulare (long-term)'),
                    ])
                    ->columns(2),
            ]);
    }
}
