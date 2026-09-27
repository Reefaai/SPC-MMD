<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class WarehouseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'code' => 'GDG-'.$this->faker->unique()->numerify('###'),
            'name' => 'Gudang '.$this->faker->city(),
            'location' => $this->faker->address(),
        ];
    }
}
