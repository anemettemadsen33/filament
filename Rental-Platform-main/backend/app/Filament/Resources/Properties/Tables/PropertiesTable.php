<?php

namespace App\Filament\Resources\Properties\Tables;

use App\Exports\PropertiesExport;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\Action;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Artisan;
use Maatwebsite\Excel\Facades\Excel;

class PropertiesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->label('Property Title')
                    ->searchable()
                    ->sortable()
                    ->limit(40),
                
                TextColumn::make('city')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('country')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),
                
                BadgeColumn::make('property_type')
                    ->label('Type')
                    ->formatStateUsing(fn (string $state): string => ucfirst(str_replace('_', ' ', $state)))
                    ->sortable(),
                
                TextColumn::make('bedrooms')
                    ->numeric()
                    ->sortable(),
                
                TextColumn::make('price_per_night')
                    ->money('USD')
                    ->sortable(),
                
                BadgeColumn::make('status')
                    ->colors([
                        'secondary' => 'draft',
                        'success' => 'published',
                        'warning' => 'unavailable',
                        'danger' => 'archived',
                    ])
                    ->sortable(),
                
                IconColumn::make('is_featured')
                    ->boolean()
                    ->sortable(),
            ])
            ->filters([
                TrashedFilter::make(),
                SelectFilter::make('status'),
                SelectFilter::make('property_type'),
            ])
            ->recordActions([
                EditAction::make(),
                Action::make('reindex')
                    ->label('Reindex Search')
                    ->icon('heroicon-o-arrow-path')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->searchable())
                    ->visible(fn ($record) => method_exists($record,'searchable')),
            ])
            ->headerActions([
                \Filament\Tables\Actions\Action::make('export')
                    ->label('Export to Excel')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->action(fn () => Excel::download(new PropertiesExport, 'properties-' . now()->format('Y-m-d') . '.xlsx'))
                    ->color('success'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                    Action::make('sync_index_settings')
                        ->label('Sync Index Settings')
                        ->icon('heroicon-o-wrench-screwdriver')
                        ->requiresConfirmation()
                        ->action(fn () => Artisan::call('scout:sync-index-settings')),
                    Action::make('reimport_all')
                        ->label('Re-import All Properties')
                        ->icon('heroicon-o-cloud-arrow-up')
                        ->requiresConfirmation()
                        ->action(fn () => Artisan::call('scout:import', ['model' => \App\Models\Property::class])),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
