<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\ConsultaController;
use App\Http\Controllers\UserController; // Importa el UserController
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
    Route::post('/pacientes/buscar-por-dni', [PacienteController::class, 'buscarPacientePorDNI']);
    
    // Rutas para Consultas
    Route::resource('consultas', ConsultaController::class);

    Route::post('/consultas/buscar-paciente', [ConsultaController::class, 'buscarPacientePorDNI']);

    Route::get('/consultas/{id}/generar-pdf', [ConsultaController::class, 'generarPDF'])->name('consultas.generarPDF');
});

// Rutas de gestión de usuarios (protegidas por autenticación y rol de administrador)
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users.index');
    Route::get('/admin/users/create', [UserController::class, 'create'])->name('admin.users.create');
    Route::post('/admin/users', [UserController::class, 'store'])->name('admin.users.store');
    Route::get('/admin/users/{id}', [UserController::class, 'show'])->name('admin.users.show');
    Route::get('/admin/users/{id}/edit', [UserController::class, 'edit'])->name('admin.users.edit');
    Route::put('/admin/users/{id}', [UserController::class, 'update'])->name('admin.users.update');
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy'])->name('admin.users.destroy');
});

// Rutas de autenticación (login, registro, etc.)
require __DIR__.'/auth.php';