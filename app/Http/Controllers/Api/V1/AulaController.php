<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Aula;
use App\Http\Requests\AulaRequest;
use App\Http\Resources\AulaResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
class AulaController extends Controller
{
    public function index()
    {
        $aulas = Aula::all();
        return AulaResource::collection($aulas);
    }

    public function show(Aula $aula)
    {
        return new AulaResource($aula);
    }

    public function store(AulaRequest $request)
    {
        $aula = Aula::create($request->validated());
        return new AulaResource($aula);
    }

    public function update(AulaRequest $request, Aula $aula)
    {
        $aula->update($request->validated());
        return new AulaResource($aula);
    }

    public function destroy(Aula $aula)
    {
        $aula->delete();
        return response()->json(['message' => 'Aula eliminada correctamente']);
    }
    public function showById($id)
    {
        $aula = Aula::findOrFail($id);
        return new AulaResource($aula);
    }
    // En AulaController
    public function obtenerDatosAulas()
    {
        $datos = DB::table('aulas')
            ->join('modulo_aula', 'aulas.id', '=', 'modulo_aula.aula_id')
            ->join('modulos', 'modulo_aula.modulo_id', '=', 'modulos.id')
            ->join('cursos', 'modulos.curso_id', '=', 'cursos.id')
            ->select('aulas.nombre as nombre_aula', 
                     DB::raw('SUM(modulos.h_semanales) as horas_semanales'), 
                     'cursos.nombre as nombre_curso', 
                     'cursos.turno')
            ->groupBy('aulas.nombre', 'cursos.nombre', 'cursos.turno')
            ->havingRaw('SUM(modulos.h_semanales) <= 30')
            ->get();
    
        return response()->json($datos);
    }
    
    
}
