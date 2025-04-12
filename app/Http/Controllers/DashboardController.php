<?php
namespace App\Http\Controllers;

use App\Models\Consulta;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Index', [
            'auth' => [
                'user' => Auth::user() ?: null
            ],
            'topCie10' => $this->getFilteredCie10Data(new Request()),
            'initialFilters' => [
                'filter_type' => 'general',
                'sex' => '',
                'min_age' => '',
                'max_age' => ''
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

    protected function getFilteredCie10Data(Request $request)
{
    // Validar los parámetros de filtro
    $validated = $request->validate([
        'filter_type' => 'nullable|in:general,sex,age',
        'sex' => 'nullable|in:M,F',
        'min_age' => [
            'nullable',
            'integer',
            'min:0',
            function ($attribute, $value, $fail) use ($request) {
                if ($request->filter_type === 'age' && empty($value)) {
                    $fail('La edad mínima es requerida cuando se filtra por edad.');
                }
            },
        ],
        'max_age' => [
            'nullable',
            'integer',
            'min:0',
            function ($attribute, $value, $fail) use ($request) {
                if ($request->filter_type === 'age' && empty($value)) {
                    $fail('La edad máxima es requerida cuando se filtra por edad.');
                }
            },
            'gte:min_age'
        ],
    ]);

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
                        if (!isset($cie10Counts[$codigo])) {
                            $cie10Counts[$codigo] = 0;
                        }
                        $cie10Counts[$codigo]++;
                    }
                }
            }
        }

        // Ordenamos por cantidad de usos (de mayor a menor)
        arsort($cie10Counts);

        return $cie10Counts;
    }
}