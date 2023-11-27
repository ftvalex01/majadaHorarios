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
        return [
            'codigo' => 'required|unique:modulos' . ($this->isMethod('patch') ? ',codigo,' . $this->route('modulo')->id : ''),
            'materia' => 'required|string',
            'h_semanales' => 'required|integer',
            'h_totales' => 'required|integer',
            'aula' => 'required|in:mañana,tarde',
            'user_id' => 'required|exists:users,id',
            'especialidad_id' => 'required|exists:especialidads,id',
            'curso_id' => 'required|exists:cursos,id',
        ];
    }
}
