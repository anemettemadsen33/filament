<?php

namespace App\Filament\Resources\Amenities\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class AmenityForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Section::make('Amenity Details')
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('e.g., WiFi, Air Conditioning, Pool')
                            ->label('Amenity Name'),
                        
                        Select::make('category')
                            ->options([
                                'basic' => 'Basic',
                                'comfort' => 'Comfort',
                                'safety' => 'Safety',
                                'facilities' => 'Facilities',
                            ])
                            ->required()
                            ->native(false)
                            ->default('basic')
                            ->label('Category'),
                        
                        TextInput::make('icon')
                            ->maxLength(100)
                            ->placeholder('heroicon-o-wifi')
                            ->label('Icon Class')
                            ->helperText('Heroicon name (optional)'),
                        
                        TextInput::make('sort_order')
                            ->numeric()
                            ->default(0)
                            ->minValue(0)
                            ->label('Sort Order')
                            ->helperText('Lower numbers appear first'),
                        
                        Toggle::make('is_active')
                            ->label('Active')
                            ->default(true)
                            ->helperText('Inactive amenities are hidden'),
                    ])->columnSpan(1),
                
                Section::make('Description')
                    ->schema([
                        Textarea::make('description')
                            ->rows(4)
                            ->maxLength(500)
                            ->placeholder('Optional description of this amenity...')
                            ->label('Description')
                            ->columnSpanFull(),
                    ])->columnSpan(1),
            ]);
    }
}
