<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\ConsultaController;
use App\Http\Controllers\Cie10Controller;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InicioController;
use App\Http\Controllers\FarmacoController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\RecetaController;
use App\Http\Controllers\RefraccionController;
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
    Route::get('/cie10/search', [DashboardController::class, 'searchCie10']);
    
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

    Route::prefix('cie10')->group(function () {
    Route::get('/search', [Cie10Controller::class, 'search'])->name('cie10.search');
    Route::post('/', [Cie10Controller::class, 'store'])->name('cie10.store');
});

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

    //Farmacos
    Route::get('/farmacos/buscar', [FarmacoController::class, 'buscar'])->name('farmacos.buscar');
    Route::get('/farmacos/{farmaco}/stock', [StockController::class, 'manage'])->name('stocks.manage');
    Route::put('/farmacos/{farmaco}/stock', [StockController::class, 'update'])->name('stocks.update');
    Route::resource('farmacos', FarmacoController::class);    

    //CITAS
    Route::resource('citas', CitaController::class);
    Route::get('/citas', [CitaController::class, 'index'])->name('citas.index');
    Route::post('/citas', [CitaController::class, 'store'])->name('citas.store');
    Route::post('/consultas/buscar-paciente', [ConsultaController::class, 'buscarPaciente']);

    Route::prefix('recetas')->group(function () {
        Route::post('/', [RecetaController::class, 'store'])->name('recetas.store');
        Route::get('/por-consulta/{consultaId}', [RecetaController::class, 'getRecetaPorConsulta'])
             ->name('recetas.get-by-consulta');
        Route::get('/{id}/generar-pdf', [RecetaController::class, 'generarPDFReceta'])
             ->name('recetas.generate-pdf');
    });
    
    Route::prefix('refracciones')->group(function () {
        Route::post('/', [RefraccionController::class, 'store']);
        Route::get('/por-consulta/{consultaId}', [RefraccionController::class, 'getPorConsulta'])
             ->name('refracciones.por-consulta');
        Route::get('/{id}/generar-pdf', [RefraccionController::class, 'generarPDF'])
             ->name('refracciones.pdf');
    });
});

// Rutas de administración (requieren autenticación y rol admin)
Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::resource('admin/users', UserController::class)->names('admin.users');
});

// Rutas de autenticación
require __DIR__.'/auth.php';