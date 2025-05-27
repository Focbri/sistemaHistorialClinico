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
use App\Http\Controllers\CirugiaController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Application;
use Inertia\Inertia;

// Ruta de inicio (pública)
Route::get('/', function () {
    return Auth::check() 
        ? redirect()->route('inicio')
        : Inertia::render('Welcome', [
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
    
    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard.index');
        Route::get('/top-cie10', [DashboardController::class, 'getTopCie10'])->name('dashboard.top-cie10');
    });
    
    // Perfil de usuario
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
    
    // Pacientes
    Route::get('pacientes/create', [PacienteController::class, 'create'])
    ->name('pacientes.create');
    Route::resource('pacientes', PacienteController::class);
    Route::post('pacientes/buscar-por-dni', [PacienteController::class, 'buscarPacientePorDNI'])
        ->name('pacientes.buscar-por-dni');
    // Nueva ruta para obtener consultas del paciente
    Route::get('pacientes/{paciente}/consultas', [PacienteController::class, 'consultas'])
        ->name('pacientes.consultas')
    ->middleware(['auth', 'verified']);
    
    // Consultas
    Route::get('consultas/create', [ConsultaController::class, 'create'])
    ->name('consultas.create');
    Route::resource('consultas', ConsultaController::class);
    Route::prefix('consultas')->group(function () {
        Route::get('verificar-inicio/{pacienteId}', [ConsultaController::class, 'verificarConsultaInicio'])
             ->name('consultas.verificar-inicio');
        Route::get('buscar-paciente-completo/{dni}', [ConsultaController::class, 'buscarPacienteCompleto'])
            ->name('consultas.buscar-paciente-completo');
        Route::match(['get', 'post'], 'buscar-paciente', [ConsultaController::class, 'buscarPaciente'])
             ->name('consultas.buscar-paciente');
             //PDF PARA CONSULTA
        Route::get('{consulta}/pdf', [ConsultaController::class, 'generarPDF'])
         ->name('consultas.pdf');
        Route::get('historial-diagnosticos/{paciente}', [ConsultaController::class, 'historialDiagnosticos'])
             ->name('consultas.historial-diagnosticos');
    });

    // Cirugías
    Route::prefix('cirugias')->group(function () {
        Route::get('/', [CirugiaController::class, 'index'])->name('cirugias.index');
        Route::get('/create', [CirugiaController::class, 'create'])
        ->name('cirugias.create')
        ->middleware(['auth', 'verified']);
        Route::post('/', [CirugiaController::class, 'store'])
        ->name('cirugias.store')
        ->middleware(['auth', 'verified']);
        Route::get('/{cirugia}', [CirugiaController::class, 'show'])->name('cirugias.show');
        Route::get('/{cirugia}/edit', [CirugiaController::class, 'edit'])->name('cirugias.edit');
        Route::put('/{cirugia}', [CirugiaController::class, 'update'])->name('cirugias.update');
        Route::delete('/{cirugia}', [CirugiaController::class, 'destroy'])->name('cirugias.destroy');

        
        // Ruta para generar PDF
        Route::get('/cirugias/{cirugia}/pdf', [CirugiaController::class, 'generarPDF'])
     ->name('cirugias.pdf')
     ->middleware('auth');
    });

    Route::post('pacientes/buscar-por-dni', [PacienteController::class, 'buscarPorDNI'])
    ->name('pacientes.buscar-por-dni');

    // CIE10
    Route::prefix('cie10')->group(function () {
        Route::get('search', [Cie10Controller::class, 'search'])->name('cie10.search');
        Route::post('/', [Cie10Controller::class, 'store'])->name('cie10.store');
    });

    // Términos médicos
    Route::prefix('terminos')->group(function () {
        Route::get('biomicroscopia/search', [ConsultaController::class, 'buscarTerminosBiomicroscopia'])
             ->name('terminos.biomicroscopia.search');
        Route::post('biomicroscopia', [ConsultaController::class, 'guardarTerminoBiomicroscopia'])
             ->name('terminos.biomicroscopia.store');
        Route::get('motivo-consulta/search', [ConsultaController::class, 'buscarTerminosMotivoConsulta'])
             ->name('terminos.motivo-consulta.search');
        Route::post('motivo-consulta', [ConsultaController::class, 'guardarTerminoMotivoConsulta'])
             ->name('terminos.motivo-consulta.store');
    });

    Route::prefix('farmacos')->group(function () {
        // Ruta de búsqueda PRIMERO, antes del resource
        Route::get('buscar', [StockController::class, 'buscarFarmacos'])->name('farmacos.buscar');
        
        // Resource para operaciones CRUD
        Route::resource('/', FarmacoController::class)->names([
            'index' => 'farmacos.index',
            'store' => 'farmacos.store',
            'update' => 'farmacos.update',
            'destroy' => 'farmacos.destroy',
            'create' => 'farmacos.create',
            'edit' => 'farmacos.edit'
        ])->parameters(['' => 'farmaco']);
        
        // Gestión de stock
        Route::prefix('{farmaco}/stock')->group(function () {
            Route::get('/', [StockController::class, 'manage'])->name('farmacos.stock.manage');
            Route::put('/', [StockController::class, 'update'])->name('farmacos.stock.update');
        });
    
         // Operaciones de stock (general)
    Route::prefix('stock')->group(function () {
        Route::post('actualizar-por-receta', [StockController::class, 'actualizarPorReceta'])
            ->name('farmacos.stock.actualizar-por-receta');
            
        Route::post('verificar', [StockController::class, 'verificarStock'])
            ->name('farmacos.stock.verificar');
    });
    });

    // Citas
    Route::resource('citas', CitaController::class)->except(['show']);
    Route::get('/citas/buscar-paciente', [PacienteController::class, 'buscarPacienteParaCita'])
    ->name('citas.buscar-paciente');
    Route::get('/citas/asignadas', [CitaController::class, 'asignadas'])
    ->middleware(['auth', 'verified'])
    ->name('citas.asignadas');
    Route::put('/citas/{cita}/status', [CitaController::class, 'updateStatus'])
    ->name('citas.update-status')
    ->middleware(['auth', 'verified']);

    // Recetas
    Route::prefix('recetas')->group(function () {
        Route::post('/', [RecetaController::class, 'store'])->name('recetas.store');
        Route::get('por-consulta/{consultaId}', [RecetaController::class, 'getRecetaPorConsulta'])
             ->name('recetas.get-by-consulta');
        Route::get('{id}/generar-pdf', [RecetaController::class, 'generarPDFReceta'])
             ->name('recetas.generate-pdf');
        Route::post('verificar-stock', [RecetaController::class, 'verificarStockReceta'])
             ->name('recetas.verificar-stock');
    });
    
    Route::prefix('refracciones')->group(function () {
        Route::post('/', [RefraccionController::class, 'store'])->name('refracciones.store');
        Route::put('/{refraccion}', [RefraccionController::class, 'update'])->name('refracciones.update');
        Route::get('por-consulta/{consultaId}', [RefraccionController::class, 'getPorConsulta'])
             ->name('refracciones.por-consulta');
        Route::get('{id}/generar-pdf', [RefraccionController::class, 'generarPDF'])
             ->name('refracciones.pdf');
    });
});

// Rutas de administración
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {
    Route::resource('users', UserController::class)->names('admin.users');
});

require __DIR__.'/auth.php';