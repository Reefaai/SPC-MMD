<?php

namespace Database\Factories;

use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PurchaseOrderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'supplier_id' => Supplier::factory(),
            'date' => $this->faker->dateTimeBetween('-3 months', 'now')->format('Y-m-d'),
            'status' => $this->faker->randomElement(['Draft', 'Pending', 'Approved', 'Completed']),
            'total_amount' => $this->faker->numberBetween(100000, 10000000),
            'created_by' => User::factory(),
        ];
    }

    public function pending(): static
    {
        return $this->state(['status' => 'Pending']);
    }

    public function completed(): static
    {
        return $this->state(['status' => 'Completed']);
    }
}
