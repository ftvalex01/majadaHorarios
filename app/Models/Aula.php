<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aula extends Model
{
    use HasFactory;



    public function modulo(){
        return $this->belongsToMany(Modulo::class,'modulo_aula');
    }
}
