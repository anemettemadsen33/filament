<?php

namespace App\Filament\Resources\Vouchers\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class VoucherForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Voucher Code')
                    ->schema([
                        TextInput::make('code')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(50)
                            ->helperText('Unique voucher code (e.g., SUMMER2024)')
                            ->placeholder('SUMMER2024')
                            ->columnSpan(2),
                        
                        Toggle::make('active')
                            ->label('Active')
                            ->default(true)
                            ->helperText('Enable or disable this voucher'),
                    ])
                    ->columns(3),
                
                Section::make('Discount Details')
                    ->schema([
                        Select::make('type')
                            ->required()
                            ->options([
                                'percentage' => 'Percentage',
                                'fixed_amount' => 'Fixed Amount',
                            ])
                            ->reactive()
                            ->helperText('Select discount type'),
                        
                        TextInput::make('value')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->suffix(fn ($get) => $get('type') === 'percentage' ? '%' : '$')
                            ->helperText('Discount value'),
                        
                        TextInput::make('min_booking_value')
                            ->label('Min Booking Amount')
                            ->numeric()
                            ->prefix('$')
                            ->default(0)
                            ->minValue(0)
                            ->helperText('Minimum booking amount to use this voucher'),
                    ])
                    ->columns(3),
                
                Section::make('Validity & Usage')
                    ->schema([
                        DateTimePicker::make('valid_from')
                            ->native(false)
                            ->required()
                            ->default(now())
                            ->helperText('Voucher valid from'),
                        
                        DateTimePicker::make('valid_until')
                            ->native(false)
                            ->required()
                            ->after('valid_from')
                            ->helperText('Voucher valid until'),
                    ])
                    ->columns(2),
                
                Section::make('Usage Limits')
                    ->schema([
                        TextInput::make('max_uses')
                            ->label('Max Uses')
                            ->numeric()
                            ->minValue(1)
                            ->helperText('Maximum number of times this voucher can be used (leave empty for unlimited)'),
                        
                        TextInput::make('current_uses')
                            ->label('Current Uses')
                            ->numeric()
                            ->default(0)
                            ->disabled()
                            ->dehydrated(false)
                            ->helperText('Number of times this voucher has been used'),
                        
                        TextInput::make('max_uses_per_user')
                            ->label('Max Uses Per User')
                            ->numeric()
                            ->minValue(1)
                            ->default(1)
                            ->helperText('Maximum uses per user'),
                    ])
                    ->columns(3),
                
                Section::make('Applicable Property')
                    ->schema([
                        Select::make('property_id')
                            ->relationship('property', 'title')
                            ->searchable()
                            ->preload()
                            ->helperText('Select specific property (leave empty for all properties)')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
