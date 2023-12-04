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
        // ES ESTUDIO EN EL JSON
        Curso::create([
            'nombre' => 'Curso de Ejemplo',
        ]);
        Curso::create([
            'nombre' => 'Curso de Ejemplo2',
        ]);

        // Puedes agregar más cursos según sea necesario
    }
}
