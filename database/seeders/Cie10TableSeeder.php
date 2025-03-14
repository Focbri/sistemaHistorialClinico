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
                'colera' => 'Cólera A00',
                'fiebres_tifoidea_paratifoidea' => 'Fiebre tifoidea A01',
                'otras_infecciones_debidas_salmonella' => 'Infección por Salmonella A02',
                'shigelosis' => 'Shigelosis A03',
            ],
            [
                'colera' => 'Cólera A01',
                'fiebres_tifoidea_paratifoidea' => 'Fiebre paratifoidea A02',
                'otras_infecciones_debidas_salmonella' => 'Infección por Salmonella A03',
                'shigelosis' => 'Shigelosis A04',
            ],
            [
                'colera' => 'Cólera A02',
                'fiebres_tifoidea_paratifoidea' => 'Fiebre tifoidea A03',
                'otras_infecciones_debidas_salmonella' => 'Infección por Salmonella A04',
                'shigelosis' => 'Shigelosis A05',
            ],
            // Agrega más datos según sea necesario
        ];

        // Insertar los datos en la tabla cie10
        foreach ($cie10Data as $data) {
            Cie10::create($data);
        }
    }
}
