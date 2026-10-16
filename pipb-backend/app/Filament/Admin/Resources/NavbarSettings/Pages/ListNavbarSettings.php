<?php

namespace App\Filament\Admin\Resources\NavbarSettings\Pages;

use App\Filament\Admin\Resources\NavbarSettings\NavbarSettingResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListNavbarSettings extends ListRecords
{
    protected static string $resource = NavbarSettingResource::class;

    protected function getHeaderActions(): array
    {
        return NavbarSettingResource::canCreate()
            ? [
                CreateAction::make()
                    ->label('Tambah Pengaturan'),
            ]
            : [];
    }
}