<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Curso;

class CursoSeeder extends Seeder
{
    public function run()
    {
        Curso::create([
            'nombre' => 'Curso de Ejemplo 1',
            'año' => '1º', 
            'turno' => 'mañana', 
        ]);

        Curso::create([
            'nombre' => 'Curso de Ejemplo 2',
            'año' => '2º', 
            'turno' => 'tarde', 
        ]);

       
    }
}
