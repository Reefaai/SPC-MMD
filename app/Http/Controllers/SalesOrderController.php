<?php

namespace App\Http\Controllers;

use App\Models\SalesOrder;
use App\Models\Product;
use App\Models\InventoryTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SalesOrderController extends Controller
{
    public function index()
    {
        $orders = SalesOrder::with('creator')->latest()->get();
        return Inertia::render('SalesOrders/Index', [
            'salesOrders' => $orders
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'date' => 'required|date',
            'warehouse_id' => 'required|exists:warehouses,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $so = SalesOrder::create([
                'customer_name' => $validated['customer_name'],
                'date' => $validated['date'],
                'status' => 'Completed', // For MVP, assume it fulfills immediately
                'created_by' => $request->user()->id,
                'total_amount' => 0,
            ]);

            $totalAmount = 0;

            foreach ($validated['items'] as $item) {
                // Harga Snapshot: get price
                $product = Product::find($item['product_id']);
                $subtotal = $product->price * $item['quantity'];

                $so->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'subtotal' => $subtotal,
                ]);

                // Inventory Transaction Logic for deducting stock (Shipment)
                InventoryTransaction::create([
                    'product_id' => $item['product_id'],
                    'warehouse_id' => $validated['warehouse_id'],
                    'type' => 'OUT',
                    'quantity' => $item['quantity'],
                    'reference_id' => $so->id,
                    'reference_type' => SalesOrder::class,
                    'date' => $validated['date'],
                ]);

                $totalAmount += $subtotal;
            }

            $so->update(['total_amount' => $totalAmount]);
        });

        return redirect()->back()->with('success', 'Sales Order created and stock updated successfully.');
    }

    public function show(SalesOrder $salesOrder)
    {
        $salesOrder->load('items.product', 'creator');
        return Inertia::render('SalesOrders/Show', [
            'salesOrder' => $salesOrder
        ]);
    }
}
