<?php

namespace App\Filament\Resources\PropertyAnalytics\Pages;

use App\Filament\Resources\PropertyAnalytics\PropertyAnalyticResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewPropertyAnalytic extends ViewRecord
{
    protected static string $resource = PropertyAnalyticResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
