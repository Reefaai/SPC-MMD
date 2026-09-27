<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_unauthenticated_user_cannot_access_categories(): void
    {
        $this->get(route('categories.index'))->assertRedirect(route('login'));
    }

    public function test_categories_index_returns_ok_for_authenticated_user(): void
    {
        Category::factory()->count(3)->create();

        $response = $this->actingAs($this->user)->get(route('categories.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Categories/Index')
            ->has('categories', 3)
        );
    }

    public function test_category_can_be_created(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('categories.store'), ['name' => 'Elektronik']);

        $response->assertRedirect();
        $this->assertDatabaseHas('categories', ['name' => 'Elektronik']);
    }

    public function test_category_name_is_required(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('categories.store'), ['name' => '']);

        $response->assertSessionHasErrors('name');
        $this->assertDatabaseCount('categories', 0);
    }

    public function test_category_can_be_updated(): void
    {
        $category = Category::factory()->create(['name' => 'Lama']);

        $this->actingAs($this->user)
            ->put(route('categories.update', $category), ['name' => 'Baru']);

        $this->assertDatabaseHas('categories', ['id' => $category->id, 'name' => 'Baru']);
    }

    public function test_category_can_be_deleted(): void
    {
        $category = Category::factory()->create();

        $this->actingAs($this->user)
            ->delete(route('categories.destroy', $category));

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }
}
