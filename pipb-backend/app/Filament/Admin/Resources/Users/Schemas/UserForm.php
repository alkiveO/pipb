<?php

namespace App\Filament\Admin\Resources\Users\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Nama')
                    ->required()
                    ->maxLength(255),

                TextInput::make('email')
                    ->label('Email')
                    ->email()
                    ->required()
                    ->unique(ignoreRecord: true),

                Select::make('role')
                    ->label('Role')
                    ->options([
                        'admin' => 'Admin',
                        'content_manager' => 'Dosen',
                    ])
                    ->default('content_manager')
                    ->selectablePlaceholder(false)
                    ->required()
                    ->live(),

                TextInput::make('password')
                    ->label('Password Login')
                    ->password()
                    ->revealable()
                    ->minLength(8)
                    ->required(
                        fn (string $operation): bool =>
                            $operation === 'create'
                    )
                    ->dehydrated(
                        fn (?string $state): bool =>
                            filled($state)
                    ),

                TextInput::make('plain_password')
                    ->label('Password Dosen')
                    ->password()
                    ->revealable()
                    ->minLength(8)
                    ->visible(
                        fn ($get): bool =>
                            $get('role') === 'content_manager'
                    )
                    ->required(
                        fn (string $operation, $get): bool =>
                            $operation === 'create'
                            && $get('role') === 'content_manager'
                    )
                    ->dehydrated(
                        fn ($get, ?string $state): bool =>
                            $get('role') === 'content_manager'
                            && filled($state)
                    ),

                DateTimePicker::make('email_verified_at')
                    ->label('Email Verified At')
                    ->nullable(),
            ]);
    }
}

