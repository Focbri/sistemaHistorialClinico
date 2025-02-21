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
        //
        Schema::table('consultas', function (Blueprint $table) {
            // Eliminar las columnas antiguas
            $table->dropColumn([
                'informacion_consulta',
                'recetas',
            ]);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('consultas', function (Blueprint $table) {
            // Revertir los cambios (eliminar las nuevas columnas y restaurar las antiguas)
            $table->dropColumn([
                'antecedentes_personales',
                'hta',
                'alergias',
                'dm',
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

            // Restaurar las columnas antiguas (si es necesario)
            $table->string('antecedentes_personales_hta')->nullable();
            $table->string('antecedentes_personales_alergias')->nullable();
            $table->string('antecedentes_personales_dm')->nullable();
            $table->string('antecedentes_personales_otros')->nullable();
            $table->string('antecedentes_patologicos_familiares')->nullable();
            $table->string('cirugias_previas')->nullable();
            $table->string('motivo_consulta')->nullable();
            $table->string('impresion_diagnostica')->nullable();
            $table->string('rp')->nullable();
            $table->string('plan')->nullable();
            $table->string('examenes_indicados')->nullable();
            $table->string('evoluciones')->nullable();
            $table->string('fondo_ojo')->nullable();
        });
    }
};
