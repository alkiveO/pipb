<?php

namespace App\Filament\Admin\Resources\FooterSettings\Pages;

use App\Filament\Admin\Resources\FooterSettings\FooterSettingResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFooterSettings extends ListRecords
{
    protected static string $resource = FooterSettingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
