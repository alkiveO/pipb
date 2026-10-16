<?php

namespace App\Filament\ContentManager\Resources\News\Pages;

use App\Filament\ContentManager\Resources\News\NewsResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListNews extends ListRecords
{
    protected static string $resource = NewsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
