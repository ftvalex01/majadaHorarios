<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Departamento extends Model
{
    protected $fillable = ['nombre']; 

    public function profesores()
    {
        return $this->hasMany(User::class, 'departamento_id');
    }
}
