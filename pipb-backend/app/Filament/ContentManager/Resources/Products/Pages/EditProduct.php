<?php

namespace App\Filament\ContentManager\Resources\Products\Pages;

use App\Filament\ContentManager\Resources\Products\ProductResource;
use App\Notifications\ProductApproved;
use App\Notifications\ProductRejected;
use App\Notifications\ProductRevisionRequested;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditProduct extends EditRecord
{
    protected static string $resource = ProductResource::class;

    protected ?string $previousApprovalStatus = null;

    protected function beforeSave(): void
    {
        // Simpan status sebelum perubahan dilakukan.
        $this->previousApprovalStatus = $this->record
            ->getOriginal('approval_status');
    }

    protected function afterSave(): void
    {
        // Ambil data produk terbaru beserta pemiliknya.
        $product = $this->record->fresh(['user']);

        if (!$product || !$product->user) {
            return;
        }

        $previousStatus = $this->previousApprovalStatus;
        $currentStatus = $product->approval_status;

        // Tidak mengirim notifikasi jika status tidak berubah.
        if ($previousStatus === $currentStatus) {
            return;
        }

        // Kirim notifikasi sesuai status terbaru.
        switch ($currentStatus) {
            case 'published':
                $product->user->notify(
                    new ProductApproved($product)
                );
                break;

            case 'rejected':
                $product->user->notify(
                    new ProductRejected($product)
                );
                break;

            case 'needs_revision':
                $product->user->notify(
                    new ProductRevisionRequested($product)
                );
                break;
        }
    }

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
