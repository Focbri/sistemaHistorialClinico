<?php

namespace App\Http\Controllers;

use App\Models\Receta;
use App\Models\MedicamentoReceta;
use App\Models\Farmaco;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class RecetaController extends Controller
{
    public function store(Request $request)
{
    // Verificar si hay datos de receta
    if (!$request->has('receta') || $request->receta === null) {
        return response()->json([
            'success' => true,
            'message' => 'Consulta guardada sin receta médica'
        ]);
    }

    DB::beginTransaction();
    try {
        // Validar solo los campos básicos primero
        $validated = $request->validate([
            'consulta_id' => 'required|exists:consultas,id',
            'paciente_id' => 'required|exists:pacientes,id',
            'medico_id' => 'required|exists:users,id',
            'fecha' => 'required|date',
        ]);

        // Validar campos específicos de receta si existen
        $request->validate([
            'cie10_codes' => 'nullable|array',
            'medicamentos' => 'nullable|array',
            'medicamentos.*.nombre_comercial' => 'required_with:medicamentos|string',
            'medicamentos.*.cantidad' => 'required_with:medicamentos|integer|min:1',
            'medicamentos.*.dosis' => 'required_with:medicamentos|string',
            'medicamentos.*.frecuencia' => 'required_with:medicamentos|string',
            'medicamentos.*.duracion' => 'required_with:medicamentos|string',
            'medicamentos.*.farmaco_id' => 'nullable|exists:farmacos,id',
            'indicaciones_generales' => 'nullable|string',
        ]);

        // Combinar datos validados
        $validated = array_merge($validated, $request->only([
            'cie10_codes', 'medicamentos', 'indicaciones_generales'
        ]));

        // Crear la receta
        $recetaData = [
            'consulta_id' => $validated['consulta_id'],
            'paciente_id' => $validated['paciente_id'],
            'medico_id' => $validated['medico_id'],
            'fecha' => $validated['fecha'],
            'indicaciones_generales' => $validated['indicaciones_generales'] ?? null,
        ];

        // Agregar CIE-10 si existen
        if (!empty($validated['cie10_codes'])) {
            $recetaData['cie10_codes'] = json_encode($validated['cie10_codes']);
        }

        $receta = Receta::create($recetaData);

        // Procesar medicamentos solo si existen
        // Procesar medicamentos solo si existen
    $erroresStock = [];
    if (!empty($validated['medicamentos'])) {
        foreach ($validated['medicamentos'] as $medicamento) {
            $medData = [
                'receta_id' => $receta->id,
                'nombre_comercial' => $medicamento['nombre_comercial'],
                'cantidad' => $medicamento['cantidad'],
                'dosis' => $medicamento['dosis'],
                'frecuencia' => $medicamento['frecuencia'],
                'duracion' => $medicamento['duracion'],
                'es_manual' => empty($medicamento['farmaco_id'])
            ];

            if (!empty($medicamento['farmaco_id'])) {
                $farmaco = Farmaco::with('stock')->find($medicamento['farmaco_id']);
                
                if (!$farmaco) {
                    $erroresStock[] = "Medicamento no encontrado: {$medicamento['nombre_comercial']}";
                    continue;
                }

                // Solo validar stock, no restar
                $stockTotal = $farmaco->stock_disponible;
                if ($stockTotal < $medicamento['cantidad']) {
                    $erroresStock[] = "Stock insuficiente para {$farmaco->nombre_comercial} (Stock: {$stockTotal}, Requerido: {$medicamento['cantidad']})";
                    continue;
                }
                
                $medData['farmaco_id'] = $medicamento['farmaco_id'];                    
                }

                MedicamentoReceta::create($medData);
            }

            if (!empty($erroresStock)) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Problemas con el stock de medicamentos',
                    'errors' => $erroresStock
                ], 422);
            }
        }

        DB::commit();

        return response()->json([
            'success' => true,
            'receta_id' => $receta->id,
            'message' => empty($validated['medicamentos']) && empty($validated['cie10_codes']) 
                ? 'Receta guardada sin medicamentos ni diagnósticos' 
                : 'Receta guardada correctamente'
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Error al guardar receta: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Error al guardar la receta: ' . $e->getMessage()
        ], 500);
    }
}

protected function actualizarStock(Farmaco $farmaco, $cantidad)
{
    $cantidadRestante = $cantidad;
    
    // Ordenar almacenes por stock descendente
    $almacenes = [
        ['nombre' => 'visual', 'stock' => $farmaco->stock->visual],
        ['nombre' => 'insamed', 'stock' => $farmaco->stock->insamed],
        ['nombre' => 's_p', 'stock' => $farmaco->stock->s_p]
    ];
    
    usort($almacenes, function($a, $b) {
        return $b['stock'] <=> $a['stock'];
    });

    foreach ($almacenes as $almacen) {
        if ($cantidadRestante <= 0) break;
        
        $descontar = min($cantidadRestante, $farmaco->stock->{$almacen['nombre']});
        if ($descontar > 0) {
            $farmaco->stock->decrement($almacen['nombre'], $descontar);
            $cantidadRestante -= $descontar;
        }
    }

    return $cantidadRestante === 0;
}

