<?php

namespace App\Filament\Admin\Resources\NavbarSettings\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class NavbarSettingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Pengaturan Navbar')
                ->description('Atur nama brand dan logo yang tampil di navbar website.')
                ->schema([
                    TextInput::make('brand_name')
                        ->label('Nama Brand')
                        ->required()
                        ->default('PIPB')
                        ->maxLength(100),

                    FileUpload::make('logo_path')
                        ->label('Logo Navbar')
                        ->image()
                        ->disk('public')
                        ->directory('navbar')
                        ->visibility('public')
                        ->imagePreviewHeight('100')
                        ->maxSize(2048)
                        ->helperText('Format gambar JPG, PNG, atau WebP. Maksimal 2 MB.')
                        ->nullable(),
                ])
                ->columns(1),
        ]);
    }
}