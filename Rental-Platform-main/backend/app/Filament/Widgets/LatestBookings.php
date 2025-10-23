<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestBookings extends BaseWidget
{
    protected static ?int $sort = 6;
    protected int | string | array $columnSpan = 'md:col-span-8';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Booking::query()
                    ->latest()
                    ->limit(10)
            )
            ->columns([
                Tables\Columns\TextColumn::make('property.title')
                    ->label('Property')
                    ->searchable()
                    ->limit(30),
                
                Tables\Columns\TextColumn::make('guest.name')
                    ->label('Guest')
                    ->searchable(),
                
                Tables\Columns\TextColumn::make('check_in')
                    ->date()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('check_out')
                    ->date()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('total_price')
                    ->money('USD')
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'confirmed' => 'success',
                        'cancelled' => 'danger',
                        'completed' => 'info',
                        default => 'gray',
                    }),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Booked')
                    ->dateTime()
                    ->sortable()
                    ->since(),
            ]);
    }
}
