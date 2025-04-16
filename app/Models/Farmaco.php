<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Model;

class Farmaco extends Model
{
    protected $fillable = [
        'nombre_comercial',
        'componente_activo',
        'presentacion',
        'concentracion'
    ];
    
    public function stock()
    {
        return $this->hasOne(Stock::class);
    }
    
    // Stock en un almacén específico
    public function stockEn($almacen)
    {
        return $this->stocks()
            ->where('almacen', $almacen)
            ->sum('cantidad');
    }
    
    // Total stock en todos los almacenes
    public function stockTotal()
    {
        return $this->stocks()->sum('cantidad');
    }
    
    // Mover stock entre almacenes
    public function moverStock($origen, $destino, $cantidad, $lote = null)
    {
        DB::transaction(function () use ($origen, $destino, $cantidad, $lote) {
            // Quitar del origen
            $queryOrigen = $this->stocks()->where('almacen', $origen);
            if ($lote) $queryOrigen->where('lote', $lote);
            
            $stockOrigen = $queryOrigen->firstOrFail();
            $stockOrigen->decrement('cantidad', $cantidad);
            
            // Añadir al destino
            $queryDestino = $this->stocks()->firstOrCreate(
                ['almacen' => $destino, 'lote' => $lote],
                ['cantidad' => 0, 'minimo' => $stockOrigen->minimo]
            );
            $queryDestino->increment('cantidad', $cantidad);
        });
    }
}