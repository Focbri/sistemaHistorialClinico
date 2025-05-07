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
        Schema::create('cirugias', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_historial');
            $table->foreignId('paciente_id')->constrained();
            $table->text('diagnostico_preoperatorio');
            $table->text('diagnostico_postoperatorio')->nullable();
            $table->string('cirugia');
            $table->string('cirujano_principal');
            $table->string('cirujano_ayudante')->nullable();
            $table->string('anestesiologo');
            $table->string('tipo_anestesia');
            $table->json('personal_enfermeria')->nullable();
            $table->text('hallazgos')->nullable();
            $table->text('procedimiento');
            $table->date('fecha_cirugia');
            $table->time('hora_inicio');
            $table->time('hora_fin')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cirugias');
    }
};
