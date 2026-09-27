<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Supplier;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReceiptTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_unauthenticated_user_cannot_access_receipts(): void
    {
        $this->get(route('receipts.index'))->assertRedirect(route('login'));
    }

    public function test_receipts_index_is_rendered_with_pending_pos(): void
    {
        PurchaseOrder::factory()->pending()->count(2)->create();
        PurchaseOrder::factory()->completed()->create();

        $response = $this->actingAs($this->user)->get(route('receipts.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Receipts/Index')
            ->has('pendingPOs', 2)
        );
    }

    public function test_receipt_can_be_created_and_stock_is_added(): void
    {
        $supplier = Supplier::factory()->create();
        $product = Product::factory()->create();
        $warehouse = Warehouse::factory()->create();

        $po = PurchaseOrder::factory()->pending()->create(['supplier_id' => $supplier->id]);
        PurchaseOrderItem::create([
            'purchase_order_id' => $po->id,
            'product_id' => $product->id,
            'quantity' => 20,
            'price' => $product->price,
            'subtotal' => $product->price * 20,
        ]);

        $response = $this->actingAs($this->user)->post(route('receipts.store'), [
            'purchase_order_id' => $po->id,
            'warehouse_id' => $warehouse->id,
            'date' => '2026-09-26',
            'items' => [
                ['product_id' => $product->id, 'quantity_received' => 20],
            ],
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('receipts', [
            'purchase_order_id' => $po->id,
            'warehouse_id' => $warehouse->id,
            'status' => 'Completed',
        ]);

        $this->assertDatabaseHas('inventory_transactions', [
            'product_id' => $product->id,
            'warehouse_id' => $warehouse->id,
            'type' => 'IN',
            'quantity' => 20,
        ]);

        $this->assertDatabaseHas('purchase_orders', ['id' => $po->id, 'status' => 'Completed']);
    }
}
