<?php
// app/Models/Cirugia.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cirugia extends Model
{
    use HasFactory;

    protected $fillable = [
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
        'hora_fin'
    ];

    protected $casts = [
        'personal_enfermeria' => 'array',
        'fecha_cirugia' => 'date'
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }
    /*
     public function user()
{
    return $this->belongsTo(User::class);
}
    */
}