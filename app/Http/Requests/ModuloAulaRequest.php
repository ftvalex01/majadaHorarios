<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ModuloAulaRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'aula_id' => 'required|exists:aulas,id',
            'modulo_id' => 'required|exists:modulos,id',
        ];
    }
}
