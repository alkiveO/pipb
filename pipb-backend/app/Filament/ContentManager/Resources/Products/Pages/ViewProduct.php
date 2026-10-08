<?php

namespace App\Filament\ContentManager\Resources\Products\Pages;

use App\Filament\ContentManager\Resources\Products\ProductResource;
use App\Models\ProductVote;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Pages\ViewRecord;

class ViewProduct extends ViewRecord
{
    protected static string $resource = ProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('evaluate')
                ->label('Evaluate Product')
                ->icon('heroicon-o-clipboard-document-check')
                ->color('primary')
                ->form([
                    Select::make('design_score')
                        ->label('Design')
                        ->options(
                            collect(range(10, 100))
                                ->mapWithKeys(
                                    fn ($score) => [
                                        $score => (string) $score,
                                    ]
                                )
                                ->toArray()
                        )
                        ->required(),

                    Select::make('usability_score')
                        ->label('Usability')
                        ->options(
                            collect(range(10, 100))
                                ->mapWithKeys(
                                    fn ($score) => [
                                        $score => (string) $score,
                                    ]
                                )
                                ->toArray()
                        )
                        ->required(),

                    Select::make('creativity_score')
                        ->label('Creativity')
                        ->options(
                            collect(range(10, 100))
                                ->mapWithKeys(
                                    fn ($score) => [
                                        $score => (string) $score,
                                    ]
                                )
                                ->toArray()
                        )
                        ->required(),

                    Select::make('content_score')
                        ->label('Content')
                        ->options(
                            collect(range(10, 100))
                                ->mapWithKeys(
                                    fn ($score) => [
                                        $score => (string) $score,
                                    ]
                                )
                                ->toArray()
                        )
                        ->required(),

                    Textarea::make('feedback')
                        ->label('Review / Feedback')
                        ->required()
                        ->rows(5),
                ])
                ->action(function (array $data): void {
                    $overallScore = (
                        $data['design_score'] +
                        $data['usability_score'] +
                        $data['creativity_score'] +
                        $data['content_score']
                    ) / 4;

                    ProductVote::updateOrCreate(
                        [
                            'product_id' => $this->record->id,
                            'content_manager_id' => auth()->id(),
                        ],
                        [
                            'score' => round($overallScore),
                            'design_score' => $data['design_score'],
                            'usability_score' => $data['usability_score'],
                            'creativity_score' => $data['creativity_score'],
                            'content_score' => $data['content_score'],
                            'overall_score' => $overallScore,
                            'feedback' => $data['feedback'],
                        ]
                    );
                })
                ->successNotificationTitle(
                    'Evaluasi produk berhasil disimpan.'
                ),

            EditAction::make(),
        ];
    }
}