<?php

namespace App\Notifications;

use App\Models\Product;
use App\Models\ProductVote;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Notification;

class ProductEvaluated extends Notification
{
    use Queueable;

    public function __construct(
        public Product $product,
        public ProductVote $vote
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): DatabaseMessage
    {
        return new DatabaseMessage([
            'type' => 'product_evaluated',
            'title' => 'Produk Telah Dievaluasi',
            'message' => 'Produk "' . $this->product->name . '" telah mendapatkan penilaian dari Content Manager.',
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'score' => $this->vote->score,
            'feedback' => $this->vote->feedback,
            'status' => $this->product->approval_status,
        ]);
    }
}