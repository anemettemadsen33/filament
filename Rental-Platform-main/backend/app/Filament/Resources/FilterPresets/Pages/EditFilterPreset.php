<?php

namespace App\Filament\Resources\FilterPresets\Pages;

use App\Filament\Resources\FilterPresets\FilterPresetResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditFilterPreset extends EditRecord
{
    protected static string $resource = FilterPresetResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
