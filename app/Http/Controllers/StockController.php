<?php

namespace App\Http\Controllers;

use App\Models\Farmaco;
use App\Models\Stock;
use Inertia\Inertia;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function manage(Farmaco $farmaco)
    {
        // Obtener o crear el registro de stock si no existe
        $stock = Stock::firstOrCreate(
            ['farmaco_id' => $farmaco->id],
            ['visual' => 0, 'insamed' => 0, 's_p' => 0]
        );
        
        return Inertia::render('Stocks/Manage', [
            'farmaco' => $farmaco,
            'stock' => $stock,
            'almacenes' => [
                'visual' => 'Visual',
                'insamed' => 'Insamed',
                's_p' => 'S&P'
            ]
        ]);
    }

    public function update(Request $request, Farmaco $farmaco)
    {
        $validated = $request->validate([
            'visual' => 'required|integer|min:0',
            'insamed' => 'required|integer|min:0',
            's_p' => 'required|integer|min:0'
        ]);

        // Actualizar el registro de stock existente
        $farmaco->stock()->update($validated);

        return redirect()->route('farmacos.index')->with('success', 'Fármaco creado exitosamente');
    }
}
