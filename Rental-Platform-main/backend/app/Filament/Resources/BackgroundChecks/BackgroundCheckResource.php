<?php

namespace App\Filament\Resources\BackgroundChecks;

use App\Filament\Resources\BackgroundChecks\Pages\CreateBackgroundCheck;
use App\Filament\Resources\BackgroundChecks\Pages\EditBackgroundCheck;
use App\Filament\Resources\BackgroundChecks\Pages\ListBackgroundChecks;
use App\Filament\Resources\BackgroundChecks\Pages\ViewBackgroundCheck;
use App\Filament\Resources\BackgroundChecks\Schemas\BackgroundCheckForm;
use App\Filament\Resources\BackgroundChecks\Schemas\BackgroundCheckInfolist;
use App\Filament\Resources\BackgroundChecks\Tables\BackgroundChecksTable;
use App\Models\BackgroundCheck;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class BackgroundCheckResource extends Resource
{
    protected static ?string $model = BackgroundCheck::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'model';

    public static function form(Schema $schema): Schema
    {
        return BackgroundCheckForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return BackgroundCheckInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BackgroundChecksTable::configure($table);
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
            'index' => ListBackgroundChecks::route('/'),
            'create' => CreateBackgroundCheck::route('/create'),
            'view' => ViewBackgroundCheck::route('/{record}'),
            'edit' => EditBackgroundCheck::route('/{record}/edit'),
        ];
    }
}
