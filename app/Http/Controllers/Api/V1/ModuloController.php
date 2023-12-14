<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ModuloRequest;
use App\Http\Resources\AulaResource;
use App\Models\Modulo;
use App\Http\Resources\CursoResource;
use App\Http\Resources\EspecialidadResource;
use App\Http\Resources\ModuloResource;
use App\Models\Aula;
use App\Models\Departamento;
use Illuminate\Support\Facades\Request;

class ModuloController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $modulos = Modulo::all();
        return ModuloResource::collection($modulos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ModuloRequest $request)
    {
        $modulo = Modulo::create($request->all());
        return new ModuloResource($modulo);
    }

    /**
     * Display the specified resource.
     */
    public function show(Modulo $modulo)
    {
        $response = new ModuloResource($modulo);
        $response['aulas'] = AulaResource::collection($modulo->aulas);
        return $response;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ModuloRequest $request, Modulo $modulo)
    {
        $modulo->update($request->all());
        return new ModuloResource($modulo);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Modulo $modulo)
    {
        $modulo->delete();
        return response()->json(['message' => 'Modulo eliminado correctamente'], 200);
    }

    public function obtenerModulosDeProfesor($departamentoId, $profesorId)
    {
        // Lógica para obtener los módulos del profesor ($profesorId) en el departamento ($departamentoId)
        // Esto podría incluir consultas a la base de datos u otras operaciones para obtener los datos necesarios

        // Por ejemplo, suponiendo que tienes un modelo Modulo y Profesor, podrías hacer algo como:
        $departamento = Departamento::findOrFail($departamentoId);
        $profesor = $departamento->profesores()->findOrFail($profesorId);
        $modulos = $profesor->modulos()->get();
        // $aulasModulos = $profesor->modulos()->get();
        // $aulasDeLosModulos = $aulasModulos->aulas()->get();


        // Aquí obtienes los módulos del profesor con ID $profesorId en el departamento con ID $departamentoId

        // Si los módulos no se encuentran en formato de array como dummy data, puedes transformarlos a ese formato.
        $modulosArray = $modulos->map(function ($modulo) {
            return [
                'id' => $modulo->id,
                'materia' => $modulo->materia,
                'cod' => $modulo->cod,
                'h_semanales' => $modulo->h_semanales,
                'h_totales' => $modulo->h_totales,
                'distribucion_horas' => $modulo->distribucion_horas,
                'turno' => $modulo->turno,
                'observaciones' => $modulo->observaciones,
                'especialidad' => new EspecialidadResource($modulo->especialidad),
                'curso' => new CursoResource($modulo->curso),
                'aula' => $modulo->aulas()->get(),

            ];
        });

        return response()->json($modulosArray);
    }
    public function todasAulas(Modulo $modulo)
    {
        $aula = $modulo->aulas()->get();
        return response()->json(['aulas' => AulaResource::collection($aula)], 200);
    }

    public function modulosPorEspecialidad($especialidadId)
    {
        $modulos = Modulo::where('especialidad_id', $especialidadId)->get();
        return ModuloResource::collection($modulos);
    }
}
