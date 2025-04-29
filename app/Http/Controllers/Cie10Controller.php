<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cie10;
use Illuminate\Support\Str;

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
    public function store(Request $request)
    {
        $request->validate([
            'termino' => 'required|string|max:255',
            'list_01' => 'required|string|max:255'
        ]);

        try {
            // Verificar si el término ya existe
            $existingTerm = Cie10::where('list_01', $request->list_01)->first();
            
            if ($existingTerm) {
                return response()->json([
                    'success' => true,
                    'term' => $existingTerm->list_01,
                    'message' => 'El término ya existía en el catálogo'
                ]);
            }

            // Crear nuevo término
            $cie10 = Cie10::create([
                'list_01' => $request->list_01,
                // Si necesitas almacenar en list_otros también:
                'list_otros' => str_contains($request->list_01, '|') ? '' : $request->list_01
            ]);

            return response()->json([
                'success' => true,
                'term' => $cie10->list_01,
                'message' => 'Término agregado correctamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al guardar el término: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * Determina en qué columna guardar el término basado en su formato
     */
    protected function determineTermType($term)
    {
        // Si el término contiene un código (ejemplo: "E11.9 - Diabetes tipo 2")
        if (preg_match('/^[A-Z]\d{2}(\.\d)?/', $term)) {
            return 'list_01'; // Asumiento que list_01 contiene términos con códigos
        }
        
        return 'list_otros'; // Términos sin código específico
    }

    protected function hasCode($term)
    {
        return str_contains($term, '|');
    }
}