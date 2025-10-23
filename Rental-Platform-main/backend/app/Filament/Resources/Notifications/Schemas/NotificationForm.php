<?php

namespace App\Filament\Resources\Notifications\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class NotificationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Notification Details')
                    ->schema([
                        Select::make('user_id')
                            ->relationship('user', 'name')
                            ->required()
                            ->searchable()
                            ->preload()
                            ->helperText('Select the user to receive this notification'),
                        
                        Select::make('type')
                            ->required()
                            ->options([
                                'booking_confirmed' => 'Booking Confirmed',
                                'booking_cancelled' => 'Booking Cancelled',
                                'message_received' => 'Message Received',
                                'price_alert' => 'Price Alert',
                                'maintenance_update' => 'Maintenance Update',
                                'payment_received' => 'Payment Received',
                                'payment_due' => 'Payment Due',
                                'review_received' => 'Review Received',
                                'property_approved' => 'Property Approved',
                                'property_rejected' => 'Property Rejected',
                                'tour_scheduled' => 'Tour Scheduled',
                                'tour_reminder' => 'Tour Reminder',
                            ])
                            ->searchable()
                            ->helperText('Select the notification type'),
                        
                        TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->helperText('Notification title shown to the user'),
                    ])
                    ->columns(3),
                
                Section::make('Content')
                    ->schema([
                        RichEditor::make('message')
                            ->required()
                            ->columnSpanFull()
                            ->helperText('The main notification message'),
                        
                        TextInput::make('action_url')
                            ->url()
                            ->maxLength(255)
                            ->helperText('Optional URL to redirect user when clicking notification')
                            ->placeholder('https://example.com/action'),
                    ]),
                
                Section::make('Additional Data')
                    ->schema([
                        KeyValue::make('data')
                            ->columnSpanFull()
                            ->helperText('Additional data in JSON format (e.g., booking_id, property_id)'),
                    ]),
                
                Section::make('Status')
                    ->schema([
                        DateTimePicker::make('read_at')
                            ->helperText('When the notification was read by the user')
                            ->disabled()
                            ->dehydrated(false),
                        
                        DateTimePicker::make('sent_at')
                            ->helperText('When the notification was sent')
                            ->disabled()
                            ->dehydrated(false),
                    ])
                    ->columns(2),
            ]);
    }
}
