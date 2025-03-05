<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Models\Consulta;
use \App\Models\Paciente;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Dompdf\Dompdf;
use Dompdf\Options;
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
    
        $consultas = $query->paginate(10); // 10 consultas por página
    
        return inertia::render('Consultas/Index', [
            'consultas' => $consultas,
            'links' => [
                'first' => $consultas->url(1),
                'last' => $consultas->url($consultas->lastPage()),
                'prev' => $consultas->previousPageUrl(),
                'next' => $consultas->nextPageUrl(),
            ],
        ]);
    }

    public function create()
    {
        $pacientes = Paciente::select('id', 'dni', 'nombres', 'apellido_paterno', 'apellido_materno')
        ->orderBy('nombres')
        ->get();
        return inertia::render('Consultas/Create', compact('pacientes'));
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
            'tratamiento' => 'nullable|string',
            'plan' => 'nullable|string',
            'examenes_indicados' => 'nullable|string',
            'evoluciones' => 'nullable|string',
            'fondo_ojo' => 'nullable|string',
        ]);

        // Transformar los valores de los checkboxes
        $antecedentesPersonalesHta = $request->antecedentes_personales_hta ? 'HTA' : '';
        $antecedentesPersonalesAlergias = $request->antecedentes_personales_alergias ? 'ALERGIAS' : '';
        $antecedentesPersonalesDm = $request->antecedentes_personales_dm ? 'DM' : '';

        // Obtener la fecha actual en formato YYYYMMDD
        $fechaActual = now()->format('dmy');

        // Obtener el número de consultas creadas hoy
        $numeroConsultaHoy = Consulta::whereDate('created_at', now()->toDateString())->count();

        // Incrementar el número para la nueva consulta
        $numeroConsultaHoy++;

        // Formatear el número con ceros a la izquierda (ejemplo: 001, 002, ..., 010, etc.)
        $numeroFormateado = str_pad($numeroConsultaHoy, 3, '0', STR_PAD_LEFT);

        // Generar el código de consulta
        $codigoConsulta = $fechaActual . '-' . $numeroFormateado;

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
            'tratamiento' => $request->tratamiento,
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
            'tratamiento' => 'nullable|string',
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
            'tratamiento' => $request->tratamiento,
            'plan' => $request->plan,
            'examenes_indicados' => $request->examenes_indicados,
            'evoluciones' => $request->evoluciones,
            'fondo_ojo' => $request->fondo_ojo,
        ]);

        return redirect()->route('consultas.index')->with('success', 'Consulta actualizada correctamente.');
    }

    public function buscarPacientePorDNI(Request $request)
{
    $dni = trim($request->input('dni')); // Eliminar espacios en blanco
    Log::info('Buscando paciente con DNI:', ['dni' => $dni]);

    // Buscar el paciente por DNI
    $paciente = Paciente::where('dni', $dni)->first();

    if ($paciente) {
        Log::info('Paciente encontrado:', ['paciente' => $paciente]);
        return response()->json([
            'success' => true,
            'paciente' => [
                'id' => $paciente->id,
                'nombres' => $paciente->nombres,
                'apellido_paterno' => $paciente->apellido_paterno,
                'apellido_materno' => $paciente->apellido_materno,
                'dni' => $paciente->dni,
                'telefono' => $paciente->telefono,
                'email' => $paciente->email,
            ],
        ]);
    }
    
    Log::warning('Paciente no encontrado para DNI:', ['dni' => $dni]);
    return response()->json(['success' => false, 'message' => 'Paciente no encontrado'], 404);
}

    public function generarPDF($id)
    {
        try {
            // Obtener la consulta
            $consulta = Consulta::findOrFail($id);
            Log::info('Consulta encontrada:', ['consulta' => $consulta]);

            // Obtener la fecha actual
            $fechaActual = now()->format('d/m/Y'); // Formato: día/mes/año

            // Convertir la imagen del fondo de ojo a base64
            $imagePathFondoOjo = public_path('img/fondo_ojo.png');
            if (!file_exists($imagePathFondoOjo)) {
                Log::error('La imagen del fondo de ojo no existe en la ruta:', ['ruta' => $imagePathFondoOjo]);
                return redirect()->back()->with('error', 'La imagen del fondo de ojo no existe.');
            }
            $imageDataFondoOjo = base64_encode(file_get_contents($imagePathFondoOjo));
            $imageSrcFondoOjo = 'data:image/png;base64,' . $imageDataFondoOjo;
            Log::info('Imagen del fondo de ojo convertida a base64:', ['imageSrcFondoOjo' => $imageSrcFondoOjo]);

            // Convertir la imagen del logo a base64
            $imagePathLogo = public_path('img/logoVisualOsf.png');
            if (!file_exists($imagePathLogo)) {
                Log::error('La imagen del logo no existe en la ruta:', ['ruta' => $imagePathLogo]);
                return redirect()->back()->with('error', 'La imagen del logo no existe.');
            }
            $imageDataLogo = base64_encode(file_get_contents($imagePathLogo));
            $imageSrcLogo = 'data:image/png;base64,' . $imageDataLogo;
            Log::info('Imagen del logo convertida a base64:', ['imageSrcLogo' => $imageSrcLogo]);

            // Pasar datos a la vista
            $pdf = Pdf::loadView('consultas.pdf', [
                'consulta' => $consulta,
                'imageSrcFondoOjo' => $imageSrcFondoOjo, // Pasar la imagen del fondo de ojo en base64
                'imageSrcLogo' => $imageSrcLogo, // Pasar la imagen del logo en base64
                'fechaActual' => $fechaActual, // Pasar la fecha actual
            ]);

            // Configurar DomPDF
            $pdf->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true, // Habilitar carga de recursos remotos
                'defaultFont' => 'sans-serif',
            ]);

            // Ruta de la carpeta del paciente
            $carpetaPaciente = 'pacientes/' . $consulta->paciente->dni;
            Log::info('Carpeta del paciente:', ['carpeta' => $carpetaPaciente]);

            // Crear la carpeta si no existe
            if (!Storage::exists($carpetaPaciente)) {
                Storage::makeDirectory($carpetaPaciente);
                Log::info('Carpeta creada:', ['carpeta' => $carpetaPaciente]);
            }

            // Nombre del archivo PDF
            $nombreArchivo = 'consulta_' . $consulta->id . '-' . $consulta->paciente->dni . '.pdf';
            Log::info('Nombre del archivo PDF:', ['nombreArchivo' => $nombreArchivo]);

            // Guardar el PDF en la carpeta del paciente
            Storage::put($carpetaPaciente . '/' . $nombreArchivo, $pdf->output());
            Log::info('PDF guardado correctamente.');

            // Retornar una respuesta JSON o redirigir
            return response()->json([
                'success' => true,
                'message' => 'PDF generado y guardado correctamente.',
                'path' => $carpetaPaciente . '/' . $nombreArchivo,
            ]);
        } catch (\Exception $e) {
            // Manejar errores
            Log::error('Error al generar el PDF:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error al generar el PDF: ' . $e->getMessage(),
            ], 500);
        }
    }
}