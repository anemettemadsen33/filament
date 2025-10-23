<?php

namespace App\Filament\Resources\Bookings\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Placeholder;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Carbon\Carbon;

class BookingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Section::make('Booking Information')
                    ->description('Core booking details')
                    ->schema([
                        Select::make('property_id')
                            ->relationship('property', 'title')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->reactive()
                            ->label('Property'),
                        
                        Select::make('guest_id')
                            ->relationship('guest', 'name')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->label('Guest'),
                        
                        DatePicker::make('check_in')
                            ->required()
                            ->native(false)
                            ->reactive()
                            ->afterStateUpdated(function ($state, callable $set, Get $get) {
                                $checkOut = $get('check_out');
                                if ($state && $checkOut) {
                                    $nights = Carbon::parse($state)->diffInDays(Carbon::parse($checkOut));
                                    $set('nights', max(1, $nights));
                                }
                            })
                            ->label('Check-in Date'),
                        
                        DatePicker::make('check_out')
                            ->required()
                            ->native(false)
                            ->reactive()
                            ->afterStateUpdated(function ($state, callable $set, Get $get) {
                                $checkIn = $get('check_in');
                                if ($state && $checkIn) {
                                    $nights = Carbon::parse($checkIn)->diffInDays(Carbon::parse($state));
                                    $set('nights', max(1, $nights));
                                }
                            })
                            ->label('Check-out Date'),
                        
                        TextInput::make('guests_count')
                            ->required()
                            ->numeric()
                            ->default(1)
                            ->minValue(1)
                            ->label('Number of Guests'),
                        
                        TextInput::make('nights')
                            ->required()
                            ->numeric()
                            ->default(1)
                            ->readOnly()
                            ->label('Number of Nights'),
                    ])->columns(2)->columnSpan(2),
                
                Section::make('Pricing Details')
                    ->description('Breakdown of costs')
                    ->schema([
                        TextInput::make('price_per_night')
                            ->required()
                            ->numeric()
                            ->prefix('$')
                            ->step(0.01)
                            ->label('Price/Night'),
                        
                        TextInput::make('subtotal')
                            ->required()
                            ->numeric()
                            ->prefix('$')
                            ->step(0.01)
                            ->label('Subtotal'),
                        
                        TextInput::make('cleaning_fee')
                            ->numeric()
                            ->prefix('$')
                            ->step(0.01)
                            ->default(0)
                            ->label('Cleaning Fee'),
                        
                        TextInput::make('service_fee')
                            ->numeric()
                            ->prefix('$')
                            ->step(0.01)
                            ->default(0)
                            ->label('Service Fee'),
                        
                        TextInput::make('total_price')
                            ->required()
                            ->numeric()
                            ->prefix('$')
                            ->step(0.01)
                            ->label('Total Price'),
                    ])->columnSpan(1),
                
                Section::make('Status & Additional Information')
                    ->schema([
                        Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'confirmed' => 'Confirmed',
                                'cancelled' => 'Cancelled',
                                'completed' => 'Completed',
                                'rejected' => 'Rejected',
                            ])
                            ->required()
                            ->native(false)
                            ->default('pending')
                            ->label('Booking Status'),
                        
                        Select::make('payment_status')
                            ->options([
                                'pending' => 'Pending',
                                'paid' => 'Paid',
                                'refunded' => 'Refunded',
                                'failed' => 'Failed',
                            ])
                            ->required()
                            ->native(false)
                            ->default('pending')
                            ->label('Payment Status'),
                        
                        Textarea::make('special_requests')
                            ->rows(3)
                            ->maxLength(1000)
                            ->placeholder('Any special requests from the guest...')
                            ->columnSpanFull()
                            ->label('Special Requests'),
                        
                        Textarea::make('cancellation_reason')
                            ->rows(3)
                            ->maxLength(1000)
                            ->placeholder('Reason for cancellation...')
                            ->visible(fn (Get $get) => $get('status') === 'cancelled')
                            ->columnSpanFull()
                            ->label('Cancellation Reason'),
                    ])->columns(2)->columnSpan(3),
            ]);
    }
}
