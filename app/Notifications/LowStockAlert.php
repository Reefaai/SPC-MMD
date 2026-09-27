<?php

namespace App\Notifications;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class LowStockAlert extends Notification
{
    use Queueable;

    public function __construct(
        public readonly Product $product,
        public readonly int $currentStock
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'product_sku' => $this->product->sku,
            'current_stock' => $this->currentStock,
            'min_stock' => $this->product->min_stock,
            'message' => "Stok produk \"{$this->product->name}\" menipis. Sisa: {$this->currentStock}, Minimum: {$this->product->min_stock}.",
        ];
    }
}
