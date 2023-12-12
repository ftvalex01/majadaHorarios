<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ModuloRequest;
use App\Http\Resources\AulaResource;
use App\Models\Modulo;

use App\Http\Resources\ModuloResource;


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
}
