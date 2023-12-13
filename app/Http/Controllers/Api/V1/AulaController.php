<?php

namespace App\Http\Controllers;

use App\Models\Aula;
use App\Http\Requests\AulaRequest;
use App\Http\Resources\AulaResource;
use Illuminate\Http\Request;

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
}
