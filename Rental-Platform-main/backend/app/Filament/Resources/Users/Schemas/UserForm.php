<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Hash;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Section::make('User Information')
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->label('Full Name'),
                        
                        TextInput::make('email')
                            ->email()
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255)
                            ->label('Email Address'),
                        
                        TextInput::make('password')
                            ->password()
                            ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                            ->dehydrated(fn ($state) => filled($state))
                            ->required(fn (string $context): bool => $context === 'create')
                            ->maxLength(255)
                            ->label('Password')
                            ->helperText('Leave blank to keep current password'),
                        
                        TextInput::make('phone')
                            ->tel()
                            ->maxLength(20)
                            ->label('Phone Number'),
                    ])->columnSpan(1),
                
                Section::make('Role & Status')
                    ->schema([
                        Select::make('role')
                            ->options([
                                'guest' => 'Guest',
                                'owner' => 'Property Owner',
                                'admin' => 'Administrator',
                            ])
                            ->required()
                            ->native(false)
                            ->default('guest')
                            ->label('User Role'),
                        
                        Toggle::make('is_verified')
                            ->label('Verified Account')
                            ->helperText('Mark user as verified'),
                        
                        FileUpload::make('profile_photo')
                            ->image()
                            ->directory('profile-photos')
                            ->visibility('public')
                            ->label('Profile Photo'),
                    ])->columnSpan(1),
                
                Section::make('Additional Information')
                    ->schema([
                        Textarea::make('bio')
                            ->rows(4)
                            ->maxLength(1000)
                            ->placeholder('Tell us about yourself...')
                            ->label('Biography')
                            ->columnSpanFull(),
                    ])->columnSpan(2),
            ]);
    }
}
