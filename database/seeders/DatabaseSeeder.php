<?php

namespace Database\Seeders;

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
    }
}