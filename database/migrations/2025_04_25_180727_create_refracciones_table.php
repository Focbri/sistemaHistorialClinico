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
        Schema::create('refracciones', function (Blueprint $table) {
            $table->id();
            
            // Relación con la consulta o paciente
            $table->unsignedBigInteger('consulta_id');
            $table->foreign('consulta_id')->references('id')->on('consultas');
            
            // Datos de distancia - Ojo Derecho (OD)
            $table->string('distancia_esfera_od', 10)->nullable();
            $table->string('distancia_cilindro_od', 10)->nullable();
            $table->string('distancia_eje_od', 10)->nullable();
            
            // Datos de distancia - Ojo Izquierdo (OI)
            $table->string('distancia_esfera_oi', 10)->nullable();
            $table->string('distancia_cilindro_oi', 10)->nullable();
            $table->string('distancia_eje_oi', 10)->nullable();
            
            // DIP para distancia
            $table->string('distancia_dip', 10)->nullable();
            
            // Datos de cerca - Ojo Derecho (OD)
            $table->string('cerca_esfera_od', 10)->nullable();
            $table->string('cerca_cilindro_od', 10)->nullable();
            $table->string('cerca_eje_od', 10)->nullable();
            
            // Datos de cerca - Ojo Izquierdo (OI)
            $table->string('cerca_esfera_oi', 10)->nullable();
            $table->string('cerca_cilindro_oi', 10)->nullable();
            $table->string('cerca_eje_oi', 10)->nullable();
            
            // DIP para cerca
            $table->string('cerca_dip', 10)->nullable();
            
            // Adición para cerca
            $table->string('adicion_cerca', 10)->nullable();
            
            // Instrucciones
            $table->string('instrucciones')->nullable();
            
            // Fechas de control
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refracciones');
    }
};
