<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_unauthenticated_user_cannot_access_products(): void
    {
        $this->get(route('products.index'))->assertRedirect(route('login'));
    }

    public function test_products_index_is_rendered(): void
    {
        Product::factory()->count(3)->create();

        $response = $this->actingAs($this->user)->get(route('products.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Products/Index')
            ->has('products', 3)
        );
    }

    public function test_product_can_be_created(): void
    {
        $category = Category::factory()->create();

        $response = $this->actingAs($this->user)->post(route('products.store'), [
            'category_id' => $category->id,
            'sku' => 'PRD-0001',
            'name' => 'Laptop ASUS',
            'unit' => 'pcs',
            'min_stock' => 5,
            'price' => 8000000,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('products', ['sku' => 'PRD-0001', 'name' => 'Laptop ASUS']);
    }

    public function test_product_sku_must_be_unique(): void
    {
        $category = Category::factory()->create();
        Product::factory()->create(['sku' => 'PRD-0001']);

        $response = $this->actingAs($this->user)->post(route('products.store'), [
            'category_id' => $category->id,
            'sku' => 'PRD-0001',
            'name' => 'Produk Lain',
            'unit' => 'pcs',
            'min_stock' => 5,
            'price' => 100000,
        ]);

        $response->assertSessionHasErrors('sku');
    }

    public function test_product_can_be_updated(): void
    {
        $product = Product::factory()->create(['name' => 'Lama', 'price' => 100000]);

        $this->actingAs($this->user)->put(route('products.update', $product), [
            'category_id' => $product->category_id,
            'sku' => $product->sku,
            'name' => 'Baru',
            'unit' => $product->unit,
            'min_stock' => $product->min_stock,
            'price' => 200000,
        ]);

        $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => 'Baru', 'price' => 200000]);
    }

    public function test_product_can_be_deleted(): void
    {
        $product = Product::factory()->create();

        $this->actingAs($this->user)->delete(route('products.destroy', $product));

        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }
}
