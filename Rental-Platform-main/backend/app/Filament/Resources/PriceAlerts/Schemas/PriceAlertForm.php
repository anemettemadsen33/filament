<?php

namespace App\Filament\Resources\PriceAlerts\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PriceAlertForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Section::make('Alert Configuration')
                    ->schema([
                        Select::make('user_id')
                            ->label('User')
                            ->relationship('user', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        
                        Select::make('property_id')
                            ->label('Property')
                            ->relationship('property', 'title')
                            ->required()
                            ->searchable()
                            ->preload(),
                        
                        TextInput::make('target_price')
                            ->label('Target Price')
                            ->required()
                            ->numeric()
                            ->prefix('$')
                            ->minValue(0),
                        
                        Select::make('price_type')
                            ->label('Price Type')
                            ->options([
                                'per_night' => 'Per Night',
                                'per_month' => 'Per Month',
                                'cleaning_fee' => 'Cleaning Fee',
                                'security_deposit' => 'Security Deposit',
                            ])
                            ->required()
                            ->native(false),
                        
                        Select::make('alert_type')
                            ->label('Alert Type')
                            ->options([
                                'price_drop' => 'Price Drop (below target)',
                                'price_match' => 'Price Match (equals target)',
                                'price_below' => 'Price Below (any drop)',
                            ])
                            ->required()
                            ->default('price_drop')
                            ->native(false)
                            ->helperText('When to trigger the alert'),
                        
                        Toggle::make('is_active')
                            ->label('Active')
                            ->default(true),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Alert Status')
                    ->schema([
                        DateTimePicker::make('triggered_at')
                            ->label('Triggered At')
                            ->native(false)
                            ->disabled()
                            ->dehydrated(false),
                        
                        DateTimePicker::make('notified_at')
                            ->label('Notified At')
                            ->native(false)
                            ->disabled()
                            ->dehydrated(false),
                    ])->columns(2)->columnSpanFull(),
            ]);
    }
}
