<?php

namespace App\Filament\Resources\Reviews\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ReviewForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Section::make('Review Information')
                    ->schema([
                        Select::make('property_id')
                            ->relationship('property', 'title')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->label('Property'),
                        
                        Select::make('user_id')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->label('Reviewer'),
                        
                        Select::make('booking_id')
                            ->relationship('booking', 'id')
                            ->searchable()
                            ->preload()
                            ->label('Related Booking')
                            ->helperText('Optional: Link to a booking'),
                    ])->columnSpan(2),
                
                Section::make('Ratings')
                    ->description('Rate different aspects (1-5 stars)')
                    ->columns(3)
                    ->schema([
                        Select::make('rating')
                            ->options([
                                1 => '⭐ 1 Star',
                                2 => '⭐⭐ 2 Stars',
                                3 => '⭐⭐⭐ 3 Stars',
                                4 => '⭐⭐⭐⭐ 4 Stars',
                                5 => '⭐⭐⭐⭐⭐ 5 Stars',
                            ])
                            ->required()
                            ->native(false)
                            ->label('Overall Rating'),
                        
                        Select::make('cleanliness_rating')
                            ->options([
                                1 => '1', 2 => '2', 3 => '3', 4 => '4', 5 => '5',
                            ])
                            ->native(false)
                            ->label('Cleanliness'),
                        
                        Select::make('location_rating')
                            ->options([
                                1 => '1', 2 => '2', 3 => '3', 4 => '4', 5 => '5',
                            ])
                            ->native(false)
                            ->label('Location'),
                        
                        Select::make('value_rating')
                            ->options([
                                1 => '1', 2 => '2', 3 => '3', 4 => '4', 5 => '5',
                            ])
                            ->native(false)
                            ->label('Value'),
                        
                        Select::make('communication_rating')
                            ->options([
                                1 => '1', 2 => '2', 3 => '3', 4 => '4', 5 => '5',
                            ])
                            ->native(false)
                            ->label('Communication'),
                        
                        Select::make('checkin_rating')
                            ->options([
                                1 => '1', 2 => '2', 3 => '3', 4 => '4', 5 => '5',
                            ])
                            ->native(false)
                            ->label('Check-in'),
                        
                        Select::make('accuracy_rating')
                            ->options([
                                1 => '1', 2 => '2', 3 => '3', 4 => '4', 5 => '5',
                            ])
                            ->native(false)
                            ->label('Accuracy'),
                    ])->columnSpan(2),
                
                Section::make('Review Content')
                    ->schema([
                        Textarea::make('comment')
                            ->required()
                            ->rows(5)
                            ->maxLength(2000)
                            ->placeholder('Share your experience...')
                            ->label('Review Comment')
                            ->columnSpanFull(),
                        
                        Textarea::make('response')
                            ->rows(3)
                            ->maxLength(1000)
                            ->placeholder('Owner response...')
                            ->label('Owner Response')
                            ->columnSpanFull(),
                    ])->columnSpan(2),
                
                Section::make('Review Status')
                    ->schema([
                        Select::make('status')
                            ->options([
                                'pending' => 'Pending Review',
                                'approved' => 'Approved',
                                'rejected' => 'Rejected',
                            ])
                            ->required()
                            ->native(false)
                            ->default('pending')
                            ->label('Status'),
                        
                        Toggle::make('is_featured')
                            ->label('Featured Review')
                            ->helperText('Highlight this review'),
                    ])->columns(2)->columnSpan(2),
            ]);
    }
}
