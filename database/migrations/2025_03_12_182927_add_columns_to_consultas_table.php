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
            $table->string('examen_av_sc_od')->nullable();
            $table->string('examen_av_cae_od')->nullable();
            $table->string('examen_av_cc_od')->nullable();
            $table->string('examen_av_sc_oi')->nullable();
            $table->string('examen_av_cae_oi')->nullable(); // Corregido
            $table->string('examen_av_cc_oi')->nullable(); // Corregido
            $table->string('examen_pi_od')->nullable();
            $table->string('examen_pi_oi')->nullable();
            $table->string('examen_ar_sph_od')->nullable();
            $table->string('examen_ar_cyl_od')->nullable();
            $table->string('examen_ar_ax_od')->nullable();
            $table->string('examen_ar_sph_oi')->nullable();
            $table->string('examen_ar_cyl_oi')->nullable();
            $table->string('examen_ar_ax_oi')->nullable();
            $table->string('examen_keratometria_qd1_od')->nullable();
            $table->string('examen_keratometria_qd2_od')->nullable();
            $table->string('examen_keratometria_eje_od')->nullable();
            $table->string('examen_keratometria_qd1_oi')->nullable();
            $table->string('examen_keratometria_qd2_oi')->nullable();
            $table->string('examen_keratometria_eje_oi')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consultas', function (Blueprint $table) {
            // Elimina solo las columnas que existen
            if (Schema::hasColumn('consultas', 'examen_av_sc_od')) {
                $table->dropColumn('examen_av_sc_od');
            }
            if (Schema::hasColumn('consultas', 'examen_av_cae_od')) {
                $table->dropColumn('examen_av_cae_od');
            }
            // Repite esto para todas las columnas...
        });
    }
};