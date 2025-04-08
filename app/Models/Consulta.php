<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Consulta extends Model
{
    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array
     */
    use HasFactory;

    protected $fillable = [ 
        'paciente_id',
        'codigo_consulta',
        'antecedentes_personales_hta',
        'antecedentes_personales_alergias',
        'antecedentes_personales_dm',
        'antecedentes_personales_otros',
        'antecedentes_patologicos_familiares',
        'cirugias_previas',
        'motivo_consulta',
        'impresion_diagnostica',
        'tratamiento',
        'plan',
        'examenes_indicados_img',
        'examenes_indicados_archivos',
        'evoluciones',
        'tipo_consulta',
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
        'biomicroscopia_movoculares_od',
        'biomicroscopia_parpados_od',
        'biomicroscopia_cornea_od',
        'biomicroscopia_corneaconj_od',
        'biomicroscopia_ca_od',
        'biomicroscopia_iris_od',
        'biomicroscopia_cristalino_od',
        'biomicroscopia_movoculares_oi',
        'biomicroscopia_parpados_oi',
        'biomicroscopia_cornea_oi',
        'biomicroscopia_corneaconj_oi',
        'biomicroscopia_ca_oi',
        'biomicroscopia_iris_oi',
        'biomicroscopia_cristalino_oi',
        //
        'fondo_ojo_posiciones',
        'fondo_ojo_retina_p_od',
        'fondo_ojo_macula_od',
        'fondo_ojo_vitreo_od',
        'fondo_ojo_disco_o_od',
        'fondo_ojo_vasos_od',
        'fondo_ojo_macula_oi',
        'fondo_ojo_vitreo_oi',
        'fondo_ojo_disco_o_oi',
        'fondo_ojo_vasos_oi',
        'fondo_ojo_retina_p_oi',
        'exam_new_distancia_esfera_od' ,
        'exam_new_distancia_esfera_oi' ,
        'exam_new_distancia_cilindro_od' ,
        'exam_new_distancia_cilindro_oi' ,
        'exam_new_distancia_eje_od' ,
        'exam_new_distancia_eje_oi' ,
        'exam_new_distancia_dip' ,
        'exam_old_distancia_esfera_od' ,
        'exam_old_distancia_esfera_oi' ,
        'exam_old_distancia_cilindro_od' ,
        'exam_old_distancia_cilindro_oi' ,
        'exam_old_distancia_eje_od' ,
        'exam_old_distancia_eje_oi' ,
        'exam_old_distancia_dip' ,

        'exam_new_cerca_esfera_od' ,
        'exam_new_cerca_esfera_oi' ,
        'exam_new_cerca_cilindro_od' ,
        'exam_new_cerca_cilindro_oi' ,
        'exam_new_cerca_eje_od' ,
        'exam_new_cerca_eje_oi' ,
        'exam_new_cerca_dip' ,
        'exam_old_cerca_esfera_od' ,
        'exam_old_cerca_esfera_oi' ,
        'exam_old_cerca_cilindro_od' ,
        'exam_old_cerca_cilindro_oi' ,
        'exam_old_cerca_eje_od' ,
        'exam_old_cerca_eje_oi' ,
        'exam_old_cerca_dip' ,
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'fondo_ojo_posiciones' => 'array',
        'examenes_indicados_img' => 'array',
        'examenes_indicados_archivos' => 'array',
    ];

    public static function rules(): array
    {
        return [
            'paciente_id' => 'required|exists:pacientes,id',
            'codigo_consulta' => 'required|string|max:50',
            'antecedentes_personales_hta' => 'nullable|string',
            'antecedentes_personales_alergias' => 'nullable|string',
            'antecedentes_personales_dm' => 'nullable|string',
            'antecedentes_personales_otros' => 'nullable|string',
            'antecedentes_patologicos_familiares' => 'nullable|string',
            'cirugias_previas' => 'nullable|string',
            'motivo_consulta' => 'required|string',
            'impresion_diagnostica' => 'required|string',
            'tratamiento' => 'nullable|string',
            'plan' => 'nullable|string',
            'examenes_indicados' => 'nullable|string',
            'evoluciones' => 'nullable|string',
            'fondo_ojo' => 'nullable|string',
            'examen_av_sc_od' => 'nullable|string',
            'examen_av_cae_od' => 'nullable|string',
            'examen_av_cc_od' => 'nullable|string',
            'examen_av_sc_oi' => 'nullable|string',
            'examen_av_cae_oi' => 'nullable|string',
            'examen_av_cc_oi' => 'nullable|string',
            'examen_pi_od' => 'nullable|string',
            'examen_pi_oi' => 'nullable|string',
            'examen_ar_sph_od' => 'nullable|string',
            'examen_ar_cyl_od' => 'nullable|string',
            'examen_ar_ax_od' => 'nullable|string',
            'examen_ar_sph_oi' => 'nullable|string',
            'examen_ar_cyl_oi' => 'nullable|string',
            'examen_ar_ax_oi' => 'nullable|string',
            'examen_keratometria_qd1_od' => 'nullable|string',
            'examen_keratometria_qd2_od' => 'nullable|string',
            'examen_keratometria_eje_od' => 'nullable|string',
            'examen_keratometria_qd1_oi' => 'nullable|string',
            'examen_keratometria_qd2_oi' => 'nullable|string',
            'examen_keratometria_eje_oi' => 'nullable|string',
            'biomicroscopia_movoculares_od',
            'biomicroscopia_parpados_od',
            'biomicroscopia_cornea_od',
            'biomicroscopia_corneaconj_od',
            'biomicroscopia_ca_od',
            'biomicroscopia_iris_od',
            'biomicroscopia_cristalino_od',
            'biomicroscopia_movoculares_oi',
            'biomicroscopia_parpados_oi',
            'biomicroscopia_cornea_oi',
            'biomicroscopia_corneaconj_oi',
            'biomicroscopia_ca_oi',
            'biomicroscopia_iris_oi',
            'biomicroscopia_cristalino_oi',
            //
            'fondo_ojo_posiciones' => 'nullable|json',
            'fondo_ojo_retina_p_od',
            'fondo_ojo_macula_od',
            'fondo_ojo_vitreo_od',
            'fondo_ojo_disco_o_od',
            'fondo_ojo_vasos_od',
            'fondo_ojo_macula_oi',
            'fondo_ojo_vitreo_oi',
            'fondo_ojo_disco_o_oi',
            'fondo_ojo_vasos_oi',
            'exam_new_distancia_esfera_od' ,
            'exam_new_distancia_esfera_oi' ,
            'exam_new_distancia_cilindro_od' ,
            'exam_new_distancia_cilindro_oi' ,
            'exam_new_distancia_eje_od' ,
            'exam_new_distancia_eje_oi' ,
            'exam_new_distancia_dip' ,
            'exam_old_distancia_esfera_od' ,
            'exam_old_distancia_esfera_oi' ,
            'exam_old_distancia_cilindro_od' ,
            'exam_old_distancia_cilindro_oi' ,
            'exam_old_distancia_eje_od' ,
            'exam_old_distancia_eje_oi' ,
            'exam_old_distancia_dip' ,
            'exam_new_cerca_esfera_od' ,
            'exam_new_cerca_esfera_oi' ,
            'exam_new_cerca_cilindro_od' ,
            'exam_new_cerca_cilindro_oi' ,
            'exam_new_cerca_eje_od' ,
            'exam_new_cerca_eje_oi' ,
            'exam_new_cerca_dip' ,
            'exam_old_cerca_esfera_od' ,
            'exam_old_cerca_esfera_oi' ,
            'exam_old_cerca_cilindro_od' ,
            'exam_old_cerca_cilindro_oi' ,
            'exam_old_cerca_eje_od' ,
            'exam_old_cerca_eje_oi' ,
            'exam_old_cerca_dip' ,
        ];
    }

    // Relación con el modelo Paciente
    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }
    public function examen()
    {
        return $this->hasOne(Examen::class);
    }

    public function terminosMotivoConsulta()
    {
        return $this->hasMany(TerminoMotivoConsulta::class);
    }

    public function terminosBiomicroscopia()
    {
        return $this->hasMany(TerminoBiomicroscopia::class);
    }
}