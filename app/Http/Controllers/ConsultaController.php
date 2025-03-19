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
use Illuminate\Support\Str; 

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

    public function create(Request $request)
{
    $pacientes = Paciente::select('id', 'dni', 'nombres', 'apellido_paterno', 'apellido_materno')
        ->orderBy('nombres')
        ->get();

    // Determinar el tipo de consulta (inicio o evolución)
    $tipoConsulta = $request->query('tipo', 'inicio'); // Por defecto es 'inicio'

    return Inertia::render('Consultas/Create', [
        'pacientes' => $pacientes,
        'tipoConsulta' => $tipoConsulta, // Pasar el tipo de consulta a la vista
    ]);
}

    // Guardar la consulta de inicio
    public function store(Request $request)
{
    try {
        // Validar los datos del formulario
        $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',
            'antecedentes_personales_hta' => 'nullable|string',
            'antecedentes_personales_alergias' => 'nullable|string',
            'antecedentes_personales_dm' => 'nullable|string',
            'antecedentes_personales_otros' => 'nullable|string',
            'antecedentes_patologicos_familiares' => 'nullable|string',
            'cirugias_previas' => 'nullable|string',
            'motivo_consulta' => 'nullable|string',
            'impresion_diagnostica' => 'nullable|string',
            'tratamiento' => 'nullable|string',
            'plan' => 'nullable|string',
            //
            'examenes_indicados_img' => 'nullable|array|max:4', // Máximo 4 imágenes
            'examenes_indicados_img.*' => 'file|mimes:jpg,jpeg,png|max:2048', // Cada imagen debe ser un archivo válido
            'examenes_indicados_archivos' => 'nullable|array|max:4', // Máximo 4 archivos
            'examenes_indicados_archivos.*' => 'file|mimes:pdf,doc,docx,xls,xlsx|max:5120', // Cada archivo debe ser válido
            //
            'evoluciones' => 'nullable|string',
            'tipo_consulta' => 'nullable|in:inicio,evolucion', // Asegurar que el tipo de consulta sea 
            'examen_av_sc_od' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_cae_od' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_cc_od' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_sc_oi' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_cae_oi' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_cc_oi' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_pi_od' => 'nullable|string',
            'examen_pi_oi' => 'nullable|string',
            'examen_ar_sph_od' => 'nullable|string',
            'examen_ar_cyl_od' => 'nullable|string',
            'examen_ar_ax_od' => 'nullable|string',
            'examen_ar_sph_oi' => 'nullable|string',
            'examen_ar_cyl_oi' => 'nullable|string',
            'examen_ar_ax_oi' => 'nullable|string',
            'examen_keratometria_qd1_od' => 'nullable|string',
            'examen_keratometria_qd2_od' => 'nullable|string',
            'examen_keratometria_eje_od' => 'nullable|string',
            'examen_keratometria_qd1_oi' => 'nullable|string',
            'examen_keratometria_qd2_oi' => 'nullable|string',
            'examen_keratometria_eje_oi' => 'nullable|string',
            'biomicroscopia_movoculares_od' => 'nullable|string',
            'biomicroscopia_movoculares_oi' => 'nullable|string',
            'biomicroscopia_parpados_od' => 'nullable|string',
            'biomicroscopia_parpados_oi' => 'nullable|string',
            'biomicroscopia_cornea_od' => 'nullable|string',
            'biomicroscopia_cornea_oi' => 'nullable|string',
            'biomicroscopia_corneaconj_od' => 'nullable|string',
            'biomicroscopia_corneaconj_oi' => 'nullable|string',
            'biomicroscopia_ca_od' => 'nullable|string',
            'biomicroscopia_ca_oi' => 'nullable|string',
            'biomicroscopia_iris_od' => 'nullable|string',
            'biomicroscopia_iris_oi' => 'nullable|string',
            'biomicroscopia_cristalino_od' => 'nullable|string',
            'biomicroscopia_cristalino_oi' => 'nullable|string',
            //
            'fondo_ojo_retina_p_od' => 'nullable|string',
            'fondo_ojo_macula_od' => 'nullable|string',
            'fondo_ojo_vitreo_od' => 'nullable|string',
            'fondo_ojo_disco_o_od' => 'nullable|string',
            'fondo_ojo_vasos_od' => 'nullable|string',
            'fondo_ojo_retina_p_oi' => 'nullable|string',
            'fondo_ojo_macula_oi' => 'nullable|string',
            'fondo_ojo_vitreo_oi' => 'nullable|string',
            'fondo_ojo_disco_o_oi' => 'nullable|string',
            'fondo_ojo_vasos_oi' => 'nullable|string',

        ]);

        Log::info('Ruta de almacenamiento:', ['ruta' => storage_path('app/public')]);
        Log::info('Ruta de enlace simbólico:', ['ruta' => public_path('storage')]);

        // Verificar si ya existe una consulta de inicio para este paciente
        if ($request->tipo_consulta === 'inicio') {
            $existeConsultaInicio = Consulta::where('paciente_id', $request->paciente_id)
                ->where('tipo_consulta', 'inicio')
                ->exists(); 

            if ($existeConsultaInicio) {
                return redirect()->back()->withErrors(['message' => 'Ya existe una consulta de inicio para este paciente. No se puede generar más de una.']);
            }
        }

        // Obtener el paciente
        $paciente = Paciente::findOrFail($request->paciente_id);

        // Crear la estructura de carpetas
        $carpetaPaciente = 'pacientes/' . $paciente->dni;

        $carpetaHistorialClinico = $carpetaPaciente . '/historial_clinico';
        $carpetaImagenes = $carpetaPaciente . '/imagenes';
        $carpetaArchivos = $carpetaPaciente . '/archivos';

         // Crear las carpetas si no existen
        if (!Storage::disk('public')->exists($carpetaImagenes)) {
            Storage::disk('public')->makeDirectory($carpetaImagenes);
        }
        if (!Storage::disk('public')->exists($carpetaHistorialClinico)) {
            Storage::disk('public')->makeDirectory($carpetaHistorialClinico);
        }
        if (!Storage::disk('public')->exists($carpetaArchivos)) {
            Storage::disk('public')->makeDirectory($carpetaArchivos);
        }

         // Procesar las imágenes
        $imagenes = [];
        if ($request->hasFile('examenes_indicados_img')) {
            foreach ($request->file('examenes_indicados_img') as $imagen) {
                $nombreImagen = time() . '_' . $imagen->getClientOriginalName();
                $rutaImagen = $imagen->storeAs($carpetaImagenes, $nombreImagen, 'public'); // Guardar en la carpeta del paciente
                $imagenes[] = $rutaImagen; // Guardar la ruta en un array
            }
        }
        // Procesar los archivos
        $archivos = [];
        if ($request->hasFile('examenes_indicados_archivos')) {
            foreach ($request->file('examenes_indicados_archivos') as $archivo) {
                $nombreArchivo = time() . '_' . $archivo->getClientOriginalName();
                $rutaArchivo = $archivo->storeAs($carpetaArchivos, $nombreArchivo, 'public'); // Guardar en la carpeta del paciente
                $archivos[] = $rutaArchivo; // Guardar la ruta en un array
            }
        }

        // Contar las consultas previas del paciente
        $numeroConsultas = Consulta::where('paciente_id', $paciente->id)->count();

        $numeroConsultasFormateado = str_pad($numeroConsultas + 1, 3, '0', STR_PAD_LEFT);
        $codigoConsulta = 'HCL-' . $paciente->dni . '-' . $numeroConsultasFormateado;
        
        // Crear la consulta
        $consulta = Consulta::create([
            'codigo_consulta' => $codigoConsulta,
            'paciente_id' => $request->paciente_id,
            'tipo_consulta' => $request->tipo_consulta,
            'antecedentes_personales_hta' => $request->antecedentes_personales_hta,
            'antecedentes_personales_alergias' => $request->antecedentes_personales_alergias,
            'antecedentes_personales_dm' => $request->antecedentes_personales_dm,
            'antecedentes_personales_otros' => $request->antecedentes_personales_otros,
            'antecedentes_patologicos_familiares' => $request->antecedentes_patologicos_familiares,
            'cirugias_previas' => $request->cirugias_previas,
            'motivo_consulta' => $request->motivo_consulta,
            'impresion_diagnostica' => $request->impresion_diagnostica,
            'tratamiento' => $request->tratamiento,
            'plan' => $request->plan,
            'examenes_indicados_img' => json_encode($imagenes), // Guardar las rutas de las imágenes como JSON
            'examenes_indicados_archivos' => json_encode($archivos), // Guardar las rutas de los archivos como JSON
            'evoluciones' => $request->evoluciones,
            'examen_av_sc_od' => $request->examen_av_sc_od,
            'examen_av_cae_od' => $request->examen_av_cae_od,
            'examen_av_cc_od' => $request->examen_av_cc_od,
            'examen_av_sc_oi' => $request->examen_av_sc_oi,
            'examen_av_cae_oi' => $request->examen_av_cae_oi,
            'examen_av_cc_oi' => $request->examen_av_cc_oi,
            'examen_pi_od' => $request->examen_pi_od,
            'examen_pi_oi' => $request->examen_pi_oi,
            'examen_ar_sph_od' => $request->examen_ar_sph_od,
            'examen_ar_cyl_od' => $request->examen_ar_cyl_od,
            'examen_ar_ax_od' => $request->examen_ar_ax_od,
            'examen_ar_sph_oi' => $request->examen_ar_sph_oi,
            'examen_ar_cyl_oi' => $request->examen_ar_cyl_oi,
            'examen_ar_ax_oi' => $request->examen_ar_ax_oi,
            'examen_keratometria_qd1_od' => $request->examen_keratometria_qd1_od,
            'examen_keratometria_qd2_od' => $request->examen_keratometria_qd2_od,
            'examen_keratometria_eje_od' => $request->examen_keratometria_eje_od,
            'examen_keratometria_qd1_oi' => $request->examen_keratometria_qd1_oi,
            'examen_keratometria_qd2_oi' => $request->examen_keratometria_qd2_oi,
            'examen_keratometria_eje_oi' => $request->examen_keratometria_eje_oi,
            'biomicroscopia_movoculares_od' => $request->biomicroscopia_movoculares_od,
            'biomicroscopia_movoculares_oi' => $request->biomicroscopia_movoculares_oi,
            'biomicroscopia_parpados_od' => $request->biomicroscopia_parpados_od,
            'biomicroscopia_parpados_oi' => $request->biomicroscopia_parpados_oi,
            'biomicroscopia_cornea_od' => $request->biomicroscopia_cornea_od,
            'biomicroscopia_cornea_oi' => $request->biomicroscopia_cornea_oi,
            'biomicroscopia_corneaconj_od' => $request->biomicroscopia_corneaconj_od,
            'biomicroscopia_corneaconj_oi' => $request->biomicroscopia_corneaconj_oi,
            'biomicroscopia_ca_od' => $request->biomicroscopia_ca_od,
            'biomicroscopia_ca_oi' => $request->biomicroscopia_ca_oi,
            'biomicroscopia_iris_od' => $request->biomicroscopia_iris_od,
            'biomicroscopia_iris_oi' => $request->biomicroscopia_iris_oi,
            'biomicroscopia_cristalino_od' => $request->biomicroscopia_cristalino_od,
            'biomicroscopia_cristalino_oi' => $request->biomicroscopia_cristalino_oi,
            //
            'fondo_ojo_retina_p_od' => $request->fondo_ojo_retina_p_od,
            'fondo_ojo_macula_od' => $request->fondo_ojo_macula_od,
            'fondo_ojo_vitreo_od' => $request->fondo_ojo_vitreo_od,
            'fondo_ojo_disco_o_od' => $request->fondo_ojo_disco_o_od,
            'fondo_ojo_vasos_od' => $request->fondo_ojo_vasos_od,
            'fondo_ojo_retina_p_oi' => $request->fondo_ojo_retina_p_oi,
            'fondo_ojo_macula_oi' => $request->fondo_ojo_macula_oi,
            'fondo_ojo_vitreo_oi' => $request->fondo_ojo_vitreo_oi,
            'fondo_ojo_disco_o_oi' => $request->fondo_ojo_disco_o_oi,
            'fondo_ojo_vasos_oi' => $request->fondo_ojo_vasos_oi,
        ]);

        Log::info('Archivos recibidos:', [
            'imagenes' => $request->file('examenes_indicados_img'),
            'archivos' => $request->file('examenes_indicados_archivos'),
        ]);

        return redirect()->route('consultas.index')->with('success', 'Consulta creada correctamente.');
    } catch (\Exception $e) {
        // Registrar el error en los logs
        Log::error('Error al crear la consulta:', ['error' => $e->getMessage()]);
        return redirect()->back()->withErrors(['message' => 'Error al crear la consulta: ' . $e->getMessage()]);
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
        Log::info('Datos recibidos:', $request->all());
        // Validar los datos del formulario
        $request->validate([
            'antecedentes_personales_hta' => 'nullable|string',
            'antecedentes_personales_alergias' => 'nullable|string',
            'antecedentes_personales_dm' => 'nullable|string',
            'antecedentes_personales_otros' => 'nullable|string',
            'antecedentes_patologicos_familiares' => 'nullable|string',
            'cirugias_previas' => 'nullable|string',
            'motivo_consulta' => 'nullable|string',
            'impresion_diagnostica' => 'nullable|string',
            'tratamiento' => 'nullable|string',
            'plan' => 'nullable|string',
            'examenes_indicados' => 'nullable|array|max:4', // Máximo 4 imágenes
            'examenes_indicados.*' => 'file|mimes:jpg,jpeg,png|max:2048', // Cada imagen debe ser un archivo válido
            'imagenes_a_eliminar' => 'nullable|json', // Campo para imágenes a eliminar
            'evoluciones' => 'nullable|string',
            'examen_av_sc_od' => 'required|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_cae_od' => 'required|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_cc_od' => 'required|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_sc_oi' => 'required|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_cae_oi' => 'required|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_cc_oi' => 'required|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_pi_od' => 'nullable|string',
            'examen_pi_oi' => 'nullable|string',
            'examen_ar_sph_od' => 'nullable|string',
            'examen_ar_cyl_od' => 'nullable|string',
            'examen_ar_ax_od' => 'nullable|string',
            'examen_ar_sph_oi' => 'nullable|string',
            'examen_ar_cyl_oi' => 'nullable|string',
            'examen_ar_ax_oi' => 'nullable|string',
            'examen_keratometria_qd1_od' => 'nullable|string',
            'examen_keratometria_qd2_od' => 'nullable|string',
            'examen_keratometria_eje_od' => 'nullable|string',
            'examen_keratometria_qd1_oi' => 'nullable|string',
            'examen_keratometria_qd2_oi' => 'nullable|string',
            'examen_keratometria_eje_oi' => 'nullable|string',
            //
            'biomicroscopia_movoculares_od' => 'nullable|string',
            'biomicroscopia_movoculares_oi' => 'nullable|string',
            'biomicroscopia_parpados_od' => 'nullable|string',
            'biomicroscopia_parpados_oi' => 'nullable|string',
            'biomicroscopia_cornea_od' => 'nullable|string',
            'biomicroscopia_cornea_oi' => 'nullable|string',
            'biomicroscopia_corneaconj_od' => 'nullable|string',
            'biomicroscopia_corneaconj_oi' => 'nullable|string',
            'biomicroscopia_ca_od' => 'nullable|string',
            'biomicroscopia_ca_oi' => 'nullable|string',
            'biomicroscopia_iris_od' => 'nullable|string',
            'biomicroscopia_iris_oi' => 'nullable|string',
            'biomicroscopia_cristalino_od' => 'nullable|string',
            'biomicroscopia_cristalino_oi' => 'nullable|string',
            //
            'fondo_ojo_retina_p_od' => 'nullable|string',
            'fondo_ojo_macula_od' => 'nullable|string',
            'fondo_ojo_vitreo_od' => 'nullable|string',
            'fondo_ojo_disco_o_od' => 'nullable|string',
            'fondo_ojo_vasos_od' => 'nullable|string',
            'fondo_ojo_retina_p_oi' => 'nullable|string',
            'fondo_ojo_macula_oi' => 'nullable|string',
            'fondo_ojo_vitreo_oi' => 'nullable|string',
            'fondo_ojo_disco_o_oi' => 'nullable|string',
            'fondo_ojo_vasos_oi' => 'nullable|string',
        ]);        

        // Buscar la consulta por su ID
        $consulta = Consulta::findOrFail($id);

        // Actualizar la consulta
        $consulta->update($request->all());

        // Procesar las imágenes a eliminar
        $imagenesAEliminar = json_decode($request->imagenes_a_eliminar, true) ?? [];
        $rutasArchivos = json_decode($consulta->examenes_indicados, true) ?? [];
        foreach ($imagenesAEliminar as $imagen) {
            Storage::disk('public')->delete($imagen); // Eliminar la imagen del almacenamiento
            $rutasArchivos = array_diff($rutasArchivos, [$imagen]); // Eliminar la ruta del array
        }

        // Procesar las imágenes subidas
        $rutasArchivos = json_decode($consulta->examenes_indicados, true) ?? [];
            if ($request->hasFile('examenes_indicados')) {
                foreach ($request->file('examenes_indicados') as $archivo) {
                    $nombreArchivo = time() . '_' . $archivo->getClientOriginalName();
                    $rutaArchivo = $archivo->storeAs('examenes_indicados', $nombreArchivo, 'public');
                    $rutasArchivos[] = $rutaArchivo;
                }
            }

    // Actualizar las rutas como JSON o null si no hay imágenes
    $consulta->update([
        // Otros campos...
        'examenes_indicados' => !empty($rutasArchivos) ? json_encode($rutasArchivos) : null,
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
                'fecha_nacimiento' => $paciente->fecha_nacimiento,
                'edad' => $paciente->edad,
                'sexo' => $paciente->sexo,
                'procedencia' => $paciente->procedencia,
                'acompañante' => $paciente->acompañante,
                'referido' => $paciente->referido,
                'peso' => $paciente->peso,
                'estado_civil' => $paciente->estado_civil,
                'ocupacion' => $paciente->ocupacion,
                'direccion' => $paciente->direccion,
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
            
            if (!$consulta->paciente) {
                Log::error('La consulta no tiene un paciente asociado:', ['consulta_id' => $id]);
                return redirect()->back()->with('error', 'La consulta no tiene un paciente asociado.');
            }

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
                'enable_css_float' => true, // Habilitar soporte para CSS float
            ]);

            // Ruta de la carpeta del paciente
            $carpetaPaciente = 'pacientes/' . $consulta->paciente->dni;

            $carpetaHistorialClinico = $carpetaPaciente . '/historial_clinico';

             // Crear la carpeta si no existe
            if (!Storage::disk('public')->exists($carpetaHistorialClinico)) {
                Storage::disk('public')->makeDirectory($carpetaHistorialClinico);
            }

            // Nombre del archivo PDF
            $nombreArchivo = 'consulta_' . $consulta->id . '-' . $consulta->paciente->dni . '.pdf';
            Log::info('Nombre del archivo PDF:', ['nombreArchivo' => $nombreArchivo]);

            // Guardar el PDF en la carpeta de historial clínico
            Storage::disk('public')->put($carpetaHistorialClinico . '/' . $nombreArchivo, $pdf->output());

            // Retornar una respuesta JSON o redirigir
            return response()->json([
                'success' => true,
                'message' => 'PDF generado y guardado correctamente.',
                'path' => $carpetaHistorialClinico . '/' . $nombreArchivo,
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

    // Verificar si existe una consulta de inicio para el paciente
    public function verificarConsultaInicio($pacienteId)
    {
        try {
            // Verificar si existe una consulta de inicio para el paciente
            $existe = Consulta::where('paciente_id', $pacienteId)
                ->where('tipo_consulta', 'inicio')
                ->exists();

            return response()->json(['existe' => $existe]);
        } catch (\Exception $e) {
            // Registrar el error en los logs
            Log::error('Error al verificar consulta de inicio:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al verificar consulta de inicio'], 500);
        }
    }
}