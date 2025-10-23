<?php

namespace App\Filament\Resources\VirtualTours\Pages;

use App\Filament\Resources\VirtualTours\VirtualTourResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewVirtualTour extends ViewRecord
{
    protected static string $resource = VirtualTourResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
