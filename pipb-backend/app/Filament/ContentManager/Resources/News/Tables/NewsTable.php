<?php

namespace App\Filament\ContentManager\Resources\News\Tables;

use Filament\Actions\ActionGroup;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class NewsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')
                    ->label('Poster')
                    ->disk('public')
                    ->square(),

                TextColumn::make('title')
                    ->label('Nama Event')
                    ->searchable()
                    ->sortable()
                    ->wrap(),

                TextColumn::make('event_date')
                    ->label('Tanggal Event')
                    ->date('d M Y')
                    ->sortable()
                    ->placeholder('Belum ditentukan'),

                TextColumn::make('event_time')
                    ->label('Waktu')
                    ->formatStateUsing(
                        fn ($state) => $state
                            ? substr((string) $state, 0, 5)
                            : null
                    )
                    ->placeholder('Belum ditentukan'),

                TextColumn::make('location')
                    ->label('Lokasi')
                    ->searchable()
                    ->placeholder('Belum ditentukan')
                    ->wrap(),

                TextColumn::make('admin.name')
                    ->label('Dibuat Oleh')
                    ->searchable(),

                TextColumn::make('created_at')
                    ->label('Tanggal Dibuat')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('event_date', 'desc')
            ->recordActions([
                ActionGroup::make([
                    EditAction::make(),
                    DeleteAction::make(),
                ]),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}