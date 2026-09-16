<?php

namespace App\Http\Controllers;

use App\Models\InventoryTransaction;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\SalesOrder;
use App\Models\Supplier;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalProducts = Product::count();
        $totalSuppliers = Supplier::count();
        $pendingPOs = PurchaseOrder::where('status', 'Pending')->count();
        $totalPOValue = PurchaseOrder::sum('total_amount');
        $totalSOValue = SalesOrder::sum('total_amount');
        $totalSOs = SalesOrder::count();

        // Stok per produk (IN - OUT)
        $stockSummary = Product::select('products.id', 'products.name', 'products.min_stock')
            ->withSum(['inventoryTransactions as stock_in' => function ($q) {
                $q->where('type', 'IN');
            }], 'quantity')
            ->withSum(['inventoryTransactions as stock_out' => function ($q) {
                $q->where('type', 'OUT');
            }], 'quantity')
            ->get()
            ->map(function ($product) {
                $product->current_stock = ($product->stock_in ?? 0) - ($product->stock_out ?? 0);
                $product->is_low_stock = $product->current_stock <= $product->min_stock;

                return $product;
            });

        $lowStockCount = $stockSummary->where('is_low_stock', true)->count();

        // Transaksi terakhir
        $recentTransactions = InventoryTransaction::with('product')
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Dashboard', [
            'metrics' => [
                'total_products' => $totalProducts,
                'total_suppliers' => $totalSuppliers,
                'pending_pos' => $pendingPOs,
                'total_po_value' => $totalPOValue,
                'total_so_value' => $totalSOValue,
                'total_sos' => $totalSOs,
                'low_stock_count' => $lowStockCount,
            ],
            'stockSummary' => $stockSummary,
            'recentTransactions' => $recentTransactions,
        ]);
    }
}
