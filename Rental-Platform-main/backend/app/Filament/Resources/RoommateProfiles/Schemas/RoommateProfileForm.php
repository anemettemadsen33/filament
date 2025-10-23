<?php

namespace App\Filament\Resources\RoommateProfiles\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class RoommateProfileForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Section::make('Personal Information')
                    ->schema([
                        Select::make('user_id')
                            ->label('User')
                            ->relationship('user', 'name')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->searchable()
                            ->preload(),
                        
                        Textarea::make('bio')
                            ->label('Biography')
                            ->rows(4)
                            ->maxLength(1000)
                            ->columnSpanFull(),
                        
                        TextInput::make('age')
                            ->numeric()
                            ->minValue(18)
                            ->maxValue(100),
                        
                        Select::make('gender')
                            ->options([
                                'male' => 'Male',
                                'female' => 'Female',
                                'non-binary' => 'Non-Binary',
                                'prefer_not_to_say' => 'Prefer Not to Say',
                            ])
                            ->native(false),
                        
                        TextInput::make('occupation')
                            ->maxLength(255),
                        
                        Select::make('work_schedule')
                            ->label('Work Schedule')
                            ->options([
                                'day_shift' => 'Day Shift',
                                'night_shift' => 'Night Shift',
                                'flexible' => 'Flexible',
                                'remote' => 'Remote',
                            ])
                            ->native(false),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Budget & Preferences')
                    ->schema([
                        TextInput::make('budget_min')
                            ->label('Minimum Budget')
                            ->required()
                            ->numeric()
                            ->prefix('$')
                            ->minValue(0),
                        
                        TextInput::make('budget_max')
                            ->label('Maximum Budget')
                            ->required()
                            ->numeric()
                            ->prefix('$')
                            ->minValue(0),
                        
                        TagsInput::make('preferred_locations')
                            ->label('Preferred Locations')
                            ->placeholder('Add locations...')
                            ->columnSpanFull(),
                        
                        Select::make('lifestyle')
                            ->options([
                                'quiet' => 'Quiet',
                                'social' => 'Social',
                                'active' => 'Active',
                                'relaxed' => 'Relaxed',
                            ])
                            ->native(false),
                        
                        Select::make('cleanliness')
                            ->options([
                                'very_clean' => 'Very Clean',
                                'clean' => 'Clean',
                                'average' => 'Average',
                                'relaxed' => 'Relaxed',
                            ])
                            ->native(false),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Pets & Smoking')
                    ->schema([
                        Toggle::make('has_pets')
                            ->label('Has Pets'),
                        
                        TextInput::make('pet_types')
                            ->label('Pet Types')
                            ->maxLength(255)
                            ->helperText('e.g., Dog, Cat'),
                        
                        Toggle::make('pet_friendly')
                            ->label('Pet Friendly'),
                        
                        Toggle::make('smoker')
                            ->label('Smoker'),
                        
                        Toggle::make('smoking_friendly')
                            ->label('Smoking Friendly'),
                    ])->columns(3)->columnSpanFull(),
                
                Section::make('Roommate Search')
                    ->schema([
                        TextInput::make('looking_for_roommates_count')
                            ->label('Looking for # Roommates')
                            ->numeric()
                            ->default(1)
                            ->minValue(1)
                            ->maxValue(10),
                        
                        DatePicker::make('move_in_date')
                            ->label('Desired Move-in Date')
                            ->native(false),
                        
                        TagsInput::make('interests')
                            ->label('Interests & Hobbies')
                            ->placeholder('Add interests...')
                            ->columnSpanFull(),
                        
                        Select::make('match_status')
                            ->label('Match Status')
                            ->options([
                                'active' => 'Active',
                                'matched' => 'Matched',
                                'inactive' => 'Inactive',
                                'paused' => 'Paused',
                            ])
                            ->required()
                            ->default('active')
                            ->native(false),
                        
                        Toggle::make('verified')
                            ->label('Verified Profile')
                            ->default(false),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Current Matches')
                    ->schema([
                        KeyValue::make('current_matches')
                            ->label('Matches')
                            ->columnSpanFull()
                            ->helperText('Auto-managed by matching system'),
                    ])->columnSpanFull(),
            ]);
    }
}
