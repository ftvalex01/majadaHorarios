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
        $rules = [
            'cod' => 'required|unique:modulos' . ($this->isMethod('patch') ? ',cod,' . $this->route('modulo')->id : ''),
            'materia' => 'required|string',
            'h_semanales' => 'required|integer',
            'h_totales' => 'required|integer',
            'turno' => 'required|in:mañana,tarde',
            'user_id' => 'required|exists:users,id',
            'especialidad_id' => 'required|exists:especialidads,id',
            'curso_id' => 'required|exists:cursos,id',
        ];
    
        // Si el método es PUT y contiene los parámetros específicos, ajusta las reglas
        if ($this->isMethod('put') && $this->has(['user_id', 'distribucion_horas', 'observaciones'])) {
            $rules = [
                'user_id' => 'required|exists:users,id',
                'distribucion_horas' => 'required|string',  // Agrega aquí las reglas específicas para distribución de horas
                'observaciones',  // Ajusta según tus necesidades
            ];
        }
    
        return $rules;
    }
    
}
