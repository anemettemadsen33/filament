<?php

namespace App\Filament\Resources\RoommateProfiles\Pages;

use App\Filament\Resources\RoommateProfiles\RoommateProfileResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListRoommateProfiles extends ListRecords
{
    protected static string $resource = RoommateProfileResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
