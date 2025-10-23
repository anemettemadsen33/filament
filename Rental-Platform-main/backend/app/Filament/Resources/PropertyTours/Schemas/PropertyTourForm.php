<?php

namespace App\Filament\Resources\PropertyTours\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PropertyTourForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Section::make('Tour Details')
                    ->schema([
                        Select::make('property_id')
                            ->label('Property')
                            ->relationship('property', 'title')
                            ->required()
                            ->searchable()
                            ->preload(),
                        
                        Select::make('user_id')
                            ->label('User (Visitor)')
                            ->relationship('user', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        
                        Select::make('landlord_id')
                            ->label('Landlord')
                            ->relationship('landlord', 'name')
                            ->searchable()
                            ->preload(),
                        
                        Select::make('tour_type')
                            ->label('Tour Type')
                            ->options([
                                'in-person' => 'In Person',
                                'virtual' => 'Virtual',
                                'self-guided' => 'Self Guided',
                            ])
                            ->required()
                            ->default('in-person')
                            ->native(false),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Schedule')
                    ->schema([
                        DateTimePicker::make('scheduled_at')
                            ->label('Scheduled Date & Time')
                            ->required()
                            ->native(false),
                        
                        TextInput::make('duration')
                            ->label('Duration (minutes)')
                            ->numeric()
                            ->default(30)
                            ->minValue(15)
                            ->maxValue(180)
                            ->suffix('min'),
                        
                        Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'confirmed' => 'Confirmed',
                                'completed' => 'Completed',
                                'cancelled' => 'Cancelled',
                                'rescheduled' => 'Rescheduled',
                                'no_show' => 'No Show',
                            ])
                            ->required()
                            ->default('pending')
                            ->native(false),
                        
                        TextInput::make('confirmation_code')
                            ->label('Confirmation Code')
                            ->maxLength(8)
                            ->disabled()
                            ->dehydrated(false)
                            ->helperText('Auto-generated when confirmed'),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Additional Information')
                    ->schema([
                        TextInput::make('meeting_url')
                            ->label('Meeting URL (for virtual tours)')
                            ->url()
                            ->maxLength(500)
                            ->columnSpanFull(),
                        
                        Textarea::make('user_notes')
                            ->label('User Notes')
                            ->rows(3)
                            ->maxLength(1000)
                            ->columnSpanFull(),
                        
                        Textarea::make('landlord_notes')
                            ->label('Landlord Notes')
                            ->rows(3)
                            ->maxLength(1000)
                            ->columnSpanFull(),
                    ])->columnSpanFull(),
            ]);
    }
}
