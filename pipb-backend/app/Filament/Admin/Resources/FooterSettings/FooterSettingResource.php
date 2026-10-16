<?php

namespace App\Filament\Admin\Resources\FooterSettings;

use App\Filament\Admin\Resources\FooterSettings\Pages\CreateFooterSetting;
use App\Filament\Admin\Resources\FooterSettings\Pages\EditFooterSetting;
use App\Filament\Admin\Resources\FooterSettings\Pages\ListFooterSettings;
use App\Filament\Admin\Resources\FooterSettings\Schemas\FooterSettingForm;
use App\Filament\Admin\Resources\FooterSettings\Tables\FooterSettingsTable;
use App\Models\FooterSetting;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class FooterSettingResource extends Resource
{
    protected static ?string $model = FooterSetting::class;

    protected static string|BackedEnum|null $navigationIcon =
        Heroicon::OutlinedRectangleStack;

    protected static ?string $navigationLabel = 'Pengaturan Footer';

    protected static string|UnitEnum|null $navigationGroup =
        'Pengaturan Website';

    protected static ?int $navigationSort = 3;

    protected static ?string $recordTitleAttribute = 'brand_name';

    public static function form(Schema $schema): Schema
    {
        return FooterSettingForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FooterSettingsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFooterSettings::route('/'),
            'create' => CreateFooterSetting::route('/create'),
            'edit' => EditFooterSetting::route('/{record}/edit'),
        ];
    }
}