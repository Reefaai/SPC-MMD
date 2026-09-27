<?php

namespace Tests\Feature;

use App\Models\InventoryTransaction;
use App\Models\Product;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_inventory(): void
    {
        $this->get(route('inventory.index'))->assertRedirect(route('login'));
    }

    public function test_inventory_page_renders(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('inventory.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Inventory/Index')
            ->has('warehouses')
            ->has('stockMatrix')
        );
    }

    public function test_stock_matrix_correctly_calculates_net_stock(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();
        $warehouse = Warehouse::factory()->create();

        InventoryTransaction::create([
            'product_id' => $product->id,
            'warehouse_id' => $warehouse->id,
            'type' => 'IN',
            'quantity' => 100,
            'date' => now()->toDateString(),
        ]);

        InventoryTransaction::create([
            'product_id' => $product->id,
            'warehouse_id' => $warehouse->id,
            'type' => 'OUT',
            'quantity' => 30,
            'date' => now()->toDateString(),
        ]);

        $response = $this->actingAs($user)->get(route('inventory.index'));

        $response->assertInertia(fn ($page) => $page
            ->where('stockMatrix.0.total_stock', 70)
        );
    }
}
