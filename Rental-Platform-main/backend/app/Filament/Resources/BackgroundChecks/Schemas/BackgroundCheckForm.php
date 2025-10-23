<?php

namespace App\Filament\Resources\BackgroundChecks\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class BackgroundCheckForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Section::make('Basic Information')
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
                            ->searchable()
                            ->preload(),
                        
                        Select::make('check_type')
                            ->label('Check Type')
                            ->options([
                                'credit' => 'Credit Check',
                                'criminal' => 'Criminal Background',
                                'eviction' => 'Eviction History',
                                'employment' => 'Employment Verification',
                                'reference' => 'Reference Check',
                                'identity' => 'Identity Verification',
                                'comprehensive' => 'Comprehensive Check'
                            ])
                            ->required()
                            ->default('comprehensive')
                            ->native(false),
                        
                        Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'in_progress' => 'In Progress',
                                'completed' => 'Completed',
                                'failed' => 'Failed',
                                'expired' => 'Expired'
                            ])
                            ->required()
                            ->default('pending')
                            ->native(false),
                    ])->columnSpan(1),
                
                Section::make('Provider Information')
                    ->schema([
                        TextInput::make('provider')
                            ->label('Provider')
                            ->maxLength(255),
                        
                        TextInput::make('provider_reference_id')
                            ->label('Provider Reference ID')
                            ->maxLength(255),
                        
                        TextInput::make('fee')
                            ->label('Fee')
                            ->numeric()
                            ->prefix('$')
                            ->default(0)
                            ->minValue(0),
                    ])->columnSpan(1),
                
                Section::make('Dates')
                    ->schema([
                        DateTimePicker::make('request_date')
                            ->label('Request Date')
                            ->default(now())
                            ->native(false),
                        
                        DateTimePicker::make('completed_date')
                            ->label('Completed Date')
                            ->native(false),
                        
                        DateTimePicker::make('expires_at')
                            ->label('Expires At')
                            ->native(false)
                            ->helperText('Background checks typically expire after 90 days'),
                    ])->columns(3)->columnSpanFull(),
                
                Section::make('Results')
                    ->schema([
                        Select::make('result')
                            ->options([
                                'pass' => 'Pass',
                                'fail' => 'Fail',
                                'conditional' => 'Conditional',
                                'review_required' => 'Review Required'
                            ])
                            ->native(false),
                        
                        TextInput::make('credit_score')
                            ->label('Credit Score')
                            ->numeric()
                            ->minValue(300)
                            ->maxValue(850)
                            ->helperText('Score range: 300-850'),
                        
                        Textarea::make('summary')
                            ->label('Summary')
                            ->rows(4)
                            ->columnSpanFull(),
                        
                        TextInput::make('report_url')
                            ->label('Report URL')
                            ->url()
                            ->maxLength(500)
                            ->columnSpanFull(),
                        
                        KeyValue::make('details')
                            ->label('Additional Details')
                            ->columnSpanFull(),
                    ])->columnSpanFull(),
                
                Section::make('Consent')
                    ->schema([
                        Toggle::make('consent_given')
                            ->label('Consent Given')
                            ->default(false),
                        
                        DateTimePicker::make('consent_given_at')
                            ->label('Consent Given At')
                            ->native(false),
                    ])->columns(2)->columnSpanFull(),
            ]);
    }
}
