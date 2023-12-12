<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ModuloAulaResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'aula_id' => $this->aula_id,
            'modulo_id' => $this->modulo_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
