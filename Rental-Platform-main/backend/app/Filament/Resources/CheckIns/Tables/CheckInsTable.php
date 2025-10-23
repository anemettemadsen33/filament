<?php

namespace App\Filament\Resources\CheckIns\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class CheckInsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('property.title')
                    ->label('Property')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('booking.id')
                    ->label('Booking #')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('access_method')
                    ->label('Access Method')
                    ->badge()
                    ->colors([
                        'info' => 'lockbox',
                        'success' => 'smart_lock',
                        'warning' => 'key_exchange',
                        'primary' => 'door_code',
                        'secondary' => 'concierge',
                    ])
                    ->sortable(),
                
                TextColumn::make('access_code')
                    ->label('Code')
                    ->searchable()
                    ->toggleable(),
                
                TextColumn::make('valid_from')
                    ->label('Valid From')
                    ->dateTime()
                    ->sortable(),
                
                TextColumn::make('valid_until')
                    ->label('Valid Until')
                    ->dateTime()
                    ->sortable(),
                
                TextColumn::make('wifi_name')
                    ->label('WiFi')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('emergency_contact_name')
                    ->label('Emergency Contact')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('access_method')
                    ->options([
                        'lockbox' => 'Lockbox',
                        'smart_lock' => 'Smart Lock',
                        'key_exchange' => 'Key Exchange',
                        'door_code' => 'Door Code',
                        'concierge' => 'Concierge',
                    ]),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('valid_from', 'desc');
    }
}
