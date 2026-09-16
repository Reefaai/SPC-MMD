<?php

namespace App\Http\Controllers;

use App\Models\InventoryTransaction;
use App\Models\PurchaseOrder;
use App\Models\SalesOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/Index');
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
