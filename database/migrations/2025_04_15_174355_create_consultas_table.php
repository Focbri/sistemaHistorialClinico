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
        Schema::create('consultas', function (Blueprint $table) {
            $table->id();

             // Relación con paciente
             $table->foreignId('paciente_id')->constrained()->onDelete('cascade');
             $table->foreignId('user_id')->constrained()->onDelete('cascade');
             
             // Campos generales
             $table->string('codigo_consulta', 50);
             
             // Antecedentes
             $table->text('antecedentes_personales_hta')->nullable();
             $table->text('antecedentes_personales_alergias')->nullable();
             $table->text('antecedentes_personales_dm')->nullable();
             $table->text('antecedentes_personales_otros')->nullable();
             $table->json('antecedentes_patologicos_familiares')->nullable();
             $table->json('cirugias_previas')->nullable();
             
             // Motivo de consulta
             $table->text('motivo_consulta_inicio')->nullable();
             $table->text('motivo_consulta_signos')->nullable();
             $table->text('motivo_consulta_enfermedad')->nullable();
             $table->text('motivo_consulta_otros')->nullable();
             
             // Diagnóstico y tratamiento
             $table->text('impresion_diagnostica')->nullable();
             $table->json('tratamiento')->nullable();
             $table->json('plan')->nullable();
             $table->json('examenes_indicados_img')->nullable();
             $table->json('examenes_indicados_archivos')->nullable();
             $table->json('evoluciones')->nullable();
             $table->string('tipo_consulta')->nullable();
             
             // Biomicroscopia OD
             $table->text('biomicroscopia_movoculares_od')->nullable();
             $table->text('biomicroscopia_parpados_od')->nullable();
             $table->text('biomicroscopia_cornea_od')->nullable();
             $table->text('biomicroscopia_corneaconj_od')->nullable();
             $table->text('biomicroscopia_ca_od')->nullable();
             $table->text('biomicroscopia_iris_od')->nullable();
             $table->text('biomicroscopia_cristalino_od')->nullable();
             
             // Biomicroscopia OI
             $table->text('biomicroscopia_movoculares_oi')->nullable();
             $table->text('biomicroscopia_parpados_oi')->nullable();
             $table->text('biomicroscopia_cornea_oi')->nullable();
             $table->text('biomicroscopia_corneaconj_oi')->nullable();
             $table->text('biomicroscopia_ca_oi')->nullable();
             $table->text('biomicroscopia_iris_oi')->nullable();
             $table->text('biomicroscopia_cristalino_oi')->nullable();
             
             // Fondo de ojo
             $table->json('fondo_ojo_posiciones')->nullable();
             $table->text('fondo_ojo_retina_p_od')->nullable();
             $table->text('fondo_ojo_macula_od')->nullable();
             $table->text('fondo_ojo_vitreo_od')->nullable();
             $table->text('fondo_ojo_disco_o_od')->nullable();
             $table->text('fondo_ojo_vasos_od')->nullable();
             $table->text('fondo_ojo_macula_oi')->nullable();
             $table->text('fondo_ojo_vitreo_oi')->nullable();
             $table->text('fondo_ojo_disco_o_oi')->nullable();
             $table->text('fondo_ojo_vasos_oi')->nullable();
             $table->text('fondo_ojo_retina_p_oi')->nullable();
             
             // Comentarios
             $table->json('comentario')->nullable();
             
             $table->timestamps();
             
             // Índices
             $table->index('codigo_consulta');
             $table->index('paciente_id');
             $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultas');
    }
};
