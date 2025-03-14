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
        Schema::table('cie10', function (Blueprint $table) {
            //
            $table->string('a00')->nullable();
            $table->string('a01')->nullable();
            $table->string('a02')->nullable();
            $table->string('a04')->nullable();
            $table->string('a05')->nullable();
            $table->string('a06')->nullable();
            $table->string('a07')->nullable();
            $table->string('a08')->nullable();
            $table->string('a09')->nullable();
            $table->string('a15')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cie10', function (Blueprint $table) {
            //
        });
    }
};
