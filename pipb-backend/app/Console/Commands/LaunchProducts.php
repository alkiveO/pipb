<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;

class LaunchProducts extends Command
{
    protected $signature = 'products:launch';

    protected $description = 'Mengubah status produk menjadi launch berdasarkan launch date';

    public function handle()
    {
        $products = Product::where('approval_status', 'approved')
            ->where('launch_status', 'belum_launch')
            ->whereNotNull('launch_date')
            ->whereDate('launch_date', '<=', now())
            ->get();

        foreach ($products as $product) {
            $product->update([
                'launch_status' => 'launch',
            ]);
        }

        $this->info(
            $products->count() . ' produk berhasil di-launch.'
        );

        return Command::SUCCESS;
    }
}