<?php

namespace App\Filament\Resources\PropertyAnalytics\Pages;

use App\Filament\Resources\PropertyAnalytics\PropertyAnalyticResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditPropertyAnalytic extends EditRecord
{
    protected static string $resource = PropertyAnalyticResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
