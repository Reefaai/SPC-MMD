<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use App\Models\PurchaseOrder;
use App\Models\InventoryTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReceiptController extends Controller
{
    public function index()
    {
        $receipts = Receipt::with('purchaseOrder', 'warehouse', 'receiver')->latest()->get();
        return Inertia::render('Receipts/Index', [
            'receipts' => $receipts
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity_received' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $receipt = Receipt::create([
                'purchase_order_id' => $validated['purchase_order_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'date' => $validated['date'],
                'status' => 'Completed',
                'received_by' => $request->user()->id,
            ]);

            foreach ($validated['items'] as $item) {
                $receipt->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity_received' => $item['quantity_received'],
                ]);

                // Inventory Transaction Logic for adding stock
                InventoryTransaction::create([
                    'product_id' => $item['product_id'],
                    'warehouse_id' => $validated['warehouse_id'],
                    'type' => 'IN',
                    'quantity' => $item['quantity_received'],
                    'reference_id' => $receipt->id,
                    'reference_type' => Receipt::class,
                    'date' => $validated['date'],
                ]);
            }

            // Update PO status to Completed
            $po = PurchaseOrder::find($validated['purchase_order_id']);
            $po->update(['status' => 'Completed']);
        });

        return redirect()->back()->with('success', 'Receipt created and stock updated successfully.');
    }

    public function show(Receipt $receipt)
    {
        $receipt->load('purchaseOrder', 'warehouse', 'items.product', 'receiver');
        return Inertia::render('Receipts/Show', [
            'receipt' => $receipt
        ]);
    }
}
