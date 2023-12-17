<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Modulo;
use App\Models\Aula;

class ModuloAulaSeeder extends Seeder
{
    public function run()
    {
        // Obtener algunos módulos existentes
        $modulo1 = Modulo::find(1);
        $modulo2 = Modulo::find(2);
        $modulo3 = Modulo::find(3);
        $modulo4 = Modulo::find(4);
        $modulo5 = Modulo::find(5);
        $modulo6 = Modulo::find(6);
        $modulo7 = Modulo::find(7);
    
        // Obtener algunas aulas existentes
        $aula1 = Aula::find(1);
        $aula2 = Aula::find(2);
        $aula3 = Aula::find(3);
        $aula4 = Aula::find(4);
        $aula5 = Aula::find(5);
        $aula6 = Aula::find(6);
        $aula7 = Aula::find(7);
    
        // Establecer relaciones entre módulos y aulas
        $modulo1->aulas()->attach($aula1);
        $modulo1->aulas()->attach($aula2);
    
        $modulo2->aulas()->attach($aula1);
        $modulo2->aulas()->attach($aula3);
    
        $modulo3->aulas()->attach($aula2);
        $modulo3->aulas()->attach($aula4);
    
        $modulo4->aulas()->attach($aula3);
        $modulo4->aulas()->attach($aula5);
    
        $modulo5->aulas()->attach($aula4);
        $modulo5->aulas()->attach($aula6);
    
        $modulo6->aulas()->attach($aula5);
        $modulo6->aulas()->attach($aula7);
    
        $modulo7->aulas()->attach($aula6);
        $modulo7->aulas()->attach($aula7);
    
        // Puedes continuar estableciendo más relaciones si es necesario
    }
}
