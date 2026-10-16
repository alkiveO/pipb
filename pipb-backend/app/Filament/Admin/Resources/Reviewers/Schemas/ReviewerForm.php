<?php

namespace App\Filament\Admin\Resources\Reviewers\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ReviewerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Nama Reviewer')
                    ->required()
                    ->maxLength(255),

                TextInput::make('role')
                    ->label('Jabatan')
                    ->required()
                    ->maxLength(255),

                FileUpload::make('photo')
                    ->label('Foto Reviewer')
                    ->image()
                    ->disk('public')
                    ->directory('reviewers')
                    ->visibility('public')
                    ->imageEditor()
                    ->maxSize(2048)
                    ->nullable()
                    ->columnSpanFull(),

                TextInput::make('order')
                    ->label('Urutan Tampil')
                    ->numeric()
                    ->integer()
                    ->minValue(1)
                    ->default(1)
                    ->required(),
            ]);
    }
}