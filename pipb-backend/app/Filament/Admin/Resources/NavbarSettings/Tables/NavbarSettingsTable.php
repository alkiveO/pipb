<?php

namespace App\Filament\Admin\Resources\NavbarSettings\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class NavbarSettingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('brand_name')
                    ->label('Nama Brand')
                    ->searchable()
                    ->sortable(),

                IconColumn::make('logo_path')
                    ->label('Logo')
                    ->state(fn ($record): bool => filled($record->logo_path))
                    ->boolean(),

                TextColumn::make('updated_at')
                    ->label('Terakhir Diubah')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make()
                    ->label('Edit Pengaturan'),
            ]);
    }
}