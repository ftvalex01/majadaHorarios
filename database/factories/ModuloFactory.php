<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Modulo>
 */
class ModuloFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'cod' => $this->faker->unique()->word,
            'materia' => $this->faker->sentence,
            'h_semanales' => $this->faker->numberBetween(1, 8),
            'h_totales' => $this->faker->numberBetween(1, 8),
            'curso_id' => $this->faker->numberBetween(1, 2),
            'especialidad_id' => $this->faker->numberBetween(1, 2),
            'observaciones' => 'Sin observaciones',
        ];
    }
    
}
