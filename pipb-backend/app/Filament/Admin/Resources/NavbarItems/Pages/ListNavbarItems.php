<?php

namespace App\Filament\Admin\Resources\NavbarItems\Pages;

use App\Filament\Admin\Resources\NavbarItems\NavbarItemResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListNavbarItems extends ListRecords
{
    protected static string $resource = NavbarItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
