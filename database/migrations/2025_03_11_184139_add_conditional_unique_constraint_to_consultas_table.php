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
             // Agregar restricción única condicional para tipo_consulta = 'inicio'
            $table->unique(['paciente_id', 'tipo_consulta'], 'unique_paciente_tipo_inicio')
            ->where('tipo_consulta', 'inicio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consultas', function (Blueprint $table) {
            //
            // Eliminar la restricción única condicional (opcional)
            $table->dropUnique('unique_paciente_tipo_inicio');
        });
    }
};
