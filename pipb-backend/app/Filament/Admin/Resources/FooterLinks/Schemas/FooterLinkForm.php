<?php

namespace App\Filament\Admin\Resources\FooterLinks\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class FooterLinkForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('section_title')
                ->label('Judul Bagian')
                ->placeholder('Contoh: Navigasi atau Akun')
                ->required()
                ->maxLength(100),

            TextInput::make('label')
                ->label('Nama Link')
                ->placeholder('Contoh: Produk')
                ->required()
                ->maxLength(100),

            TextInput::make('href')
                ->label('Link Tujuan')
                ->placeholder('Contoh: #produk atau /login')
                ->required()
                ->maxLength(255),

            TextInput::make('sort_order')
                ->label('Urutan Link')
                ->numeric()
                ->integer()
                ->default(0)
                ->required(),

            Toggle::make('is_visible')
                ->label('Tampilkan Link')
                ->default(true)
                ->required(),
        ]);
    }
}