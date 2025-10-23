<?php

namespace App\Filament\Resources\Vouchers\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class VouchersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('code')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->weight('bold'),
                
                TextColumn::make('type')
                    ->label('Type')
                    ->badge()
                    ->sortable()
                    ->color(fn (string $state): string => match ($state) {
                        'percentage' => 'success',
                        'fixed_amount' => 'info',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => str_replace('_', ' ', ucwords($state, '_'))),
                
                TextColumn::make('value')
                    ->label('Discount')
                    ->formatStateUsing(fn ($state, $record) => 
                        $record->type === 'percentage' 
                            ? $state . '%' 
                            : '$' . number_format($state, 2)
                    )
                    ->sortable(),
                
                TextColumn::make('usage_stats')
                    ->label('Usage')
                    ->formatStateUsing(fn ($record) => 
                        $record->current_uses . ' / ' . ($record->max_uses ?? '∞')
                    )
                    ->color(fn ($record) => 
                        $record->max_uses && $record->current_uses >= $record->max_uses 
                            ? 'danger' 
                            : 'success'
                    ),
                
                TextColumn::make('min_booking_value')
                    ->label('Min Amount')
                    ->money('USD')
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('valid_from')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('valid_until')
                    ->dateTime()
                    ->sortable()
                    ->color(fn ($state) => now()->greaterThan($state) ? 'danger' : 'success'),
                
                IconColumn::make('active')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),
                
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('type')
                    ->options([
                        'percentage' => 'Percentage',
                        'fixed_amount' => 'Fixed Amount',
                    ]),
                
                TernaryFilter::make('active')
                    ->label('Active Status'),
                
                Filter::make('valid_now')
                    ->label('Currently Valid')
                    ->query(fn (Builder $query): Builder => 
                        $query->where('valid_from', '<=', now())
                            ->where('valid_until', '>=', now())
                    ),
                
                Filter::make('expired')
                    ->label('Expired')
                    ->query(fn (Builder $query): Builder => 
                        $query->where('valid_until', '<', now())
                    ),
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
