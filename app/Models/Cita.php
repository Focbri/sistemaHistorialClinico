<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    protected $fillable = [
        'paciente_id',
        'medico_id',
        'fecha_hora',
        'motivo',
        'estado'
    ];
    
    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }
    
    public function medico()
    {
        return $this->belongsTo(User::class, 'medico_id');
    }
}