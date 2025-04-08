<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\ConsultaController; // Controlador común para funcionalidades compartidas
use App\Http\Controllers\Cie10Controller;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
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

// Rutas de pacientes (protegidas por autenticación)
Route::middleware('auth')->group(function () {
    // Rutas para Pacientes
    Route::resource('pacientes', PacienteController::class);
    Route::post('/pacientes/buscar-por-dni', [PacienteController::class, 'buscarPacientePorDNI'])->name('pacientes.buscar-por-dni');
});

// Rutas de consultas (protegidas por autenticación)
Route::middleware('auth')->group(function () {
    // Ruta para listar consultas
    Route::resource('consultas', ConsultaController::class);
    Route::get('/cie10/search', [Cie10Controller::class, 'search']);
    Route::put('consultas/{consulta}', [ConsultaController::class, 'update'])
    ->name('consultas.update');

    Route::get('/dashboard/top-cie10', [DashboardController::class, 'getTopCie10']);

    // Ruta para verificar si existe una consulta de inicio
    Route::get('/consultas/verificar-inicio/{pacienteId}', [ConsultaController::class, 'verificarConsultaInicio'])->name('consultas.verificar-inicio');

    // Ruta para buscar paciente por DNI (POST)
    Route::match(['get', 'post'], '/consultas/buscar-paciente', [ConsultaController::class, 'buscarPaciente'])
->name('consultas.buscar-paciente');

    // Ruta para generar PDF (común para ambos tipos de consulta)
    Route::get('/consultas/{id}/generar-pdf', [ConsultaController::class, 'generarPDF'])->name('consultas.generarPDF');

    // Rutas para términos de biomicroscopía
    Route::get('/terminos-biomicroscopia/search', [ConsultaController::class, 'buscarTerminosBiomicroscopia']);
    Route::post('/terminos-biomicroscopia', [ConsultaController::class, 'guardarTerminoBiomicroscopia']);
    Route::get('/terminos-motivo-consulta/search', [ConsultaController::class, 'buscarTerminosMotivoConsulta']);
});

// Rutas de gestión de usuarios (protegidas por autenticación y rol de administrador)
Route::middleware(['auth', 'admin'])->group(function () {
    Route::resource('/admin/users', UserController::class)->names('admin.users');
});

// Rutas de autenticación (login, registro, etc.)
require __DIR__.'/auth.php';