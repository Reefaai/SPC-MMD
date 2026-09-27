<?php

namespace Tests\Feature;

use App\Models\InventoryTransaction;
use App\Models\Product;
use App\Models\SalesOrder;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SalesOrderTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_unauthenticated_user_cannot_access_sales_orders(): void
    {
        $this->get(route('sales-orders.index'))->assertRedirect(route('login'));
    }

    public function test_sales_orders_index_is_rendered(): void
    {
        SalesOrder::factory()->count(3)->create();

        $response = $this->actingAs($this->user)->get(route('sales-orders.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('SalesOrders/Index')
            ->has('salesOrders', 3)
            ->has('products')
            ->has('warehouses')
        );
    }

    public function test_sales_order_can_be_created_with_items_and_reduces_stock(): void
    {
        $product = Product::factory()->create(['price' => 75000]);
        $warehouse = Warehouse::factory()->create();

        // Perlu ada stok terlebih dahulu agar validasi tidak gagal
        InventoryTransaction::create([
            'product_id' => $product->id,
            'warehouse_id' => $warehouse->id,
            'type' => 'IN',
            'quantity' => 10,
            'date' => now()->toDateString(),
        ]);

        $response = $this->actingAs($this->user)->post(route('sales-orders.store'), [
            'customer_name' => 'Budi Santoso',
            'date' => '2026-09-26',
            'warehouse_id' => $warehouse->id,
            'items' => [
                ['product_id' => $product->id, 'quantity' => 3],
            ],
        ]);

        $response->assertRedirect();

        $so = SalesOrder::first();
        $this->assertNotNull($so);
        $this->assertEquals('Budi Santoso', $so->customer_name);
        $this->assertEquals(225000, $so->total_amount);

        $this->assertDatabaseHas('inventory_transactions', [
            'product_id' => $product->id,
            'warehouse_id' => $warehouse->id,
            'type' => 'OUT',
            'quantity' => 3,
        ]);
    }

    public function test_sales_order_rejected_when_stock_insufficient(): void
    {
        $product = Product::factory()->create(['price' => 50000]);
        $warehouse = Warehouse::factory()->create();

        // Stok hanya 2, order 5 → harus gagal
        InventoryTransaction::create([
            'product_id' => $product->id,
            'warehouse_id' => $warehouse->id,
            'type' => 'IN',
            'quantity' => 2,
            'date' => now()->toDateString(),
        ]);

        $response = $this->actingAs($this->user)->post(route('sales-orders.store'), [
            'customer_name' => 'Pelanggan Test',
            'date' => '2026-09-26',
            'warehouse_id' => $warehouse->id,
            'items' => [['product_id' => $product->id, 'quantity' => 5]],
        ]);

        $response->assertSessionHasErrors(['items.0.quantity']);
        $this->assertDatabaseCount('sales_orders', 0);
    }

    public function test_sales_order_snapshots_price_at_creation(): void
    {
        $product = Product::factory()->create(['price' => 200000]);
        $warehouse = Warehouse::factory()->create();

        // Tambah stok sebelum SO
        InventoryTransaction::create([
            'product_id' => $product->id,
            'warehouse_id' => $warehouse->id,
            'type' => 'IN',
            'quantity' => 10,
            'date' => now()->toDateString(),
        ]);

        $this->actingAs($this->user)->post(route('sales-orders.store'), [
            'customer_name' => 'Pelanggan Test',
            'date' => '2026-09-26',
            'warehouse_id' => $warehouse->id,
            'items' => [['product_id' => $product->id, 'quantity' => 2]],
        ]);

        $product->update(['price' => 999999]);

        $this->assertDatabaseHas('sales_order_items', ['price' => 200000]);
    }

    public function test_sales_order_requires_customer_name_and_items(): void
    {
        $warehouse = Warehouse::factory()->create();

        $response = $this->actingAs($this->user)->post(route('sales-orders.store'), [
            'customer_name' => '',
            'date' => '2026-09-26',
            'warehouse_id' => $warehouse->id,
            'items' => [],
        ]);

        $response->assertSessionHasErrors(['customer_name', 'items']);
    }

    public function test_sales_order_show_renders(): void
    {
        $so = SalesOrder::factory()->create();

        $response = $this->actingAs($this->user)->get(route('sales-orders.show', $so));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('SalesOrders/Show')
        );
    }
}
