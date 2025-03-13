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
            $table->string('biomicroscopia_movoculares_od')->nullable();
            $table->string('biomicroscopia_parpados_od')->nullable();
            $table->string('biomicroscopia_cornea_od')->nullable();
            $table->string('biomicroscopia_corneaconj_od')->nullable();
            $table->string('biomicroscopia_ca_od')->nullable();
            $table->string('biomicroscopia_iris_od')->nullable();
            $table->string('biomicroscopia_cristalino_od')->nullable();
            $table->string('biomicroscopia_movoculares_oi')->nullable();
            $table->string('biomicroscopia_parpados_oi')->nullable();
            $table->string('biomicroscopia_cornea_oi')->nullable();
            $table->string('biomicroscopia_corneaconj_oi')->nullable();
            $table->string('biomicroscopia_ca_oi')->nullable();
            $table->string('biomicroscopia_iris_oi')->nullable();
            $table->string('biomicroscopia_cristalino_oi')->nullable();
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
