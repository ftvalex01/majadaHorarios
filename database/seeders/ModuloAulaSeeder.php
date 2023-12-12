<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Modulo;
use App\Models\Aula;

class ModuloAulaSeeder extends Seeder
{
    public function run()
    {
        // Obtener algunos módulos y aulas existentes
        $modulo1 = Modulo::find(1);
        $modulo2 = Modulo::find(2);
        // ... Puedes seguir obteniendo más módulos según sea necesario

        $aula1 = Aula::find(1);
        $aula2 = Aula::find(2);
        // ... Puedes seguir obteniendo más aulas según sea necesario

        // Establecer la relación entre módulos y aulas
        $modulo1->aulas()->attach($aula1);
        $modulo1->aulas()->attach($aula2);

        $modulo2->aulas()->attach($aula1);
        // ... Puedes seguir estableciendo relaciones entre módulos y aulas

        // También puedes usar sync() para sincronizar relaciones, detach() para eliminar relaciones, etc.
    }
}
