<?php

namespace App\Filament\Resources\LeaseAgreements\Pages;

use App\Filament\Resources\LeaseAgreements\LeaseAgreementResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListLeaseAgreements extends ListRecords
{
    protected static string $resource = LeaseAgreementResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
