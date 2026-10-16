<?php

namespace App\Filament\ContentManager\Resources\News\Pages;

use App\Filament\ContentManager\Resources\News\NewsResource;
use Filament\Resources\Pages\CreateRecord;

class CreateNews extends CreateRecord
{
    protected static string $resource = NewsResource::class;
}
