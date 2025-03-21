<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Examen extends Model
{
    //
    use HasFactory;

    // Especifica el nombre de la tabla
    protected $table = 'examenes';

    protected $fillable = [
        'consulta_id',
        'examen_av_sc_od',
        'examen_av_cae_od',
        'examen_av_cc_od',
        'examen_av_sc_oi',
        'examen_av_cae_oi',
        'examen_av_cc_oi',
        'examen_pi_tipo',
        'examen_pi_od',
        'examen_pi_oi',
        'examen_ar_sph_od',
        'examen_ar_cyl_od',
        'examen_ar_ax_od',
        'examen_ar_sph_oi',
        'examen_ar_cyl_oi',
        'examen_ar_ax_oi',
        'examen_keratometria_qd1_od',
        'examen_keratometria_qd2_od',
        'examen_keratometria_eje_od',
        'examen_keratometria_qd1_oi',
        'examen_keratometria_qd2_oi',
        'examen_keratometria_eje_oi',
        'exam_new_distancia_esfera_od',
        'exam_new_distancia_esfera_oi',
        'exam_new_distancia_cilindro_od',
        'exam_new_distancia_cilindro_oi',
        'exam_new_distancia_eje_od',
        'exam_new_distancia_eje_oi',
        'exam_new_distancia_dip',
        'exam_old_distancia_esfera_od',
        'exam_old_distancia_esfera_oi',
        'exam_old_distancia_cilindro_od',
        'exam_old_distancia_cilindro_oi',
        'exam_old_distancia_eje_od',
        'exam_old_distancia_eje_oi',
        'exam_old_distancia_dip',
        'exam_new_cerca_esfera_od',
        'exam_new_cerca_esfera_oi',
        'exam_new_cerca_cilindro_od',
        'exam_new_cerca_cilindro_oi',
        'exam_new_cerca_eje_od',
        'exam_new_cerca_eje_oi',
        'exam_new_cerca_dip',
        'exam_old_cerca_esfera_od',
        'exam_old_cerca_esfera_oi',
        'exam_old_cerca_cilindro_od',
        'exam_old_cerca_cilindro_oi',
        'exam_old_cerca_eje_od',
        'exam_old_cerca_eje_oi',
        'exam_old_cerca_dip',
    ];

    public function consulta()
    {
        return $this->belongsTo(Consulta::class);
    }
}
