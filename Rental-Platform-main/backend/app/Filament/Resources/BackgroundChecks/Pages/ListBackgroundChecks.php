<?php

namespace App\Filament\Resources\BackgroundChecks\Pages;

use App\Filament\Resources\BackgroundChecks\BackgroundCheckResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListBackgroundChecks extends ListRecords
{
    protected static string $resource = BackgroundCheckResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
