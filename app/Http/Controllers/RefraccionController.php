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
            'distancia_esfera_od' => 'nullable|string|max:10',
            'distancia_cilindro_od' => 'nullable|string|max:10',
            'distancia_eje_od' => 'nullable|string|max:10',
            'distancia_esfera_oi' => 'nullable|string|max:10',
            'distancia_cilindro_oi' => 'nullable|string|max:10',
            'distancia_eje_oi' => 'nullable|string|max:10',
            'distancia_dip' => 'nullable|string|max:10',
            'cerca_esfera_od' => 'nullable|string|max:10',
            'cerca_cilindro_od' => 'nullable|string|max:10',
            'cerca_eje_od' => 'nullable|string|max:10',
            'cerca_esfera_oi' => 'nullable|string|max:10',
            'cerca_cilindro_oi' => 'nullable|string|max:10',
            'cerca_eje_oi' => 'nullable|string|max:10',
            'cerca_dip' => 'nullable|string|max:10',
            'adicion_cerca' => 'nullable|string|max:10',
            'instrucciones' => 'nullable|string|max:255'
        ]);
        
        $refraccion = Refraccion::create($validated);

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
            $refraccion = Refraccion::with(['consulta.paciente'])->findOrFail($id);

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