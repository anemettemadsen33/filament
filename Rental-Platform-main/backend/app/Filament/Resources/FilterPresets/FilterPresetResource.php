<?php

namespace App\Filament\Resources\FilterPresets;

use App\Filament\Resources\FilterPresets\Pages\CreateFilterPreset;
use App\Filament\Resources\FilterPresets\Pages\EditFilterPreset;
use App\Filament\Resources\FilterPresets\Pages\ListFilterPresets;
use App\Filament\Resources\FilterPresets\Pages\ViewFilterPreset;
use App\Filament\Resources\FilterPresets\Schemas\FilterPresetForm;
use App\Filament\Resources\FilterPresets\Schemas\FilterPresetInfolist;
use App\Filament\Resources\FilterPresets\Tables\FilterPresetsTable;
use App\Models\FilterPreset;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class FilterPresetResource extends Resource
{
    protected static ?string $model = FilterPreset::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'model';

    public static function form(Schema $schema): Schema
    {
        return FilterPresetForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return FilterPresetInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FilterPresetsTable::configure($table);
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
            'index' => ListFilterPresets::route('/'),
            'create' => CreateFilterPreset::route('/create'),
            'view' => ViewFilterPreset::route('/{record}'),
            'edit' => EditFilterPreset::route('/{record}/edit'),
        ];
    }
}
