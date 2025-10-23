<?php

namespace App\Filament\Resources\MaintenanceRequests\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class MaintenanceRequestsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('property.title')
                    ->label('Property')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->limit(40),
                
                TextColumn::make('category')
                    ->badge()
                    ->colors([
                        'info' => 'plumbing',
                        'warning' => 'electrical',
                        'danger' => 'hvac',
                        'success' => 'appliances',
                        'gray' => 'structural',
                        'primary' => 'pest_control',
                    ])
                    ->sortable(),
                
                TextColumn::make('priority')
                    ->badge()
                    ->colors([
                        'gray' => 'low',
                        'info' => 'medium',
                        'warning' => 'high',
                        'danger' => 'urgent',
                    ])
                    ->sortable(),
                
                TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'warning' => 'pending',
                        'info' => 'acknowledged',
                        'primary' => 'scheduled',
                        'secondary' => 'in_progress',
                        'success' => 'completed',
                        'danger' => 'cancelled',
                    ])
                    ->sortable(),
                
                TextColumn::make('tenant.name')
                    ->label('Tenant')
                    ->searchable()
                    ->toggleable(),
                
                TextColumn::make('assignedTo.name')
                    ->label('Assigned To')
                    ->searchable()
                    ->toggleable(),
                
                TextColumn::make('estimated_cost')
                    ->money('USD')
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('actual_cost')
                    ->money('USD')
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('scheduled_date')
                    ->dateTime()
                    ->sortable()
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
                        'acknowledged' => 'Acknowledged',
                        'scheduled' => 'Scheduled',
                        'in_progress' => 'In Progress',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ]),
                
                SelectFilter::make('priority')
                    ->options([
                        'low' => 'Low',
                        'medium' => 'Medium',
                        'high' => 'High',
                        'urgent' => 'Urgent',
                    ]),
                
                SelectFilter::make('category')
                    ->options([
                        'plumbing' => 'Plumbing',
                        'electrical' => 'Electrical',
                        'hvac' => 'HVAC',
                        'appliances' => 'Appliances',
                        'structural' => 'Structural',
                        'pest_control' => 'Pest Control',
                        'cleaning' => 'Cleaning',
                        'landscaping' => 'Landscaping',
                        'other' => 'Other',
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
