<?php

namespace App\Http\Controllers;

use App\Models\Receta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Consulta;
use App\Models\Paciente;
use App\Models\User;

class RecetaController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'consulta_id' => 'required|exists:consultas,id',
            'paciente_id' => 'required|exists:pacientes,id',
            'medico_id' => 'required|exists:users,id',
            'cie10_codes' => 'required|array', // Cambiado de diagnostico a cie10_codes
            'medicamentos' => 'required|array',
            'indicaciones_generales' => 'nullable|string',
            'fecha' => 'required|date',
        ]);

        // Convertir arrays a JSON
        $validated['cie10_codes'] = json_encode($validated['cie10_codes']);
        $validated['medicamentos'] = json_encode($validated['medicamentos']);

        Receta::create($validated);

        return back()->with('success', 'Receta guardada correctamente');
    }

    public function generarPDFReceta($id)
    {
        try {
            $receta = Receta::with(['consulta.paciente'])->findOrFail($id);

            // Convertir campos JSON a arrays
            $cie10Codes = json_decode($receta->cie10_codes, true) ?? [];
            $medicamentos = is_string($receta->medicamentos) 
                ? json_decode($receta->medicamentos, true) ?? []
                : $receta->medicamentos;

            $pdf = Pdf::loadView('recetas.pdf', [
                'receta' => $receta,
                'paciente' => $receta->consulta->paciente,
                'cie10Codes' => $cie10Codes,
                'medicamentos' => $medicamentos,
                'fechaActual' => now()->format('d/m/Y'),
                'codigoReceta' => 'REC-' . str_pad($receta->id, 6, '0', STR_PAD_LEFT)
            ]);

            return $pdf->stream('receta.pdf');

        } catch (\Exception $e) {
            Log::error('Error al generar receta PDF: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getRecetaPorConsulta($consultaId)
    {
        try {
            $receta = Receta::where('consulta_id', $consultaId)->first();
    
            if (!$receta) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontró receta para esta consulta'
                ], 404);
            }
    
            return response()->json([
                'success' => true,
                'id' => $receta->id,
                'consulta_id' => $receta->consulta_id,
                'cie10_codes' => json_decode($receta->cie10_codes, true) ?? [],
                'medicamentos' => is_string($receta->medicamentos) 
                    ? json_decode($receta->medicamentos, true) 
                    : $receta->medicamentos
            ]);
    
        } catch (\Exception $e) {
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
            'firma' => $this->imageToBase64(public_path('img/firma_medico.png'))
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