public function generarPDFReceta($id)
{
    try {
        // 1. Obtener datos básicos de la receta
        $receta = Receta::with(['consulta.paciente', 'medico'])
                      ->findOrFail($id);

        // 2. Obtener medicamentos (versión adaptada a tu estructura)
        $medicamentos = DB::table('medicamentos_receta')
                        ->where('receta_id', $id)
                        ->select([
                            'nombre_comercial',
                            'cantidad',
                            'dosis',
                            'frecuencia',
                            'duracion',
                            'farmaco_id' // Para referencia aunque no lo usemos
                        ])
                        ->get();

        // 3. Opcional: Obtener datos adicionales de fármacos si existen
        $farmacosIds = $medicamentos->pluck('farmaco_id')->filter()->unique();
        $farmacosData = DB::table('farmacos')
                         ->whereIn('id', $farmacosIds)
                         ->select('id', 'componente_activo')
                         ->get()
                         ->keyBy('id');

        // 4. Preparar datos para la vista
        $data = [
            'receta' => $receta,
            'paciente' => $receta->consulta->paciente,
            'medico' => $receta->medico,
            'cie10Codes' => $receta->cie10_codes ? json_decode($receta->cie10_codes, true) : [],
            'medicamentos' => $medicamentos->map(function($med) use ($farmacosData) {
                return [
                    'nombre_comercial' => $med->nombre_comercial,
                    'cantidad' => $med->cantidad,
                    'dosis' => $med->dosis,
                    'frecuencia' => $med->frecuencia,
                    'duracion' => $med->duracion,
                    'componente_activo' => $med->farmaco_id ? 
                        ($farmacosData[$med->farmaco_id]->componente_activo ?? null) : null
                ];
            }),
            'fechaActual' => now()->format('d/m/Y'),
            'codigoReceta' => 'REC-'.str_pad($receta->id, 6, '0', STR_PAD_LEFT),
            'created_at' => $receta->created_at,
            'updated_at' => $receta->updated_at
        ];

        // 5. Generar PDF
        $pdf = PDF::loadView('recetas.pdf', $data);
        return $pdf->download("Receta_{$receta->consulta->paciente->dni}.pdf");

    } catch (\Exception $e) {
        Log::error('Error al generar PDF', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        return response()->json([
            'success' => false,
            'message' => 'Error al generar PDF: '.$e->getMessage()
        ], 500);
    }
}

public function getRecetaPorConsulta($consultaId)
{
    try {
        Log::info('Buscando receta para consulta: '.$consultaId);
        
        $receta = Receta::with(['medicamentos' => function($query) {
                $query->with('farmaco');
            }])
            ->where('consulta_id', $consultaId)
            ->first();

        Log::info('Receta encontrada: '.($receta ? $receta->id : 'null'));

        if (!$receta) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontró receta para esta consulta'
            ], 200);
        }

        // Asegurar que medicamentos es siempre una colección
        $medicamentos = $receta->medicamentos ?: collect();

        return response()->json([
            'success' => true,
            'id' => $receta->id,
            'receta' => [
                'id' => $receta->id,
                'consulta_id' => $receta->consulta_id,
                'cie10_codes' => $receta->cie10_codes ?? [],
                'medicamentos' => $medicamentos->map(function($med) {
                    return [
                        'id' => $med->id,
                        'farmaco_id' => $med->farmaco_id,
                        'nombre_comercial' => $med->nombre_comercial,
                        'cantidad' => $med->cantidad,
                        'dosis' => $med->dosis,
                        'frecuencia' => $med->frecuencia,
                        'duracion' => $med->duracion,
                        'es_manual' => $med->es_manual,
                        'farmaco' => $med->farmaco ? [
                            'id' => $med->farmaco->id,
                            'nombre_comercial' => $med->farmaco->nombre_comercial,
                            'nombre_generico' => $med->farmaco->nombre_generico // Asegúrate de incluir esto
                        ] : null
                    ];
                })
            ]
        ]);

    } catch (\Exception $e) {
        Log::error('Error al buscar receta: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Error al buscar receta: ' . $e->getMessage()
        ], 500);
    }
}

    // Métodos protegidos para funcionalidad interna
    protected function generarPDF($receta, $medico)
    {
        $images = [
            'logo' => $this->imageToBase64(public_path('img/logoVisualOsf.png')),
            //'firma' => $this->imageToBase64(public_path('img/firma_medico.png'))
        ];

        // Convertir cie10_codes a array si es necesario
        $cie10Codes = is_string($receta->cie10_codes) 
            ? json_decode($receta->cie10_codes, true) ?? []
            : $receta->cie10_codes;

        return Pdf::loadView('recetas.pdf', [
            'receta' => $receta,
            'medico' => $medico,
            'images' => $images,
            'cie10Codes' => $cie10Codes,
            'fechaActual' => now()->format('d/m/Y'),
            'horaActual' => now()->format('H:i'),
            'fechaReceta' => $receta->created_at->format('d/m/Y'),
            'codigoReceta' => 'REC-' . str_pad($receta->id, 6, '0', STR_PAD_LEFT)
        ])->setOptions([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
            'defaultFont' => 'sans-serif',
            'enable_css_float' => true,
            'dpi' => 300
        ]);
    }

    protected function guardarPDFReceta($receta, $pdf)
    {
        $dni = $receta->consulta->paciente->dni;
        $filename = 'receta_' . $receta->id . '_' . now()->format('YmdHis') . '.pdf';
        $directory = "pacientes/{$dni}/recetas";
        
        Storage::disk('public')->makeDirectory($directory);
        Storage::disk('public')->put("{$directory}/{$filename}", $pdf->output());
        
        $receta->update(['pdf_path' => "{$directory}/{$filename}"]);
        
        return "{$directory}/{$filename}";
    }

    protected function imageToBase64($path)
    {
        if (!file_exists($path)) {
            throw new \Exception("Imagen no encontrada: $path");
        }
        
        $type = pathinfo($path, PATHINFO_EXTENSION);
        $data = file_get_contents($path);
        
        return 'data:image/' . $type . ';base64,' . base64_encode($data);
    }

    protected function jsonError($message, $status = 500)
    {
        return response()->json([
            'success' => false,
            'message' => $message
        ], $status);
    }
}