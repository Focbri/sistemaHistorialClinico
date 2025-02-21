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
        Schema::create('biomicroscopia', function (Blueprint $table) {
            $table->id(); // Columna id (clave primaria autoincremental)
            $table->unsignedBigInteger('consulta_id'); // Columna para la clave foránea
            $table->string('parpados_od')->nullable(); // Párpados Ojo Derecho
            $table->string('parpados_oi')->nullable(); // Párpados Ojo Izquierdo
            $table->string('cornea_od')->nullable(); // Córnea Ojo Derecho
            $table->string('cornea_oi')->nullable(); // Córnea Ojo Izquierdo
            $table->string('camara_anterior_od')->nullable(); // Cámara Anterior Ojo Derecho
            $table->string('camara_anterior_oi')->nullable(); // Cámara Anterior Ojo Izquierdo
            $table->string('iris_od')->nullable(); // Iris Ojo Derecho
            $table->string('iris_oi')->nullable(); // Iris Ojo Izquierdo
            $table->string('cristalino_od')->nullable(); // Cristalino Ojo Derecho
            $table->string('cristalino_oi')->nullable(); // Cristalino Ojo Izquierdo
            $table->timestamps(); // Columnas created_at y updated_at

            // Definir la clave foránea
            $table->foreign('consulta_id')
                  ->references('id')
                  ->on('consultas')
                  ->onDelete('cascade'); // Eliminar en cascada si se elimina la consulta
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biomicroscopia');
    }
};
