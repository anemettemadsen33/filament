<?php

namespace App\Filament\Resources\LeaseAgreements\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class LeaseAgreementForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Section::make('Parties')
                    ->schema([
                        Select::make('property_id')
                            ->label('Property')
                            ->relationship('property', 'title')
                            ->required()
                            ->searchable()
                            ->preload(),
                        
                        Select::make('landlord_id')
                            ->label('Landlord')
                            ->relationship('landlord', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        
                        Select::make('tenant_id')
                            ->label('Tenant')
                            ->relationship('tenant', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        
                        Select::make('booking_id')
                            ->label('Booking')
                            ->relationship('booking', 'id')
                            ->searchable()
                            ->preload(),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Lease Terms')
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
                        
                        TextInput::make('rent_amount')
                            ->label('Rent Amount')
                            ->required()
                            ->numeric()
                            ->prefix('$')
                            ->minValue(0),
                        
                        TextInput::make('deposit_amount')
                            ->label('Deposit Amount')
                            ->required()
                            ->numeric()
                            ->prefix('$')
                            ->minValue(0),
                        
                        Select::make('payment_frequency')
                            ->label('Payment Frequency')
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
                
                Section::make('Terms & Conditions')
                    ->schema([
                        RichEditor::make('terms')
                            ->label('Lease Terms')
                            ->required()
                            ->columnSpanFull(),
                        
                        KeyValue::make('additional_clauses')
                            ->label('Additional Clauses')
                            ->columnSpanFull(),
                    ])->columnSpanFull(),
                
                Section::make('Status & Documents')
                    ->schema([
                        Select::make('status')
                            ->options([
                                'draft' => 'Draft',
                                'pending_signatures' => 'Pending Signatures',
                                'active' => 'Active',
                                'expired' => 'Expired',
                                'terminated' => 'Terminated',
                                'renewed' => 'Renewed',
                            ])
                            ->required()
                            ->default('draft')
                            ->native(false),
                        
                        TextInput::make('document_url')
                            ->label('Document URL')
                            ->url()
                            ->maxLength(500)
                            ->columnSpanFull(),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Signatures')
                    ->schema([
                        Textarea::make('signature_landlord')
                            ->label('Landlord Signature (Base64)')
                            ->rows(2)
                            ->helperText('Digital signature data'),
                        
                        DateTimePicker::make('signed_by_landlord_at')
                            ->label('Landlord Signed At')
                            ->native(false),
                        
                        Textarea::make('signature_tenant')
                            ->label('Tenant Signature (Base64)')
                            ->rows(2)
                            ->helperText('Digital signature data'),
                        
                        DateTimePicker::make('signed_by_tenant_at')
                            ->label('Tenant Signed At')
                            ->native(false),
                    ])->columns(2)->columnSpanFull(),
                
                Section::make('Renewal Settings')
                    ->schema([
                        Toggle::make('auto_renew')
                            ->label('Auto Renew')
                            ->default(false),
                        
                        TextInput::make('renewal_notice_days')
                            ->label('Renewal Notice Days')
                            ->numeric()
                            ->default(30)
                            ->minValue(1)
                            ->helperText('Days before expiry to send renewal notice'),
                        
                        Textarea::make('termination_reason')
                            ->label('Termination Reason')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])->columns(2)->columnSpanFull(),
            ]);
    }
}
