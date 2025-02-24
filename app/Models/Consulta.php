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
        'rp',
        'plan',
        'examenes_indicados',
        'evoluciones',
        'fondo_ojo',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
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
            'rp' => 'nullable|string',
            'plan' => 'nullable|string',
            'examenes_indicados' => 'nullable|string',
            'evoluciones' => 'nullable|string',
            'fondo_ojo' => 'nullable|string',
        ];
    }

    // Relación con el modelo Paciente
    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }
}