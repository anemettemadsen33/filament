<?php

namespace App\Filament\Resources\Settings\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SettingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('smtp_host')
                    ->searchable(),
                TextColumn::make('smtp_port')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('smtp_username')
                    ->searchable(),
                TextColumn::make('smtp_encryption')
                    ->searchable(),
                TextColumn::make('mail_from_address')
                    ->searchable(),
                TextColumn::make('mail_from_name')
                    ->searchable(),
                TextColumn::make('public_site_url')
                    ->searchable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('public_site_api_base_url')
                    ->searchable(),
                TextColumn::make('public_site_api_key')
                    ->searchable(),
                TextColumn::make('sms_provider')
                    ->searchable(),
                TextColumn::make('sms_from')
                    ->searchable(),
                TextColumn::make('twilio_sid')
                    ->searchable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
