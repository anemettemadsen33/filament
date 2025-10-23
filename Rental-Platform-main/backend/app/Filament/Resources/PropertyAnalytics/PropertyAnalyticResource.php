<?php

namespace App\Filament\Resources\PropertyAnalytics;

use App\Filament\Resources\PropertyAnalytics\Pages\CreatePropertyAnalytic;
use App\Filament\Resources\PropertyAnalytics\Pages\EditPropertyAnalytic;
use App\Filament\Resources\PropertyAnalytics\Pages\ListPropertyAnalytics;
use App\Filament\Resources\PropertyAnalytics\Pages\ViewPropertyAnalytic;
use App\Filament\Resources\PropertyAnalytics\Schemas\PropertyAnalyticForm;
use App\Filament\Resources\PropertyAnalytics\Schemas\PropertyAnalyticInfolist;
use App\Filament\Resources\PropertyAnalytics\Tables\PropertyAnalyticsTable;
use App\Models\PropertyAnalytic;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PropertyAnalyticResource extends Resource
{
    protected static ?string $model = PropertyAnalytic::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'model';

    public static function form(Schema $schema): Schema
    {
        return PropertyAnalyticForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return PropertyAnalyticInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PropertyAnalyticsTable::configure($table);
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
            'index' => ListPropertyAnalytics::route('/'),
            'create' => CreatePropertyAnalytic::route('/create'),
            'view' => ViewPropertyAnalytic::route('/{record}'),
            'edit' => EditPropertyAnalytic::route('/{record}/edit'),
        ];
    }
}
