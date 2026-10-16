<?php

namespace App\Notifications;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Notification;

class ProductRejected extends Notification
{
    use Queueable;

    public function __construct(
        public Product $product
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): DatabaseMessage
    {
        return new DatabaseMessage([
            'type' => 'product_rejected',
            'title' => 'Produk Ditolak',
            'message' => 'Produk "' . $this->product->name . '" ditolak dan belum dapat dipublikasikan.',
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'feedback' => $this->product->rejection_reason,
            'status' => $this->product->approval_status,
        ]);
    }
}