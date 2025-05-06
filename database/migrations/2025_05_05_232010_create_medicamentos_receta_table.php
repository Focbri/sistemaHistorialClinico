<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('medicamentos_receta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('receta_id')->constrained()->onDelete('cascade');
            $table->foreignId('farmaco_id')->nullable()->constrained('farmacos');
            $table->string('nombre_comercial');
            $table->integer('cantidad');
            $table->string('dosis');
            $table->string('frecuencia');
            $table->string('duracion');
            $table->boolean('es_manual')->default(false);
            $table->timestamps();
            
            // Opcional: índice para búsquedas por medicamento
            $table->index('farmaco_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('medicamentos_receta');
    }
};