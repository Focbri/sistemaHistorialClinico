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
             // Campos principales según tu modelo
             $table->string('list_01')->nullable();
             $table->text('list_otros')->nullable();
             
             // Campos estándar de Laravel
             $table->timestamps();
             
             // Índices para mejorar búsquedas
             $table->index('list_01');
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
