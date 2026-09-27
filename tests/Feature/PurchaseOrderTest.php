<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PurchaseOrderTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_unauthenticated_user_cannot_access_purchase_orders(): void
    {
        $this->get(route('purchase-orders.index'))->assertRedirect(route('login'));
    }

    public function test_purchase_orders_index_is_rendered(): void
    {
        PurchaseOrder::factory()->count(2)->create();

        $response = $this->actingAs($this->user)->get(route('purchase-orders.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('PurchaseOrders/Index')
            ->has('purchaseOrders', 2)
            ->has('suppliers')
            ->has('products')
        );
    }

    public function test_purchase_order_can_be_created_with_items(): void
    {
        $supplier = Supplier::factory()->create();
        $product = Product::factory()->create(['price' => 50000]);

        $response = $this->actingAs($this->user)->post(route('purchase-orders.store'), [
            'supplier_id' => $supplier->id,
            'date' => '2026-09-26',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 10],
            ],
        ]);

        $response->assertRedirect();

        $po = PurchaseOrder::first();
        $this->assertNotNull($po);
        $this->assertEquals('Pending', $po->status);
        $this->assertEquals(500000, $po->total_amount);
        $this->assertDatabaseHas('purchase_order_items', [
            'purchase_order_id' => $po->id,
            'product_id' => $product->id,
            'quantity' => 10,
            'price' => 50000,
        ]);
    }

    public function test_purchase_order_snapshots_price_at_creation(): void
    {
        $supplier = Supplier::factory()->create();
        $product = Product::factory()->create(['price' => 100000]);

        $this->actingAs($this->user)->post(route('purchase-orders.store'), [
            'supplier_id' => $supplier->id,
            'date' => '2026-09-26',
            'items' => [['product_id' => $product->id, 'quantity' => 5]],
        ]);

        $product->update(['price' => 999999]);

        $this->assertDatabaseHas('purchase_order_items', ['price' => 100000]);
    }

    public function test_purchase_order_requires_at_least_one_item(): void
    {
        $supplier = Supplier::factory()->create();

        $response = $this->actingAs($this->user)->post(route('purchase-orders.store'), [
            'supplier_id' => $supplier->id,
            'date' => '2026-09-26',
            'items' => [],
        ]);

        $response->assertSessionHasErrors('items');
    }

    public function test_purchase_order_status_can_be_updated(): void
    {
        $po = PurchaseOrder::factory()->pending()->create();

        $this->actingAs($this->user)
            ->put(route('purchase-orders.update', $po), ['status' => 'Approved']);

        $this->assertDatabaseHas('purchase_orders', ['id' => $po->id, 'status' => 'Approved']);
    }

    public function test_purchase_order_show_renders(): void
    {
        $po = PurchaseOrder::factory()->create();

        $response = $this->actingAs($this->user)->get(route('purchase-orders.show', $po));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('PurchaseOrders/Show')
            ->has('purchaseOrder')
        );
    }
}
