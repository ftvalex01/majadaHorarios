<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ModuloController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\V1\DepartamentoController;
use App\Http\Controllers\Api\V1\ModuloAulaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Rutas para el registro y inicio de sesión
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas por Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Ruta para cerrar sesión
    Route::post('/logout', [AuthController::class, 'logout']);

    // Rutas de recursos protegidos
    Route::get('/user', [AuthController::class, 'getAllUsers']);
    Route::apiResource('modulos', ModuloController::class)->missing(function ($instance) {
        return response()->json(['error' => 'Modulo no encontrado'], 404);
    });
    Route::apiResource('departamentos', DepartamentoController::class)->missing(function ($instance) {
        return response()->json(['error' => 'Modulo no encontrado'], 404);
    });
    Route::get('/modulos/{modulo}/aulas', [ModuloController::class, 'todasAulas']);
    Route::get('departamentos/{id}/profesores', [DepartamentoController::class, 'profesoresPorDepartamento'])->name('departamentos.profesores');
});
