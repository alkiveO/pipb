<?php

namespace App\Filament\Admin\Resources\Reviewers\Pages;

use App\Filament\Admin\Resources\Reviewers\ReviewerResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditReviewer extends EditRecord
{
    protected static string $resource = ReviewerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
