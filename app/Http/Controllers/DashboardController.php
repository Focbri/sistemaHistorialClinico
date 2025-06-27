<?php
namespace App\Http\Controllers;

use App\Models\Consulta;
use App\Models\Paciente;
use App\Models\Cita;
use App\Models\Farmaco;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Index', [
            'auth' => [
                'user' => Auth::user() ?: null
            ],
            'initialTopCie10' => $this->getFilteredCie10Data([
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
        'start_date' => 'nullable|date',
        'end_date' => 'nullable|date|after_or_equal:start_date',
        'terms' => 'nullable|array',
        'terms.*' => 'nullable|string',
        'procedencia' => 'nullable|string'
    ]);

    if ($validator->fails()) {
        throw new \Illuminate\Validation\ValidationException($validator);
    }

    $validated = $validator->validated();
    $terms = $requestData['terms'] ?? ($requestData['terms[]'] ?? []);
    $validated['terms'] = is_array($terms) ? $terms : [$terms];
    
    $query = Consulta::with('paciente')
        ->select('id', 'impresion_diagnostica', 'paciente_id', 'created_at')
        ->whereHas('paciente', function($q) {
            // Filtro principal por sede de la sesión
            $q->where('sede', session('sede_actual'));
        });

    // Filtro por sexo
    if (!empty($validated['sex'])) {
        $query->whereHas('paciente', function($q) use ($validated) {
            $q->where('sexo', $validated['sex']);
        });
    }
    
    // Filtro por edad (similar al PacienteController pero con edad directa)
    if (!empty($validated['min_age']) || !empty($validated['max_age'])) {
        $query->whereHas('paciente', function($q) use ($validated) {
            if (!empty($validated['min_age'])) {
                $q->where('edad', '>=', $validated['min_age']);
            }
            if (!empty($validated['max_age'])) {
                $q->where('edad', '<=', $validated['max_age']);
            }
        });
    }
    
    // Filtro por rango de fechas (de la consulta)
    if (!empty($validated['start_date']) || !empty($validated['end_date'])) {
        if (!empty($validated['start_date'])) {
            $query->whereDate('created_at', '>=', $validated['start_date']);
        }
        if (!empty($validated['end_date'])) {
            $query->whereDate('created_at', '<=', $validated['end_date']);
        }
    }
    
    // Filtro por procedencia
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

