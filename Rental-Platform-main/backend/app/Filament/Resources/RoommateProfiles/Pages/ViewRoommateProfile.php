<?php

namespace App\Filament\Resources\RoommateProfiles\Pages;

use App\Filament\Resources\RoommateProfiles\RoommateProfileResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewRoommateProfile extends ViewRecord
{
    protected static string $resource = RoommateProfileResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
