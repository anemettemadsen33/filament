<?php

namespace App\Filament\Resources\Insurances\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class InsurancesTable
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
                
                TextColumn::make('policy_type')
                    ->label('Type')
                    ->badge()
                    ->colors([
                        'primary' => 'renters',
                        'success' => 'landlord',
                        'warning' => 'liability',
                        'info' => 'property',
                        'danger' => 'flood',
                        'gray' => 'earthquake',
                    ])
                    ->sortable(),
                
                TextColumn::make('policy_number')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('provider')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('coverage_amount')
                    ->label('Coverage')
                    ->money('USD')
                    ->sortable(),
                
                TextColumn::make('premium_amount')
                    ->label('Premium')
                    ->money('USD')
                    ->sortable(),
                
                TextColumn::make('premium_frequency')
                    ->badge()
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'active',
                        'danger' => 'expired',
                        'gray' => 'cancelled',
                        'info' => 'lapsed',
                    ])
                    ->sortable(),
                
                IconColumn::make('auto_renew')
                    ->boolean()
                    ->toggleable(),
                
                TextColumn::make('start_date')
                    ->date()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('end_date')
                    ->date()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('next_payment_date')
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
                        'active' => 'Active',
                        'expired' => 'Expired',
                        'cancelled' => 'Cancelled',
                        'lapsed' => 'Lapsed',
                    ]),
                
                SelectFilter::make('policy_type')
                    ->label('Type')
                    ->options([
                        'renters' => 'Renters Insurance',
                        'landlord' => 'Landlord Insurance',
                        'liability' => 'Liability Insurance',
                        'property' => 'Property Insurance',
                        'flood' => 'Flood Insurance',
                        'earthquake' => 'Earthquake Insurance',
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
