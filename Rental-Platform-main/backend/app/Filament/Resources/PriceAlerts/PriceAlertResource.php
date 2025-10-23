<?php

namespace App\Filament\Resources\PriceAlerts;

use App\Filament\Resources\PriceAlerts\Pages\CreatePriceAlert;
use App\Filament\Resources\PriceAlerts\Pages\EditPriceAlert;
use App\Filament\Resources\PriceAlerts\Pages\ListPriceAlerts;
use App\Filament\Resources\PriceAlerts\Pages\ViewPriceAlert;
use App\Filament\Resources\PriceAlerts\Schemas\PriceAlertForm;
use App\Filament\Resources\PriceAlerts\Schemas\PriceAlertInfolist;
use App\Filament\Resources\PriceAlerts\Tables\PriceAlertsTable;
use App\Models\PriceAlert;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PriceAlertResource extends Resource
{
    protected static ?string $model = PriceAlert::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'model';

    public static function form(Schema $schema): Schema
    {
        return PriceAlertForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return PriceAlertInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PriceAlertsTable::configure($table);
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
            'index' => ListPriceAlerts::route('/'),
            'create' => CreatePriceAlert::route('/create'),
            'view' => ViewPriceAlert::route('/{record}'),
            'edit' => EditPriceAlert::route('/{record}/edit'),
        ];
    }
}
