<?php

namespace App\Filament\Admin\Resources\Categories\Tables;

use App\Models\Category;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection;

class CategoriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),

                TextColumn::make('name')
                    ->label('Nama Kategori')
                    ->searchable()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),

                EditAction::make(),

                DeleteAction::make()
                    ->before(function (Category $record, DeleteAction $action) {
                        if ($record->products()->exists()) {
                            Notification::make()
                                ->title('Kategori tidak dapat dihapus')
                                ->body('Kategori ini masih digunakan oleh produk.')
                                ->danger()
                                ->send();

                            $action->cancel();
                        }
                    }),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()
                        ->before(function (Collection $records, DeleteBulkAction $action) {
                            foreach ($records as $record) {
                                if ($record->products()->exists()) {
                                    Notification::make()
                                        ->title('Kategori tidak dapat dihapus')
                                        ->body('Salah satu kategori yang dipilih masih digunakan oleh produk.')
                                        ->danger()
                                        ->send();

                                    $action->cancel();

                                    return;
                                }
                            }
                        }),
                ]),
            ]);
    }
}
