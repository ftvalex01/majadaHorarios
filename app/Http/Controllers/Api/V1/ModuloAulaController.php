<?php

namespace App\Http\Controllers\Api\V1;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ModuloAula;

class ModuloAulaController extends Controller
{
    public function getAulasByModulo($moduloId)
    {
        $aulas = ModuloAula::where('modulo_id', $moduloId)->get();
        return response()->json(['data' => $aulas]);
    }
}
