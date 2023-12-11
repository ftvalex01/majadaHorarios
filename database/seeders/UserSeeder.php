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
            'name' => 'Juan Carlos',
            'email' => 'juancarlos@example.com',
            'password' => Hash::make('contraseña'), // Hash de la contraseña
            'especialidad_id' => 1, // ID de la especialidad deseada para el profesor
            'departamento_id' => 3, // ID del departamento
            'rol' => 'profesor',
        ]);

        // Crear usuario para el rol de jefe de estudios
        User::create([
            'name' => 'Pepe Ruiz',
            'email' => 'peperuiz@example.com',
            'password' => Hash::make('contraseña'), // Hash de la contraseña
            'especialidad_id' => 2, // ID de la especialidad deseada para el jefe de estudios
            'departamento_id' => 2, // ID del departamento
            'rol' => 'jefe_estudios',
        ]);

        // Crear usuario para el rol de jefe de departamento
        User::create([
            'name' => 'Raymundo Alfajor',
            'email' => 'raymundoalfajor@example.com',
            'password' => Hash::make('contraseña'), // Hash de la contraseña
            'especialidad_id' => 1, // ID de la especialidad deseada para el jefe de departamento
            'departamento_id' => 3, // ID del departamento
            'rol' => 'jefe_departamento',
        ]);
    }
}

?>