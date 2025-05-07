<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Refraccion extends Model
{
    use HasFactory;

    protected $table = 'refracciones';

    protected $fillable = [
        'consulta_id',
        // Campos para examen previo - Distancia
        'exam_old_distancia_esfera_od',
        'exam_old_distancia_cilindro_od',
        'exam_old_distancia_eje_od',
        'exam_old_distancia_esfera_oi',
        'exam_old_distancia_cilindro_oi',
        'exam_old_distancia_eje_oi',
        'exam_old_distancia_dip',
        // Campos para examen previo - Cerca
        'exam_old_cerca_esfera_od',
        'exam_old_cerca_cilindro_od',
        'exam_old_cerca_eje_od',
        'exam_old_cerca_esfera_oi',
        'exam_old_cerca_cilindro_oi',
        'exam_old_cerca_eje_oi',
        'exam_old_cerca_dip',
        // Campos para examen actual - Distancia
        'exam_new_distancia_esfera_od',
        'exam_new_distancia_cilindro_od',
        'exam_new_distancia_eje_od',
        'exam_new_distancia_esfera_oi',
        'exam_new_distancia_cilindro_oi',
        'exam_new_distancia_eje_oi',
        'exam_new_distancia_dip',
        // Campos para examen actual - Cerca
        'exam_new_cerca_esfera_od',
        'exam_new_cerca_cilindro_od',
        'exam_new_cerca_eje_od',
        'exam_new_cerca_esfera_oi',
        'exam_new_cerca_cilindro_oi',
        'exam_new_cerca_eje_oi',
        'exam_new_cerca_dip',
        // Campos adicionales
        'instrucciones',
        'adiciones',
    ];

    public function consulta()
    {
        return $this->belongsTo(Consulta::class);
    }
}