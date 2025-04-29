<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Refraccion extends Model
{
    protected $table = 'refracciones';
    
    protected $fillable = [
        'consulta_id',
        'distancia_esfera_od',
        'distancia_cilindro_od',
        'distancia_eje_od',
        'distancia_esfera_oi',
        'distancia_cilindro_oi',
        'distancia_eje_oi',
        'distancia_dip',
        'cerca_esfera_od',
        'cerca_cilindro_od',
        'cerca_eje_od',
        'cerca_esfera_oi',
        'cerca_cilindro_oi',
        'cerca_eje_oi',
        'cerca_dip',
        'adicion_cerca',
        'instrucciones'
    ];
    
    public function consulta()
    {
        return $this->belongsTo(Consulta::class);
    }
}