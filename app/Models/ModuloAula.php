<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModuloAula extends Model
{
    protected $table = 'modulo_aula';

    protected $fillable = ['aula_id', 'modulo_id'];

    public function aula()
    {
        return $this->belongsTo(Aula::class, 'aula_id');
    }

    public function modulo()
    {
        return $this->belongsTo(Modulo::class, 'modulo_id');
    }

}
