<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Farmaco;
use App\Models\Stock;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\FarmacoResource;

class FarmacoController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $farmacos = Farmaco::when($search, function ($query, $search) {
            return $query->where('nombre_comercial', 'like', "%{$search}%")
                        ->orWhere('componente_activo', 'like', "%{$search}%");
        })
        ->paginate(10)
        ->withQueryString(); // Esto mantiene los parámetros en los links de paginación

        return Inertia::render('Farmacos/Index', [
            'farmacos' => $farmacos,
            'filters' => $request->only(['search']),
        ]);
    }
    public function create()
    {
        $presentaciones = [
            'FRASCO','TUBO','UNIDOSIS','CAPSULAS','TABLETA','CAPSULAS_BLANDAS',
        ];

        return Inertia::render('Farmacos/Create', [
            'presentaciones' => $presentaciones
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre_comercial' => 'required|string|max:255',
            'componente_activo' => 'required|string|max:255',
            'presentacion' => 'required|in:FRASCO,TUBO,UNIDOSIS,CAPSULAS,TABLETA,CAPSULAS_BLANDAS',
            'concentracion' => 'nullable|string|max:100',
            'stocks.visual' => 'nullable|integer|min:0',
            'stocks.insamed' => 'nullable|integer|min:0',
            'stocks.s_p' => 'nullable|integer|min:0'
        ]);

        $validated['presentacion'] = strtoupper(trim($validated['presentacion']));
        // Cambiar "CAPSULAS BLANDAS" a "CAPSULAS_BLANDAS"
        $validated['presentacion'] = str_replace(' ', '_', strtoupper(trim($validated['presentacion'])));
        // Crear el fármaco
        $farmaco = Farmaco::create([
            'nombre_comercial' => $validated['nombre_comercial'],
            'componente_activo' => $validated['componente_activo'],
            'presentacion' => $validated['presentacion'],
            'concentracion' => $validated['concentracion'] ?? null,
        ]);

        // Crear el stock solo si al menos uno de los valores es mayor que 0
        if (($validated['stocks']['visual'] ?? 0) > 0 || 
            ($validated['stocks']['insamed'] ?? 0) > 0 || 
            ($validated['stocks']['s_p'] ?? 0) > 0) {
            
            $farmaco->stock()->create([
                'visual' => $validated['stocks']['visual'] ?? 0,
                'insamed' => $validated['stocks']['insamed'] ?? 0,
                's_p' => $validated['stocks']['s_p'] ?? 0
            ]);
        }

        return redirect()->route('farmacos.index')->with('success', 'Fármaco creado exitosamente');
    }

    public function edit(Farmaco $farmaco)
    {
        $presentaciones = [
            'FRASCO','TUBO','UNIDOSIS','CAPSULAS','TABLETA','CAPSULAS_BLANDAS'
        ];

        // Normalizar la presentación del fármaco a mayúsculas
        $presentacionFarmaco = strtoupper(trim($farmaco->presentacion));
        
        // Verificar coincidencia sin importar mayúsculas originales
        if (!in_array($presentacionFarmaco, $presentaciones)) {
            Log::warning("Presentación inválida para fármaco {$farmaco->id}: '{$farmaco->presentacion}'");
            // Corregir automáticamente si es posible
            $farmaco->presentacion = $presentacionFarmaco;
        }

        return Inertia::render('Farmacos/Edit', [
            'farmaco' => $farmaco,
            'presentaciones' => $presentaciones
        ]);
    }

    public function update(Request $request, Farmaco $farmaco)
    {
        $validated = $request->validate([
            'nombre_comercial' => 'required|string|max:255',
            'componente_activo' => 'required|string|max:255',
            'presentacion' => 'required|in:FRASCO,TUBO,UNIDOSIS,CAPSULAS,TABLETA,CAPSULAS_BLANDAS',
            'concentracion' => 'nullable|string|max:100'
        ]);

        // Asegurar mayúsculas en la presentación
        $validated['presentacion'] = strtoupper(trim($validated['presentacion']));

        $farmaco->update($validated);

        return redirect()->route('farmacos.index')->with('success', 'Fármaco actualizado exitosamente');
    }

    public function destroy(Farmaco $farmaco)
    {
        // Eliminar el stock asociado (ahora es delete() en lugar de stocks()->delete())
        if ($farmaco->stock) {
            $farmaco->stock->delete();
        }
        
        // Eliminar el fármaco
        $farmaco->delete();

        return redirect()->route('farmacos.index')
            ->with('success', 'Fármaco eliminado exitosamente');
    }

    public function updateStock(Request $request, Farmaco $farmaco)
    {
        $validated = $request->validate([
            'visual' => 'required|integer|min:0',
            'insamed' => 'required|integer|min:0',
            's_p' => 'required|integer|min:0'
        ]);

        // Usamos updateOrCreate para asegurarnos que exista el registro
        $farmaco->stock()->updateOrCreate(
            ['farmaco_id' => $farmaco->id],
            $validated
        );

        return redirect()->route('farmacos.index')
            ->with('success', 'Stocks actualizados correctamente');
    }

    public function buscar(Request $request)
{
    Log::info("Accediendo a /farmacos/buscar", ['search' => $request->query('search')]);
    try {
        $request->validate([
            'search' => 'nullable|string|max:255'
        ]);

        $search = $request->query('search', '');
        
        $query = Farmaco::query()->with('stock');
        
        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('nombre_comercial', 'like', "%{$search}%")
                  ->orWhere('componente_activo', 'like', "%{$search}%");
            });
        }

        $farmacos = $query->limit(10)->get();

        return response()->json([
            'success' => true,
            'data' => $farmacos->map(function ($farmaco) {
                return [
                    'id' => $farmaco->id,
                    'nombre' => $farmaco->nombre_comercial,
                    'presentacion' => $farmaco->presentacion,
                    'componente_activo' => $farmaco->componente_activo,
                    'concentracion' => $farmaco->concentracion,
                    'stock_visual' => $farmaco->stock->visual ?? 0,
                    'stock_insamed' => $farmaco->stock->insamed ?? 0,
                    'stock_s_p' => $farmaco->stock->s_p ?? 0,
                    'stock_total' => ($farmaco->stock->visual ?? 0) + 
                                    ($farmaco->stock->insamed ?? 0) + 
                                    ($farmaco->stock->s_p ?? 0),
                    'almacen_principal' => $this->getAlmacenPrincipal($farmaco)
                ];
            })
        ]);

    } catch (\Exception $e) {
        Log::error("Error en búsqueda de fármacos: " . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Error en el servidor al buscar fármacos'
        ], 500);
    }
}

private function getAlmacenPrincipal($farmaco)
{
    if (!$farmaco->stock) return 'N/A';
    
    $stocks = [
        'Visual' => $farmaco->stock->visual ?? 0,
        'Insamed' => $farmaco->stock->insamed ?? 0,
        'S/P' => $farmaco->stock->s_p ?? 0
    ];
    
    arsort($stocks);
    return array_key_first($stocks);
}

    // Método show básico si lo necesitas para otras rutas
    public function show($id)
    {
        $farmaco = Farmaco::with('stock')->findOrFail($id);
        return response()->json($farmaco);
    }

}