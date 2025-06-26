<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Cita extends Model
{
    protected $fillable = [
        'paciente_id',
        'medico_id',
        'fecha_hora',
        'motivo',
        'estado',
        'user_id',
        'cita',
        'cotizacion',
        'observaciones',
        'sede',
    ];
    
    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }
    
public function medico()
{
    return $this->belongsTo(User::class, 'medico_id')->whereIn('role', ['medico', 'medico_externo']);
}

    public function user()
{
    return $this->belongsTo(User::class);
}

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($cita) {
            // Asignar usuario autenticado
            if (Auth::check()) {
                $cita->user_id = Auth::id();
            } else {
                throw new \Exception('No hay usuario autenticado al registrar la cirugía');
            }
            
        });
    }
    public function scopeDeSedeActual($query)
{
    return $query->where('sede', Auth::user()->sede);
}
}