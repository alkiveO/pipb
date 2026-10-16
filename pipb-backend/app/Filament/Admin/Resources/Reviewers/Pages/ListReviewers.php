<?php

namespace App\Filament\Admin\Resources\Reviewers\Pages;

use App\Filament\Admin\Resources\Reviewers\ReviewerResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListReviewers extends ListRecords
{
    protected static string $resource = ReviewerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
