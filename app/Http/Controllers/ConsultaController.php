<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Models\Consulta;
use \App\Models\Paciente;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ConsultaController extends Controller
{
    public function index(Request $request)
    {
        $query = Consulta::with('paciente');

        if ($request->has('dni') && $request->dni) {
            $query->whereHas('paciente', function ($q) use ($request) {
                $q->where('dni', $request->dni);
            });
        }
    
        $consultas = $query->get();
    
        return inertia('Consultas/Index', compact('consultas'));
    }

    public function create()
    {
        $pacientes = Paciente::select('id', 'dni', 'nombres', 'apellido_paterno', 'apellido_materno')->get();
        return inertia('Consultas/Create', compact('pacientes'));
    }

    public function store(Request $request)
{
    try {
        // Validar los datos del formulario
        $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',
            'antecedentes_personales_hta' => 'nullable|boolean',
            'antecedentes_personales_alergias' => 'nullable|boolean',
            'antecedentes_personales_dm' => 'nullable|boolean',
            'antecedentes_personales_otros' => 'nullable|string',
            'antecedentes_patologicos_familiares' => 'nullable|string',
            'cirugias_previas' => 'nullable|string',
            'motivo_consulta' => 'nullable|string',
            'impresion_diagnostica' => 'nullable|string',
            'rp' => 'nullable|string',
            'plan' => 'nullable|string',
            'examenes_indicados' => 'nullable|string',
            'evoluciones' => 'nullable|string',
            'fondo_ojo' => 'nullable|string',
        ]);

        // Transformar los valores de los checkboxes
        $antecedentesPersonalesHta = $request->antecedentes_personales_hta ? 'HTA' : '';
        $antecedentesPersonalesAlergias = $request->antecedentes_personales_alergias ? 'ALERGIAS' : '';
        $antecedentesPersonalesDm = $request->antecedentes_personales_dm ? 'DM' : '';

        // Generar el código de consulta automáticamente
        $codigoConsulta = 'CONS-' . now()->format('Ymd-His');

        // Crear la consulta
        $consulta = Consulta::create([
            'paciente_id' => $request->paciente_id,
            'codigo_consulta' => $codigoConsulta,
            'antecedentes_personales_hta' => $antecedentesPersonalesHta,
            'antecedentes_personales_alergias' => $antecedentesPersonalesAlergias,
            'antecedentes_personales_dm' => $antecedentesPersonalesDm,
            'antecedentes_personales_otros' => $request->antecedentes_personales_otros,
            'antecedentes_patologicos_familiares' => $request->antecedentes_patologicos_familiares,
            'cirugias_previas' => $request->cirugias_previas,
            'motivo_consulta' => $request->motivo_consulta,
            'impresion_diagnostica' => $request->impresion_diagnostica,
            'rp' => $request->rp,
            'plan' => $request->plan,
            'examenes_indicados' => $request->examenes_indicados,
            'evoluciones' => $request->evoluciones,
            'fondo_ojo' => $request->fondo_ojo,
        ]);

        return redirect()->route('consultas.index')->with('success', 'Consulta creada correctamente.');
    } catch (\Exception $e) {
        return redirect()->back()->with('error', 'Error al crear la consulta: ' . $e->getMessage());
    }
}

    public function show(Consulta $consulta)
    {
        // Cargar la relación con el paciente
        $consulta->load('paciente');
        return Inertia::render('Consultas/Show', [
            'consulta' => $consulta,
        ]);
    }

    public function destroy($id)
    {
        // Buscar y eliminar la consulta
        $consulta = Consulta::findOrFail($id);
        $consulta->delete();

        // Redirigir a la lista de consultas con un mensaje de éxito
        return redirect()->route('consultas.index')->with('success', 'Consulta eliminada correctamente.');
    }

    public function edit($id)
    {
        // Buscar la consulta y cargar paciente e imágenes
        $consulta = Consulta::with('paciente')->findOrFail($id);

        return Inertia::render('Consultas/Edit', [
            'consulta' => $consulta,
        ]);
    }

    public function update(Request $request, $id)
{
    // Validar los datos del formulario
    $request->validate([
        'antecedentes_personales_hta' => 'nullable|boolean',
        'antecedentes_personales_alergias' => 'nullable|boolean',
        'antecedentes_personales_dm' => 'nullable|boolean',
        'antecedentes_personales_otros' => 'nullable|string',
        'antecedentes_patologicos_familiares' => 'nullable|string',
        'cirugias_previas' => 'nullable|string',
        'motivo_consulta' => 'nullable|string',
        'impresion_diagnostica' => 'nullable|string',
        'rp' => 'nullable|string',
        'plan' => 'nullable|string',
        'examenes_indicados' => 'nullable|string',
        'evoluciones' => 'nullable|string',
        'fondo_ojo' => 'nullable|string',
    ]);

    // Buscar la consulta por su ID
    $consulta = Consulta::findOrFail($id);

    // Transformar los valores de los checkboxes
    $antecedentesPersonalesHta = $request->antecedentes_personales_hta ? 'HTA' : '';
    $antecedentesPersonalesAlergias = $request->antecedentes_personales_alergias ? 'ALERGIAS' : '';
    $antecedentesPersonalesDm = $request->antecedentes_personales_dm ? 'DM' : '';

    // Actualizar la consulta
    $consulta->update([
        'antecedentes_personales_hta' => $antecedentesPersonalesHta,
        'antecedentes_personales_alergias' => $antecedentesPersonalesAlergias,
        'antecedentes_personales_dm' => $antecedentesPersonalesDm,
        'antecedentes_personales_otros' => $request->antecedentes_personales_otros,
        'antecedentes_patologicos_familiares' => $request->antecedentes_patologicos_familiares,
        'cirugias_previas' => $request->cirugias_previas,
        'motivo_consulta' => $request->motivo_consulta,
        'impresion_diagnostica' => $request->impresion_diagnostica,
        'rp' => $request->rp,
        'plan' => $request->plan,
        'examenes_indicados' => $request->examenes_indicados,
        'evoluciones' => $request->evoluciones,
        'fondo_ojo' => $request->fondo_ojo,
    ]);

    return redirect()->route('consultas.index')->with('success', 'Consulta actualizada correctamente.');
}

    public function buscarPacientePorDNI(Request $request)
    {
        $dni = $request->input('dni'); // Obtener el DNI del request

        // Buscar el paciente por DNI
        $paciente = Paciente::where('dni', $dni)->first();

        if ($paciente) {
            // Formatear los datos del paciente en un solo string
            $pacienteInfo = "Nombres: {$paciente->nombres}\nApellido Paterno: {$paciente->apellido_paterno}\nApellido Materno: {$paciente->apellido_materno}\nDNI: {$paciente->dni}";
            return response()->json(['paciente_info' => $pacienteInfo]);
        }

        return response()->json(['paciente_info' => 'Paciente no encontrado'], 404);
    }
}