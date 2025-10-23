<?php

namespace App\Filament\Resources\PropertyAnalytics\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class PropertyAnalyticsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('property.title')
                    ->label('Property')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('date')
                    ->date()
                    ->sortable(),
                
                TextColumn::make('views')
                    ->numeric()
                    ->sortable()
                    ->color('info'),
                
                TextColumn::make('unique_visitors')
                    ->label('Unique')
                    ->numeric()
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('inquiries')
                    ->numeric()
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('bookings')
                    ->numeric()
                    ->sortable()
                    ->color('success'),
                
                TextColumn::make('revenue')
                    ->money('USD')
                    ->sortable()
                    ->color('success'),
                
                TextColumn::make('conversion_rate')
                    ->suffix('%')
                    ->sortable()
                    ->color(fn ($state) => $state >= 5 ? 'success' : ($state >= 2 ? 'warning' : 'danger')),
                
                TextColumn::make('occupancy_rate')
                    ->label('Occupancy')
                    ->suffix('%')
                    ->sortable()
                    ->toggleable()
                    ->color(fn ($state) => $state >= 80 ? 'success' : ($state >= 50 ? 'warning' : 'danger')),
                
                TextColumn::make('avg_stay_duration')
                    ->label('Avg Stay')
                    ->suffix(' days')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('avg_daily_rate')
                    ->label('ADR')
                    ->money('USD')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Filter::make('date_range')
                    ->form([
                        \Filament\Forms\Components\DatePicker::make('date_from')
                            ->label('From Date'),
                        \Filament\Forms\Components\DatePicker::make('date_to')
                            ->label('To Date'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['date_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('date', '>=', $date),
                            )
                            ->when(
                                $data['date_to'],
                                fn (Builder $query, $date): Builder => $query->whereDate('date', '<=', $date),
                            );
                    }),
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
            ->defaultSort('date', 'desc');
    }
}
