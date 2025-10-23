<?php

namespace App\Filament\Resources\PropertyTours\Pages;

use App\Filament\Resources\PropertyTours\PropertyTourResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPropertyTours extends ListRecords
{
    protected static string $resource = PropertyTourResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
