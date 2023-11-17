<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Curso;

class CursoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Crear un curso de ejemplo
        Curso::create([
            'nombre' => 'Curso de Ejemplo',
        ]);

        // Puedes agregar más cursos según sea necesario
    }
}
