<?php

namespace App\Filament\ContentManager\Resources\Products\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class ProductInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('user.name')
                    ->label('User'),
                TextEntry::make('category.name')
                    ->label('Category'),
                TextEntry::make('name'),
                TextEntry::make('description')
                    ->columnSpanFull(),
                TextEntry::make('target_fund')
                    ->numeric(),
                TextEntry::make('investment_amount')
                    ->numeric(),
                TextEntry::make('launch_date')
                    ->date()
                    ->placeholder('-'),
                TextEntry::make('approval_status')
                    ->badge(),
                TextEntry::make('launch_status')
                    ->badge(),
                TextEntry::make('rejection_reason')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
