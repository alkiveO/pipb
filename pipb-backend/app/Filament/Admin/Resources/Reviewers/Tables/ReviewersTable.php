<?php

namespace App\Filament\Admin\Resources\Reviewers\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ReviewersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('order')
            ->columns([
                TextColumn::make('order')
                    ->label('Urutan')
                    ->sortable(),

                TextColumn::make('name')
                    ->label('Nama Reviewer')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('role')
                    ->label('Jabatan')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('updated_at')
                    ->label('Terakhir Diperbarui')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}