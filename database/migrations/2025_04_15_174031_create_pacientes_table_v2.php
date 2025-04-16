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
        Schema::create('pacientes', function (Blueprint $table) {
            $table->id();
            // Campos básicos
            $table->string('apellido_paterno');
            $table->string('apellido_materno');
            $table->string('nombres');
            $table->date('fecha_nacimiento')->nullable();
            $table->integer('edad')->nullable();
            $table->decimal('peso', 5, 2)->nullable();
            $table->string('dni')->unique();
            $table->enum('sexo', ['M', 'F'])->nullable();
            $table->enum('estado_civil', ['soltero', 'casado', 'divorciado', 'viudo'])->nullable();
            $table->string('ocupacion')->nullable();
            $table->string('direccion')->nullable();
            $table->string('telefono')->nullable();
            $table->string('email')->unique();
            $table->string('procedencia')->nullable();
            $table->string('acompañante')->nullable();
            $table->string('referido')->nullable();
            $table->json('foto_perfil')->nullable();
            $table->timestamps();

            $table->index('dni');
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pacientes_table_v2');
    }
};
