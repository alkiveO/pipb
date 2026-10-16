<?php

namespace App\Filament\Admin\Resources\NavbarItems\Pages;

use App\Filament\Admin\Resources\NavbarItems\NavbarItemResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditNavbarItem extends EditRecord
{
    protected static string $resource = NavbarItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
