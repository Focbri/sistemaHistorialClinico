<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('refracciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consulta_id')->constrained()->onDelete('cascade');
            
            // Examen Previo - Distancia
            $table->string('exam_old_distancia_esfera_od', 10)->nullable();
            $table->string('exam_old_distancia_cilindro_od', 10)->nullable();
            $table->string('exam_old_distancia_eje_od', 10)->nullable();
            $table->string('exam_old_distancia_esfera_oi', 10)->nullable();
            $table->string('exam_old_distancia_cilindro_oi', 10)->nullable();
            $table->string('exam_old_distancia_eje_oi', 10)->nullable();
            $table->string('exam_old_distancia_dip', 10)->nullable();
            
            // Examen Previo - Cerca
            $table->string('exam_old_cerca_esfera_od', 10)->nullable();
            $table->string('exam_old_cerca_cilindro_od', 10)->nullable();
            $table->string('exam_old_cerca_eje_od', 10)->nullable();
            $table->string('exam_old_cerca_esfera_oi', 10)->nullable();
            $table->string('exam_old_cerca_cilindro_oi', 10)->nullable();
            $table->string('exam_old_cerca_eje_oi', 10)->nullable();
            $table->string('exam_old_cerca_dip', 10)->nullable();
            
            // Examen Actual - Distancia
            $table->string('exam_new_distancia_esfera_od', 10)->nullable();
            $table->string('exam_new_distancia_cilindro_od', 10)->nullable();
            $table->string('exam_new_distancia_eje_od', 10)->nullable();
            $table->string('exam_new_distancia_esfera_oi', 10)->nullable();
            $table->string('exam_new_distancia_cilindro_oi', 10)->nullable();
            $table->string('exam_new_distancia_eje_oi', 10)->nullable();
            $table->string('exam_new_distancia_dip', 10)->nullable();
            
            // Examen Actual - Cerca
            $table->string('exam_new_cerca_esfera_od', 10)->nullable();
            $table->string('exam_new_cerca_cilindro_od', 10)->nullable();
            $table->string('exam_new_cerca_eje_od', 10)->nullable();
            $table->string('exam_new_cerca_esfera_oi', 10)->nullable();
            $table->string('exam_new_cerca_cilindro_oi', 10)->nullable();
            $table->string('exam_new_cerca_eje_oi', 10)->nullable();
            $table->string('exam_new_cerca_dip', 10)->nullable();
            
            // Campos adicionales
            $table->text('instrucciones')->nullable();
            $table->text('adiciones')->nullable();
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('refracciones');
    }
};