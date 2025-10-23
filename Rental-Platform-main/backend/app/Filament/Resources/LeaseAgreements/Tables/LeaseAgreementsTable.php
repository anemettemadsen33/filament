<?php

namespace App\Filament\Resources\LeaseAgreements\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class LeaseAgreementsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('property.title')
                    ->label('Property')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('landlord.name')
                    ->label('Landlord')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('tenant.name')
                    ->label('Tenant')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('start_date')
                    ->date()
                    ->sortable(),
                
                TextColumn::make('end_date')
                    ->date()
                    ->sortable(),
                
                TextColumn::make('rent_amount')
                    ->money('USD')
                    ->sortable(),
                
                TextColumn::make('payment_frequency')
                    ->badge()
                    ->colors([
                        'info' => 'monthly',
                        'warning' => 'quarterly',
                        'success' => 'semi-annually',
                        'primary' => 'annually',
                    ])
                    ->sortable(),
                
                TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'gray' => 'draft',
                        'warning' => 'pending_signatures',
                        'success' => 'active',
                        'danger' => 'expired',
                        'info' => 'terminated',
                        'primary' => 'renewed',
                    ])
                    ->sortable(),
                
                TextColumn::make('signed_by_landlord_at')
                    ->label('Landlord Signed')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('signed_by_tenant_at')
                    ->label('Tenant Signed')
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
                        'draft' => 'Draft',
                        'pending_signatures' => 'Pending Signatures',
                        'active' => 'Active',
                        'expired' => 'Expired',
                        'terminated' => 'Terminated',
                        'renewed' => 'Renewed',
                    ]),
                
                SelectFilter::make('payment_frequency')
                    ->options([
                        'monthly' => 'Monthly',
                        'quarterly' => 'Quarterly',
                        'semi-annually' => 'Semi-Annually',
                        'annually' => 'Annually',
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
