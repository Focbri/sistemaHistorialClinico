<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Consulta;
use App\Models\Paciente;
use App\Models\User; // Asegúrate de importar el modelo User
use App\Models\MedicamentoReceta;

class Receta extends Model
{
    protected $fillable = [
        'consulta_id',
        'paciente_id',
        'medico_id',  // Asegúrate que este campo existe en la tabla
        'cie10_codes',
        'indicaciones_generales',
        'fecha',
        'pdf_path'
    ];

    protected $casts = [
        'fecha' => 'datetime',  // Cambiado de 'date' a 'datetime'
        'cie10_codes' => 'array',
    ];

    public function consulta(): BelongsTo
    {
        return $this->belongsTo(Consulta::class);
    }

    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class);
    }

    // Relación con el médico (usuario)
    public function medico(): BelongsTo
    {
        return $this->belongsTo(User::class, 'medico_id');
    }

    // Relación con los medicamentos de la receta
    public function medicamentos()
{
    return $this->hasMany(\App\Models\MedicamentoReceta::class, 'receta_id')
                ->from('medicamentos_receta');
}
}