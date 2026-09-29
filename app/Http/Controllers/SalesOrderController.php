<?php

namespace App\Http\Controllers;

use App\Models\InventoryTransaction;
use App\Models\Product;
use App\Models\SalesOrder;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SalesOrderController extends Controller
{
    public function index()
    {
        $salesOrders = SalesOrder::with(['creator', 'warehouse', 'items'])->latest()->get();
        $products = Product::orderBy('name')->get();
        $warehouses = Warehouse::orderBy('name')->get();

        return Inertia::render('SalesOrders/Index', [
            'salesOrders' => $salesOrders,
            'products' => $products,
            'warehouses' => $warehouses,
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
            $validationErrors = [];

            // Validasi stok mencukupi untuk semua item sebelum memproses apapun
            foreach ($validated['items'] as $index => $item) {
                $product = Product::findOrFail($item['product_id']);

                $stockIn = InventoryTransaction::where('product_id', $item['product_id'])
                    ->where('warehouse_id', $validated['warehouse_id'])
                    ->where('type', 'IN')
                    ->sum('quantity');

                $stockOut = InventoryTransaction::where('product_id', $item['product_id'])
                    ->where('warehouse_id', $validated['warehouse_id'])
                    ->where('type', 'OUT')
                    ->sum('quantity');

                $availableStock = $stockIn - $stockOut;

                if ($availableStock < $item['quantity']) {
                    $validationErrors["items.{$index}.quantity"] = "Sisa stok hanya: {$availableStock}";
                }
            }

            if (! empty($validationErrors)) {
                throw ValidationException::withMessages($validationErrors);
            }

            $so = SalesOrder::create([
                'customer_name' => $validated['customer_name'],
                'date' => $validated['date'],
                'warehouse_id' => $validated['warehouse_id'],
                'status' => 'Completed',
                'created_by' => $request->user()->id,
                'total_amount' => 0,
            ]);

            $totalAmount = 0;

            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);
                $subtotal = $product->price * $item['quantity'];

                $so->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'subtotal' => $subtotal,
                ]);

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

        return redirect()->back()->with('success', 'Sales Order berhasil dibuat dan stok diperbarui.');
    }

    public function show(SalesOrder $salesOrder)
    {
        $salesOrder->load('items.product', 'creator', 'warehouse');

        return Inertia::render('SalesOrders/Show', [
            'salesOrder' => $salesOrder,
        ]);
    }
}
