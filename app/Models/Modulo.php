<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modulo extends Model
{
    use HasFactory;

    protected $fillable = [
        'cod',
        'materia',
        'h_semanales',
        'h_totales',
        'grupos',
        'aula',
        'user_id',
        'especialidad_id',
        'curso_id',
    ];

    /**
     * Relación con el usuario que crea el módulo.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relación con la especialidad asociada al módulo.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function especialidad()
    {
        return $this->belongsTo(Especialidad::class);
    }

    /**
     * Relación con el curso asociado al módulo.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function curso()
    {
        return $this->belongsTo(Curso::class, 'curso_id');
    }
}
