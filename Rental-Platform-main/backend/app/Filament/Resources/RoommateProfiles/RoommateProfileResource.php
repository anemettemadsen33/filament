<?php

namespace App\Filament\Resources\RoommateProfiles;

use App\Filament\Resources\RoommateProfiles\Pages\CreateRoommateProfile;
use App\Filament\Resources\RoommateProfiles\Pages\EditRoommateProfile;
use App\Filament\Resources\RoommateProfiles\Pages\ListRoommateProfiles;
use App\Filament\Resources\RoommateProfiles\Pages\ViewRoommateProfile;
use App\Filament\Resources\RoommateProfiles\Schemas\RoommateProfileForm;
use App\Filament\Resources\RoommateProfiles\Schemas\RoommateProfileInfolist;
use App\Filament\Resources\RoommateProfiles\Tables\RoommateProfilesTable;
use App\Models\RoommateProfile;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class RoommateProfileResource extends Resource
{
    protected static ?string $model = RoommateProfile::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'model';

    public static function form(Schema $schema): Schema
    {
        return RoommateProfileForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return RoommateProfileInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return RoommateProfilesTable::configure($table);
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
            'index' => ListRoommateProfiles::route('/'),
            'create' => CreateRoommateProfile::route('/create'),
            'view' => ViewRoommateProfile::route('/{record}'),
            'edit' => EditRoommateProfile::route('/{record}/edit'),
        ];
    }
}
