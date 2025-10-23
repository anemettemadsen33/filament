<?php

namespace App\Filament\Resources\VirtualTours\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class VirtualTourForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Tour Information')
                    ->schema([
                        Select::make('property_id')
                            ->relationship('property', 'title')
                            ->required()
                            ->searchable()
                            ->preload()
                            ->helperText('Select the property for this virtual tour'),
                        
                        Select::make('tour_type')
                            ->required()
                            ->options([
                                '360_video' => '360° Video',
                                '3d_model' => '3D Model',
                                'video_walkthrough' => 'Video Walkthrough',
                                'image_gallery' => 'Image Gallery',
                                'matterport' => 'Matterport Tour',
                            ])
                            ->helperText('Select the type of virtual tour'),
                        
                        Toggle::make('is_active')
                            ->label('Active')
                            ->default(true)
                            ->helperText('Enable or disable this tour'),
                    ])
                    ->columns(3),
                
                Section::make('Tour Media')
                    ->schema([
                        TextInput::make('tour_url')
                            ->url()
                            ->required()
                            ->maxLength(500)
                            ->helperText('URL to the virtual tour (YouTube, Matterport, etc.)')
                            ->placeholder('https://example.com/tour'),
                        
                        FileUpload::make('thumbnail')
                            ->image()
                            ->imageEditor()
                            ->maxSize(5120)
                            ->helperText('Upload a thumbnail for the tour (max 5MB)'),
                        
                        TextInput::make('duration')
                            ->numeric()
                            ->suffix('minutes')
                            ->minValue(0)
                            ->helperText('Duration of the tour in minutes'),
                    ])
                    ->columns(3),
                
                Section::make('Engagement & Stats')
                    ->schema([
                        TextInput::make('views_count')
                            ->label('Views Count')
                            ->numeric()
                            ->default(0)
                            ->disabled()
                            ->dehydrated(false)
                            ->helperText('Total number of views'),
                        
                        TextInput::make('avg_watch_time')
                            ->label('Avg Watch Time')
                            ->numeric()
                            ->suffix('minutes')
                            ->disabled()
                            ->dehydrated(false)
                            ->helperText('Average watch time'),
                    ])
                    ->columns(2),
            ]);
    }
}
