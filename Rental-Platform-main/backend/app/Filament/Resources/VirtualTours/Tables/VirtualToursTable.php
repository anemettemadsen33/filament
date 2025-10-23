<?php

namespace App\Filament\Resources\VirtualTours\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class VirtualToursTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('thumbnail')
                    ->label('Thumbnail')
                    ->square()
                    ->defaultImageUrl(url('/images/default-tour.png'))
                    ->toggleable(),
                
                TextColumn::make('property.title')
                    ->label('Property')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('tour_type')
                    ->label('Type')
                    ->badge()
                    ->sortable()
                    ->color(fn (string $state): string => match ($state) {
                        '360_video' => 'primary',
                        '3d_model' => 'success',
                        'video_walkthrough' => 'info',
                        'image_gallery' => 'warning',
                        'matterport' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        '360_video' => '360° Video',
                        '3d_model' => '3D Model',
                        'video_walkthrough' => 'Video Walkthrough',
                        'image_gallery' => 'Image Gallery',
                        'matterport' => 'Matterport',
                        default => $state,
                    }),
                
                TextColumn::make('duration')
                    ->suffix(' min')
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('views_count')
                    ->label('Views')
                    ->numeric()
                    ->sortable()
                    ->color('info'),
                
                TextColumn::make('avg_watch_time')
                    ->label('Avg Watch')
                    ->suffix(' min')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),
                
                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('tour_type')
                    ->options([
                        '360_video' => '360° Video',
                        '3d_model' => '3D Model',
                        'video_walkthrough' => 'Video Walkthrough',
                        'image_gallery' => 'Image Gallery',
                        'matterport' => 'Matterport Tour',
                    ]),
                
                TernaryFilter::make('is_active')
                    ->label('Active Status'),
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
