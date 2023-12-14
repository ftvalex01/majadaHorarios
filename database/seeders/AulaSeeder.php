<?php

namespace Database\Seeders;

use App\Models\Aula;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AulaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $nombresAulas = [
            'Aula 101',
            'Aula 102',
            'Aula 103',
            'Aula 104',
            'Aula 105',
            'Aula 106',
            'Aula 107',
            'Aula 108',
            'Aula 109',
            'Aula 110'
        ];

        foreach ($nombresAulas as $nombreAula) {
            Aula::create([
                'nombre' => $nombreAula,
            ]);
        }
    }
}
