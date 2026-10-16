<?php

namespace App\Filament\Admin\Resources\FooterLinks;

use App\Filament\Admin\Resources\FooterLinks\Pages\CreateFooterLink;
use App\Filament\Admin\Resources\FooterLinks\Pages\EditFooterLink;
use App\Filament\Admin\Resources\FooterLinks\Pages\ListFooterLinks;
use App\Filament\Admin\Resources\FooterLinks\Schemas\FooterLinkForm;
use App\Filament\Admin\Resources\FooterLinks\Tables\FooterLinksTable;
use App\Models\FooterLink;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class FooterLinkResource extends Resource
{
    protected static ?string $model = FooterLink::class;

    protected static string|BackedEnum|null $navigationIcon =
        Heroicon::OutlinedRectangleStack;

    protected static ?string $navigationLabel = 'Footer';

    protected static string|UnitEnum|null $navigationGroup =
        'Pengaturan Website';

    protected static ?int $navigationSort = 2;

    protected static ?string $recordTitleAttribute = 'label';

    public static function form(Schema $schema): Schema
    {
        return FooterLinkForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FooterLinksTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFooterLinks::route('/'),
            'create' => CreateFooterLink::route('/create'),
            'edit' => EditFooterLink::route('/{record}/edit'),
        ];
    }
}