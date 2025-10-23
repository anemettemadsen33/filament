<?php

namespace App\Filament\Resources\PropertyTours;

use App\Filament\Resources\PropertyTours\Pages\CreatePropertyTour;
use App\Filament\Resources\PropertyTours\Pages\EditPropertyTour;
use App\Filament\Resources\PropertyTours\Pages\ListPropertyTours;
use App\Filament\Resources\PropertyTours\Pages\ViewPropertyTour;
use App\Filament\Resources\PropertyTours\Schemas\PropertyTourForm;
use App\Filament\Resources\PropertyTours\Schemas\PropertyTourInfolist;
use App\Filament\Resources\PropertyTours\Tables\PropertyToursTable;
use App\Models\PropertyTour;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PropertyTourResource extends Resource
{
    protected static ?string $model = PropertyTour::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'model';

    public static function form(Schema $schema): Schema
    {
        return PropertyTourForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return PropertyTourInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PropertyToursTable::configure($table);
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
            'index' => ListPropertyTours::route('/'),
            'create' => CreatePropertyTour::route('/create'),
            'view' => ViewPropertyTour::route('/{record}'),
            'edit' => EditPropertyTour::route('/{record}/edit'),
        ];
    }
}
