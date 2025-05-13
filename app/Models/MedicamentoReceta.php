<?php
// app/Models/MedicamentoReceta.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Farmaco;
use App\Models\Receta;

class MedicamentoReceta extends Model
{
    protected $table = 'medicamentos_receta';
    protected $primaryKey = 'id';
    
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
        return $this->belongsTo(Receta::class, 'receta_id');
    }
    
    public function farmaco()
    {
        return $this->belongsTo(Farmaco::class, 'farmaco_id');
    }

    protected static function boot()
{
    parent::boot();
    
    // Remover cualquier scope que pueda estar afectando
    static::addGlobalScope('nombre_scope', function ($builder) {
    });
}
}