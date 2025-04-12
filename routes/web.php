<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\ConsultaController;
use App\Http\Controllers\Cie10Controller;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InicioController;
use App\Http\Controllers\MedicoController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

// Ruta de inicio (pública)
Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('inicio');
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Rutas protegidas por autenticación
Route::middleware(['auth', 'verified'])->group(function () {
    // Menú principal
    Route::get('/inicio', [InicioController::class, 'index'])->name('inicio');
    
    // Dashboard/Reportes
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
    Route::get('/dashboard/top-cie10', [DashboardController::class, 'getTopCie10']);
    
    // Perfil de usuario
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Pacientes
    Route::resource('pacientes', PacienteController::class);
    Route::post('/pacientes/buscar-por-dni', [PacienteController::class, 'buscarPacientePorDNI'])
         ->name('pacientes.buscar-por-dni');
    
    // Consultas
    Route::resource('consultas', ConsultaController::class);
    Route::put('consultas/{consulta}', [ConsultaController::class, 'update'])
         ->name('consultas.update');
    Route::get('/cie10/search', [Cie10Controller::class, 'search']);
    Route::get('/consultas/verificar-inicio/{pacienteId}', [ConsultaController::class, 'verificarConsultaInicio'])
         ->name('consultas.verificar-inicio');
    Route::match(['get', 'post'], '/consultas/buscar-paciente', [ConsultaController::class, 'buscarPaciente'])
         ->name('consultas.buscar-paciente');
    Route::get('/consultas/{id}/generar-pdf', [ConsultaController::class, 'generarPDF'])
         ->name('consultas.generarPDF');
    Route::get('/terminos-biomicroscopia/search', [ConsultaController::class, 'buscarTerminosBiomicroscopia']);
    Route::post('/terminos-biomicroscopia', [ConsultaController::class, 'guardarTerminoBiomicroscopia']);
    Route::get('/terminos-motivo-consulta/search', [ConsultaController::class, 'buscarTerminosMotivoConsulta']);
    Route::post('/terminos-motivo-consulta', [ConsultaController::class, 'guardarTerminoMotivoConsulta']);
    Route::get('/consultas/historial-diagnosticos/{paciente}', [ConsultaController::class, 'historialDiagnosticos']);
});

// Rutas de administración (requieren autenticación y rol admin)
Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::resource('admin/users', UserController::class)->names('admin.users');
});

// Rutas de autenticación
require __DIR__.'/auth.php';