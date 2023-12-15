<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\CursoRequest;
use App\Http\Resources\CursoResource;
use App\Models\Curso;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
class CursoController extends Controller
{
    public function index()
    {
        $cursos = Curso::all();
        return CursoResource::collection($cursos);
    }

    public function store(CursoRequest $request)
    {
        $curso = Curso::create($request->validated());
        return new CursoResource($curso);
    }

    public function show($id)
    {
        $curso = Curso::findOrFail($id);
        return new CursoResource($curso);
    }

    public function update(CursoRequest $request, $id)
    {
        $curso = Curso::findOrFail($id);
        $curso->update($request->validated());
        return new CursoResource($curso);
    }

    public function destroy($id)
    {
        $curso = Curso::findOrFail($id);
        $curso->delete();
        return response()->json(null, 204);
    }
}
