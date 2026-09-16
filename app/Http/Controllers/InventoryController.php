<?php

namespace App\Http\Controllers;

use App\Models\InventoryTransaction;
use App\Models\Product;
use App\Models\Warehouse;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index()
    {
        $warehouses = Warehouse::orderBy('name')->get();
        $products = Product::orderBy('name')->get();

        // Hitung stok per produk per gudang
        $stockMatrix = [];

        foreach ($products as $product) {
            $row = [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'unit' => $product->unit,
                'min_stock' => $product->min_stock,
                'total_stock' => 0,
                'warehouses' => [],
            ];

            foreach ($warehouses as $warehouse) {
                $stockIn = InventoryTransaction::where('product_id', $product->id)
                    ->where('warehouse_id', $warehouse->id)
                    ->where('type', 'IN')
                    ->sum('quantity');

                $stockOut = InventoryTransaction::where('product_id', $product->id)
                    ->where('warehouse_id', $warehouse->id)
                    ->where('type', 'OUT')
                    ->sum('quantity');

                $stock = $stockIn - $stockOut;
                $row['warehouses'][$warehouse->id] = $stock;
                $row['total_stock'] += $stock;
            }

            $row['is_low_stock'] = $row['total_stock'] <= $product->min_stock;
            $stockMatrix[] = $row;
        }

        return Inertia::render('Inventory/Index', [
            'warehouses' => $warehouses,
            'stockMatrix' => $stockMatrix,
        ]);
    }
}
