<?php

namespace App\Filament\Admin\Resources\FooterSettings\Pages;

use App\Filament\Admin\Resources\FooterSettings\FooterSettingResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditFooterSetting extends EditRecord
{
    protected static string $resource = FooterSettingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
