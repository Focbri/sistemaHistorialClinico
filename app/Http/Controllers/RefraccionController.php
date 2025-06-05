<?php
namespace App\Http\Controllers;

use App\Models\Refraccion;
use App\Models\Consulta;
use App\Models\Paciente;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;

class RefraccionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'consulta_id' => 'required|exists:consultas,id',
            // Examen previo - Distancia
            'exam_old_distancia_esfera_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_distancia_cilindro_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_distancia_eje_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_distancia_esfera_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_distancia_cilindro_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_distancia_eje_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_distancia_dip' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            // Examen previo - Cerca
            'exam_old_cerca_esfera_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_cerca_cilindro_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_cerca_eje_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_cerca_esfera_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_cerca_cilindro_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_cerca_eje_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_cerca_dip' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            // Examen actual - Distancia
            'exam_new_distancia_esfera_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_distancia_cilindro_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_distancia_eje_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_distancia_esfera_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_distancia_cilindro_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_distancia_eje_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_distancia_dip' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            // Examen actual - Cerca
            'exam_new_cerca_esfera_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_cerca_cilindro_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_cerca_eje_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_cerca_esfera_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_cerca_cilindro_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_cerca_eje_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_cerca_dip' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            // Campos adicionales
            'instrucciones' => 'nullable|string|max:255',
            'adiciones' => 'nullable|string|max:255'
        ]);
        
        $refraccion = Refraccion::create($validated);

        return response()->json([
            'success' => true,
            'data' => $refraccion
        ]);
    }
    
    public function update(Request $request, Refraccion $refraccion)
    {
        $validated = $request->validate([
            'consulta_id' => 'required|exists:consultas,id',
            // Examen previo - Distancia
            'exam_old_distancia_esfera_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_distancia_cilindro_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_distancia_eje_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_distancia_esfera_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_distancia_cilindro_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_distancia_eje_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_distancia_dip' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            // Examen previo - Cerca
            'exam_old_cerca_esfera_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_cerca_cilindro_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_cerca_eje_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_cerca_esfera_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_cerca_cilindro_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_cerca_eje_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_old_cerca_dip' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            // Examen actual - Distancia
            'exam_new_distancia_esfera_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_distancia_cilindro_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_distancia_eje_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_distancia_esfera_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_distancia_cilindro_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_distancia_eje_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_distancia_dip' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            // Examen actual - Cerca
            'exam_new_cerca_esfera_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_cerca_cilindro_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_cerca_eje_od' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_cerca_esfera_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_cerca_cilindro_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_cerca_eje_oi' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            'exam_new_cerca_dip' => 'nullable|regex:/^[+-]?\d{1,3}(?:\.\d{1,2})?$/',
            // Campos adicionales
            'instrucciones' => 'nullable|string|max:255',
            'adiciones' => 'nullable|string|max:255'
        ]);
        
        $refraccion->update($validated);

        return response()->json([
            'success' => true,
            'data' => $refraccion
        ]);
    }
    
    public function getPorConsulta($consultaId)
    {
        $refraccion = Refraccion::where('consulta_id', $consultaId)->first();

        if (!$refraccion) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontró examen de refracción para esta consulta'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $refraccion
        ]);
    }

    public function generarPDF($id)
    {
        try {
            $refraccion = Refraccion::with(['consulta.paciente', 'consulta.medico'])->findOrFail($id);
            

            $pdf = Pdf::loadView('refracciones.pdf', [
                'refraccion' => $refraccion,
                'paciente' => $refraccion->consulta->paciente,
                'fechaActual' => now()->format('d/m/Y'),
                'codigoRefraccion' => 'REF-' . str_pad($refraccion->id, 6, '0', STR_PAD_LEFT)
            ]);

            return $pdf->stream('refraccion.pdf');

        } catch (\Exception $e) {
            Log::error('Error al generar PDF de refracción: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}