<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Especialidad;

class EspecialidadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Crear la especialidad "INFORMÁTICA"
        Especialidad::create([
            'nombre' => 'INFORMÁTICA',
        ]);

        // Crear la especialidad "SISTEMAS Y APLICACIONES INFORMÁTICAS"
        Especialidad::create([
            'nombre' => 'SISTEMAS Y APLICACIONES INFORMÁTICAS',
        ]);
        Especialidad::create([
            'nombre' => 'INGLÉS',
        ]);
        Especialidad::create([
            'nombre' => 'MARKETING Y COMERCIO',
        ]);
        Especialidad::create([
            'nombre' => 'DISEÑO GRÁFICO',
        ]);

        // Puedes agregar más especialidades según sea necesario
    }
}
