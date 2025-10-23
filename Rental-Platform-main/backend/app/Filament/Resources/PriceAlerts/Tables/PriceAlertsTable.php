<?php

namespace App\Filament\Resources\PriceAlerts\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class PriceAlertsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('property.title')
                    ->label('Property')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('target_price')
                    ->money('USD')
                    ->sortable(),
                
                TextColumn::make('price_type')
                    ->label('Type')
                    ->badge()
                    ->colors([
                        'info' => 'per_night',
                        'success' => 'per_month',
                        'warning' => 'cleaning_fee',
                        'primary' => 'security_deposit',
                    ])
                    ->sortable(),
                
                TextColumn::make('alert_type')
                    ->label('Alert Type')
                    ->badge()
                    ->colors([
                        'success' => 'price_drop',
                        'info' => 'price_match',
                        'warning' => 'price_below',
                    ])
                    ->sortable(),
                
                IconColumn::make('is_active')
                    ->boolean()
                    ->sortable(),
                
                TextColumn::make('triggered_at')
                    ->label('Triggered')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('notified_at')
                    ->label('Notified')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TernaryFilter::make('is_active')
                    ->label('Active'),
                
                SelectFilter::make('alert_type')
                    ->options([
                        'price_drop' => 'Price Drop',
                        'price_match' => 'Price Match',
                        'price_below' => 'Price Below',
                    ]),
                
                SelectFilter::make('price_type')
                    ->options([
                        'per_night' => 'Per Night',
                        'per_month' => 'Per Month',
                        'cleaning_fee' => 'Cleaning Fee',
                        'security_deposit' => 'Security Deposit',
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
            ->defaultSort('created_at', 'desc');
    }
}
