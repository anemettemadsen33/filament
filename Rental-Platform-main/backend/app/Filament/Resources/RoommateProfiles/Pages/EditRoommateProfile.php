<?php

namespace App\Filament\Resources\RoommateProfiles\Pages;

use App\Filament\Resources\RoommateProfiles\RoommateProfileResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditRoommateProfile extends EditRecord
{
    protected static string $resource = RoommateProfileResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
