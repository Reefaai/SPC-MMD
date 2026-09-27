<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WarehouseTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_unauthenticated_user_cannot_access_warehouses(): void
    {
        $this->get(route('warehouses.index'))->assertRedirect(route('login'));
    }

    public function test_warehouses_index_is_rendered(): void
    {
        Warehouse::factory()->count(2)->create();

        $response = $this->actingAs($this->user)->get(route('warehouses.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Warehouses/Index')
            ->has('warehouses', 2)
        );
    }

    public function test_warehouse_can_be_created(): void
    {
        $response = $this->actingAs($this->user)->post(route('warehouses.store'), [
            'code' => 'GDG-001',
            'name' => 'Gudang Utama',
            'location' => 'Jl. Industri No. 5',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('warehouses', ['code' => 'GDG-001', 'name' => 'Gudang Utama']);
    }

    public function test_warehouse_code_and_name_are_required(): void
    {
        $response = $this->actingAs($this->user)->post(route('warehouses.store'), [
            'code' => '',
            'name' => '',
        ]);

        $response->assertSessionHasErrors(['code', 'name']);
    }

    public function test_warehouse_can_be_updated(): void
    {
        $warehouse = Warehouse::factory()->create(['name' => 'Lama']);

        $this->actingAs($this->user)->put(route('warehouses.update', $warehouse), [
            'code' => $warehouse->code,
            'name' => 'Baru',
        ]);

        $this->assertDatabaseHas('warehouses', ['id' => $warehouse->id, 'name' => 'Baru']);
    }

    public function test_warehouse_can_be_deleted(): void
    {
        $warehouse = Warehouse::factory()->create();

        $this->actingAs($this->user)->delete(route('warehouses.destroy', $warehouse));

        $this->assertDatabaseMissing('warehouses', ['id' => $warehouse->id]);
    }
}
