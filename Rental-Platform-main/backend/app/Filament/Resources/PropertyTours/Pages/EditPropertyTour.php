<?php

namespace App\Filament\Resources\PropertyTours\Pages;

use App\Filament\Resources\PropertyTours\PropertyTourResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditPropertyTour extends EditRecord
{
    protected static string $resource = PropertyTourResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
