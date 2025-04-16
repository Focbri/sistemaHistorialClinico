<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Farmaco;
use App\Models\Stock;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class FarmacoController extends Controller
{
    public function index()
    {
        $farmacos = Farmaco::with('stock') // Cambiado a 'stock' (singular) porque ahora es relación hasOne
            ->get()
            ->map(function ($farmaco) {
                return [
                    'id' => $farmaco->id,
                    'nombre_comercial' => $farmaco->nombre_comercial,
                    'componente_activo' => $farmaco->componente_activo,
                    'presentacion' => $farmaco->presentacion,
                    'concentracion' => $farmaco->concentracion,
                    'stock' => $farmaco->stock ? [
                        'visual' => $farmaco->stock->visual,
                        'insamed' => $farmaco->stock->insamed,
                        's_p' => $farmaco->stock->s_p,
                        'total' => $farmaco->stock->total // Usando el accessor del modelo
                    ] : null,
                    'stock_total' => $farmaco->stock ? $farmaco->stock->total : 0
                ];
            });

        return Inertia::render('Farmacos/Index', [
            'farmacos' => $farmacos
        ]);
    }

    public function create()
    {
        $presentaciones = [
            'FRASCO', 'TUBO', 'UNIDOSIS', 'CAPSULAS', 
            'COMPRIMIDOS', 'JARABE', 'CREMA', 'GEL', 'AMPOLETA'
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
            'presentacion' => 'required|in:FRASCO,TUBO,UNIDOSIS,CAPSULAS,COMPRIMIDOS,JARABE,CREMA,GEL,AMPOLETA',
            'concentracion' => 'nullable|string|max:100',
            'stock_inicial' => 'nullable|integer|min:0',
            'almacen' => 'required_if:stock_inicial,>0|in:visual,insamed,s_p'
        ]);

        $validated['presentacion'] = strtoupper(trim($validated['presentacion']));

        $farmaco = Farmaco::create($validated);

        if (isset($validated['stock_inicial']) && $validated['stock_inicial'] > 0) {
            $stockData = [
                $validated['almacen'] => $validated['stock_inicial'],
                // Los otros almacenes se quedan en 0 por defecto
            ];
            
            $farmaco->stock()->create($stockData);
        }

        return redirect()->route('farmacos.index')->with('success', 'Fármaco creado exitosamente');
    }

    public function edit(Farmaco $farmaco)
    {
        $presentaciones = [
            'FRASCO', 'TUBO', 'UNIDOSIS', 'CAPSULAS', 
            'COMPRIMIDOS', 'JARABE', 'CREMA', 'GEL', 'AMPOLETA'
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
            'presentacion' => 'required|in:FRASCO,TUBO,UNIDOSIS,CAPSULAS,COMPRIMIDOS,JARABE,CREMA,GEL,AMPOLETA',
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

}