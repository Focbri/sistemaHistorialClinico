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
            //
            $table->string('fondo_ojo_retina_p_od')->nullable();
            $table->string('fondo_ojo_macula_od')->nullable();
            $table->string('fondo_ojo_vitreo_od')->nullable();
            $table->string('fondo_ojo_disco_o_od')->nullable();
            $table->string('fondo_ojo_vasos_od')->nullable();
            $table->string('fondo_ojo_retina_p_oi')->nullable();
            $table->string('fondo_ojo_macula_oi')->nullable();
            $table->string('fondo_ojo_vitreo_oi')->nullable();
            $table->string('fondo_ojo_disco_o_oi')->nullable();
            $table->string('fondo_ojo_vasos_oi')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consultas', function (Blueprint $table) {
            //
        });
    }
};
