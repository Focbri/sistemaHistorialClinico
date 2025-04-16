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
        Schema::create('examenes', function (Blueprint $table) {
            $table->id();
            // Relación con consulta
            $table->foreignId('consulta_id')
                  ->constrained()
                  ->onDelete('cascade');

            // Examen de agudeza visual
            $table->string('examen_av_sc_od')->nullable();
            $table->string('examen_av_cae_od')->nullable();
            $table->string('examen_av_cc_od')->nullable();
            $table->string('examen_av_sc_oi')->nullable();
            $table->string('examen_av_cae_oi')->nullable();
            $table->string('examen_av_cc_oi')->nullable();
            
            // Examen de presión intraocular
            $table->string('examen_pi_tipo')->nullable();
            $table->string('examen_pi_od')->nullable();
            $table->string('examen_pi_oi')->nullable();
            
            // Refracción
            $table->string('examen_ar_sph_od')->nullable();
            $table->string('examen_ar_cyl_od')->nullable();
            $table->string('examen_ar_ax_od')->nullable();
            $table->string('examen_ar_sph_oi')->nullable();
            $table->string('examen_ar_cyl_oi')->nullable();
            $table->string('examen_ar_ax_oi')->nullable();
            
            // Queratometría
            $table->string('examen_keratometria_qd1_od')->nullable();
            $table->string('examen_keratometria_qd2_od')->nullable();
            $table->string('examen_keratometria_eje_od')->nullable();
            $table->string('examen_keratometria_qd1_oi')->nullable();
            $table->string('examen_keratometria_qd2_oi')->nullable();
            $table->string('examen_keratometria_eje_oi')->nullable();

            // Examen de refracción - Distancia
            $table->string('exam_new_distancia_esfera_od')->nullable();
            $table->string('exam_new_distancia_esfera_oi')->nullable();
            $table->string('exam_new_distancia_cilindro_od')->nullable();
            $table->string('exam_new_distancia_cilindro_oi')->nullable();
            $table->string('exam_new_distancia_eje_od')->nullable();
            $table->string('exam_new_distancia_eje_oi')->nullable();
            $table->string('exam_new_distancia_dip')->nullable();
            $table->string('exam_old_distancia_esfera_od')->nullable();
            $table->string('exam_old_distancia_esfera_oi')->nullable();
            $table->string('exam_old_distancia_cilindro_od')->nullable();
            $table->string('exam_old_distancia_cilindro_oi')->nullable();
            $table->string('exam_old_distancia_eje_od')->nullable();
            $table->string('exam_old_distancia_eje_oi')->nullable();
            $table->string('exam_old_distancia_dip')->nullable();
            
            // Examen de refracción - Cerca
            $table->string('exam_new_cerca_esfera_od')->nullable();
            $table->string('exam_new_cerca_esfera_oi')->nullable();
            $table->string('exam_new_cerca_cilindro_od')->nullable();
            $table->string('exam_new_cerca_cilindro_oi')->nullable();
            $table->string('exam_new_cerca_eje_od')->nullable();
            $table->string('exam_new_cerca_eje_oi')->nullable();
            $table->string('exam_new_cerca_dip')->nullable();
            $table->string('exam_old_cerca_esfera_od')->nullable();
            $table->string('exam_old_cerca_esfera_oi')->nullable();
            $table->string('exam_old_cerca_cilindro_od')->nullable();
            $table->string('exam_old_cerca_cilindro_oi')->nullable();
            $table->string('exam_old_cerca_eje_od')->nullable();
            $table->string('exam_old_cerca_eje_oi')->nullable();
            $table->string('exam_old_cerca_dip')->nullable();
            
            $table->timestamps();
            
            // Índices
            $table->index('consulta_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('examenes');
    }
};
