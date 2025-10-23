<?php

namespace App\Filament\Resources\Notifications\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class NotificationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('type')
                    ->badge()
                    ->sortable()
                    ->color(fn (string $state): string => match ($state) {
                        'booking_confirmed' => 'success',
                        'booking_cancelled' => 'danger',
                        'message_received' => 'info',
                        'price_alert' => 'warning',
                        'maintenance_update' => 'primary',
                        'payment_received' => 'success',
                        'payment_due' => 'warning',
                        'review_received' => 'info',
                        'property_approved' => 'success',
                        'property_rejected' => 'danger',
                        'tour_scheduled' => 'primary',
                        'tour_reminder' => 'warning',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => str_replace('_', ' ', ucwords($state, '_'))),
                
                TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->limit(50),
                
                IconColumn::make('read_at')
                    ->label('Read')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('warning')
                    ->sortable(),
                
                TextColumn::make('sent_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
                
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('type')
                    ->options([
                        'booking_confirmed' => 'Booking Confirmed',
                        'booking_cancelled' => 'Booking Cancelled',
                        'message_received' => 'Message Received',
                        'price_alert' => 'Price Alert',
                        'maintenance_update' => 'Maintenance Update',
                        'payment_received' => 'Payment Received',
                        'payment_due' => 'Payment Due',
                        'review_received' => 'Review Received',
                        'property_approved' => 'Property Approved',
                        'property_rejected' => 'Property Rejected',
                        'tour_scheduled' => 'Tour Scheduled',
                        'tour_reminder' => 'Tour Reminder',
                    ]),
                
                TernaryFilter::make('read_at')
                    ->label('Read Status')
                    ->nullable()
                    ->trueLabel('Read')
                    ->falseLabel('Unread')
                    ->queries(
                        true: fn ($query) => $query->whereNotNull('read_at'),
                        false: fn ($query) => $query->whereNull('read_at'),
                        blank: fn ($query) => $query,
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
