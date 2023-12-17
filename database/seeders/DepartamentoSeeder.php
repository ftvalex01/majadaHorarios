<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Departamento;

class DepartamentoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Ejemplo de nombres de departamentos
        $nombresDepartamentos = ['Departamento de Informatica', 'Departamento de Marketing y Comercio', 'Departamento de Educacion', 'Departamento de Inglés', 'Departamento de Diseño Gráfico'];

        // Itera sobre los nombres y crea un registro para cada uno
        foreach ($nombresDepartamentos as $nombre) {
            Departamento::create([
                'nombre' => $nombre,
            ]);
        }
    }
}
