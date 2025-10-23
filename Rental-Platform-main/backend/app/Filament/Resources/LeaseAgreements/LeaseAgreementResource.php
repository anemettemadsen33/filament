<?php

namespace App\Filament\Resources\LeaseAgreements;

use App\Filament\Resources\LeaseAgreements\Pages\CreateLeaseAgreement;
use App\Filament\Resources\LeaseAgreements\Pages\EditLeaseAgreement;
use App\Filament\Resources\LeaseAgreements\Pages\ListLeaseAgreements;
use App\Filament\Resources\LeaseAgreements\Pages\ViewLeaseAgreement;
use App\Filament\Resources\LeaseAgreements\Schemas\LeaseAgreementForm;
use App\Filament\Resources\LeaseAgreements\Schemas\LeaseAgreementInfolist;
use App\Filament\Resources\LeaseAgreements\Tables\LeaseAgreementsTable;
use App\Models\LeaseAgreement;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class LeaseAgreementResource extends Resource
{
    protected static ?string $model = LeaseAgreement::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'model';

    public static function form(Schema $schema): Schema
    {
        return LeaseAgreementForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return LeaseAgreementInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return LeaseAgreementsTable::configure($table);
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
            'index' => ListLeaseAgreements::route('/'),
            'create' => CreateLeaseAgreement::route('/create'),
            'view' => ViewLeaseAgreement::route('/{record}'),
            'edit' => EditLeaseAgreement::route('/{record}/edit'),
        ];
    }
}
