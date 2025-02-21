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
        Schema::table('consultas', function (Blueprint $table) {
            //
            $table->string('antecedentes_personales_hta')->nullable(); // HTA (Hipertensión Arterial)
            $table->string('antecedentes_personales_alergias')->nullable(); // Alergias
            $table->string('antecedentes_personales_dm')->nullable(); // DM (Diabetes Mellitus)
            $table->text('antecedentes_personales_otros')->nullable(); // Otros (texto libre)
    
            // Antecedentes patológicos familiares
            $table->text('antecedentes_patologicos_familiares')->nullable();
    
            // Cirugías previas
            $table->text('cirugias_previas')->nullable();
    
            // Motivo de consulta
            $table->text('motivo_consulta')->nullable();
    
            // Impresión diagnóstica
            $table->text('impresion_diagnostica')->nullable();
    
            // RP (Recomendaciones y Plan)
            $table->text('rp')->nullable();
    
            // Plan
            $table->text('plan')->nullable();
    
            // Exámenes indicados
            $table->text('examenes_indicados')->nullable();
    
            // Evoluciones
            $table->text('evoluciones')->nullable();
    
            // Fondo de ojo
            $table->text('fondo_ojo')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consultas', function (Blueprint $table) {
            $table->dropColumn([
                'antecedentes_personales_hta',
                'antecedentes_personales_alergias',
                'antecedentes_personales_dm',
                'antecedentes_personales_otros',
                'antecedentes_patologicos_familiares',
                'cirugias_previas',
                'motivo_consulta',
                'impresion_diagnostica',
                'rp',
                'plan',
                'examenes_indicados',
                'evoluciones',
                'fondo_ojo',
            ]);
        });
    }
};
