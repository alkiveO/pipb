<?php

namespace App\Filament\ContentManager\Resources\Products\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required(),
                Select::make('category_id')
                    ->relationship('category', 'name')
                    ->required(),
                TextInput::make('name')
                    ->required(),
                Textarea::make('description')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('target_fund')
                    ->required()
                    ->numeric()
                    ->default(0.0),
                TextInput::make('investment_amount')
                    ->required()
                    ->numeric()
                    ->default(0.0),
                DatePicker::make('launch_date'),
                Select::make('approval_status')
                    ->options([
            'pending_review' => 'Pending review',
            'needs_revision' => 'Needs revision',
            'rejected' => 'Rejected',
            'published' => 'Published',
        ])
                    ->default('pending_review')
                    ->required(),
                Select::make('launch_status')
                    ->options(['belum_launch' => 'Belum launch', 'launch' => 'Launch'])
                    ->default('belum_launch')
                    ->required(),
                Textarea::make('rejection_reason')
                    ->columnSpanFull(),
            ]);
    }
}
