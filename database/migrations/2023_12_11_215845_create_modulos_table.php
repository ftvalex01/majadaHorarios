<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('modulos', function (Blueprint $table) {
            $table->id();
            $table->string('cod')->unique(); // Se agregó la validación unique para el código
            $table->string('materia');
            $table->unsignedInteger('h_semanales')->default(0);
            $table->unsignedInteger('h_totales')->default(0);
            $table->string('distribucion_horas')->default('');
            $table->enum('turno', ['mañana', 'tarde'])->comment('Solo puede tomar los valores "mañana" o "tarde"')->default('tarde');
            $table->text('observaciones');
            // Claves foráneas
            $table->foreignId('user_id')->nullable()->constrained()->comment('Clave foránea para user_id, referencia a la tabla users');
            $table->foreignId('especialidad_id')->constrained()->comment('Clave foránea para especialidad_id, referencia a la tabla especialidades');
            $table->foreignId('curso_id')->constrained()->comment('Clave foránea para estudio_id, referencia a la tabla estudios');
           
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('modulos');
    }
};