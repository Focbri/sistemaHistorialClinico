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
    // Convertir a array si es un objeto Request
    $requestData = $requestData instanceof Request ? $requestData->all() : $requestData;
    
    // Validar los parámetros de filtro
    $validator = Validator::make($requestData, [
        'filter_type' => 'nullable|in:general,sex,age,terms',
        'sex' => 'nullable|in:M,F',
        'min_age' => [
            'nullable',
            'integer',
            'min:0',
            function ($attribute, $value, $fail) use ($requestData) {
                if (($requestData['filter_type'] ?? null) === 'age' && empty($value)) {
                    $fail('La edad mínima es requerida cuando se filtra por edad.');
                }
            },
        ],
        'max_age' => [
            'nullable',
            'integer',
            'min:0',
            function ($attribute, $value, $fail) use ($requestData) {
                if (($requestData['filter_type'] ?? null) === 'age' && empty($value)) {
                    $fail('La edad máxima es requerida cuando se filtra por edad.');
                }
            },
            'gte:min_age'
        ],
        'terms' => 'nullable|array',
        'terms.*' => 'nullable|string'
    ]);

    if ($validator->fails()) {
        throw new \Illuminate\Validation\ValidationException($validator);
    }

    $validated = $validator->validated();
    // Primero obtenemos todas las consultas filtradas
    $query = Consulta::query()
        ->select('id', 'impresion_diagnostica', 'paciente_id');

    // Aplicar filtros según el tipo
    switch ($validated['filter_type'] ?? 'general') {
        case 'sex':
            if (!empty($validated['sex'])) {
                $query->whereHas('paciente', function($q) use ($validated) {
                    $q->where('sexo', $validated['sex']);
                });
            }
            break;
            
        case 'age':
            // Filtramos directamente por la columna edad
            $query->whereHas('paciente', function($q) use ($validated) {
                $q->where('edad', '>=', $validated['min_age'])
                  ->where('edad', '<=', $validated['max_age']);
            });
            break;
            
        case 'terms':
            if (!empty($validated['terms'])) {
                $query->where(function($q) use ($validated) {
                    foreach ($validated['terms'] as $term) {
                        $q->orWhere('impresion_diagnostica', 'LIKE', "%{$term}%");
                    }
                });
            }
            break;
    }

    // Obtenemos los resultados y procesamos los códigos
    $consultas = $query->get();

    // Contador para los códigos CIE10
    $cie10Counts = [];

    foreach ($consultas as $consulta) {
        if (!empty($consulta->impresion_diagnostica)) {
            // Separamos los códigos por punto y coma
            $codigos = explode(';', $consulta->impresion_diagnostica);
            
            // Limpiamos cada código (eliminamos espacios en blanco)
            $codigos = array_map('trim', $codigos);
            
            // Contamos cada código individual
            foreach ($codigos as $codigo) {
                if (!empty($codigo)) {
                    // Si estamos filtrando por términos, solo contamos los seleccionados
                    if ($validated['filter_type'] !== 'terms' || 
                        in_array($codigo, $validated['terms'] ?? [])) {
                        
                        if (!isset($cie10Counts[$codigo])) {
                            $cie10Counts[$codigo] = 0;
                        }
                        $cie10Counts[$codigo]++;
                    }
                }
            }
        }
    }

    // Ordenamos por cantidad de usos (de mayor a menor)
    arsort($cie10Counts);

    // Si estamos filtrando por términos, aseguramos que aparezcan todos los términos seleccionados
    if ($validated['filter_type'] === 'terms' && !empty($validated['terms'])) {
        foreach ($validated['terms'] as $term) {
            if (!isset($cie10Counts[$term])) {
                $cie10Counts[$term] = 0;
            }
        }
        
        // Filtramos para mantener solo los términos seleccionados
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