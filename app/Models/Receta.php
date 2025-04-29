<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receta extends Model
{
    protected $fillable = [
        'consulta_id',
        'paciente_id',
        'medico_id',
        'cie10_codes',
        'medicamentos', // JSON
        'indicaciones_generales',
        'fecha',
        'pdf_path'
    ];

    protected $casts = [
        'medicamentos' => 'array',
        'fecha' => 'date',
        'cie10_codes' => 'array',
    ];

    public function consulta()
    {
        return $this->belongsTo(Consulta::class);
    }

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}