<?php

namespace App\Filament\Resources\Bookings\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\Action;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;
use App\Services\InvoiceService;
use App\Notifications\InvoiceIssuedNotification;

class BookingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable()
                    ->searchable(),
                
                TextColumn::make('property.title')
                    ->label('Property')
                    ->searchable()
                    ->sortable()
                    ->limit(30)
                    ->tooltip(function (TextColumn $column): ?string {
                        $state = $column->getState();
                        if (strlen($state) <= 30) {
                            return null;
                        }
                        return $state;
                    }),
                
                TextColumn::make('guest.name')
                    ->label('Guest')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('check_in')
                    ->label('Check-in')
                    ->date('M d, Y')
                    ->sortable(),
                
                TextColumn::make('check_out')
                    ->label('Check-out')
                    ->date('M d, Y')
                    ->sortable(),
                
                TextColumn::make('nights')
                    ->label('Nights')
                    ->suffix(' nights')
                    ->sortable(),
                
                TextColumn::make('guests_count')
                    ->label('Guests')
                    ->suffix(' guests')
                    ->sortable(),
                
                BadgeColumn::make('status')
                    ->label('Status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'confirmed',
                        'danger' => 'cancelled',
                        'secondary' => 'completed',
                        'danger' => 'rejected',
                    ])
                    ->sortable(),
                
                BadgeColumn::make('payment_status')
                    ->label('Payment')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'paid',
                        'info' => 'refunded',
                        'danger' => 'failed',
                    ])
                    ->sortable(),
                
                TextColumn::make('total_price')
                    ->label('Total')
                    ->money('USD')
                    ->sortable(),
                
                TextColumn::make('created_at')
                    ->label('Booked On')
                    ->dateTime('M d, Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'cancelled' => 'Cancelled',
                        'completed' => 'Completed',
                        'rejected' => 'Rejected',
                    ])
                    ->label('Booking Status'),
                
                SelectFilter::make('payment_status')
                    ->options([
                        'pending' => 'Pending',
                        'paid' => 'Paid',
                        'refunded' => 'Refunded',
                        'failed' => 'Failed',
                    ])
                    ->label('Payment Status'),
                
                Filter::make('upcoming')
                    ->query(fn (Builder $query): Builder => $query->where('check_in', '>', now()))
                    ->label('Upcoming'),
                
                Filter::make('past')
                    ->query(fn (Builder $query): Builder => $query->where('check_out', '<', now()))
                    ->label('Past'),
            ])
            ->recordActions([
                EditAction::make(),
                Action::make('confirm')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update([
                        'status' => 'confirmed',
                        'confirmed_at' => now(),
                    ]))
                    ->visible(fn ($record) => $record->status === 'pending'),
                
                Action::make('generate_invoice')
                    ->icon('heroicon-o-document-text')
                    ->color('info')
                    ->requiresConfirmation()
                    ->action(function ($record) {
                        $invoiceService = app(InvoiceService::class);
                        $invoice = $invoiceService->createForBooking($record);
                        $record->guest?->notify(new InvoiceIssuedNotification($invoice));
                    })
                    ->visible(fn ($record) => $record->status === 'confirmed' && !$record->invoice),

                Action::make('resend_invoice')
                    ->icon('heroicon-o-paper-airplane')
                    ->color('info')
                    ->requiresConfirmation()
                    ->action(function ($record) {
                        if ($record->invoice) {
                            $record->guest?->notify(new InvoiceIssuedNotification($record->invoice));
                        }
                    })
                    ->visible(fn ($record) => $record->invoice !== null),

                Action::make('mark_paid')
                    ->icon('heroicon-o-currency-dollar')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(function ($record) {
                        $record->update(['payment_status' => 'paid']);
                        if ($record->invoice) {
                            $record->invoice->update(['status' => 'paid']);
                        }
                    })
                    ->visible(fn ($record) => $record->payment_status !== 'paid'),

                Action::make('cancel')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update([
                        'status' => 'cancelled',
                        'cancelled_at' => now(),
                    ]))
                    ->visible(fn ($record) => in_array($record->status, ['pending', 'confirmed'])),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
