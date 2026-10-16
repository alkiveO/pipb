<?php

namespace App\Filament\Admin\Resources\FooterSettings\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class FooterSettingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Bagian Kiri — Identitas dan Logo')
                ->description('Atur logo dan identitas PIPB.')
                ->schema([
                    TextInput::make('brand_name')
                        ->label('Nama Brand')
                        ->required()
                        ->maxLength(255),

                    FileUpload::make('logo_path')
                        ->label('Logo PIPB')
                        ->image()
                        ->disk('public')
                        ->directory('footer')
                        ->visibility('public')
                        ->imagePreviewHeight('120')
                        ->maxSize(2048),

                    Textarea::make('description')
                        ->label('Deskripsi')
                        ->rows(3),

                    TextInput::make('institution_name')
                        ->label('Nama Institusi')
                        ->maxLength(255),
                ])
                ->columns(2),

            Section::make('Bagian Bawah Kiri — Copyright')
                ->schema([
                    TextInput::make('copyright_text')
                        ->label('Teks Copyright')
                        ->placeholder('All rights reserved.')
                        ->maxLength(255),

                    Toggle::make('use_current_year')
                        ->label('Gunakan Tahun Otomatis')
                        ->default(true)
                        ->live(),

                    TextInput::make('copyright_year')
                        ->label('Tahun Copyright')
                        ->numeric()
                        ->integer()
                        ->minValue(2000)
                        ->maxValue(2100)
                        ->visible(fn ($get): bool => ! $get('use_current_year')),
                ])
                ->columns(2),

            Section::make('Bagian Bawah Kanan — Kembali ke Atas')
                ->schema([
                    TextInput::make('back_to_top_label')
                        ->label('Tulisan Tombol')
                        ->required()
                        ->default('Kembali ke atas ↑')
                        ->maxLength(100),

                    TextInput::make('back_to_top_href')
                        ->label('Link Tujuan')
                        ->required()
                        ->default('#home')
                        ->maxLength(255),

                    Toggle::make('show_back_to_top')
                        ->label('Tampilkan Tombol')
                        ->default(true),
                ])
                ->columns(2),
        ]);
    }
}