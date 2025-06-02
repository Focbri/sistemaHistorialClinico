<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\ConsultaController;
use App\Http\Controllers\Cie10Controller;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\RecetaController;
use App\Http\Controllers\RefraccionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FarmacoController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\CirugiaController;

Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    // API de Pacientes
    Route::post('/pacientes', [PacienteController::class, 'store'])->name('api.pacientes.store');
    Route::put('/pacientes/{paciente}', [PacienteController::class, 'update'])->name('api.pacientes.update');
    Route::delete('/pacientes/{paciente}', [PacienteController::class, 'destroy'])->name('api.pacientes.destroy');
    
    // API de Consultas
    Route::get('/consultas/verificar-inicio/{pacienteId}', [ConsultaController::class, 'verificarConsultaInicio']);
    Route::get('/consultas/{consulta}/pdf', [ConsultaController::class, 'generarPDF']);
    Route::get('/consultas/historial-diagnosticos/{paciente}', [ConsultaController::class, 'historialDiagnosticos']);
    Route::apiResource('consultas', ConsultaController::class)->except(['create', 'edit']);
    
    // API de CIE10
    Route::get('/cie10/search', [Cie10Controller::class, 'search']);
    Route::post('/cie10', [Cie10Controller::class, 'store']);
    
    // API de Citas
    Route::get('/citas/asignadas', [CitaController::class, 'asignadas']);
    Route::put('/citas/{cita}/status', [CitaController::class, 'updateStatus']);
    Route::apiResource('citas', CitaController::class)->except(['create', 'edit', 'show']);
    Route::get('/citas/buscar-paciente', [PacienteController::class, 'buscarPacienteParaCita']);
    
    // API de Fármacos y Stock
    Route::prefix('farmacos')->group(function () {
        // Búsqueda de fármacos
        Route::get('/buscar', [FarmacoController::class, 'buscar'])->name('api.farmacos.buscar');
        Route::get('/buscar-con-stock', [FarmacoController::class, 'buscarConStock'])->name('api.farmacos.buscar-con-stock');
        
        // CRUD de fármacos
        Route::post('/', [FarmacoController::class, 'store'])->name('api.farmacos.store');
        Route::put('/{farmaco}', [FarmacoController::class, 'update'])->name('api.farmacos.update');
        Route::delete('/{farmaco}', [FarmacoController::class, 'destroy'])->name('api.farmacos.destroy');
        
        // Gestión de stock (API)
        Route::put('/{farmaco}/stock', [FarmacoController::class, 'updateStock'])->name('farmacos.stock.update');
        
        // Operaciones de stock general
        Route::prefix('stock')->group(function () {
            Route::post('/verificar', [StockController::class, 'verificarStock'])->name('api.farmacos.stock.verificar');
            Route::post('/actualizar-por-receta', [StockController::class, 'actualizarPorReceta'])->name('api.farmacos.stock.actualizar-por-receta');
        });
    });
    
    // API de Recetas
    Route::post('/recetas', [RecetaController::class, 'store']);
    Route::get('/recetas/por-consulta/{consultaId}', [RecetaController::class, 'getRecetaPorConsulta']);
    Route::get('/recetas/{id}/generar-pdf', [RecetaController::class, 'generarPDFReceta']);
    Route::post('/recetas/verificar-stock', [RecetaController::class, 'verificarStockReceta']);
    
    // API de Refracciones
    Route::post('/refracciones', [RefraccionController::class, 'store']);
    Route::put('/refracciones/{refraccion}', [RefraccionController::class, 'update']);
    Route::get('/refracciones/por-consulta/{consultaId}', [RefraccionController::class, 'getPorConsulta']);
    Route::get('/refracciones/{id}/generar-pdf', [RefraccionController::class, 'generarPDF']);
    
    // API de Dashboard
    Route::get('/dashboard/top-cie10', [DashboardController::class, 'getTopCie10']);
    
    // API de Cirugías
    Route::get('/cirugias/{cirugia}/pdf', [CirugiaController::class, 'generarPDF']);
    Route::apiResource('cirugias', CirugiaController::class)->except(['create', 'edit']);
    
    // API de Admin (Usuarios)
    Route::middleware('admin')->group(function () {
        Route::apiResource('users', UserController::class)->except(['create', 'edit']);
    });
});