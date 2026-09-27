<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SupplierFactory extends Factory
{
    public function definition(): array
    {
        return [
            'code' => 'SUP-'.$this->faker->unique()->numerify('###'),
            'name' => $this->faker->company(),
            'contact' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
        ];
    }
}
