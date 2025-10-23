<?php

namespace App\Filament\Resources\Settings\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class SettingInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('smtp_host')
                    ->placeholder('-'),
                TextEntry::make('smtp_port')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('smtp_username')
                    ->placeholder('-'),
                TextEntry::make('smtp_encryption')
                    ->placeholder('-'),
                TextEntry::make('mail_from_address')
                    ->placeholder('-'),
                TextEntry::make('mail_from_name')
                    ->placeholder('-'),
                TextEntry::make('public_site_url')
                    ->placeholder('-'),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('public_site_api_base_url')
                    ->placeholder('-'),
                TextEntry::make('public_site_api_key')
                    ->placeholder('-'),
                TextEntry::make('sms_provider')
                    ->placeholder('-'),
                TextEntry::make('sms_from')
                    ->placeholder('-'),
                TextEntry::make('twilio_sid')
                    ->placeholder('-'),
            ]);
    }
}
