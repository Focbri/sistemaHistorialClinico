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
        Schema::create('terminos_motivo_consulta', function (Blueprint $table) {
            $table->id();
            // Relación con consulta
            $table->foreignId('consulta_id')
                  ->constrained()
                  ->onDelete('cascade');
            
            // Término del motivo de consulta
            $table->string('termino_mc');
            
            // Campos adicionales recomendados
            $table->string('tipo')->nullable(); // Ej: 'principal', 'secundario'
            $table->integer('orden')->default(0); // Para priorizar términos
            $table->text('descripcion')->nullable(); // Detalles adicionales
            
            $table->timestamps();
            
            // Índices para optimización
            $table->index('consulta_id');
            $table->index('termino_mc');
            $table->index(['consulta_id', 'tipo']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('terminos_motivo_consulta');
    }
};
