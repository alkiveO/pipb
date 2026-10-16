<?php

namespace App\Filament\Admin\Resources\Reviewers\Pages;

use App\Filament\Admin\Resources\Reviewers\ReviewerResource;
use Filament\Resources\Pages\CreateRecord;

class CreateReviewer extends CreateRecord
{
    protected static string $resource = ReviewerResource::class;
}
