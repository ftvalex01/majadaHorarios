<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ModuloRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
{
    $baseRules = [
        'cod' => 'required|unique:modulos' . ($this->isMethod('patch') ? ',cod,' . $this->route('modulo')->id : ''),
        'materia' => 'required|string',
        'h_semanales' => 'required|integer',
        'h_totales' => 'required|integer',
        'turno' => 'required|in:mañana,tarde',
        'user_id' => 'required|exists:users,id',
        'especialidad_id' => 'required|exists:especialidads,id',
        'curso_id' => 'required|exists:cursos,id',
    ];

    if ($this->isMethod('put')) {
        $updateRules = [
            'user_id' => 'exists:users,id', // 'required' si siempre se espera un user_id en la actualización
            'distribucion_horas', // 'nullable' permite que el campo sea opcional
            'observaciones', // Valida las observaciones
        ];

        return array_merge($baseRules, $updateRules);
    }

    return $baseRules;
}

    
}
