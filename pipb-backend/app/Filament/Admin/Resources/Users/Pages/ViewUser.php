<?php

namespace App\Filament\Admin\Resources\Users\Pages;

use App\Filament\Admin\Resources\Users\UserResource;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Support\Facades\Hash;

class ViewUser extends ViewRecord
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('resetPassword')
                ->label('Reset Password Dosen')
                ->icon('heroicon-o-key')
                ->color('warning')
                ->visible(
                    fn (): bool =>
                        $this->record->role === 'content_manager'
                )
                ->form([
                    TextInput::make('password')
                        ->label('Password Baru')
                        ->password()
                        ->revealable()
                        ->required()
                        ->minLength(8)
                        ->confirmed(),

                    TextInput::make('password_confirmation')
                        ->label('Konfirmasi Password')
                        ->password()
                        ->revealable()
                        ->required(),
                ])
                ->action(function (array $data): void {
                    $this->record->update([
                        'password' => Hash::make(
                            $data['password']
                        ),
                    ]);
                })
                ->successNotificationTitle(
                    'Password Dosen berhasil diubah.'
                ),

            EditAction::make(),
        ];
    }
}