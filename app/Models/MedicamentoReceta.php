<?php
// app/Models/MedicamentoReceta.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicamentoReceta extends Model
{
    protected $table = 'medicamentos_receta';
    
    protected $fillable = [
        'receta_id',
        'farmaco_id',
        'nombre_comercial',
        'cantidad',
        'dosis',
        'frecuencia',
        'duracion',
        'es_manual'
    ];
    
    public function receta()
    {
        return $this->belongsTo(Receta::class);
    }
    
    public function farmaco()
    {
        return $this->belongsTo(Farmaco::class);
    }
}