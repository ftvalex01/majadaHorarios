<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModuloAula extends Model
{
    protected $table = 'modulo_aula';

    protected $fillable = ['aula_id', 'modulo_id'];

    // Puedes agregar más relaciones o métodos según sea necesario
}
