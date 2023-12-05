<?php

namespace Database\Seeders;

use App\Models\Modulo;
use Illuminate\Database\Seeder;


class ModuloSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                "Cod." => "AIF",
                "Materia" => "Aplicaciones ofimáticas",
                "Alumnos" => 26,
                "Grupos" => 1,
                "H.Sem." => 8,
                "H.Tot." => 8,
                "Estudio" => 1,
                "Especialidad" => 2,
            ],
            [
                "Cod." => "SNS",
                "Materia" => "Sistemas de aprendizaje automático",
                "Alumnos" => "",
                "Grupos" => 1,
                "H.Sem." => 3,
                "H.Tot." => 3,
                "Estudio" => 2,
                "Especialidad" => 2,
            ],
            [
                "Cod." => "SPS",
                "Materia" => "Sistemas de Big Data",
                "Alumnos" => "",
                "Grupos" => 1,
                "H.Sem." => 3,
                "H.Tot." => 3,
                "Estudio" => 1,
                "Especialidad" => 2,
            ],
            [
                "Cod." => "TUO",
                "Materia" => "Tutoría",
                "Alumnos" => "",
                "Grupos" => 1,
                "H.Sem." => 2,
                "H.Tot." => 2,
                "Estudio" => 2,
                "Especialidad" => 1,
            ],
        ];

        foreach ($data as $subjectData) {
            Modulo::create([
                'cod' => $subjectData['Cod.'],
                'materia' => $subjectData['Materia'],
                'h_semanales' => $subjectData['H.Sem.'],
                'h_totales' => $subjectData['H.Tot.'],
                'curso_id' => $subjectData['Estudio'],
                'especialidad_id' => $subjectData['Especialidad'],
            ]);
        }
    }
}