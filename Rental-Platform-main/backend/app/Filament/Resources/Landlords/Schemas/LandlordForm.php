<?php

namespace App\Filament\Resources\Landlords\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class LandlordForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Section::make('User Information')
                    ->schema([
                        Select::make('user_id')
                            ->label('User')
                            ->relationship('user', 'name')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->searchable()
                            ->preload()
                            ->helperText('Select the user account for this landlord'),
                    ])->columnSpanFull(),
                
                Section::make('Verification & Status')
                    ->schema([
                        Toggle::make('is_verified')
                            ->label('Verified Landlord')
                            ->default(false)
                            ->helperText('Verified landlords have completed identity verification'),
                        
                        DateTimePicker::make('verified_at')
                            ->label('Verified Date')
                            ->native(false)
                            ->disabled()
                            ->dehydrated(false),
                        
                        TextInput::make('verification_documents')
                            ->label('Verification Documents')
                            ->maxLength(500)
                            ->helperText('Links or references to verification documents')
                            ->columnSpanFull(),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Business Information')
                    ->schema([
                        TextInput::make('company_name')
                            ->label('Company Name')
                            ->maxLength(255),
                        
                        TextInput::make('license_number')
                            ->label('License Number')
                            ->maxLength(100)
                            ->helperText('Real estate or business license number'),
                        
                        TextInput::make('tax_id')
                            ->label('Tax ID')
                            ->maxLength(50),
                        
                        FileUpload::make('business_logo')
                            ->label('Business Logo')
                            ->image()
                            ->directory('landlord-logos')
                            ->visibility('public')
                            ->maxSize(2048),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Rating & Performance')
                    ->schema([
                        TextInput::make('rating')
                            ->label('Average Rating')
                            ->numeric()
                            ->default(0)
                            ->minValue(0)
                            ->maxValue(5)
                            ->step(0.1)
                            ->suffix('/ 5')
                            ->disabled()
                            ->dehydrated(false),
                        
                        TextInput::make('total_properties')
                            ->label('Total Properties')
                            ->numeric()
                            ->default(0)
                            ->disabled()
                            ->dehydrated(false),
                        
                        TextInput::make('response_time_hours')
                            ->label('Avg Response Time')
                            ->numeric()
                            ->default(0)
                            ->suffix('hours')
                            ->disabled()
                            ->dehydrated(false),
                    ])->columns(3)->columnSpanFull(),
                
                Section::make('Additional Information')
                    ->schema([
                        Textarea::make('bio')
                            ->label('Biography')
                            ->rows(4)
                            ->maxLength(1000)
                            ->columnSpanFull(),
                        
                        Textarea::make('languages')
                            ->label('Languages Spoken')
                            ->rows(2)
                            ->maxLength(255)
                            ->helperText('e.g., English, Spanish, French')
                            ->columnSpanFull(),
                    ])->columnSpanFull(),
            ]);
    }
}
