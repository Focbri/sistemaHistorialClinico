<?php
namespace App\Http\Controllers;

use App\Models\Consulta;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Index', [
            'auth' => [
                'user' => Auth::user() ?: null
            ],
            'topCie10' => $this->getFilteredCie10Data([
                'filter_type' => 'general',
                'sex' => '',
                'min_age' => '',
                'max_age' => '',
                'terms' => []
            ]),
            'initialFilters' => [
                'filter_type' => 'general',
                'sex' => '',
                'min_age' => '',
                'max_age' => '',
                'terms' => []
            ]
        ]);
    }

    public function getTopCie10(Request $request)
    {
        try {
            $filteredData = $this->getFilteredCie10Data($request);
            return response()->json($filteredData);
        } catch (\Exception $e) {
            Log::error('Error en getTopCie10:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    protected function getFilteredCie10Data($requestData)
    {
        $requestData = $requestData instanceof Request ? $requestData->all() : $requestData;
    
        $validator = Validator::make($requestData, [
            'sex' => 'nullable|in:M,F',
            'min_age' => 'nullable|integer|min:0',
            'max_age' => 'nullable|integer|min:0|gte:min_age',
            'terms' => 'nullable|array',
            'terms.*' => 'nullable|string',
            'procedencia' => 'nullable|string' // Añadir validación para procedencia
        ]);

        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }

        $validated = $validator->validated();
        
        $query = Consulta::with('paciente')
            ->select('id', 'impresion_diagnostica', 'paciente_id');

        // Filtro por sexo
        if (!empty($validated['sex'])) {
            $query->whereHas('paciente', function($q) use ($validated) {
                $q->where('sexo', $validated['sex']);
            });
        }
        
        // Filtro por edad
        if (!empty($validated['min_age']) && !empty($validated['max_age'])) {
            $query->whereHas('paciente', function($q) use ($validated) {
                $q->where('edad', '>=', $validated['min_age'])
                ->where('edad', '<=', $validated['max_age']);
            });
        }
        
        // Filtro por procedencia (NUEVO)
        if (!empty($validated['procedencia'])) {
            $query->whereHas('paciente', function($q) use ($validated) {
                $q->where('procedencia', $validated['procedencia']);
            });
        }
        
        // Filtro por términos
        if (!empty($validated['terms'])) {
            $query->where(function($q) use ($validated) {
                foreach ($validated['terms'] as $term) {
                    $q->orWhere('impresion_diagnostica', 'LIKE', "%{$term}%");
                }
            });
        }

        $consultas = $query->get();
        $cie10Counts = [];

        foreach ($consultas as $consulta) {
            if (!empty($consulta->impresion_diagnostica)) {
                $codigos = array_map('trim', explode(';', $consulta->impresion_diagnostica));
                
                foreach ($codigos as $codigo) {
                    if (!empty($codigo)) {
                        if (empty($validated['terms']) || in_array($codigo, $validated['terms'])) {
                            $cie10Counts[$codigo] = ($cie10Counts[$codigo] ?? 0) + 1;
                        }
                    }
                }
            }
        }

        arsort($cie10Counts);

        if (!empty($validated['terms'])) {
            foreach ($validated['terms'] as $term) {
                if (!isset($cie10Counts[$term])) {
                    $cie10Counts[$term] = 0;
                }
            }
            
            $cie10Counts = array_filter($cie10Counts, function($key) use ($validated) {
                return in_array($key, $validated['terms']);
            }, ARRAY_FILTER_USE_KEY);
        }

        return $cie10Counts;
    }

    public function searchCie10(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2'
        ]);

        // Obtener el término de búsqueda correctamente
        $searchTerm = $request->input('query');  // Opción recomendada
        // O también puedes usar: $searchTerm = $request->get('query');
        // Pero NO uses $request->query directamente

        $consultas = Consulta::query()
            ->select('impresion_diagnostica')
            ->where('impresion_diagnostica', 'LIKE', "%{$searchTerm}%")
            ->distinct()
            ->get();

        $uniqueTerms = [];
        
        foreach ($consultas as $consulta) {
            if (!empty($consulta->impresion_diagnostica)) {
                $terms = explode(';', $consulta->impresion_diagnostica);
                foreach ($terms as $term) {
                    $term = trim($term);
                    if (!empty($term) && stripos($term, $searchTerm) !== false) {
                        $uniqueTerms[$term] = true;
                    }
                }
            }
        }
        
        return response()->json(array_keys($uniqueTerms));
    }
}