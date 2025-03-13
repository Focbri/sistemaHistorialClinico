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
            // Eliminar la restricción única existente
            $table->dropUnique('unique_paciente_tipo_consulta');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consultas', function (Blueprint $table) {
            // Revertir la eliminación de la restricción única (opcional)
            $table->unique(['paciente_id', 'tipo_consulta'], 'unique_paciente_tipo_consulta');
        });
    }
};
