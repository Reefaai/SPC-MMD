<?php

namespace Tests\Feature;

use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SupplierTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_unauthenticated_user_cannot_access_suppliers(): void
    {
        $this->get(route('suppliers.index'))->assertRedirect(route('login'));
    }

    public function test_suppliers_index_is_rendered(): void
    {
        Supplier::factory()->count(2)->create();

        $response = $this->actingAs($this->user)->get(route('suppliers.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Suppliers/Index')
            ->has('suppliers', 2)
        );
    }

    public function test_supplier_can_be_created(): void
    {
        $response = $this->actingAs($this->user)->post(route('suppliers.store'), [
            'code' => 'SUP-001',
            'name' => 'PT Maju Jaya',
            'contact' => '08123456789',
            'address' => 'Jl. Contoh No. 1',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('suppliers', ['code' => 'SUP-001', 'name' => 'PT Maju Jaya']);
    }

    public function test_supplier_code_must_be_unique(): void
    {
        Supplier::factory()->create(['code' => 'SUP-001']);

        $response = $this->actingAs($this->user)->post(route('suppliers.store'), [
            'code' => 'SUP-001',
            'name' => 'Supplier Lain',
        ]);

        $response->assertSessionHasErrors('code');
    }

    public function test_supplier_can_be_updated(): void
    {
        $supplier = Supplier::factory()->create(['name' => 'Lama']);

        $this->actingAs($this->user)->put(route('suppliers.update', $supplier), [
            'code' => $supplier->code,
            'name' => 'Baru',
        ]);

        $this->assertDatabaseHas('suppliers', ['id' => $supplier->id, 'name' => 'Baru']);
    }

    public function test_supplier_can_be_deleted(): void
    {
        $supplier = Supplier::factory()->create();

        $this->actingAs($this->user)->delete(route('suppliers.destroy', $supplier));

        $this->assertDatabaseMissing('suppliers', ['id' => $supplier->id]);
    }
}
