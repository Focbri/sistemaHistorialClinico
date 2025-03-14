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
        Schema::create('cie10', function (Blueprint $table) {
            $table->id();
            $table->string('colera')->nullable(); // Columna para "colera"
            $table->string('fiebres_tifoidea_paratifoidea')->nullable(); // Columna para "fiebres_tifoidea_paratifoidea"
            $table->string('otras_infecciones_debidas_salmonella')->nullable(); // Columna para "otras_infecciones_debidas_salmonella"
            $table->string('shigelosis')->nullable(); // Columna para "shigelosis"
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cie10');
    }
};
