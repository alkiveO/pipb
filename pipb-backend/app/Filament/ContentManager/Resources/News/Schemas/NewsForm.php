<?php

namespace App\Filament\ContentManager\Resources\News\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TimePicker;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;

class NewsForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Hidden::make('admin_id')
                    ->default(fn () => Auth::id())
                    ->required(),

                TextInput::make('title')
                    ->label('Nama Event / Judul Berita')
                    ->required()
                    ->maxLength(255)
                    ->columnSpanFull(),

                FileUpload::make('image')
                    ->label('Foto / Poster Event')
                    ->image()
                    ->disk('public')
                    ->directory('news')
                    ->visibility('public')
                    ->imagePreviewHeight('250')
                    ->maxSize(5120)
                    ->nullable()
                    ->columnSpanFull(),

                DatePicker::make('event_date')
                    ->label('Tanggal Event')
                    ->native(false)
                    ->displayFormat('d M Y')
                    ->nullable(),

                TimePicker::make('event_time')
                    ->label('Waktu Event')
                    ->seconds(false)
                    ->nullable(),

                TextInput::make('location')
                    ->label('Lokasi Event')
                    ->placeholder('Contoh: Aula Kampus')
                    ->maxLength(255)
                    ->nullable()
                    ->columnSpanFull(),

                Textarea::make('content')
                    ->label('Deskripsi / Isi Berita')
                    ->required()
                    ->rows(10)
                    ->columnSpanFull(),
            ]);
    }
}