<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Paciente;
use App\Models\User;
use App\Models\Receta;
use App\Models\Examen;
use Illuminate\Support\Facades\Auth;

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
        'user_id',
        'codigo_historial',
        'antecedentes_personales_hta',
        'antecedentes_personales_alergias',
        'antecedentes_personales_dm',
        'antecedentes_personales_otros',
        'antecedentes_patologicos_familiares',
        'cirugias_previas',
        'motivo_consulta_inicio',
        'motivo_consulta_signos',
        'motivo_consulta_enfermedad',
        'motivo_consulta_otros',
        'impresion_diagnostica',
        'tratamiento',
        'plan',
        'examenes_indicados_img',
        'examenes_indicados_archivos',
        'evoluciones',
        'tipo_consulta',
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
        //FONDO OJO
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
        'f_o_dilat_pup_od',
        'f_o_dilat_pup_oi',
        'f_o_locs_tres_od',
        'f_o_locs_tres_oi',
        'f_o_fundoscopia_od',
        'f_o_fundoscopia_oi',
        'f_o_conclusion',
        'f_o_plan',
        'comentario',
        'ciit_archivos',
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
        'cirugias_previas' => 'array',
        'antecedentes_patologicos_familiares'=> 'array',
        'tratamiento'=> 'array',
        'antecedentes_patologicos_familiares'=> 'array',
        'plan'=> 'array',
        'evoluciones'=> 'array',
        'comentario'=> 'array',
    ];

    public static function rules(): array
    {
        return [
            'paciente_id' => 'required|exists:pacientes,id',
            'codigo_consulta' => 'required|string|max:50',
            'user_id' => 'sometimes|exists:users,id',
            'antecedentes_personales_hta' => 'nullable|string',
            'antecedentes_personales_alergias' => 'nullable|string',
            'antecedentes_personales_dm' => 'nullable|string',
            'antecedentes_personales_otros' => 'nullable|string',
            'antecedentes_patologicos_familiares' => 'nullable|json',
            'cirugias_previas' => 'nullable|json',
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
            'motivo_consulta_inicio',
            'motivo_consulta_signos',
            'motivo_consulta_enfermedad',
            'motivo_consulta_otros',
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
            'comentario' => 'nullable|string',
            'ciit' => 'nullable|string',
        ];
    }

    // Relación con el modelo Paciente
    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
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

    public function receta(): HasOne
    {
        return $this->hasOne(Receta::class, 'consulta_id');
    }

    protected static function boot()
{
    parent::boot();

    static::creating(function ($consulta) {
        if (\Illuminate\Support\Facades\Auth::check()) { // ← Usando el facade completo
            $consulta->user_id = \Illuminate\Support\Facades\Auth::id();
        } else {
            throw new \Exception('No hay usuario autenticado al crear una consulta');
        }
    });
}

public function refraccion()
{
    return $this->hasOne(Refraccion::class);
}
public function medico()
{
    return $this->belongsTo(User::class, 'medico_id');
}
}