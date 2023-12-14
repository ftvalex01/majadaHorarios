<?php

use App\Http\Controllers\Api\V1\DepartamentoController;
use App\Http\Controllers\EspecialidadController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JefeDeDepartamentoController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return response()->file(public_path('index.html'));
});
Route::get('/teacherSheets', function () {
    return response()->file(public_path('views/teacherSheets.html'));
});


Route::get('/jefeDeDepartamento', function () {
    return response()->file(public_path('views/jefeDeDepartamento.html'));
});

Route::get('/jefeDeEstudios', function () {
    return response()->file(public_path('views/jefeDeEstudios.html'));
});
Route::get('departamentos/{id}/profesores', function () {
    return response()->file(public_path('views/profesoresDepartamento.html'));
});



Route::get('/admin', function () {
    return response()->file(public_path('views/admin.html'));
});
