<?php

namespace App\Filament\Admin\Resources\HowItWorks\Pages;

use App\Filament\Admin\Resources\HowItWorks\HowItWorksResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListHowItWorks extends ListRecords
{
    protected static string $resource = HowItWorksResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
