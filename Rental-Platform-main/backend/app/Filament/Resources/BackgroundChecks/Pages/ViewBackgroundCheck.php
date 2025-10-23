<?php

namespace App\Filament\Resources\BackgroundChecks\Pages;

use App\Filament\Resources\BackgroundChecks\BackgroundCheckResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewBackgroundCheck extends ViewRecord
{
    protected static string $resource = BackgroundCheckResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
