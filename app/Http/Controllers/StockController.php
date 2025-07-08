<?php

namespace App\Http\Controllers;

use App\Models\Farmaco;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Stock;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\FarmacoResource;
use App\Http\Resources\StockResource;

class StockController extends Controller
{
    public function manage(Farmaco $farmaco)
    {
        // Asegurar que exista el stock
        $farmaco->load(['stock']);
        
        return Inertia::render('Stocks/Manage', [
            'farmaco' => $farmaco,
            'stock' => $farmaco->stock ?? new Stock(['visual' => 0, 'insamed' => 0, 's_p' => 0]),
            'almacenes' => [
                'visual' => 'Visual',
                'insamed' => 'Insamed',
                's_p' => 'S&P'
            ],
            'auth' => [
                'user' => Auth::user()
            ],
        ]);
    }

    public function update(Request $request, Farmaco $farmaco)
{
    $validated = $request->validate([
        'visual' => 'required|integer|min:0',
        'insamed' => 'required|integer|min:0',
        's_p' => 'required|integer|min:0',
        'from_dashboard' => 'nullable|boolean' // Nuevo campo para identificar la fuente
    ]);

    $farmaco->stock()->updateOrCreate([], $validated);

    // Redirigir según la fuente de la solicitud
    if ($request->input('from_dashboard')) {
        return redirect()->route('dashboard.index')
               ->with('success', 'Stock actualizado exitosamente');
    }

    return redirect()->route('farmacos.index')
           ->with('success', 'Stock actualizado exitosamente');
}

    public function buscarFarmacos(Request $request)
    {
        try {
            $request->validate([
                'search' => 'sometimes|string|min:1',
                'with_stock' => 'sometimes|boolean' // Cambiado a sometimes
            ]);
    
            // Conversión explícita a booleano
            $withStock = filter_var($request->input('with_stock', false), FILTER_VALIDATE_BOOLEAN);
    
            $query = Farmaco::query()
                ->with(['stock'])
                ->when($request->search, function($q, $search) {
                    $q->where(function($query) use ($search) {
                        $query->where('nombre_comercial', 'like', "%{$search}%")
                              ->orWhere('componente_activo', 'like', "%{$search}%");
                    });
                })
                ->when($withStock, function($q) {
                    $q->whereHas('stock', function($q) {
                        $q->where(function($query) {
                            $query->where('visual', '>', 0)
                                  ->orWhere('insamed', '>', 0)
                                  ->orWhere('s_p', '>', 0);
                        });
                    });
                })
                ->orderBy('nombre_comercial')
                ->limit(20);
    
            $farmacos = $query->get()->map(function($farmaco) {
                return [
                    'id' => $farmaco->id,
                    'farmaco_id' => $farmaco->id, // Para consistencia con otros lugares
                    'nombre_comercial' => $farmaco->nombre_comercial,
                    'componente_activo' => $farmaco->componente_activo,
                    'presentacion' => $farmaco->presentacion,
                    'concentracion' => $farmaco->concentracion,
                    'stock' => $farmaco->stock ? [
                        'visual' => (int)$farmaco->stock->visual,
                        'insamed' => (int)$farmaco->stock->insamed,
                        's_p' => (int)$farmaco->stock->s_p,
                        'total' => (int)($farmaco->stock->visual + $farmaco->stock->insamed + $farmaco->stock->s_p)
                    ] : [
                        'visual' => 0,
                        'insamed' => 0,
                        's_p' => 0,
                        'total' => 0
                    ]
                ];
            });
    
            return response()->json([
                'success' => true,
                'data' => $farmacos
            ]);
    
        } catch (\Exception $e) {
            Log::error('Error buscando fármacos: '.$e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al buscar fármacos'
            ], 500);
        }
    }

    public function actualizarPorReceta(Request $request)
{
    // Cambiar este método para que sea explícito:
    $request->validate([
        'accion' => 'required|in:validar,restar' // Determina si solo valida o también resta
    ]);

    if ($request->accion === 'restar') {
        // Lógica actual que resta stock
    } else {
        // Solo validar stock
        foreach ($request->medicamentos as $med) {
            $farmaco = Farmaco::find($med['farmaco_id']);
            if ($farmaco->stock_total < $med['cantidad']) {
                // Retornar error
            }
        }
    }
}
    protected function descontarDeAlmacenes($stock, $cantidad)
{
    $almacenes = ['visual', 'insamed', 's_p'];
    
    foreach ($almacenes as $almacen) {
        if ($stock->$almacen >= $cantidad) {
            $stock->$almacen -= $cantidad;
            $cantidad = 0;
            break;
        } else {
            $cantidad -= $stock->$almacen;
            $stock->$almacen = 0;
        }
    }
    
    if ($cantidad > 0) {
        throw new \Exception("No hay suficiente stock en ningún almacén");
    }
}

    public function verificarStock(Farmaco $farmaco, Request $request)
    {
        $data = $request->validate([
            'cantidad' => 'required|integer|min:1',
            'reservar' => 'nullable|boolean' // Opción para reservar temporalmente
        ]);
        
        $disponible = $farmaco->tieneStockSuficiente($data['cantidad']);
        
        return response()->json([
            'disponible' => $disponible,
            'stock_total' => $farmaco->stock_total,
            'stock_detalle' => $farmaco->stock?->only(['visual', 'insamed', 's_p']) ?? null,
            'farmaco' => $farmaco->only(['id', 'nombre_comercial'])
        ]);
    }
}