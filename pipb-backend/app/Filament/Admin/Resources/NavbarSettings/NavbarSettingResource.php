<?php

namespace App\Filament\Admin\Resources\NavbarSettings;

use App\Filament\Admin\Resources\NavbarSettings\Pages\CreateNavbarSetting;
use App\Filament\Admin\Resources\NavbarSettings\Pages\EditNavbarSetting;
use App\Filament\Admin\Resources\NavbarSettings\Pages\ListNavbarSettings;
use App\Filament\Admin\Resources\NavbarSettings\Schemas\NavbarSettingForm;
use App\Filament\Admin\Resources\NavbarSettings\Tables\NavbarSettingsTable;
use App\Models\NavbarSetting;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class NavbarSettingResource extends Resource
{
    protected static ?string $model = NavbarSetting::class;

    protected static string|BackedEnum|null $navigationIcon =
        Heroicon::OutlinedRectangleStack;

    protected static string|UnitEnum|null $navigationGroup =
        'Pengaturan Website';

    protected static ?int $navigationSort = 2;

    protected static ?string $recordTitleAttribute = 'brand_name';

    public static function form(Schema $schema): Schema
    {
        return NavbarSettingForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return NavbarSettingsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListNavbarSettings::route('/'),
            'create' => CreateNavbarSetting::route('/create'),
            'edit' => EditNavbarSetting::route('/{record}/edit'),
        ];
    }
}