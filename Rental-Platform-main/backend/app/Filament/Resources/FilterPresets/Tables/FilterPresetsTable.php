<?php

namespace App\Filament\Resources\FilterPresets\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class FilterPresetsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->limit(50),
                
                IconColumn::make('is_active')
                    ->boolean()
                    ->sortable(),
                
                IconColumn::make('notification_enabled')
                    ->label('Notifications')
                    ->boolean()
                    ->sortable(),
                
                IconColumn::make('is_favorite')
                    ->boolean()
                    ->sortable(),
                
                TextColumn::make('match_count')
                    ->label('Matches')
                    ->numeric()
                    ->sortable(),
                
                TextColumn::make('new_matches_count')
                    ->label('New')
                    ->numeric()
                    ->badge()
                    ->color(fn ($state) => $state > 0 ? 'success' : 'gray')
                    ->sortable(),
                
                TextColumn::make('usage_count')
                    ->label('Usage')
                    ->numeric()
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('last_checked_at')
                    ->label('Last Checked')
                    ->dateTime()
                    ->sortable()
                    ->since()
                    ->toggleable(),
                
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TernaryFilter::make('is_active')
                    ->label('Active'),
                
                TernaryFilter::make('notification_enabled')
                    ->label('Notifications Enabled'),
                
                TernaryFilter::make('is_favorite')
                    ->label('Favorites'),
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
