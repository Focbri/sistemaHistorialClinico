<?php
// app/Http/Controllers/CirugiaController.php
namespace App\Http\Controllers;

use App\Models\Cirugia;
use App\Models\Paciente;
use Illuminate\Http\Request;

class CirugiaController extends Controller
{
    public function create()
    {
        return inertia('Consultas/CreateCirugia', [
            'pacientes' => Paciente::all()
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
    return inertia('Cirugias/Show', [
        'cirugia' => $cirugia->load('paciente', 'user')
    ]);
}
}