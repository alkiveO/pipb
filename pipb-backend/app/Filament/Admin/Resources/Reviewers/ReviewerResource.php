<?php

namespace App\Filament\Admin\Resources\Reviewers;

use App\Filament\Admin\Resources\Reviewers\Pages\CreateReviewer;
use App\Filament\Admin\Resources\Reviewers\Pages\EditReviewer;
use App\Filament\Admin\Resources\Reviewers\Pages\ListReviewers;
use App\Filament\Admin\Resources\Reviewers\Schemas\ReviewerForm;
use App\Filament\Admin\Resources\Reviewers\Tables\ReviewersTable;
use App\Models\Reviewer;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ReviewerResource extends Resource
{
    protected static ?string $model = Reviewer::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return ReviewerForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ReviewersTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListReviewers::route('/'),
            'create' => CreateReviewer::route('/create'),
            'edit' => EditReviewer::route('/{record}/edit'),
        ];
    }
}
