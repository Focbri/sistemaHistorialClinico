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

    /**
     * Relación con el modelo Paciente (una consulta pertenece a un paciente).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class);
    }
}