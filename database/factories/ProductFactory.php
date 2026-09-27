<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'sku' => 'PRD-'.$this->faker->unique()->numerify('####'),
            'name' => $this->faker->words(2, true),
            'unit' => $this->faker->randomElement(['pcs', 'kg', 'liter', 'box']),
            'min_stock' => $this->faker->numberBetween(5, 20),
            'price' => $this->faker->numberBetween(10000, 500000),
        ];
    }
}
