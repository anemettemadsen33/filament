<?php

namespace App\Filament\Resources\Conversations\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ConversationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Section::make('Conversation Details')
                    ->schema([
                        Select::make('property_id')
                            ->label('Property')
                            ->relationship('property', 'title')
                            ->required()
                            ->searchable()
                            ->preload(),
                        
                        TextInput::make('subject')
                            ->label('Subject')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        
                        Select::make('status')
                            ->options([
                                'active' => 'Active',
                                'archived' => 'Archived',
                                'closed' => 'Closed',
                            ])
                            ->required()
                            ->default('active')
                            ->native(false),
                        
                        Select::make('conversation_type')
                            ->label('Type')
                            ->options([
                                'inquiry' => 'Inquiry',
                                'booking' => 'Booking',
                                'support' => 'Support',
                                'complaint' => 'Complaint',
                            ])
                            ->required()
                            ->default('inquiry')
                            ->native(false),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Participants')
                    ->schema([
                        Repeater::make('participants')
                            ->label('Participants')
                            ->schema([
                                Select::make('user_id')
                                    ->label('User')
                                    ->options(fn () => \App\Models\User::pluck('name', 'id')->toArray())
                                    ->required()
                                    ->searchable(),
                            ])
                            ->defaultItems(2)
                            ->columnSpanFull(),
                    ])->columnSpanFull(),
                
                Section::make('Statistics')
                    ->schema([
                        TextInput::make('total_messages')
                            ->label('Total Messages')
                            ->numeric()
                            ->default(0)
                            ->disabled()
                            ->dehydrated(false),
                        
                        DateTimePicker::make('last_message_at')
                            ->label('Last Message At')
                            ->native(false)
                            ->disabled()
                            ->dehydrated(false),
                        
                        KeyValue::make('unread_count')
                            ->label('Unread Count per User')
                            ->columnSpanFull()
                            ->helperText('Format: user_id => count'),
                    ])->columns(2)->columnSpanFull(),
            ]);
    }
}
