<?php

namespace App\Filament\Resources\VirtualTours;

use App\Filament\Resources\VirtualTours\Pages\CreateVirtualTour;
use App\Filament\Resources\VirtualTours\Pages\EditVirtualTour;
use App\Filament\Resources\VirtualTours\Pages\ListVirtualTours;
use App\Filament\Resources\VirtualTours\Pages\ViewVirtualTour;
use App\Filament\Resources\VirtualTours\Schemas\VirtualTourForm;
use App\Filament\Resources\VirtualTours\Schemas\VirtualTourInfolist;
use App\Filament\Resources\VirtualTours\Tables\VirtualToursTable;
use App\Models\VirtualTour;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class VirtualTourResource extends Resource
{
    protected static ?string $model = VirtualTour::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'model';

    public static function form(Schema $schema): Schema
    {
        return VirtualTourForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return VirtualTourInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return VirtualToursTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListVirtualTours::route('/'),
            'create' => CreateVirtualTour::route('/create'),
            'view' => ViewVirtualTour::route('/{record}'),
            'edit' => EditVirtualTour::route('/{record}/edit'),
        ];
    }
}
