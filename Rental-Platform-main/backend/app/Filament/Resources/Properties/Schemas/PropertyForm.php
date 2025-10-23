<?php

namespace App\Filament\Resources\Properties\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\KeyValue;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

class PropertyForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Property Details')
                    ->tabs([
                        // Tab 1: Basic Information
                        Tabs\Tab::make('Basic Info')
                            ->icon('heroicon-o-information-circle')
                            ->schema([
                                Section::make('Property Details')
                                    ->schema([
                                        Select::make('owner_id')
                                            ->relationship('owner', 'name')
                                            ->searchable()
                                            ->preload()
                                            ->required()
                                            ->default(fn() => auth()->id())
                                            ->label('Property Owner'),
                                        
                                        TextInput::make('title')
                                            ->required()
                                            ->maxLength(255)
                                            ->placeholder('Beautiful apartment in city center')
                                            ->columnSpan(2),
                                        
                                        Textarea::make('description')
                                            ->required()
                                            ->rows(5)
                                            ->maxLength(5000)
                                            ->placeholder('Describe your property, its features, and what makes it special...')
                                            ->columnSpanFull(),
                                    ])->columns(2),
                                
                                Section::make('Property Type & Rental')
                                    ->schema([
                                        Select::make('property_type')
                                            ->options([
                                                'apartment' => 'Apartment',
                                                'house' => 'House',
                                                'villa' => 'Villa',
                                                'room' => 'Room',
                                                'studio' => 'Studio',
                                                'condo' => 'Condo',
                                                'other' => 'Other',
                                            ])
                                            ->required()
                                            ->native(false),
                                        
                                        Select::make('rental_type')
                                            ->options([
                                                'short_term' => 'Short Term Only',
                                                'long_term' => 'Long Term Only',
                                                'both' => 'Both Short & Long Term',
                                            ])
                                            ->required()
                                            ->native(false)
                                            ->default('both'),
                                        
                                        Select::make('status')
                                            ->options([
                                                'draft' => 'Draft',
                                                'published' => 'Published',
                                                'unavailable' => 'Unavailable',
                                                'archived' => 'Archived',
                                            ])
                                            ->required()
                                            ->native(false)
                                            ->default('draft'),
                                        
                                        Toggle::make('is_featured')
                                            ->label('Featured Property')
                                            ->helperText('Featured properties appear at the top of search results'),
                                    ])->columns(2),
                            ]),
                        
                        // Tab 2: Location
                        Tabs\Tab::make('Location')
                            ->icon('heroicon-o-map-pin')
                            ->schema([
                                Section::make('Address')
                                    ->schema([
                                        TextInput::make('address')
                                            ->required()
                                            ->maxLength(255)
                                            ->placeholder('123 Main Street')
                                            ->columnSpan(2),
                                        
                                        TextInput::make('city')
                                            ->required()
                                            ->maxLength(100)
                                            ->placeholder('New York'),
                                        
                                        TextInput::make('state')
                                            ->maxLength(100)
                                            ->placeholder('NY'),
                                        
                                        TextInput::make('country')
                                            ->required()
                                            ->maxLength(100)
                                            ->placeholder('United States'),
                                        
                                        TextInput::make('postal_code')
                                            ->required()
                                            ->maxLength(20)
                                            ->placeholder('10001'),
                                    ])->columns(2),
                                
                                Section::make('Coordinates')
                                    ->description('Optional: Add exact coordinates for map display')
                                    ->schema([
                                        TextInput::make('latitude')
                                            ->numeric()
                                            ->step(0.00000001)
                                            ->placeholder('40.7128')
                                            ->helperText('Latitude coordinate'),
                                        
                                        TextInput::make('longitude')
                                            ->numeric()
                                            ->step(0.00000001)
                                            ->placeholder('-74.0060')
                                            ->helperText('Longitude coordinate'),
                                    ])->columns(2),
                            ]),
                        
                        // Tab 3: Details & Capacity
                        Tabs\Tab::make('Details')
                            ->icon('heroicon-o-home')
                            ->schema([
                                Section::make('Property Specifications')
                                    ->schema([
                                        TextInput::make('bedrooms')
                                            ->required()
                                            ->numeric()
                                            ->default(1)
                                            ->minValue(0)
                                            ->maxValue(50)
                                            ->suffix('rooms'),
                                        
                                        TextInput::make('bathrooms')
                                            ->required()
                                            ->numeric()
                                            ->default(1)
                                            ->minValue(0)
                                            ->maxValue(20)
                                            ->step(0.5)
                                            ->suffix('bathrooms'),
                                        
                                        TextInput::make('max_guests')
                                            ->required()
                                            ->numeric()
                                            ->default(2)
                                            ->minValue(1)
                                            ->maxValue(100)
                                            ->suffix('guests'),
                                        
                                        TextInput::make('area_sqm')
                                            ->numeric()
                                            ->minValue(1)
                                            ->suffix('m²')
                                            ->label('Area (Square Meters)'),
                                    ])->columns(2),
                            ]),
                        
                        // Tab 4: Pricing
                        Tabs\Tab::make('Pricing')
                            ->icon('heroicon-o-currency-dollar')
                            ->schema([
                                Section::make('Rental Prices')
                                    ->schema([
                                        TextInput::make('price_per_night')
                                            ->numeric()
                                            ->prefix('$')
                                            ->minValue(0)
                                            ->step(0.01)
                                            ->helperText('Price per night for short-term rentals')
                                            ->required(fn(Get $get) => in_array($get('rental_type'), ['short_term', 'both'])),
                                        
                                        TextInput::make('price_per_month')
                                            ->numeric()
                                            ->prefix('$')
                                            ->minValue(0)
                                            ->step(0.01)
                                            ->helperText('Price per month for long-term rentals')
                                            ->required(fn(Get $get) => in_array($get('rental_type'), ['long_term', 'both'])),
                                    ])->columns(2),
                                
                                Section::make('Additional Fees')
                                    ->schema([
                                        TextInput::make('cleaning_fee')
                                            ->numeric()
                                            ->prefix('$')
                                            ->minValue(0)
                                            ->step(0.01)
                                            ->default(0)
                                            ->helperText('One-time cleaning fee'),
                                        
                                        TextInput::make('security_deposit')
                                            ->numeric()
                                            ->prefix('$')
                                            ->minValue(0)
                                            ->step(0.01)
                                            ->default(0)
                                            ->helperText('Refundable security deposit'),
                                    ])->columns(2),
                            ]),
                        
                        // Tab 5: Availability
                        Tabs\Tab::make('Availability')
                            ->icon('heroicon-o-calendar')
                            ->schema([
                                Section::make('Availability Dates')
                                    ->schema([
                                        DatePicker::make('available_from')
                                            ->native(false)
                                            ->label('Available From'),
                                        
                                        DatePicker::make('available_to')
                                            ->native(false)
                                            ->label('Available Until'),
                                    ])->columns(2),
                                
                                Section::make('Stay Requirements')
                                    ->schema([
                                        TextInput::make('minimum_stay_nights')
                                            ->required()
                                            ->numeric()
                                            ->default(1)
                                            ->minValue(1)
                                            ->suffix('nights')
                                            ->label('Minimum Stay'),
                                        
                                        TextInput::make('maximum_stay_nights')
                                            ->numeric()
                                            ->minValue(1)
                                            ->suffix('nights')
                                            ->label('Maximum Stay')
                                            ->helperText('Leave empty for no maximum'),
                                    ])->columns(2),
                            ]),
                        
                        // Tab 6: Rules & Policies
                        Tabs\Tab::make('Rules & Policies')
                            ->icon('heroicon-o-document-text')
                            ->schema([
                                Section::make('House Rules')
                                    ->schema([
                                        KeyValue::make('house_rules')
                                            ->label('House Rules')
                                            ->keyLabel('Rule Type')
                                            ->valueLabel('Description')
                                            ->addActionLabel('Add Rule')
                                            ->reorderable()
                                            ->columnSpanFull(),
                                    ]),
                                
                                Section::make('Cancellation Policy')
                                    ->schema([
                                        Textarea::make('cancellation_policy')
                                            ->rows(5)
                                            ->maxLength(2000)
                                            ->placeholder('Describe your cancellation policy...')
                                            ->columnSpanFull(),
                                    ]),
                            ]),
                    ])
                    ->columnSpanFull(),
            ]);
    }
}
