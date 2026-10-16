<?php

namespace App\Filament\Admin\Resources\FooterSettings\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class FooterSettingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('brand_name')
                    ->label('Nama Brand')
                    ->searchable()
                    ->sortable(),

                ImageColumn::make('logo_path')
                    ->label('Logo')
                    ->disk('public')
                    ->height(45),

                TextColumn::make('institution_name')
                    ->label('Institusi')
                    ->searchable()
                    ->limit(35),

                TextColumn::make('copyright_year')
                    ->label('Tahun Copyright')
                    ->state(fn ($record) => $record->use_current_year
                        ? now()->year
                        : $record->copyright_year
                    ),

                IconColumn::make('show_back_to_top')
                    ->label('Tombol Kembali ke Atas')
                    ->boolean(),

                TextColumn::make('updated_at')
                    ->label('Terakhir Diubah')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
            ])
            ->defaultSort('updated_at', 'desc')
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
}