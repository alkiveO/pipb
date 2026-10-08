<?php

namespace App\Filament\ContentManager\Resources\Products\Pages;

use App\Filament\ContentManager\Resources\Products\ProductResource;
use Filament\Resources\Pages\CreateRecord;

class CreateProduct extends CreateRecord
{
    protected static string $resource = ProductResource::class;
}
