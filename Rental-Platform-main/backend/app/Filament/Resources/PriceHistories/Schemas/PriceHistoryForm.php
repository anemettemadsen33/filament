<?php

namespace App\Filament\Resources\PriceHistories\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PriceHistoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Section::make('Price Change Information')
                    ->schema([
                        Select::make('property_id')
                            ->label('Property')
                            ->relationship('property', 'title')
                            ->required()
                            ->searchable()
                            ->preload(),
                        
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
                        
                        TextInput::make('old_price')
                            ->label('Old Price')
                            ->required()
                            ->numeric()
                            ->prefix('$')
                            ->minValue(0),
                        
                        TextInput::make('new_price')
                            ->label('New Price')
                            ->required()
                            ->numeric()
                            ->prefix('$')
                            ->minValue(0),
                        
                        TextInput::make('price_change_percentage')
                            ->label('Price Change %')
                            ->numeric()
                            ->suffix('%')
                            ->disabled()
                            ->dehydrated(false)
                            ->helperText('Auto-calculated'),
                        
                        DateTimePicker::make('effective_date')
                            ->label('Effective Date')
                            ->required()
                            ->default(now())
                            ->native(false),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Change Details')
                    ->schema([
                        Select::make('changed_by_id')
                            ->label('Changed By')
                            ->relationship('changedBy', 'name')
                            ->searchable()
                            ->preload(),
                        
                        Textarea::make('reason')
                            ->label('Reason for Change')
                            ->rows(3)
                            ->maxLength(500)
                            ->columnSpanFull(),
                    ])->columnSpanFull(),
            ]);
    }
}
