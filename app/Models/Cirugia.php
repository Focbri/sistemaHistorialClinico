<?php
// app/Models/Cirugia.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cirugia extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'paciente_id',
        'codigo_historial',
        'diagnostico_preoperatorio',
        'diagnostico_postoperatorio',
        'cirugia',
        'cirujano_principal',
        'cirujano_ayudante',
        'anestesiologo',
        'tipo_anestesia',
        'personal_enfermeria',
        'hallazgos',
        'procedimiento',
        'fecha_cirugia',
        'hora_inicio',
        'hora_fin',
        'sede'
    ];

    protected $casts = [
        'personal_enfermeria' => 'array', // Conversión automática JSON ↔ array
        'fecha_cirugia' => 'date',
        'hora_inicio' => 'datetime:H:i',
        'hora_fin' => 'datetime:H:i'
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }

    public function user(): BelongsTo
{
    return $this->belongsTo(User::class, 'user_id'); // Especificar clave explícitamente
}

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($cirugia) {
            // Asignar usuario autenticado
            if (Auth::check()) {
                $cirugia->user_id = Auth::id();
            } else {
                throw new \Exception('No hay usuario autenticado al registrar la cirugía');
            }

            // Obtener el paciente relacionado
            $paciente = $cirugia->paciente;
            
            // Generar código de historial si no existe
            /*if ($paciente && empty($cirugia->codigo_historial)) {
                $cirugia->codigo_historial = $paciente->codigo_historial;
            }*/
        });
    }
    public function scopeDeSedeActual($query)
{
    return $query->where('sede', Auth::user()->sede);
}
}