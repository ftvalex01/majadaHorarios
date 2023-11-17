
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
        // Crear una especialidad de ejemplo
        Especialidad::create([
            'nombre' => 'Especialidad de Ejemplo',
        ]);

        // Puedes agregar más especialidades según sea necesario
    }
}
