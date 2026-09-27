<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Models\User;
use App\Notifications\LowStockAlert;
use Illuminate\Console\Command;

class CheckLowStock extends Command
{
    protected $signature = 'stock:check-low';

    protected $description = 'Periksa stok produk dan kirim notifikasi ke Admin jika ada yang menipis';

    public function handle(): int
    {
        $products = Product::withSum(['inventoryTransactions as stock_in' => fn ($q) => $q->where('type', 'IN')], 'quantity')
            ->withSum(['inventoryTransactions as stock_out' => fn ($q) => $q->where('type', 'OUT')], 'quantity')
            ->get();

        $admins = User::whereHas('role', fn ($q) => $q->where('name', 'Admin'))->get();

        if ($admins->isEmpty()) {
            $this->warn('Tidak ada Admin untuk dikirim notifikasi.');

            return self::SUCCESS;
        }

        $notifiedCount = 0;

        foreach ($products as $product) {
            $currentStock = ($product->stock_in ?? 0) - ($product->stock_out ?? 0);

            if ($currentStock > $product->min_stock) {
                continue;
            }

            foreach ($admins as $admin) {
                // Hindari duplikasi: cek jika notifikasi belum dibaca untuk produk ini
                $alreadyNotified = $admin->unreadNotifications()
                    ->whereJsonContains('data->product_id', $product->id)
                    ->exists();

                if ($alreadyNotified) {
                    continue;
                }

                $admin->notify(new LowStockAlert($product, $currentStock));
                $notifiedCount++;
            }
        }

        $this->info("Selesai. {$notifiedCount} notifikasi low stock dikirim.");

        return self::SUCCESS;
    }
}
