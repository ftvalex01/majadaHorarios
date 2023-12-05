<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ModuloResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'cod' => $this->cod,
            'materia' => $this->materia,
            'h_semanales' => $this->h_semanales,
            'h_totales' => $this->h_totales,
            'turno' => $this->turno,
            'user_id' => $this->user_id,
            'especialidad' => new EspecialidadResource($this->especialidad),
            'curso_id' => $this->curso_id,
            //'created_at' => $this->created_at,
            //'updated_at' => $this->updated_at,
        ];
    }
}
