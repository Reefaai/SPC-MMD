<?php

namespace App\Http\Controllers;

use App\Models\InventoryTransaction;
use App\Models\PurchaseOrder;
use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        // Revenue per bulan (6 bulan terakhir)
        $months = collect(range(5, 0))->map(fn ($i) => now()->subMonths($i));

        $monthlyPO = $months->map(fn ($m) => [
            'label' => $m->translatedFormat('M Y'),
            'value' => (float) PurchaseOrder::whereYear('date', $m->year)
                ->whereMonth('date', $m->month)
                ->sum('total_amount'),
        ])->values();

        $monthlySO = $months->map(fn ($m) => [
            'label' => $m->translatedFormat('M Y'),
            'value' => (float) SalesOrder::whereYear('date', $m->year)
                ->whereMonth('date', $m->month)
                ->sum('total_amount'),
        ])->values();

        // Top 5 produk terlaris (dari sales_order_items)
        $topProducts = SalesOrderItem::selectRaw('product_id, SUM(quantity) as total_qty, SUM(subtotal) as total_revenue')
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->take(5)
            ->with('product:id,name,sku')
            ->get()
            ->map(fn ($item) => [
                'name' => $item->product?->name ?? '—',
                'sku' => $item->product?->sku ?? '—',
                'total_qty' => (int) $item->total_qty,
                'total_revenue' => (float) $item->total_revenue,
            ]);

        // Top 5 supplier by nilai PO
        $topSuppliers = PurchaseOrder::selectRaw('supplier_id, SUM(total_amount) as total_value, COUNT(*) as po_count')
            ->groupBy('supplier_id')
            ->orderByDesc('total_value')
            ->take(5)
            ->with('supplier:id,name')
            ->get()
            ->map(fn ($po) => [
                'name' => $po->supplier?->name ?? '—',
                'total_value' => (float) $po->total_value,
                'po_count' => (int) $po->po_count,
            ]);

        // Summary cards
        $currentMonth = now();
        $lastMonth = now()->subMonth();

        $summary = [
            'total_po_this_month' => (float) PurchaseOrder::whereYear('date', $currentMonth->year)->whereMonth('date', $currentMonth->month)->sum('total_amount'),
            'total_so_this_month' => (float) SalesOrder::whereYear('date', $currentMonth->year)->whereMonth('date', $currentMonth->month)->sum('total_amount'),
            'total_po_last_month' => (float) PurchaseOrder::whereYear('date', $lastMonth->year)->whereMonth('date', $lastMonth->month)->sum('total_amount'),
            'total_so_last_month' => (float) SalesOrder::whereYear('date', $lastMonth->year)->whereMonth('date', $lastMonth->month)->sum('total_amount'),
            'total_po_all' => (float) PurchaseOrder::sum('total_amount'),
            'total_so_all' => (float) SalesOrder::sum('total_amount'),
        ];

        return Inertia::render('Reports/Index', [
            'monthlyPO' => $monthlyPO,
            'monthlySO' => $monthlySO,
            'topProducts' => $topProducts,
            'topSuppliers' => $topSuppliers,
            'summary' => $summary,
        ]);
    }

    public function export(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:purchase_orders,sales_orders,inventory',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        $type = $validated['type'];
        $from = $validated['date_from'] ?? null;
        $to = $validated['date_to'] ?? null;

        $filename = $type.'_report_'.now()->format('Y-m-d').'.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = match ($type) {
            'purchase_orders' => $this->exportPurchaseOrders($from, $to),
            'sales_orders' => $this->exportSalesOrders($from, $to),
            'inventory' => $this->exportInventory(),
        };

        return response()->stream($callback, 200, $headers);
    }

    private function exportPurchaseOrders(?string $from, ?string $to): \Closure
    {
        return function () use ($from, $to) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['No. PO', 'Supplier', 'Tanggal', 'Status', 'Total Amount']);

            $query = PurchaseOrder::with('supplier');
            if ($from) {
                $query->whereDate('date', '>=', $from);
            }
            if ($to) {
                $query->whereDate('date', '<=', $to);
            }

            foreach ($query->get() as $po) {
                fputcsv($handle, [
                    'PO-'.str_pad($po->id, 4, '0', STR_PAD_LEFT),
                    $po->supplier?->name ?? '-',
                    $po->date,
                    $po->status,
                    $po->total_amount,
                ]);
            }

            fclose($handle);
        };
    }

    private function exportSalesOrders(?string $from, ?string $to): \Closure
    {
        return function () use ($from, $to) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['No. SO', 'Pelanggan', 'Tanggal', 'Status', 'Total Amount']);

            $query = SalesOrder::query();
            if ($from) {
                $query->whereDate('date', '>=', $from);
            }
            if ($to) {
                $query->whereDate('date', '<=', $to);
            }

            foreach ($query->get() as $so) {
                fputcsv($handle, [
                    'SO-'.str_pad($so->id, 4, '0', STR_PAD_LEFT),
                    $so->customer_name,
                    $so->date,
                    $so->status,
                    $so->total_amount,
                ]);
            }

            fclose($handle);
        };
    }

    private function exportInventory(): \Closure
    {
        return function () {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Produk', 'SKU', 'Tipe', 'Qty', 'Gudang', 'Tanggal']);

            foreach (InventoryTransaction::with('product', 'warehouse')->latest()->get() as $trx) {
                fputcsv($handle, [
                    $trx->product?->name ?? '-',
                    $trx->product?->sku ?? '-',
                    $trx->type,
                    $trx->quantity,
                    $trx->warehouse?->name ?? '-',
                    $trx->date,
                ]);
            }

            fclose($handle);
        };
    }
}
