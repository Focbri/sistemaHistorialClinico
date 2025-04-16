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
        Schema::table('farmacos', function (Blueprint $table) {
            // 1. Eliminar la restricción de clave foránea si existe
            $table->dropForeign(['componente_id']);
            
            // 2. Eliminar la columna componente_id
            $table->dropColumn('componente_id');
            
            // 3. Agregar la nueva columna de texto
            $table->string('componente_activo')->after('nombre_comercial');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('farmacos', function (Blueprint $table) {
            // Para revertir (opcional)
            $table->dropColumn('componente_activo');
            $table->unsignedBigInteger('componente_id')->nullable();
            $table->foreign('componente_id')->references('id')->on('componentes');
        });
    }
};
