<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cie10;

class Cie10Controller extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('query');

        // Buscar en cada columna y combinar los resultados en un solo array
        $list_01Results = Cie10::where('list_01', 'LIKE', "%{$query}%")->pluck('list_01');
        $list_otrosResults = Cie10::where('list_otros', 'LIKE', "%{$query}%")->pluck('list_otros');

        // Combinar todos los resultados en un solo array y eliminar duplicados
        $allResults = $list_01Results
            ->concat($list_otrosResults)
            ->unique()
            ->values(); // Reiniciar índices del array

        return response()->json($allResults);
    }
}