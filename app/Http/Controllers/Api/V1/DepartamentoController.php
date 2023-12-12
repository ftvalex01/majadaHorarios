<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Departamento;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;


class DepartamentoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $departamentos = Departamento::all();
        return response()->json($departamentos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $departamentos = Departamento::all();
        return response()->json($departamentos);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    public function profesoresPorDepartamento($id): JsonResponse
    {
        try {
            $departamento = Departamento::findOrFail($id);
            $profesores = $departamento->profesores;

            return response()->json(['profesores' => $profesores], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener profesores del departamento'], 500);
        }
    }
    public function mostrarProfesoresDepartamento($id)
    {
        $departamento = Departamento::findOrFail($id);
        $profesores = $departamento->profesores()->get();

        return view('profesores_departamento', ['profesores' => $profesores]);
    }
}
