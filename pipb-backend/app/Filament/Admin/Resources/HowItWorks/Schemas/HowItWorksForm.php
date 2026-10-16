<?php

namespace App\Filament\Admin\Resources\HowItWorks\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class HowItWorksForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('number')
                    ->label('Nomor Urutan')
                    ->numeric()
                    ->integer()
                    ->minValue(1)
                    ->required()
                    ->unique(ignoreRecord: true),

                TextInput::make('title')
                    ->label('Judul Langkah')
                    ->required()
                    ->maxLength(255),

                Textarea::make('description')
                    ->label('Deskripsi Langkah')
                    ->required()
                    ->rows(4)
                    ->columnSpanFull(),
            ]);
    }
}