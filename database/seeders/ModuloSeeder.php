<?php
namespace Database\Seeders;

use App\Models\Modulo;
use Illuminate\Database\Seeder;

class ModuloSeeder extends Seeder
{
    public function run()
    {
        Modulo::factory()->count(20)->create(); // Crea 20 módulos
    }
    
}
