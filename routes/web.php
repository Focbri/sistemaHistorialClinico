<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\ConsultaController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Ruta de inicio (pública)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Ruta del dashboard (protegida por autenticación)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Rutas de perfil (protegidas por autenticación)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

    // Rutas de pacientes y consultas (protegidas por autenticación)
    Route::middleware('auth')->group(function () {
    // Rutas para Pacientes
    Route::resource('pacientes', PacienteController::class);
    //Route::post('/pacientes/buscar-por-dni', [PacienteController::class, 'buscarPacientePorDNI']);
    
    // Rutas para Consultas
    Route::resource('consultas', ConsultaController::class);
});

// Rutas de autenticación (login, registro, etc.)
require __DIR__.'/auth.php';