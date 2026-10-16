<?php

namespace App\Filament\Admin\Resources\FooterLinks\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class FooterLinksTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('section_title')
                    ->label('Judul Bagian')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('label')
                    ->label('Nama Link')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('href')
                    ->label('Link Tujuan')
                    ->searchable()
                    ->limit(35),

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
            ->recordActions([
                EditAction::make()->label('Edit'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()->label('Hapus Terpilih'),
                ]),
            ]);
    }
}