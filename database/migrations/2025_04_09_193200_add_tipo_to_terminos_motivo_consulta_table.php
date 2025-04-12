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
            Schema::table('terminos_motivo_consulta', function (Blueprint $table) {
                $table->enum('tipo', ['inicio', 'signos_sintomas', 'tipo_enfermedad', 'otros'])
                ->after('termino_mc')
                ->default('inicio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('terminos_motivo_consulta', function (Blueprint $table) {
            $table->dropColumn('tipo');
        });
    }
};
