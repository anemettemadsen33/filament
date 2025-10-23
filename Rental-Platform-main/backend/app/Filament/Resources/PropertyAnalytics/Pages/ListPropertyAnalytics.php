<?php

namespace App\Filament\Resources\PropertyAnalytics\Pages;

use App\Filament\Resources\PropertyAnalytics\PropertyAnalyticResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPropertyAnalytics extends ListRecords
{
    protected static string $resource = PropertyAnalyticResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
