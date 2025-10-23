<?php

namespace App\Filament\Resources\PropertyAnalytics\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PropertyAnalyticForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Property & Date')
                    ->schema([
                        Select::make('property_id')
                            ->relationship('property', 'title')
                            ->required()
                            ->searchable()
                            ->preload()
                            ->helperText('Select the property to track analytics'),
                        
                        DatePicker::make('date')
                            ->required()
                            ->native(false)
                            ->displayFormat('Y-m-d')
                            ->helperText('Date for this analytics record')
                            ->default(now()),
                    ])
                    ->columns(2),
                
                Section::make('Traffic Metrics')
                    ->schema([
                        TextInput::make('views')
                            ->numeric()
                            ->default(0)
                            ->minValue(0)
                            ->helperText('Total property views'),
                        
                        TextInput::make('unique_visitors')
                            ->numeric()
                            ->default(0)
                            ->minValue(0)
                            ->helperText('Unique visitors'),
                        
                        TextInput::make('inquiries')
                            ->numeric()
                            ->default(0)
                            ->minValue(0)
                            ->helperText('Number of inquiries received'),
                    ])
                    ->columns(3),
                
                Section::make('Booking Metrics')
                    ->schema([
                        TextInput::make('bookings')
                            ->numeric()
                            ->default(0)
                            ->minValue(0)
                            ->helperText('Number of bookings'),
                        
                        TextInput::make('revenue')
                            ->numeric()
                            ->prefix('$')
                            ->default(0)
                            ->minValue(0)
                            ->step(0.01)
                            ->helperText('Revenue generated'),
                        
                        TextInput::make('conversion_rate')
                            ->numeric()
                            ->suffix('%')
                            ->default(0)
                            ->minValue(0)
                            ->maxValue(100)
                            ->step(0.01)
                            ->helperText('Conversion rate (bookings/views)'),
                    ])
                    ->columns(3),
                
                Section::make('Performance Metrics')
                    ->schema([
                        TextInput::make('avg_stay_duration')
                            ->numeric()
                            ->suffix('days')
                            ->default(0)
                            ->minValue(0)
                            ->step(0.1)
                            ->helperText('Average stay duration'),
                        
                        TextInput::make('occupancy_rate')
                            ->numeric()
                            ->suffix('%')
                            ->default(0)
                            ->minValue(0)
                            ->maxValue(100)
                            ->step(0.01)
                            ->helperText('Occupancy rate for the date'),
                        
                        TextInput::make('avg_daily_rate')
                            ->numeric()
                            ->prefix('$')
                            ->default(0)
                            ->minValue(0)
                            ->step(0.01)
                            ->helperText('Average daily rate'),
                    ])
                    ->columns(3),
            ]);
    }
}
