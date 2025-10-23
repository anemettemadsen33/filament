<?php

namespace App\Filament\Resources\Settings\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\TagsInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Schema;

class SettingsForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Tabs::make('Settings')
                    ->tabs([
                        Tabs\Tab::make('🏢 Company Information')
                            ->schema([
                                Section::make('Basic Company Details')
                                    ->description('Essential company information for legal and business purposes')
                                    ->schema([
                                        TextInput::make('company_legal_name')
                                            ->label('Legal Company Name')
                                            ->placeholder('e.g., RentHub Solutions SRL')
                                            ->required()
                                            ->maxLength(255),
                                        TextInput::make('company_trade_name')
                                            ->label('Trade Name')
                                            ->placeholder('e.g., RentHub')
                                            ->maxLength(255),
                                        Grid::make(3)
                                            ->schema([
                                                TextInput::make('company_registration_number')
                                                    ->label('Registration Number')
                                                    ->placeholder('e.g., J40/12345/2023')
                                                    ->maxLength(100),
                                                TextInput::make('company_tax_number')
                                                    ->label('Tax Number (CUI)')
                                                    ->placeholder('e.g., RO12345678')
                                                    ->maxLength(50),
                                                TextInput::make('company_vat_number')
                                                    ->label('VAT Number')
                                                    ->placeholder('e.g., RO12345678')
                                                    ->maxLength(50),
                                            ]),
                                    ])->columns(2),
                                
                                Section::make('Company Address')
                                    ->description('Official registered address')
                                    ->schema([
                                        TextInput::make('company_address_street')
                                            ->label('Street Address')
                                            ->placeholder('e.g., Strada Victoriei 123, Bloc A, Ap. 4')
                                            ->columnSpanFull()
                                            ->maxLength(255),
                                        Grid::make(4)
                                            ->schema([
                                                TextInput::make('company_address_city')
                                                    ->label('City')
                                                    ->placeholder('e.g., București')
                                                    ->maxLength(100),
                                                TextInput::make('company_address_state')
                                                    ->label('State/County')
                                                    ->placeholder('e.g., Ilfov')
                                                    ->maxLength(100),
                                                TextInput::make('company_address_postal_code')
                                                    ->label('Postal Code')
                                                    ->placeholder('e.g., 010001')
                                                    ->maxLength(20),
                                                TextInput::make('company_address_country')
                                                    ->label('Country')
                                                    ->placeholder('e.g., România')
                                                    ->maxLength(100),
                                            ]),
                                    ])->columns(2),
                                
                                Section::make('Google Maps Integration')
                                    ->description('Map and location services for your business')
                                    ->schema([
                                        TextInput::make('google_maps_api_key')
                                            ->label('Google Maps API Key')
                                            ->password()
                                            ->placeholder('Enter your Google Maps API key')
                                            ->columnSpanFull(),
                                        TextInput::make('google_maps_embed_url')
                                            ->label('Google Maps Embed URL')
                                            ->url()
                                            ->placeholder('https://www.google.com/maps/embed?...')
                                            ->columnSpanFull(),
                                    ])->columns(2)->collapsible(),
                            ]),

                        Tabs\Tab::make('📞 Contact & Communication')
                            ->schema([
                                Section::make('Primary Contact Information')
                                    ->schema([
                                        Grid::make(2)
                                            ->schema([
                                                TextInput::make('contact_email')
                                                    ->label('Contact Email')
                                                    ->email()
                                                    ->required()
                                                    ->placeholder('contact@company.com'),
                                                TextInput::make('contact_phone')
                                                    ->label('Contact Phone')
                                                    ->tel()
                                                    ->placeholder('+40 123 456 789'),
                                            ]),
                                        Textarea::make('contact_address')
                                            ->label('Contact Address')
                                            ->placeholder('Full address for customer correspondence')
                                            ->columnSpanFull()
                                            ->rows(3),
                                    ])->columns(2),

                                Section::make('Additional Communication Channels')
                                    ->description('Modern communication methods for customer support')
                                    ->schema([
                                        Grid::make(3)
                                            ->schema([
                                                TextInput::make('company_whatsapp')
                                                    ->label('WhatsApp Number')
                                                    ->tel()
                                                    ->placeholder('+40 123 456 789'),
                                                TextInput::make('company_skype')
                                                    ->label('Skype ID')
                                                    ->placeholder('company.support'),
                                                TextInput::make('company_telegram')
                                                    ->label('Telegram Handle')
                                                    ->placeholder('@company_support'),
                                            ]),
                                        Grid::make(2)
                                            ->schema([
                                                TextInput::make('emergency_contact_name')
                                                    ->label('Emergency Contact Name')
                                                    ->placeholder('24/7 Support Team'),
                                                TextInput::make('emergency_contact_phone')
                                                    ->label('Emergency Phone')
                                                    ->tel()
                                                    ->placeholder('+40 123 456 789'),
                                            ]),
                                        TextInput::make('support_hours')
                                            ->label('Support Hours')
                                            ->placeholder('Monday-Friday 9:00-18:00')
                                            ->columnSpanFull(),
                                    ])->columns(2)->collapsible(),
                            ]),

                        Tabs\Tab::make('🕒 Business Hours')
                            ->schema([
                                Section::make('Operating Schedule')
                                    ->description('Set your business operating hours for each day of the week')
                                    ->schema([
                                        Grid::make(2)
                                            ->schema([
                                                TextInput::make('business_hours_monday')
                                                    ->label('Monday')
                                                    ->placeholder('9:00 - 18:00'),
                                                TextInput::make('business_hours_tuesday')
                                                    ->label('Tuesday')
                                                    ->placeholder('9:00 - 18:00'),
                                                TextInput::make('business_hours_wednesday')
                                                    ->label('Wednesday')
                                                    ->placeholder('9:00 - 18:00'),
                                                TextInput::make('business_hours_thursday')
                                                    ->label('Thursday')
                                                    ->placeholder('9:00 - 18:00'),
                                                TextInput::make('business_hours_friday')
                                                    ->label('Friday')
                                                    ->placeholder('9:00 - 18:00'),
                                                TextInput::make('business_hours_saturday')
                                                    ->label('Saturday')
                                                    ->placeholder('10:00 - 16:00'),
                                                TextInput::make('business_hours_sunday')
                                                    ->label('Sunday')
                                                    ->placeholder('Închis'),
                                            ]),
                                    ])->columns(2),
                            ]),

                        Tabs\Tab::make('🏠 Rental Business Settings')
                            ->schema([
                                Section::make('Rental Types & Duration')
                                    ->description('Configure supported rental types and minimum stay requirements')
                                    ->schema([
                                        Grid::make(2)
                                            ->schema([
                                                Toggle::make('short_term_rentals_enabled')
                                                    ->label('Enable Short-term Rentals')
                                                    ->helperText('Properties rented for days/weeks'),
                                                Toggle::make('long_term_rentals_enabled')
                                                    ->label('Enable Long-term Rentals')
                                                    ->helperText('Properties rented for months/years'),
                                            ]),
                                        Grid::make(2)
                                            ->schema([
                                                TextInput::make('minimum_stay_short_term')
                                                    ->label('Minimum Stay (Short-term)')
                                                    ->numeric()
                                                    ->suffix('days')
                                                    ->default(1),
                                                TextInput::make('minimum_stay_long_term')
                                                    ->label('Minimum Stay (Long-term)')
                                                    ->numeric()
                                                    ->suffix('days')
                                                    ->default(30),
                                            ]),
                                    ])->columns(2),

                                Section::make('Commission & Pricing')
                                    ->description('Commission rates and default fees for rental types')
                                    ->schema([
                                        Grid::make(2)
                                            ->schema([
                                                TextInput::make('short_term_commission_rate')
                                                    ->label('Short-term Commission Rate')
                                                    ->numeric()
                                                    ->step(0.01)
                                                    ->suffix('%')
                                                    ->placeholder('15.00'),
                                                TextInput::make('long_term_commission_rate')
                                                    ->label('Long-term Commission Rate')
                                                    ->numeric()
                                                    ->step(0.01)
                                                    ->suffix('%')
                                                    ->placeholder('10.00'),
                                            ]),
                                        Select::make('default_currency')
                                            ->label('Default Currency')
                                            ->options([
                                                'EUR' => 'Euro (EUR)',
                                                'RON' => 'Romanian Leu (RON)',
                                                'USD' => 'US Dollar (USD)',
                                            ])
                                            ->default('EUR'),
                                        TagsInput::make('accepted_currencies')
                                            ->label('Accepted Currencies')
                                            ->placeholder('EUR, RON, USD')
                                            ->columnSpanFull(),
                                    ])->columns(2)->collapsible(),

                                Section::make('Default Fees & Deposits')
                                    ->description('Standard fees applied to bookings')
                                    ->schema([
                                        Grid::make(3)
                                            ->schema([
                                                TextInput::make('cleaning_fee_short_term')
                                                    ->label('Cleaning Fee (Short-term)')
                                                    ->numeric()
                                                    ->step(0.01)
                                                    ->prefix('€')
                                                    ->placeholder('50.00'),
                                                TextInput::make('security_deposit_short_term')
                                                    ->label('Security Deposit (Short-term)')
                                                    ->numeric()
                                                    ->step(0.01)
                                                    ->prefix('€')
                                                    ->placeholder('200.00'),
                                                TextInput::make('security_deposit_long_term')
                                                    ->label('Security Deposit (Long-term)')
                                                    ->numeric()
                                                    ->step(0.01)
                                                    ->prefix('€')
                                                    ->placeholder('500.00'),
                                            ]),
                                    ])->columns(2)->collapsible(),
                            ]),

                        Tabs\Tab::make('📋 Policies & Rules')
                            ->schema([
                                Section::make('Cancellation Policies')
                                    ->description('Define cancellation terms for different rental types')
                                    ->schema([
                                        Textarea::make('cancellation_policy_short_term')
                                            ->label('Short-term Cancellation Policy')
                                            ->placeholder('Define cancellation terms for short-term rentals...')
                                            ->rows(4)
                                            ->columnSpanFull(),
                                        Textarea::make('cancellation_policy_long_term')
                                            ->label('Long-term Cancellation Policy')
                                            ->placeholder('Define cancellation terms for long-term rentals...')
                                            ->rows(4)
                                            ->columnSpanFull(),
                                    ])->columns(1),

                                Section::make('Property Rules & Instructions')
                                    ->description('Standard rules and check-in/out procedures')
                                    ->schema([
                                        Textarea::make('house_rules')
                                            ->label('House Rules')
                                            ->placeholder('No smoking, quiet hours 22:00-8:00, etc...')
                                            ->rows(4)
                                            ->columnSpanFull(),
                                        Grid::make(2)
                                            ->schema([
                                                Textarea::make('check_in_instructions')
                                                    ->label('Check-in Instructions')
                                                    ->placeholder('How guests should check in...')
                                                    ->rows(3),
                                                Textarea::make('check_out_instructions')
                                                    ->label('Check-out Instructions')
                                                    ->placeholder('What guests need to do before leaving...')
                                                    ->rows(3),
                                            ]),
                                    ])->columns(1)->collapsible(),
                            ]),

                        Tabs\Tab::make('📱 Social Media & SEO')
                            ->schema([
                                Section::make('Social Media Links')
                                    ->description('Connect your social media profiles')
                                    ->schema([
                                        Grid::make(2)
                                            ->schema([
                                                TextInput::make('social_facebook')
                                                    ->label('Facebook Page')
                                                    ->url()
                                                    ->placeholder('https://facebook.com/yourpage'),
                                                TextInput::make('social_instagram')
                                                    ->label('Instagram Profile')
                                                    ->url()
                                                    ->placeholder('https://instagram.com/yourprofile'),
                                                TextInput::make('social_twitter')
                                                    ->label('Twitter/X Profile')
                                                    ->url()
                                                    ->placeholder('https://twitter.com/yourprofile'),
                                                TextInput::make('social_linkedin')
                                                    ->label('LinkedIn Company')
                                                    ->url()
                                                    ->placeholder('https://linkedin.com/company/yourcompany'),
                                                TextInput::make('youtube_url')
                                                    ->label('YouTube Channel')
                                                    ->url()
                                                    ->placeholder('https://youtube.com/@yourchannel'),
                                                TextInput::make('tiktok_url')
                                                    ->label('TikTok Profile')
                                                    ->url()
                                                    ->placeholder('https://tiktok.com/@yourprofile'),
                                            ]),
                                        Grid::make(2)
                                            ->schema([
                                                TextInput::make('pinterest_url')
                                                    ->label('Pinterest Profile')
                                                    ->url()
                                                    ->placeholder('https://pinterest.com/yourprofile'),
                                                TextInput::make('whatsapp_business_url')
                                                    ->label('WhatsApp Business Link')
                                                    ->url()
                                                    ->placeholder('https://wa.me/40123456789'),
                                            ]),
                                    ])->columns(2),

                                Section::make('SEO Settings')
                                    ->description('Search engine optimization settings')
                                    ->schema([
                                        TagsInput::make('meta_keywords')
                                            ->label('Meta Keywords')
                                            ->placeholder('Enter keywords separated by commas')
                                            ->columnSpanFull(),
                                    ])->columns(2)->collapsible(),
                            ]),

                        Tabs\Tab::make('🌐 Website Settings')
                            ->schema([
                                Section::make('Basic Website Configuration')
                                    ->schema([
                                        Grid::make(2)
                                            ->schema([
                                                TextInput::make('website_name')
                                                    ->label('Website Name')
                                                    ->required()
                                                    ->placeholder('Your Website Name'),
                                                TextInput::make('frontend_domain')
                                                    ->label('Frontend Domain')
                                                    ->url()
                                                    ->placeholder('https://yourwebsite.com'),
                                            ]),
                                        Textarea::make('website_description')
                                            ->label('Website Description')
                                            ->placeholder('Brief description of your website...')
                                            ->rows(3)
                                            ->columnSpanFull(),
                                    ])->columns(2),

                                Section::make('CORS Configuration')
                                    ->description('Cross-Origin Resource Sharing settings')
                                    ->schema([
                                        Toggle::make('cors_enabled')
                                            ->label('Enable CORS')
                                            ->helperText('Allow cross-origin requests'),
                                        TextInput::make('cors_allowed_origins')
                                            ->label('Allowed Origins')
                                            ->placeholder('https://domain1.com,https://domain2.com')
                                            ->columnSpanFull(),
                                    ])->columns(2)->collapsible(),

                                Section::make('Maintenance Mode')
                                    ->description('Site maintenance settings')
                                    ->schema([
                                        Toggle::make('maintenance_mode')
                                            ->label('Enable Maintenance Mode')
                                            ->helperText('Temporarily disable site access'),
                                        Textarea::make('maintenance_message')
                                            ->label('Maintenance Message')
                                            ->placeholder('Message to display during maintenance...')
                                            ->rows(3)
                                            ->columnSpanFull(),
                                    ])->columns(2)->collapsible(),
                            ]),

                        Tabs\Tab::make('📧 Email & SMS')
                            ->schema([
                                Section::make('Email Configuration')
                                    ->description('SMTP settings for sending emails')
                                    ->schema([
                                        Grid::make(3)
                                            ->schema([
                                                TextInput::make('smtp_host')
                                                    ->label('SMTP Host')
                                                    ->placeholder('smtp.gmail.com'),
                                                TextInput::make('smtp_port')
                                                    ->label('SMTP Port')
                                                    ->numeric()
                                                    ->placeholder('587'),
                                                Select::make('smtp_encryption')
                                                    ->label('Encryption')
                                                    ->options([
                                                        'none' => 'None',
                                                        'tls' => 'TLS',
                                                        'ssl' => 'SSL',
                                                    ])
                                                    ->default('tls'),
                                            ]),
                                        Grid::make(2)
                                            ->schema([
                                                TextInput::make('mail_from_address')
                                                    ->label('From Email Address')
                                                    ->email()
                                                    ->placeholder('noreply@yoursite.com'),
                                                TextInput::make('mail_from_name')
                                                    ->label('From Name')
                                                    ->placeholder('Your Company Name'),
                                            ]),
                                    ])->columns(2),

                                Section::make('Notification Settings')
                                    ->description('Control when and how notifications are sent')
                                    ->schema([
                                        Grid::make(2)
                                            ->schema([
                                                Toggle::make('email_notifications_enabled')
                                                    ->label('Enable Email Notifications')
                                                    ->default(true),
                                                Toggle::make('sms_notifications_enabled')
                                                    ->label('Enable SMS Notifications')
                                                    ->default(false),
                                            ]),
                                    ])->columns(2)->collapsible(),
                            ]),

                        Tabs\Tab::make('⚖️ Legal & Compliance')
                            ->schema([
                                Section::make('Legal Documents')
                                    ->description('Links to your legal pages and policies')
                                    ->schema([
                                        Grid::make(2)
                                            ->schema([
                                                TextInput::make('privacy_policy_url')
                                                    ->label('Privacy Policy URL')
                                                    ->url()
                                                    ->placeholder('https://yoursite.com/privacy'),
                                                TextInput::make('terms_of_service_url')
                                                    ->label('Terms of Service URL')
                                                    ->url()
                                                    ->placeholder('https://yoursite.com/terms'),
                                            ]),
                                    ])->columns(2),
                            ]),
                    ])
                    ->persistTabInQueryString()
                    ->columnSpanFull(),
            ])
            ->statePath('data');
    }
}