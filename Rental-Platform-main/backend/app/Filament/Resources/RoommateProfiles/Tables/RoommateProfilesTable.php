<?php

namespace App\Filament\Resources\RoommateProfiles\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class RoommateProfilesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('age')
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('gender')
                    ->badge()
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('occupation')
                    ->searchable()
                    ->limit(30)
                    ->toggleable(),
                
                TextColumn::make('budget_min')
                    ->label('Budget')
                    ->money('USD')
                    ->sortable()
                    ->formatStateUsing(fn ($record) => 
                        '$' . number_format($record->budget_min) . ' - $' . number_format($record->budget_max)
                    ),
                
                TextColumn::make('lifestyle')
                    ->badge()
                    ->colors([
                        'gray' => 'quiet',
                        'success' => 'social',
                        'warning' => 'active',
                        'info' => 'relaxed',
                    ])
                    ->sortable(),
                
                TextColumn::make('cleanliness')
                    ->badge()
                    ->sortable()
                    ->toggleable(),
                
                IconColumn::make('has_pets')
                    ->boolean()
                    ->toggleable(),
                
                IconColumn::make('smoker')
                    ->boolean()
                    ->toggleable(),
                
                TextColumn::make('match_status')
                    ->badge()
                    ->colors([
                        'success' => 'active',
                        'primary' => 'matched',
                        'gray' => 'inactive',
                        'warning' => 'paused',
                    ])
                    ->sortable(),
                
                IconColumn::make('verified')
                    ->boolean()
                    ->sortable(),
                
                TextColumn::make('move_in_date')
                    ->date()
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('match_status')
                    ->options([
                        'active' => 'Active',
                        'matched' => 'Matched',
                        'inactive' => 'Inactive',
                        'paused' => 'Paused',
                    ]),
                
                SelectFilter::make('lifestyle')
                    ->options([
                        'quiet' => 'Quiet',
                        'social' => 'Social',
                        'active' => 'Active',
                        'relaxed' => 'Relaxed',
                    ]),
                
                TernaryFilter::make('verified')
                    ->label('Verified'),
                
                TernaryFilter::make('has_pets')
                    ->label('Has Pets'),
                
                TernaryFilter::make('smoker')
                    ->label('Smoker'),
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
