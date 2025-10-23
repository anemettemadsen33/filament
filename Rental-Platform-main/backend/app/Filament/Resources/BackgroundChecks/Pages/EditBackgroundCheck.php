<?php

namespace App\Filament\Resources\BackgroundChecks\Pages;

use App\Filament\Resources\BackgroundChecks\BackgroundCheckResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditBackgroundCheck extends EditRecord
{
    protected static string $resource = BackgroundCheckResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
