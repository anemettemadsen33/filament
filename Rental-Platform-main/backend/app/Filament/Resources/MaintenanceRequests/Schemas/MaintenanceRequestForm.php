<?php

namespace App\Filament\Resources\MaintenanceRequests\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class MaintenanceRequestForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Section::make('Request Details')
                    ->schema([
                        Select::make('property_id')
                            ->label('Property')
                            ->relationship('property', 'title')
                            ->required()
                            ->searchable()
                            ->preload(),
                        
                        Select::make('tenant_id')
                            ->label('Tenant')
                            ->relationship('tenant', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        
                        Select::make('landlord_id')
                            ->label('Landlord')
                            ->relationship('landlord', 'name')
                            ->searchable()
                            ->preload(),
                        
                        Select::make('assigned_to')
                            ->label('Assigned To')
                            ->relationship('assignedTo', 'name')
                            ->searchable()
                            ->preload(),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Issue Information')
                    ->schema([
                        TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        
                        Textarea::make('description')
                            ->required()
                            ->rows(4)
                            ->columnSpanFull(),
                        
                        Select::make('category')
                            ->options([
                                'plumbing' => 'Plumbing',
                                'electrical' => 'Electrical',
                                'hvac' => 'HVAC',
                                'appliances' => 'Appliances',
                                'structural' => 'Structural',
                                'pest_control' => 'Pest Control',
                                'cleaning' => 'Cleaning',
                                'landscaping' => 'Landscaping',
                                'other' => 'Other',
                            ])
                            ->required()
                            ->native(false),
                        
                        Select::make('priority')
                            ->options([
                                'low' => 'Low',
                                'medium' => 'Medium',
                                'high' => 'High',
                                'urgent' => 'Urgent',
                            ])
                            ->required()
                            ->default('medium')
                            ->native(false),
                        
                        Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'acknowledged' => 'Acknowledged',
                                'scheduled' => 'Scheduled',
                                'in_progress' => 'In Progress',
                                'completed' => 'Completed',
                                'cancelled' => 'Cancelled',
                            ])
                            ->required()
                            ->default('pending')
                            ->native(false),
                        
                        FileUpload::make('attachments')
                            ->label('Attachments')
                            ->multiple()
                            ->directory('maintenance-attachments')
                            ->image()
                            ->maxSize(5120)
                            ->columnSpanFull(),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Schedule & Costs')
                    ->schema([
                        DateTimePicker::make('scheduled_date')
                            ->label('Scheduled Date')
                            ->native(false),
                        
                        DateTimePicker::make('completed_date')
                            ->label('Completed Date')
                            ->native(false),
                        
                        TextInput::make('estimated_cost')
                            ->label('Estimated Cost')
                            ->numeric()
                            ->prefix('$')
                            ->minValue(0),
                        
                        TextInput::make('actual_cost')
                            ->label('Actual Cost')
                            ->numeric()
                            ->prefix('$')
                            ->minValue(0),
                    ])->columns(2)->columnSpanFull(),
            ]);
    }
}
