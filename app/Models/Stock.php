<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $fillable = [
        'farmaco_id',
        'visual',
        'insamed',
        's_p'
    ];
    
    public function farmaco()
    {
        return $this->belongsTo(Farmaco::class);
    }
    
    /**
     * Calcula el stock total sumando todos los almacenes
     */
    public function getTotalAttribute()
    {
        return $this->visual + $this->insamed + $this->s_p;
    }
    
    /**
     * Actualiza el stock de un almacén específico
     */
    public function updateStock($almacen, $cantidad)
    {
        if (!in_array($almacen, ['visual', 'insamed', 's_p'])) {
            throw new \InvalidArgumentException("Almacén no válido");
        }
        
        $this->{$almacen} = max(0, $cantidad); // No permite valores negativos
        return $this->save();
    }
}