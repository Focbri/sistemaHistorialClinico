<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('farmacos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_comercial');
            $table->unsignedBigInteger('componente_id'); // Cambiado temporalmente
            
            $table->enum('presentacion', [
                'tableta', 'capsula', 'frasco', 'tubo', 
                'ampolla', 'sobre', 'jarabe', 'crema', 
                'supositorio', 'otro'
            ]);
            
            $table->string('concentracion')->nullable();
            $table->timestamps();
            
            $table->index('nombre_comercial');
        });

        // Añadir la restricción de clave foránea después
        Schema::table('farmacos', function (Blueprint $table) {
            $table->foreign('componente_id')
                  ->references('id')
                  ->on('componentes')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('farmacos', function (Blueprint $table) {
            $table->dropForeign(['componente_id']);
        });
        
        Schema::dropIfExists('farmacos');
    }
};
