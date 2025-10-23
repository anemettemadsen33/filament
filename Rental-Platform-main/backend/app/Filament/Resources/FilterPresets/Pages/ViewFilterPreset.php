<?php

namespace App\Filament\Resources\FilterPresets\Pages;

use App\Filament\Resources\FilterPresets\FilterPresetResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewFilterPreset extends ViewRecord
{
    protected static string $resource = FilterPresetResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
