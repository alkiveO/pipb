<?php

namespace App\Filament\Admin\Resources\Abouts;

use App\Models\About;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class AboutResource extends Resource
{
    protected static ?string $model = About::class;

    protected static string|BackedEnum|null $navigationIcon =
        'heroicon-o-information-circle';

    protected static ?string $navigationLabel = 'About';

    protected static ?string $modelLabel = 'About';

    protected static ?string $pluralModelLabel = 'About';

    protected static ?string $slug = 'abouts';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('title')
                ->label('Judul About')
                ->required()
                ->maxLength(255),

            Textarea::make('description')
                ->label('Deskripsi About')
                ->required()
                ->rows(6)
                ->columnSpanFull(),

            FileUpload::make('image')
                ->label('Gambar About')
                ->image()
                ->disk('public')
                ->directory('abouts')
                ->visibility('public')
                ->imagePreviewHeight('250')
                ->maxSize(5120)
                ->nullable()
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->label('Judul')
                    ->searchable(),

                ImageColumn::make('image')
                    ->label('Gambar')
                    ->disk('public'),

                TextColumn::make('updated_at')
                    ->label('Terakhir Diperbarui')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->defaultSort('updated_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAbouts::route('/'),
            'create' => Pages\CreateAbout::route('/create'),
            'edit' => Pages\EditAbout::route('/{record}/edit'),
        ];
    }
}