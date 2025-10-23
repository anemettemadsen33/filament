<?php

namespace App\Filament\Resources\PropertyTours\Pages;

use App\Filament\Resources\PropertyTours\PropertyTourResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewPropertyTour extends ViewRecord
{
    protected static string $resource = PropertyTourResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