// En patientStats()
public function patientStats(Request $request)
{
    // Obtener parámetros de filtrado
    $minAge = $request->input('min_age');
    $maxAge = $request->input('max_age');
    $procedencia = $request->input('procedencia');

    // Consulta base
    $query = Paciente::deSedeActual();

    // Aplicar filtros
    if (!empty($minAge)) {
        $query->where('edad', '>=', $minAge);
    }

    if (!empty($maxAge)) {
        $query->where('edad', '<=', $maxAge);
    }

    if (!empty($procedencia)) {
        $query->where('procedencia', $procedencia);
    }

    // Determinar si se están usando filtros personalizados
    $customRange = !empty($minAge) || !empty($maxAge);

    // Obtener distribución por género
    $genderDistribution = (clone $query)
        ->selectRaw('sexo as gender, COUNT(*) as count')
        ->groupBy('sexo')
        ->get()
        ->pluck('count', 'gender');

    // Obtener distribución por rangos de edad
    $ageDistribution = [];
    if ($customRange) {
        // Usar rango personalizado
        $rangeLabel = (!empty($minAge) ? $minAge : '0') . '-' . (!empty($maxAge) ? $maxAge : '+');
        $count = (clone $query)->count();
        $ageDistribution = [$rangeLabel => $count];
    } else {
        // Usar rangos predefinidos
        $ageDistribution = (clone $query)
            ->selectRaw('
                CASE
                    WHEN edad < 18 THEN "0-17"
                    WHEN edad BETWEEN 18 AND 30 THEN "18-30"
                    WHEN edad BETWEEN 31 AND 45 THEN "31-45"
                    WHEN edad BETWEEN 46 AND 60 THEN "46-60"
                    ELSE "60+"
                END as age_range,
                COUNT(*) as count
            ')
            ->groupBy('age_range')
            ->orderBy('age_range')
            ->get()
            ->pluck('count', 'age_range');
    }

    // Obtener distribución por procedencia
    $procedenciaDistribution = (clone $query)
        ->selectRaw('procedencia, COUNT(*) as count')
        ->whereNotNull('procedencia')
        ->groupBy('procedencia')
        ->orderBy('count', 'desc')
        ->get()
        ->pluck('count', 'procedencia');

    return response()->json([
        'data' => [
            'gender' => $genderDistribution,
            'age_ranges' => $ageDistribution,
            'procedencia' => $procedenciaDistribution,
            'total' => $query->count(),
            'newThisMonth' => (clone $query)
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'custom_range' => $customRange,
            'min_age' => $minAge,
            'max_age' => $maxAge
        ]
    ]);
}

public function appointmentStats()
{
    $today = now()->format('Y-m-d');
    
    if (!Auth::check()) {
        return response()->json([
            'data' => [
                'today' => 0,
                'total' => 0,
                'statusDistribution' => [],
                'doctorAppointments' => [],
            ]
        ]);
    }
    
    try {
        // Citas para hoy
        $citasHoy = Cita::deSedeActual()
            ->whereDate('fecha_hora', $today)
            ->count();
        
        // Citas totales (a partir de hoy)
        $citasTotales = Cita::deSedeActual()
            ->whereDate('fecha_hora', '>=', $today)
            ->count();
        
        // Distribución por estado (para hoy)
        $statusDistribution = Cita::deSedeActual()
            ->whereDate('fecha_hora', $today)
            ->selectRaw('estado as status, COUNT(*) as count')
            ->groupBy('estado')
            ->get()
            ->pluck('count', 'status');
        
        // Obtenemos médicos con citas (alternativa segura)
        $medicos = User::whereIn('role', ['medico', 'medico_externo'])
            ->select('id', 'name')
            ->get();
        
        $doctorAppointments = [];
        
        foreach ($medicos as $medico) {
            $citasHoyMedico = Cita::deSedeActual()
                ->where('medico_id', $medico->id)
                ->whereDate('fecha_hora', $today)
                ->count();
                
            $citasTotalesMedico = Cita::deSedeActual()
                ->where('medico_id', $medico->id)
                ->whereDate('fecha_hora', '>=', $today)
                ->count();
                
            if ($citasHoyMedico > 0 || $citasTotalesMedico > 0) {
                $doctorAppointments[] = [
                    'medico' => $medico->name,
                    'citas_hoy' => $citasHoyMedico,
                    'citas_totales' => $citasTotalesMedico
                ];
            }
        }
        
        // Ordenar por citas de hoy (descendente)
        usort($doctorAppointments, function($a, $b) {
            return $b['citas_hoy'] - $a['citas_hoy'];
        });
        
        return response()->json([
            'data' => [
                'today' => $citasHoy,
                'total' => $citasTotales,
                'statusDistribution' => $statusDistribution,
                'doctorAppointments' => $doctorAppointments
            ]
        ]);
        
    } catch (\Exception $e) {
        Log::error('Error en appointmentStats: ' . $e->getMessage());
        return response()->json([
            'error' => 'Error al obtener estadísticas de citas',
            'details' => $e->getMessage()
        ], 500);
    }
}

public function farmacoStats()
{
    try {
        // Total de fármacos en el sistema
        $totalFarmacos = Farmaco::count();
        
        // Fármacos con stock crítico (total <= 1)
        $farmacosCriticos = Farmaco::with('stock')
            ->whereHas('stock', function($query) {
                $query->whereRaw('(visual + insamed + s_p) <= 1');
            })
            ->get()
            ->map(function($farmaco) {
                return [
                    'id' => $farmaco->id,
                    'nombre_comercial' => $farmaco->nombre_comercial,
                    'componente_activo' => $farmaco->componente_activo,
                    'presentacion' => $farmaco->presentacion,
                    'stock_total' => $farmaco->stock ? 
                        ($farmaco->stock->visual + $farmaco->stock->insamed + $farmaco->stock->s_p) : 0,
                    'stock_visual' => $farmaco->stock->visual ?? 0,
                    'stock_insamed' => $farmaco->stock->insamed ?? 0,
                    'stock_s_p' => $farmaco->stock->s_p ?? 0,
                ];
            });
        
        return response()->json([
            'data' => [
                'total_farmacos' => $totalFarmacos,
                'farmacos_criticos' => $farmacosCriticos,
                'count_criticos' => count($farmacosCriticos)
            ]
        ]);
        
    } catch (\Exception $e) {
        Log::error('Error en farmacoStats: ' . $e->getMessage());
        return response()->json([
            'error' => 'Error al obtener estadísticas de fármacos',
            'details' => $e->getMessage()
        ], 500);
    }
}
}