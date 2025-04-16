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
            // Relaciones básicas
            $table->foreignId('paciente_id')->constrained('pacientes');
            $table->foreignId('medico_id')->constrained('users');
            
            // Datos principales de la cita
            $table->dateTime('fecha_hora');
            $table->string('motivo');
            $table->enum('estado', ['programada', 'completada', 'cancelada'])->default('programada');
            
            $table->timestamps();
            
            // Índice para búsquedas rápidas
            $table->index(['medico_id', 'fecha_hora']);
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
