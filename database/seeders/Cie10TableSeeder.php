<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Cie10;

class Cie10TableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Datos de ejemplo para insertar en la tabla cie10
        $cie10Data = [
            [
                'a00' => 'A000 - COLERA DEBIDO A VIBRIO CHOLERAE 01, BIOTIPO CHOLERAE',
                'a01' => 'A010 - FIEBRE TIFOIDEA',
                'a02' => 'A020 - ENTERITIS DEBIDA A SALMONELLA',
                'a03' => 'A030 - SHIGELOSIS DEBIDA A SHIGELLA DYSENTERIAE',
                'a04' => 'A040 - INFECCION DEBIDA A ESCHERICHIA COLI ENTEROPATOGENA',
            ],
            [
                'a00' => 'A001 - COLERA DEBIDO A VIBRIO CHOLERAE 01, BIOTIPO EL TOR',
                'a01' => 'A0109 - FIEBRE TIFOIDEA CON DIARREA',
                'a02' => 'A021 - SEPSIS DEBIDA A SALMONELLA',
                'a03' => 'A031 - SHIGELOSIS DEBIDA A SHIGELLA FLEXNERI',
                'a04' => 'A041 - INFECCION DEBIDA A ESCHERICHIA COLI ENTEROTOXIGENA',
            ],
            [
                'a00' => 'A009 - COLERA, NO ESPECIFICADO',
                'a01' => 'A011 - FIEBRE PARATIFOIDEA A',
                'a02' => 'A022 - INFECCIONES LOCALIZADAS DEBIDAS A SALMONELLA',
                'a03' => 'A032 - SHIGELOSIS DEBIDA A SHIGELLA BOYDII',
                'a04' => 'A042 - INFECCION DEBIDA A ESCHERICHIA COLI ENTEROINVASIVA',
            ],
            [
                'a00' => 'A0090 - SOSPECHOSO DE COLERA',
                'a01' => 'A012 - FIEBRE PARATIFOIDEA B',
                'a02' => 'A028 - OTRAS INFECCIONES ESPECIFICADAS COMO DEBIDAS A SALMONELLA',
                'a03' => 'A033 - SHIGELOSIS DEBIDA A SHIGELLA SONNEI',
                'a04' => 'A043 - INFECCION DEBIDA A ESCHERICHIA COLI ENTEROHEMORRAGICA',
            ],
            [
                'a00' => 'A0091 - SOSPECHOSO DE COLERA NO ESPECIFICADO SIN DESHIDRATACION',
                'a01' => 'A013 - FIEBRE PARATIFOIDEA C',
                'a02' => 'A029 - INFECCION DEBIDA A SALMONELLA, NO ESPECIFICADA',
                'a03' => 'A038 - OTRAS SHIGELOSIS',
                'a04' => 'A044 - OTRAS INFECCIONES INTESTINALES DEBIDAS A ESCHERICHIA COLI',
            ],
            [
                'a00' => 'A0092 - SOSPECHOSOS DE COLERA NO ESPECIFICADO CON DESHIDRATACION',
                'a01' => 'A014 - FIEBRE PARATIFOIDEA, NO ESPECIFICADA',
                'a03' => 'A039 - SHIGELOSIS DE TIPO NO ESPECIFICADO',
                'a04' => 'A045 - ENTERITIS DEBIDA A CAMPYLOBACTER',
            ],
            [
                'a00' => 'A0093 - SOSPECHOSOS DE COLERA NO ESPECIFICADO CON DESHIDRATACION CON SHOCK',
                'a01' => 'A0141 - FIEBRE PARATIFOIDEA NO ESPECIFICADA CON DIARREA',
                'a04' => 'A046 - ENTERITIS DEBIDA A YERSINIA ENTEROCOLITICA',
            ],
            [
                'a04' => 'A047 - ENTEROCOLITIS DEBIDA A CLOSTRIDIUM DIFFICILE',
            ],
            [
                'a04' => 'A048 - OTRAS INFECCIONES INTESTINALES BACTERIANAS ESPECIFICADAS',
            ],
            [
                'a04' => 'A049 - INFECCION INTESTINAL BACTERIANA, NO ESPECIFICADA',
            ],
            // Agrega más datos según sea necesario
        ];

        // Insertar los datos en la tabla cie10
        foreach ($cie10Data as $data) {
            Cie10::create($data);
        }
    }
}
