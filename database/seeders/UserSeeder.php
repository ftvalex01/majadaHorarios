<?php 
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Crear usuario para el rol de profesor
        User::create([
            'name' => 'Profesor Usuario',
            'email' => 'profesor@example.com',
            'password' => Hash::make('contraseña'), // Hash de la contraseña
            'especialidad_id' => 1, // ID de la especialidad deseada para el profesor
            'rol' => 'profesor',
        ]);

        // Crear usuario para el rol de jefe de estudios
        User::create([
            'name' => 'Jefe de Estudios Usuario',
            'email' => 'jefe_estudios@example.com',
            'password' => Hash::make('contraseña'), // Hash de la contraseña
            'especialidad_id' => 2, // ID de la especialidad deseada para el jefe de estudios
            'rol' => 'jefe_estudios',
        ]);

        // Crear usuario para el rol de jefe de departamento
        User::create([
            'name' => 'Jefe de Departamento Usuario',
            'email' => 'jefe_departamento@example.com',
            'password' => Hash::make('contraseña'), // Hash de la contraseña
            'especialidad_id' => 1, // ID de la especialidad deseada para el jefe de departamento
            'rol' => 'jefe_departamento',
        ]);
    }
}

?>