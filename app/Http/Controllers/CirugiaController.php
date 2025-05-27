<?php
// app/Http/Controllers/CirugiaController.php
namespace App\Http\Controllers;

use App\Models\Cirugia;
use App\Models\Paciente;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Cita;
use Inertia\Inertia;

class CirugiaController extends Controller
{
    public function create(Request $request)
{
    $paciente = null;
    $cita_id = $request->input('cita_id');
    

    if ($cita_id) {
        $cita = Cita::with('paciente')->findOrFail($cita_id);
        $paciente = $cita->paciente;
    }

    return Inertia::render('Consultas/CreateCirugia', [
        'paciente' => $paciente,
        'cita_id' => $cita_id
    ]);
}

public function edit(Cirugia $cirugia)
{
    $pacientes = Paciente::all();
    
    // Asegurar el formato de fecha correcto para el input date
    $cirugia->fecha_cirugia = $cirugia->fecha_cirugia ? 
        (new \DateTime($cirugia->fecha_cirugia))->format('Y-m-d') : 
        now()->format('Y-m-d');
    
    return Inertia::render('Consultas/EditCirugia', [
        'cirugia' => $cirugia,
        'pacientes' => $pacientes
    ]);
}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',
            'diagnostico_preoperatorio' => 'required|string',
            'diagnostico_postoperatorio' => 'nullable|string',
            'cirugia' => 'required|string',
            'cirujano_principal' => 'required|string',
            'cirujano_ayudante' => 'nullable|string',
            'anestesiologo' => 'required|string',
            'tipo_anestesia' => 'required|string',
            'personal_enfermeria' => 'nullable|array',
            'hallazgos' => 'nullable|string',
            'procedimiento' => 'required|string',
            'fecha_cirugia' => 'required|date',
            'hora_inicio' => 'required',
            'hora_fin' => 'nullable'
        ]);

        $paciente = Paciente::find($request->paciente_id);
        
        if (!$paciente->codigo_historial) {
            $paciente->codigo_historial = 'HCL-' . $paciente->dni;
            $paciente->save();
        }

        Cirugia::create([
            'codigo_historial' => $paciente->codigo_historial,
            ...$validated
        ]);

        return redirect()->route('consultas.index')
            ->with('success', 'Cirugía registrada correctamente');
    }
    public function show(Cirugia $cirugia)
{
    return inertia('Consultas/ShowCirugia', [
        'cirugia' => $cirugia->load('paciente', 'user')
    ]);
}

public function generarPDF($id)
{
    try {
        $cirugia = Cirugia::with(['paciente', 'user'])->findOrFail($id);
        
        // Procesar personal_enfermeria - ya es un array, no necesita json_decode
        $personalEnfermeria = $cirugia->personal_enfermeria ?? [];
        
        // Si por alguna razón viene como string JSON, intentamos convertirlo
        if (is_string($personalEnfermeria)) {
            $decoded = json_decode($personalEnfermeria, true);
            $personalEnfermeria = (json_last_error() === JSON_ERROR_NONE) ? $decoded : [$personalEnfermeria];
        }

        $data = [
            'cirugia' => $cirugia,
            'personalEnfermeria' => (array)$personalEnfermeria, // Asegurarse que es array
            'fechaActual' => now()->format('d/m/Y'),
            'horaActual' => now()->format('H:i')
        ];

        $pdf = Pdf::loadView('cirugias.pdf', $data);
        return $pdf->download("Cirugia_{$cirugia->paciente->dni}.pdf");

    } catch (\Exception $e) {
        Log::error('Error al generar PDF de cirugía: ' . $e->getMessage());
        return back()->with('error', 'Error al generar el PDF: ' . $e->getMessage());
    }
}

public function update(Request $request, Cirugia $cirugia)
{
    $validated = $request->validate([
        'diagnostico_preoperatorio' => 'required|string',
        'diagnostico_postoperatorio' => 'nullable|string',
        'cirugia' => 'required|string',
        'cirujano_principal' => 'required|string',
        'cirujano_ayudante' => 'nullable|string',
        'anestesiologo' => 'required|string',
        'tipo_anestesia' => 'required|string',
        'personal_enfermeria' => 'nullable|array',
        'hallazgos' => 'nullable|string',
        'procedimiento' => 'required|string',
        'fecha_cirugia' => 'required|date',
        'hora_inicio' => 'required',
        'hora_fin' => 'nullable'
    ]);

    $cirugia->update($validated);

    return redirect()->route('consultas.index', $cirugia->id)
        ->with('success', 'Cirugía actualizada correctamente');
}
}