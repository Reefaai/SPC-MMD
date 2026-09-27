<?php

namespace Tests\Feature;

use App\Models\InventoryTransaction;
use App\Models\Product;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_is_redirected_from_dashboard(): void
    {
        $this->get(route('dashboard'))->assertRedirect(route('login'));
    }

    public function test_dashboard_renders_with_metrics(): void
    {
        $user = User::factory()->create();
        Product::factory()->count(5)->create();

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->has('metrics')
            ->has('stockSummary')
            ->has('recentTransactions')
        );
    }

    public function test_dashboard_metrics_contain_correct_product_count(): void
    {
        $user = User::factory()->create();
        Product::factory()->count(7)->create();

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn ($page) => $page
            ->where('metrics.total_products', 7)
        );
    }

    public function test_dashboard_detects_low_stock(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['min_stock' => 10]);
        $warehouse = Warehouse::factory()->create();

        InventoryTransaction::create([
            'product_id' => $product->id,
            'warehouse_id' => $warehouse->id,
            'type' => 'IN',
            'quantity' => 5,
            'date' => now()->toDateString(),
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn ($page) => $page
            ->where('metrics.low_stock_count', 1)
        );
    }
}
