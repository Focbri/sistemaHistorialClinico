<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            
            // Relación 1:1 con fármacos (un registro por fármaco)
            $table->foreignId('farmaco_id')
                  ->constrained()
                  ->onDelete('cascade')
                  ->unique();
            
            // Stocks por almacén
            $table->integer('visual')->default(0)->comment('Stock en almacén Visual');
            $table->integer('insamed')->default(0)->comment('Stock en almacén Insamed');
            $table->integer('s_p')->default(0)->comment('Stock en almacén S&P');
            
            // Timestamps
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('stocks');
    }
};