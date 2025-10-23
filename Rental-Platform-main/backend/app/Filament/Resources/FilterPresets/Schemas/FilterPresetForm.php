<?php

namespace App\Filament\Resources\FilterPresets\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class FilterPresetForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Section::make('Preset Details')
                    ->schema([
                        Select::make('user_id')
                            ->label('User')
                            ->relationship('user', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        
                        TextInput::make('name')
                            ->label('Preset Name')
                            ->required()
                            ->maxLength(255)
                            ->helperText('Give this filter preset a memorable name'),
                        
                        Toggle::make('is_active')
                            ->label('Active')
                            ->default(true),
                        
                        Toggle::make('notification_enabled')
                            ->label('Enable Notifications')
                            ->default(false)
                            ->helperText('Notify when new properties match this filter'),
                        
                        Toggle::make('is_favorite')
                            ->label('Favorite')
                            ->default(false),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Filter Configuration')
                    ->schema([
                        KeyValue::make('filters')
                            ->label('Filter Settings')
                            ->required()
                            ->columnSpanFull()
                            ->helperText('Complete FilterState object: location, price_min, price_max, bedrooms, bathrooms, property_type, amenities, etc.'),
                    ])->columnSpanFull(),
                
                Section::make('Statistics')
                    ->schema([
                        TextInput::make('match_count')
                            ->label('Current Matches')
                            ->numeric()
                            ->default(0)
                            ->disabled()
                            ->dehydrated(false),
                        
                        TextInput::make('new_matches_count')
                            ->label('New Matches')
                            ->numeric()
                            ->default(0)
                            ->disabled()
                            ->dehydrated(false),
                        
                        TextInput::make('usage_count')
                            ->label('Times Used')
                            ->numeric()
                            ->default(0)
                            ->disabled()
                            ->dehydrated(false),
                        
                        DateTimePicker::make('last_checked_at')
                            ->label('Last Checked')
                            ->native(false)
                            ->disabled()
                            ->dehydrated(false),
                    ])->columns(2)->columnSpanFull(),
            ]);
    }
}
