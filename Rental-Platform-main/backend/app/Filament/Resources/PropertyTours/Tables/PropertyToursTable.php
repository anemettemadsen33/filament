<?php

namespace App\Filament\Resources\PropertyTours\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class PropertyToursTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('property.title')
                    ->label('Property')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('user.name')
                    ->label('Visitor')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('landlord.name')
                    ->label('Landlord')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('tour_type')
                    ->label('Type')
                    ->badge()
                    ->colors([
                        'success' => 'in-person',
                        'info' => 'virtual',
                        'warning' => 'self-guided',
                    ])
                    ->sortable(),
                
                TextColumn::make('scheduled_at')
                    ->label('Scheduled')
                    ->dateTime()
                    ->sortable(),
                
                TextColumn::make('duration')
                    ->label('Duration')
                    ->suffix(' min')
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'warning' => 'pending',
                        'info' => 'confirmed',
                        'success' => 'completed',
                        'danger' => 'cancelled',
                        'secondary' => 'rescheduled',
                        'gray' => 'no_show',
                    ])
                    ->sortable(),
                
                TextColumn::make('confirmation_code')
                    ->label('Code')
                    ->searchable()
                    ->toggleable(),
                
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                        'rescheduled' => 'Rescheduled',
                        'no_show' => 'No Show',
                    ]),
                
                SelectFilter::make('tour_type')
                    ->label('Type')
                    ->options([
                        'in-person' => 'In Person',
                        'virtual' => 'Virtual',
                        'self-guided' => 'Self Guided',
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
            ->defaultSort('scheduled_at', 'desc');
    }
}
