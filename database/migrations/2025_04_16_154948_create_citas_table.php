<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('citas', function (Blueprint $table) {
            $table->id();
            
            // Relaciones con eliminación en cascada
            $table->foreignId('paciente_id')
                  ->constrained('pacientes')
                  ->onDelete('cascade'); // Elimina cita si se elimina paciente
            
            $table->foreignId('medico_id')
                  ->constrained('users')
                  ->onDelete('cascade'); // Elimina cita si se elimina médico
                  
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade'); // Usuario que creó la cita
            
            // Datos principales de la cita
            $table->dateTime('fecha_hora');
            $table->string('motivo');
            $table->string('codigo_cita')->nullable(); // Código único de la cita
            $table->enum('estado', ['programada', 'completada', 'cancelada'])->default('programada');
            
            $table->timestamps();
            
            // Índices para búsquedas rápidas
            $table->index(['medico_id', 'fecha_hora']);
            $table->index('codigo_cita'); // Índice para búsqueda por código
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citas');
    }
};