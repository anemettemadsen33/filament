<?php

namespace App\Filament\Resources\FilterPresets\Pages;

use App\Filament\Resources\FilterPresets\FilterPresetResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFilterPresets extends ListRecords
{
    protected static string $resource = FilterPresetResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
