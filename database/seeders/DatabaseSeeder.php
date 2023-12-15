<?php

namespace Database\Seeders;

use App\Models\Aula;
use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Otros seeders...
        $this->call(EspecialidadSeeder::class);
        $this->call(CursoSeeder::class);
        $this->call(DepartamentoSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(AulaSeeder::class);
        $this->call(ModuloSeeder::class);
        $this->call(ModuloAulaSeeder::class);
    }
}