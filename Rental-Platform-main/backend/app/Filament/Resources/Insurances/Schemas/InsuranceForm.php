<?php

namespace App\Filament\Resources\Insurances\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class InsuranceForm
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
                            ->searchable()
                            ->preload(),
                        
                        Select::make('user_id')
                            ->label('User')
                            ->relationship('user', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        
                        Select::make('policy_type')
                            ->label('Policy Type')
                            ->options([
                                'renters' => 'Renters Insurance',
                                'landlord' => 'Landlord Insurance',
                                'liability' => 'Liability Insurance',
                                'property' => 'Property Insurance',
                                'flood' => 'Flood Insurance',
                                'earthquake' => 'Earthquake Insurance',
                            ])
                            ->required()
                            ->native(false),
                        
                        Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'active' => 'Active',
                                'expired' => 'Expired',
                                'cancelled' => 'Cancelled',
                                'lapsed' => 'Lapsed',
                            ])
                            ->required()
                            ->default('pending')
                            ->native(false),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Provider Information')
                    ->schema([
                        TextInput::make('provider')
                            ->label('Provider')
                            ->required()
                            ->maxLength(255),
                        
                        TextInput::make('policy_number')
                            ->label('Policy Number')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        
                        TextInput::make('document_url')
                            ->label('Document URL')
                            ->url()
                            ->maxLength(500)
                            ->columnSpanFull(),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Coverage Details')
                    ->schema([
                        TextInput::make('coverage_amount')
                            ->label('Coverage Amount')
                            ->required()
                            ->numeric()
                            ->prefix('$')
                            ->minValue(0),
                        
                        TextInput::make('deductible')
                            ->label('Deductible')
                            ->required()
                            ->numeric()
                            ->prefix('$')
                            ->minValue(0),
                        
                        TextInput::make('premium_amount')
                            ->label('Premium Amount')
                            ->required()
                            ->numeric()
                            ->prefix('$')
                            ->minValue(0),
                        
                        Select::make('premium_frequency')
                            ->label('Premium Frequency')
                            ->options([
                                'monthly' => 'Monthly',
                                'quarterly' => 'Quarterly',
                                'semi-annually' => 'Semi-Annually',
                                'annually' => 'Annually',
                            ])
                            ->required()
                            ->default('monthly')
                            ->native(false),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Policy Period')
                    ->schema([
                        DatePicker::make('start_date')
                            ->label('Start Date')
                            ->required()
                            ->native(false),
                        
                        DatePicker::make('end_date')
                            ->label('End Date')
                            ->required()
                            ->native(false)
                            ->after('start_date'),
                        
                        DateTimePicker::make('last_payment_date')
                            ->label('Last Payment Date')
                            ->native(false),
                        
                        DateTimePicker::make('next_payment_date')
                            ->label('Next Payment Date')
                            ->native(false),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Covered Items')
                    ->schema([
                        Repeater::make('covered_items')
                            ->label('Covered Items')
                            ->schema([
                                TextInput::make('item')
                                    ->label('Item')
                                    ->required(),
                                TextInput::make('value')
                                    ->label('Value')
                                    ->numeric()
                                    ->prefix('$')
                                    ->required(),
                            ])
                            ->columns(2)
                            ->columnSpanFull(),
                    ])->columnSpanFull(),
                
                Section::make('Auto Renewal')
                    ->schema([
                        Toggle::make('auto_renew')
                            ->label('Auto Renew')
                            ->default(false),
                    ])->columnSpanFull(),
            ]);
    }
}
