<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Curso;

class CursoSeeder extends Seeder
{
    public function run()
    {
        Curso::create([
            'nombre' => 'Desarrollo de Aplicaciones Web',
            'año' => 2,
            'turno' => 'Mañana',
        ]);
        
        Curso::create([
            'nombre' => 'Estrategias de Marketing Digital',
            'año' => 2,
            'turno' => 'Tarde',
        ]);
        
        Curso::create([
            'nombre' => 'Educación Infantil: Métodos y Prácticas',
            'año' => 1,
            'turno' => 'Mañana',
        ]);
        
        Curso::create([
            'nombre' => 'Diseño Gráfico y Comunicación Visual',
            'año' => 2,
            'turno' => 'Mañana',
        ]);
        
        Curso::create([
            'nombre' => 'Inglés Avanzado para Negocios',
            'año' => 1,
            'turno' => 'Tarde',
        ]);

       
    }
}
