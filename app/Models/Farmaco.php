<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

use Illuminate\Database\Eloquent\Model;

class Farmaco extends Model
{
    protected $fillable = [
        'nombre_comercial',
        'componente_activo',
        'presentacion',
        'concentracion'
    ];
    
    
    public function stock(): HasOne
    {
        return $this->hasOne(Stock::class);
    }
    
    // Stock en un almacén específico
    public function stockEn(string $almacen): int
    {
        return $this->stocks()
            ->where('almacen', $almacen)
            ->sum('cantidad');
    }
    
    // Total stock en todos los almacenes
    public function stockTotal(): int
    {
        return $this->stocks->sum('cantidad');
    }
    
    // Mover stock entre almacenes
    public function moverStock(string $origen, string $destino, int $cantidad, ?string $lote = null): void
    {
        DB::transaction(function () use ($origen, $destino, $cantidad, $lote) {
            // Quitar del origen
            $queryOrigen = $this->stocks()->where('almacen', $origen);
            
            if ($lote) {
                $queryOrigen->where('lote', $lote);
            }
            
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

    public function getStockTotalAttribute(): int
    {
        if (!$this->stock) return 0;
        return ($this->stock->visual ?? 0) + ($this->stock->insamed ?? 0) + ($this->stock->s_p ?? 0);
    }

    public function getAlmacenPrincipalAttribute(): string
    {
        if (!$this->stock) return 'N/A';
        
        $almacenes = [
            'Visual' => $this->stock->visual ?? 0,
            'Insamed' => $this->stock->insamed ?? 0,
            'S/P' => $this->stock->s_p ?? 0
        ];
        
        arsort($almacenes);
        return array_key_first($almacenes);
    }
}