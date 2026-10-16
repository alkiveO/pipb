<?php

namespace App\Filament\Admin\Resources\HowItWorks\Pages;

use App\Filament\Admin\Resources\HowItWorks\HowItWorksResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditHowItWorks extends EditRecord
{
    protected static string $resource = HowItWorksResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
