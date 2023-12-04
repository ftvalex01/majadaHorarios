<?php

namespace Database\Seeders;

use App\Models\User;
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
        $this->call(UserSeeder::class);
        $this->call(ModuloSeeder::class);
    }
}