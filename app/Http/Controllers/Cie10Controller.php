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
        $coleraResults = Cie10::where('colera', 'LIKE', "%{$query}%")->pluck('colera');
        $fiebresResults = Cie10::where('fiebres_tifoidea_paratifoidea', 'LIKE', "%{$query}%")->pluck('fiebres_tifoidea_paratifoidea');
        $salmonellaResults = Cie10::where('otras_infecciones_debidas_salmonella', 'LIKE', "%{$query}%")->pluck('otras_infecciones_debidas_salmonella');
        $shigelosisResults = Cie10::where('shigelosis', 'LIKE', "%{$query}%")->pluck('shigelosis');

        // Combinar todos los resultados en un solo array y eliminar duplicados
        $allResults = $coleraResults
            ->concat($fiebresResults)
            ->concat($salmonellaResults)
            ->concat($shigelosisResults)
            ->unique()
            ->values(); // Reiniciar índices del array

        return response()->json($allResults);
    }
}