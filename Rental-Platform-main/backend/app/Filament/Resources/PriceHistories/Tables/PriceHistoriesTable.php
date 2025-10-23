<?php

namespace App\Filament\Resources\PriceHistories\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class PriceHistoriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('property.title')
                    ->label('Property')
                    ->searchable()
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
                
                TextColumn::make('old_price')
                    ->money('USD')
                    ->sortable(),
                
                TextColumn::make('new_price')
                    ->money('USD')
                    ->sortable(),
                
                TextColumn::make('price_change_percentage')
                    ->label('Change %')
                    ->suffix('%')
                    ->badge()
                    ->color(fn ($state) => $state < 0 ? 'success' : ($state > 0 ? 'danger' : 'gray'))
                    ->sortable(),
                
                TextColumn::make('changedBy.name')
                    ->label('Changed By')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('effective_date')
                    ->dateTime()
                    ->sortable(),
                
                TextColumn::make('reason')
                    ->limit(30)
                    ->toggleable(),
                
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('price_type')
                    ->label('Type')
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
            ->defaultSort('effective_date', 'desc');
    }
}
