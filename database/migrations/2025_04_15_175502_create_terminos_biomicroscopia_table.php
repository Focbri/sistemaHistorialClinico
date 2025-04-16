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
        Schema::create('terminos_biomicroscopia', function (Blueprint $table) {
            $table->id();
            // Relación con consulta
            $table->foreignId('consulta_id')
                  ->constrained()
                  ->onDelete('cascade');
            
            // Término de biomicroscopía
            $table->string('termino');
            
            // Campos adicionales recomendados
            $table->string('tipo')->nullable(); // Ej: 'od', 'oi', 'general'
            $table->string('seccion')->nullable(); // Ej: 'córnea', 'iris', etc.
            $table->text('descripcion')->nullable();
            $table->boolean('normal')->default(true);
            
            $table->timestamps();
            
            // Índices para optimización
            $table->index('consulta_id');
            $table->index('termino');
            $table->index(['tipo', 'seccion']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('terminos_biomicroscopia');
    }
};
