<?php

namespace App\Filament\Resources\BackgroundChecks\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class BackgroundChecksTable
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
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('check_type')
                    ->label('Type')
                    ->badge()
                    ->colors([
                        'info' => 'credit',
                        'danger' => 'criminal',
                        'warning' => 'eviction',
                        'success' => 'employment',
                        'gray' => 'reference',
                        'primary' => 'identity',
                        'secondary' => 'comprehensive',
                    ])
                    ->sortable(),
                
                TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'warning' => 'pending',
                        'info' => 'in_progress',
                        'success' => 'completed',
                        'danger' => 'failed',
                        'gray' => 'expired',
                    ])
                    ->sortable(),
                
                TextColumn::make('result')
                    ->badge()
                    ->colors([
                        'success' => 'pass',
                        'danger' => 'fail',
                        'warning' => 'conditional',
                        'info' => 'review_required',
                    ])
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('credit_score')
                    ->label('Score')
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('provider')
                    ->searchable()
                    ->toggleable(),
                
                TextColumn::make('fee')
                    ->money('USD')
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('request_date')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('completed_date')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('expires_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'in_progress' => 'In Progress',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                        'expired' => 'Expired',
                    ]),
                
                SelectFilter::make('check_type')
                    ->label('Type')
                    ->options([
                        'credit' => 'Credit Check',
                        'criminal' => 'Criminal Background',
                        'eviction' => 'Eviction History',
                        'employment' => 'Employment Verification',
                        'reference' => 'Reference Check',
                        'identity' => 'Identity Verification',
                        'comprehensive' => 'Comprehensive Check',
                    ]),
                
                SelectFilter::make('result')
                    ->options([
                        'pass' => 'Pass',
                        'fail' => 'Fail',
                        'conditional' => 'Conditional',
                        'review_required' => 'Review Required',
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
