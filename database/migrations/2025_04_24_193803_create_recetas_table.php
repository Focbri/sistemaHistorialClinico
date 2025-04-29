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
        Schema::create('recetas', function (Blueprint $table) {
            $table->id();
            // Relación con la consulta
            $table->foreignId('consulta_id')->constrained('consultas')->onDelete('cascade');
            
            // Relación con el paciente
            $table->foreignId('paciente_id')->constrained('pacientes');
            
            // Relación con el médico (asumiendo que los médicos están en la tabla users)
            $table->foreignId('medico_id')->constrained('users');
            
            // Información de diagnóstico
            $table->text('diagnostico');

            $table->json('medicamentos'); 
            
            // Ruta del PDF almacenado
            $table->string('pdf_path')->nullable();
            
            // Fecha de emisión de la receta
            $table->date('fecha');
            
            // Campos de auditoría
            $table->timestamps();
            
            // Índices para mejorar el rendimiento en búsquedas comunes
            $table->index('paciente_id');
            $table->index('medico_id');
            $table->index('fecha');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recetas');
    }
};
