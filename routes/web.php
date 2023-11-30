<?php

use Illuminate\Support\Facades\Route;

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
})->middleware('auth');