<?php

namespace App\Filament\Admin\Resources\NavbarSettings\Pages;

use App\Filament\Admin\Resources\NavbarSettings\NavbarSettingResource;
use App\Models\NavbarSetting;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;

class CreateNavbarSetting extends CreateRecord
{
    protected static string $resource = NavbarSettingResource::class;

    protected function handleRecordCreation(array $data): Model
    {
        return NavbarSetting::query()->firstOrCreate(
            [],
            $data,
        );
    }
}