<?php

namespace App\Filament\Admin\Resources\NavbarItems;

use App\Filament\Admin\Resources\NavbarItems\Pages;
use App\Models\NavbarItem;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class NavbarItemResource extends Resource
{
    protected static ?string $model = NavbarItem::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBars3;

    protected static string|UnitEnum|null $navigationGroup = 'Pengaturan Website';

    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'label';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('label')
                ->label('Nama Menu')
                ->required()
                ->maxLength(100),

            TextInput::make('href')
                ->label('Link Tujuan')
                ->required()
                ->maxLength(255)
                ->placeholder('#tentang'),

            Select::make('type')
                ->label('Jenis Menu')
                ->options([
                    'link' => 'Menu Biasa',
                    'cta' => 'Tombol CTA',
                ])
                ->default('link')
                ->required(),

            TextInput::make('sort_order')
                ->label('Urutan Menu')
                ->numeric()
                ->integer()
                ->default(0)
                ->required(),

            Toggle::make('is_visible')
                ->label('Tampilkan Menu')
                ->default(true)
                ->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('label')
                    ->label('Nama Menu')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('href')
                    ->label('Link Tujuan')
                    ->searchable()
                    ->limit(35),

                TextColumn::make('type')
                    ->label('Jenis Menu')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'cta' => 'success',
                        default => 'gray',
                    }),

                TextColumn::make('sort_order')
                    ->label('Urutan')
                    ->sortable(),

                IconColumn::make('is_visible')
                    ->label('Ditampilkan')
                    ->boolean(),

                TextColumn::make('updated_at')
                    ->label('Terakhir Diubah')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->recordActions([
                EditAction::make()
                    ->label('Edit'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()
                        ->label('Hapus Terpilih'),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNavbarItems::route('/'),
            'create' => Pages\CreateNavbarItem::route('/create'),
            'edit' => Pages\EditNavbarItem::route('/{record}/edit'),
        ];
    }
}