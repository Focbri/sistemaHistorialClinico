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
    ];

    public function consulta()
    {
        return $this->belongsTo(Consulta::class);
    }
}
