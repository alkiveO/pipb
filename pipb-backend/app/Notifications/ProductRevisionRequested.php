<?php

namespace App\Notifications;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Notification;

class ProductRevisionRequested extends Notification
{
    use Queueable;

    public function __construct(
        public Product $product
    ) {
    }

    /**
     * Tentukan channel notification.
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Data notification yang disimpan ke database.
     */
    public function toDatabase(object $notifiable): DatabaseMessage
    {
        return new DatabaseMessage([
            'type' => 'product_revision_requested',
            'title' => 'Produk Membutuhkan Revisi',
            'message' => 'Produk "' . $this->product->name . '" membutuhkan revisi sebelum dapat diproses kembali.',
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'feedback' => $this->product->rejection_reason,
            'status' => $this->product->approval_status,
        ]);
    }
}