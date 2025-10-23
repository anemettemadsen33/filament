<?php

namespace App\Filament\Resources\CheckIns\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CheckInForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Section::make('Basic Information')
                    ->schema([
                        Select::make('property_id')
                            ->label('Property')
                            ->relationship('property', 'title')
                            ->required()
                            ->searchable()
                            ->preload(),
                        
                        Select::make('booking_id')
                            ->label('Booking')
                            ->relationship('booking', 'id')
                            ->searchable()
                            ->preload(),
                        
                        Select::make('access_method')
                            ->label('Access Method')
                            ->options([
                                'lockbox' => 'Lockbox',
                                'smart_lock' => 'Smart Lock',
                                'key_exchange' => 'Key Exchange',
                                'door_code' => 'Door Code',
                                'concierge' => 'Concierge',
                            ])
                            ->required()
                            ->default('lockbox')
                            ->native(false),
                        
                        TextInput::make('access_code')
                            ->label('Access Code')
                            ->maxLength(50)
                            ->helperText('Code for lockbox or smart lock'),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Access Details')
                    ->schema([
                        TextInput::make('lockbox_location')
                            ->label('Lockbox Location')
                            ->maxLength(255)
                            ->columnSpanFull(),
                        
                        Textarea::make('check_in_instructions')
                            ->label('Check-in Instructions')
                            ->rows(4)
                            ->columnSpanFull(),
                        
                        DateTimePicker::make('valid_from')
                            ->label('Valid From')
                            ->required()
                            ->native(false),
                        
                        DateTimePicker::make('valid_until')
                            ->label('Valid Until')
                            ->required()
                            ->native(false)
                            ->after('valid_from'),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Property Amenities')
                    ->schema([
                        TextInput::make('wifi_name')
                            ->label('WiFi Network Name')
                            ->maxLength(255),
                        
                        TextInput::make('wifi_password')
                            ->label('WiFi Password')
                            ->password()
                            ->revealable()
                            ->maxLength(255),
                        
                        Textarea::make('parking_details')
                            ->label('Parking Details')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Emergency Contact')
                    ->schema([
                        TextInput::make('emergency_contact_name')
                            ->label('Contact Name')
                            ->maxLength(255),
                        
                        TextInput::make('emergency_contact_phone')
                            ->label('Contact Phone')
                            ->tel()
                            ->maxLength(20),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Additional Information')
                    ->schema([
                        KeyValue::make('additional_info')
                            ->label('Additional Info')
                            ->columnSpanFull(),
                    ])->columnSpanFull(),
            ]);
    }
}
