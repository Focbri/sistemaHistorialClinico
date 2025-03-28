<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TerminoMotivoConsulta extends Model
{
    //
    use HasFactory;
    protected $table = 'terminos_motivo_consulta';
    protected $fillable = ['consulta_id', 'termino_mc'];

    public function consulta()
    {
        return $this->belongsTo(Consulta::class);
    }
}
