<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class Farmaco extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre_comercial',
        'componente_activo',
        'presentacion',
        'concentracion',
        'user_id',
    ];
    
    /**
     * Relación con el stock (modelo Stock)
     */
    public function stock(): HasOne
    {
        return $this->hasOne(Stock::class);
    }
    
    /**
     * Obtener el stock total sumando todos los almacenes
     */
    public function getStockTotalAttribute()
{
    if (!$this->stock) return 0;
    
    return $this->stock->visual + $this->stock->insamed + $this->stock->s_p;
}
    
    /**
     * Verificar si hay stock suficiente
     */
    public function tieneStockSuficiente(int $cantidad): bool
    {
        return $this->stock_total >= $cantidad;
    }
    
    /**
     * Descontar stock según la política definida
     */
    // Podrías hacer configurable la política de descuento
    public function descontarStock(int $cantidad): bool
    {
        if (!$this->tieneStockSuficiente($cantidad)) {
            return false;
        }

        DB::beginTransaction();
        try {
            $stock = $this->stock()->lockForUpdate()->firstOrFail();
            
            // Ordenar almacenes por cantidad descendente
            $almacenes = collect([
                'visual' => $stock->visual,
                'insamed' => $stock->insamed,
                's_p' => $stock->s_p
            ])->sortDesc();

            foreach ($almacenes as $almacen => $cantidadAlmacen) {
                if ($cantidad <= 0) break;
                
                $descontar = min($cantidadAlmacen, $cantidad);
                $stock->$almacen -= $descontar;
                $cantidad -= $descontar;
            }

            $stock->save();
            DB::commit();
            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error al descontar stock para fármaco {$this->id}: " . $e->getMessage());
            return false;
        }
    }
        
    /**
     * Obtener el almacén con más stock
     */
    public function getAlmacenPrincipalAttribute(): string
    {
        if (!$this->relationLoaded('stock')) {
            $this->load('stock');
        }
        
        if (!$this->stock) {
            return 'N/A';
        }
        
        $almacenes = [
            'Visual' => $this->stock->visual ?? 0,
            'Insamed' => $this->stock->insamed ?? 0,
            'S&P' => $this->stock->s_p ?? 0
        ];
        
        arsort($almacenes);
        return array_key_first($almacenes) ?? 'N/A';
    }

    public function toStockArray()
{
    return [
        'id' => $this->id,
        'nombre_comercial' => $this->nombre_comercial,
        'componente_activo' => $this->componente_activo,
        'presentacion' => $this->presentacion,
        'concentracion' => $this->concentracion,
        'stock' => $this->stock ? [
            'visual' => $this->stock->visual,
            'insamed' => $this->stock->insamed,
            's_p' => $this->stock->s_p,
            'total' => $this->stock->visual + $this->stock->insamed + $this->stock->s_p
        ] : null
    ];
}

public function medicamentosReceta()
{
    return $this->hasMany(MedicamentoReceta::class);
}

public function aumentarStock(int $cantidad, string $almacen = 'visual'): bool
{
    DB::beginTransaction();
    try {
        $stock = $this->stock()->lockForUpdate()->firstOrFail();
        
        if (!in_array($almacen, ['visual', 'insamed', 's_p'])) {
            throw new \InvalidArgumentException("Almacén no válido");
        }

        $stock->$almacen += $cantidad;
        $stock->save();
        
        DB::commit();
        return true;

    } catch (\Exception $e) {
        DB::rollBack();
        Log::error("Error al aumentar stock: " . $e->getMessage());
        return false;
    }
}

public function getStockDisponibleAttribute()
{
    if ($this->stock) {
        return $this->stock->visual + $this->stock->insamed + $this->stock->s_p;
    }
    return 0;
}

// En el modelo Farmaco
public function scopeConStock($query)
{
    return $query->whereHas('stock', function($q) {
        $q->whereRaw('visual + insamed + s_p > 0');
    });
}

public function scopeSinStock($query)
{
    return $query->whereHas('stock', function($q) {
        $q->whereRaw('visual + insamed + s_p <= 0');
    });
}

public function scopePorAlmacen($query, string $almacen, int $minimo = 0)
{
    if (!in_array($almacen, ['visual', 'insamed', 's_p'])) {
        return $query;
    }
    
    return $query->whereHas('stock', function($q) use ($almacen, $minimo) {
        $q->where($almacen, '>', $minimo);
    });
}

public function user()
{
    return $this->belongsTo(User::class);
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
            
        });
    }
    public function scopeStockCritico($query)
{
    return $query->whereHas('stock', function($q) {
        $q->whereRaw('visual + insamed + s_p <= 1');
    });
}
}