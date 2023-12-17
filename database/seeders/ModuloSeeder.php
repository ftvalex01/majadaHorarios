<?php

namespace Database\Seeders;

use App\Models\Modulo;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ModuloSeeder extends Seeder
{
    public function run()
    {
        $modulos = [
            [
                'cod' => 'AIF',
                'materia' => 'Aplicaciones ofimáticas',
                'h_semanales' => 8,
                'h_totales' => 8,
                'distribucion_horas' => '',
                'turno' => 'tarde',
                'observaciones' => null,
                'user_id' => null, // Replace with actual ID
                'especialidad_id' => 1, // Replace with actual ID
                'curso_id' => 1, // Replace with actual ID
            ],
            // ... other modulos
            [
                'cod' => 'FUW',
                'materia' => 'Fundamentos de hardware',
                'h_semanales' => 3,
                'h_totales' => 3,
                'distribucion_horas' => '',
                'turno' => 'tarde',
                'observaciones' => null,
                'user_id' => null, // Replace with actual ID
                'especialidad_id' => 2, // Replace with actual ID
                'curso_id' => 2, // Replace with actual ID
            ], [
                'cod' => 'GTB',
                'materia' => 'Gestión de bases de datos',
                'h_semanales' => 5,
                'h_totales' => 5,
                'distribucion_horas' => '',
                'turno' => 'mañana',
                'observaciones' => null,
                'user_id' => null, // Replace with actual ID
                'especialidad_id' => 1, // Replace with actual ID
                'curso_id' => 2, // Replace with actual ID
            ],
            [
                'cod' => 'IDP',
                'materia' => 'Implantación de sistemas operativos',
                'h_semanales' => 5,
                'h_totales' => 5,
                'distribucion_horas' => '',
                'turno' => 'tarde',
                'observaciones' => null,
                'user_id' => null, // Replace with actual ID
                'especialidad_id' => 2, // Replace with actual ID
                'curso_id' => 1, // Replace with actual ID
            ],
            [
                'cod' => 'IRD',
                'materia' => 'Infraestructuras de redes de datos y sistemas de telefonía',
                'h_semanales' => 4,
                'h_totales' => 4,
                'distribucion_horas' => '',
                'turno' => 'mañana',
                'observaciones' => null,
                'user_id' => null, // Replace with actual ID
                'especialidad_id' => 2, // Replace with actual ID
                'curso_id' => 2, // Replace with actual ID
            ],
            [
                'cod' => 'PRL',
                'materia' => 'Planificación y administración de redes',
                'h_semanales' => 3,
                'h_totales' => 3,
                'distribucion_horas' => '',
                'turno' => 'tarde',
                'observaciones' => null,
                'user_id' => null, // Replace with actual ID
                'especialidad_id' => 1, // Replace with actual ID
                'curso_id' => 2, // Replace with actual ID
            ],
            [
                'cod' => 'SGO',
                'materia' => 'Servicios de red e Internet',
                'h_semanales' => 5,
                'h_totales' => 5,
                'distribucion_horas' => '',
                'turno' => 'mañana',
                'observaciones' => null,
                'user_id' => null, // Replace with actual ID
                'especialidad_id' => 2, // Replace with actual ID
                'curso_id' => 1, // Replace with actual ID
            ],
            [
                'cod' => 'SRI',
                'materia' => 'Seguridad y alta disponibilidad',
                'h_semanales' => 5,
                'h_totales' => 5,
                'distribucion_horas' => '',
                'turno' => 'tarde',
                'observaciones' => null,
                'user_id' => null, // Replace with actual ID
                'especialidad_id' => 1, // Replace with actual ID
                'curso_id' => 2, // Replace with actual ID
            ],
            [
                'cod' => 'PPM',
                'materia' => 'Principios de Publicidad y Marketing',
                'h_semanales' => 6,
                'h_totales' => 6,
                'distribucion_horas' => '',
                'turno' => 'mañana',
                'observaciones' => null,
                'user_id' => null, // Reemplazar con ID de usuario real
                'especialidad_id' => 1, // Reemplazar con ID de especialidad real
                'curso_id' => 1, // Reemplazar con ID de curso real
            ],
            [
                'cod' => 'ESM',
                'materia' => 'Estrategias de Mercadotecnia',
                'h_semanales' => 5,
                'h_totales' => 5,
                'distribucion_horas' => '',
                'turno' => 'tarde',
                'observaciones' => null,
                'user_id' => null, // Reemplazar con ID de usuario real
                'especialidad_id' => 1, // Reemplazar con ID de especialidad real
                'curso_id' => 1, // Reemplazar con ID de curso real
            ],
            // ... Puedes seguir añadiendo más módulos según sea necesario
            [
                'cod' => 'DIG',
                'materia' => 'Marketing Digital',
                'h_semanales' => 4,
                'h_totales' => 4,
                'distribucion_horas' => '',
                'turno' => 'mañana',
                'observaciones' => null,
                'user_id' => null, // Reemplazar con ID de usuario real
                'especialidad_id' => 1, // Reemplazar con ID de especialidad real
                'curso_id' => 2, // Reemplazar con ID de curso real
            ], [
                'cod' => 'PIE',
                'materia' => 'Psicología Infantil y Educación',
                'h_semanales' => 6,
                'h_totales' => 6,
                'distribucion_horas' => '',
                'turno' => 'mañana',
                'observaciones' => null,
                'user_id' => null, // Reemplazar con ID de usuario real
                'especialidad_id' => 2, // Reemplazar con ID de especialidad real
                'curso_id' => 1, // Reemplazar con ID de curso real
            ],
            [
                'cod' => 'PAE',
                'materia' => 'Pedagogía y Aprendizaje Temprano',
                'h_semanales' => 5,
                'h_totales' => 5,
                'distribucion_horas' => '',
                'turno' => 'tarde',
                'observaciones' => null,
                'user_id' => null, // Reemplazar con ID de usuario real
                'especialidad_id' => 2, // Reemplazar con ID de especialidad real
                'curso_id' => 1, // Reemplazar con ID de curso real
            ],
            // ... Puedes seguir añadiendo más módulos según sea necesario
            [
                'cod' => 'EIJ',
                'materia' => 'Educación Inclusiva en la Infancia',
                'h_semanales' => 4,
                'h_totales' => 4,
                'distribucion_horas' => '',
                'turno' => 'mañana',
                'observaciones' => null,
                'user_id' => null, // Reemplazar con ID de usuario real
                'especialidad_id' => 2, // Reemplazar con ID de especialidad real
                'curso_id' => 2, // Reemplazar con ID de curso real
            ],
            [
                'cod' => 'FDD',
                'materia' => 'Fundamentos del Diseño y la Composición',
                'h_semanales' => 6,
                'h_totales' => 6,
                'distribucion_horas' => '',
                'turno' => 'mañana',
                'observaciones' => null,
                'user_id' => null, // Reemplazar con ID de usuario real
                'especialidad_id' => 3, // Reemplazar con ID de especialidad real
                'curso_id' => 1, // Reemplazar con ID de curso real
            ],
            [
                'cod' => 'DID',
                'materia' => 'Diseño de Identidad Corporativa',
                'h_semanales' => 5,
                'h_totales' => 5,
                'distribucion_horas' => '',
                'turno' => 'tarde',
                'observaciones' => null,
                'user_id' => null, // Reemplazar con ID de usuario real
                'especialidad_id' => 3, // Reemplazar con ID de especialidad real
                'curso_id' => 1, // Reemplazar con ID de curso real
            ],
            // ... Puedes seguir añadiendo más módulos según sea necesario
            [
                'cod' => 'IMP',
                'materia' => 'Ilustración y Manipulación de Imágenes',
                'h_semanales' => 4,
                'h_totales' => 4,
                'distribucion_horas' => '',
                'turno' => 'mañana',
                'observaciones' => null,
                'user_id' => null, // Reemplazar con ID de usuario real
                'especialidad_id' => 3, // Reemplazar con ID de especialidad real
                'curso_id' => 2, // Reemplazar con ID de curso real
            ],
        ];



        foreach ($modulos as $modulo) {
            DB::table('modulos')->insert([
                'cod' => $modulo['cod'],
                'materia' => $modulo['materia'],
                'h_semanales' => $modulo['h_semanales'],
                'h_totales' => $modulo['h_totales'],
                'distribucion_horas' => $modulo['distribucion_horas'],
                'turno' => $modulo['turno'],
                'observaciones' => $modulo['observaciones'],
                'user_id' => $modulo['user_id'],
                'especialidad_id' => $modulo['especialidad_id'],
                'curso_id' => $modulo['curso_id'],
            ]);
        }
    }
}
