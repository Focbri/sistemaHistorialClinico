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
        $a00Results = Cie10::where('a00', 'LIKE', "%{$query}%")->pluck('a00');
        $a01Results = Cie10::where('a01', 'LIKE', "%{$query}%")->pluck('a01');
        $a02Results = Cie10::where('a02', 'LIKE', "%{$query}%")->pluck('a02');
        $a03Results = Cie10::where('a03', 'LIKE', "%{$query}%")->pluck('a03');
        $a04Results = Cie10::where('a04', 'LIKE', "%{$query}%")->pluck('a04');
        $a05Results = Cie10::where('a05', 'LIKE', "%{$query}%")->pluck('a05');
        $a06Results = Cie10::where('a06', 'LIKE', "%{$query}%")->pluck('a06');
        $a07Results = Cie10::where('a07', 'LIKE', "%{$query}%")->pluck('a07');
        $a08Results = Cie10::where('a08', 'LIKE', "%{$query}%")->pluck('a08');
        $a09Results = Cie10::where('a09', 'LIKE', "%{$query}%")->pluck('a09');
        $a15Results = Cie10::where('a15', 'LIKE', "%{$query}%")->pluck('a15');

        // Combinar todos los resultados en un solo array y eliminar duplicados
        $allResults = $a00Results
            ->concat($a01Results)
            ->concat($a02Results)
            ->concat($a03Results)
            ->concat($a04Results)
            ->concat($a05Results)
            ->concat($a06Results)
            ->concat($a07Results)
            ->concat($a08Results)
            ->concat($a09Results)
            ->concat($a15Results)
            ->unique()
            ->values(); // Reiniciar índices del array

        return response()->json($allResults);
    }
}