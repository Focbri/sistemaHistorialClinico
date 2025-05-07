<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Models\Consulta;
use \App\Models\Paciente;
use \App\Models\TerminoBiomicroscopia;
use \App\Models\Examen;
use \App\Models\Receta;
use \App\Models\Refraccion;
use App\Models\TerminoMotivoConsulta;
use \App\Models\Cirugia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Illuminate\Pagination\LengthAwarePaginator;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use phpDocumentor\Reflection\DocBlock\Tags\Var_;

class ConsultaController extends Controller
{
    public function index(Request $request) 
{
    // Consultas médicas
    $queryConsultas = Consulta::with(['paciente', 'receta', 'user'])
        ->when($request->filled('dni'), function($q) use ($request) {
            $q->whereHas('paciente', function($q) use ($request) {
                $q->where('dni', 'like', '%'.$request->dni.'%');
            });
        });

    // Cirugías
    $queryCirugias = Cirugia::with(['paciente'])
        ->when($request->filled('dni'), function($q) use ($request) {
            $q->whereHas('paciente', function($q) use ($request) {
                $q->where('dni', 'like', '%'.$request->dni.'%');
            });
        });

    // Combinar resultados
    $resultadosCombinados = $queryConsultas->get()
        ->merge($queryCirugias->get())
        ->sortByDesc('created_at');

    // Paginación manual
    $page = LengthAwarePaginator::resolveCurrentPage();
    $perPage = 10;
    $results = $resultadosCombinados->slice(($page - 1) * $perPage, $perPage)->values();
    
    $paginatedResults = new LengthAwarePaginator(
        $results,
        $resultadosCombinados->count(),
        $perPage,
        $page,
        [
            'path' => LengthAwarePaginator::resolveCurrentPath(),
            'pageName' => 'page',
        ]
    );

    // Convertir a array y ajustar estructura para Inertia
    $consultas = $paginatedResults->toArray();
    $consultas['data'] = $results->toArray();
    
    // Construir links en el formato que espera tu componente
    $links = [];
    
    // Previous page
    $links[] = [
        'url' => $paginatedResults->previousPageUrl(),
        'label' => '&laquo; Anterior',
        'active' => false
    ];
    
    // Numbered pages
    foreach ($paginatedResults->getUrlRange(1, $paginatedResults->lastPage()) as $page => $url) {
        $links[] = [
            'url' => $url,
            'label' => (string)$page,
            'active' => $page == $paginatedResults->currentPage()
        ];
    }
    
    // Next page
    $links[] = [
        'url' => $paginatedResults->nextPageUrl(),
        'label' => 'Siguiente &raquo;',
        'active' => false
    ];

    $consultas['links'] = $links;

    return Inertia::render('Consultas/Index', [
        'consultas' => $consultas,
        'filters' => $request->only(['dni'])
    ]);
}
public function create(Request $request)
{
    // Obtener la consulta (si es necesario)
    $pacientes = Paciente::select('id', 'dni', 'nombres', 'apellido_paterno', 'apellido_materno','edad')
        ->orderBy('nombres')
        ->get();

    // Determinar el tipo de consulta (inicio o evolución)
    $tipoConsulta = $request->query('tipo', 'inicio'); // Por defecto es 'inicio'
    // Obtener la edad del paciente si se selecciona uno
    $edad = null;
    $historialDiagnosticos = [];
    if ($request->has('paciente_id')) {
        $paciente = Paciente::find($request->query('paciente_id'));
        if ($paciente) {
            $edad = $paciente->edad;
            
            // Cargar historial solo si es evolución
            if ($tipoConsulta === 'evolucion') {
                $historialDiagnosticos = Consulta::where('paciente_id', $paciente->id)
                    ->whereNotNull('impresion_diagnostica')
                    ->orderBy('created_at', 'desc')
                    ->get(['impresion_diagnostica', 'created_at', 'tipo_consulta'])
                    ->map(function ($consulta) {
                        return [
                            'fecha' => $consulta->created_at->format('d/m/Y'),
                            'diagnostico' => $consulta->impresion_diagnostica,
                            'tipo' => $consulta->tipo_consulta
                        ];
                    });
            }
        }
    }

    return Inertia::render('Consultas/Create', [
        'pacientes' => $pacientes,
        'tipoConsulta' => $tipoConsulta, // Pasar el tipo de consulta a la vista
        'edad' => $edad, // Pasar la edad del paciente
        'historialDiagnosticos' => $historialDiagnosticos
    ]);
}
public function show($id)
{
    $consulta = Consulta::with(['paciente', 'receta', 'user'])->findOrFail($id);
    
    // Para peticiones AJAX/API
    if (request()->expectsJson()) {
        return response()->json([
            'consulta' => $consulta,
            'receta' => $consulta->receta // Incluir la receta relacionada
        ]);
    }
    
    // Para navegación normal
    return Inertia::render('Consultas/Show', [
        'consulta' => $consulta
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
    $consulta = Consulta::with(['paciente', 'examen'])->findOrFail($id);
    
    // Función mejorada para parsear archivos
    $parseFiles = function ($jsonData) {
        if (empty($jsonData)) return [];
        
        try {
            $parsed = is_array($jsonData) ? $jsonData : json_decode($jsonData, true);
            
            return array_map(function ($item) {
                if (is_array($item)) {
                    return [
                        'ruta' => $item['ruta'] ?? $item['path'] ?? $item,
                        'nombre_original' => $item['nombre_original'] ?? basename($item['ruta'] ?? $item),
                        'tipo' => $item['tipo'] ?? (str_contains($item['ruta'] ?? $item, 'imagenes') ? 'image' : 'file')
                    ];
                }
                return [
                    'ruta' => $item,
                    'nombre_original' => basename($item),
                    'tipo' => str_contains($item, 'imagenes') ? 'image' : 'file'
                ];
            }, is_array($parsed) ? $parsed : [$parsed]);
        } catch (\Exception $e) {
            return [];
        }
    };


    // Parsear archivos manteniendo estructura consistente
    $consulta->examenes_indicados_img = $parseFiles($consulta->examenes_indicados_img);
    $consulta->examenes_indicados_archivos = $parseFiles($consulta->examenes_indicados_archivos);
    
    // Manejar fondo_ojo_posiciones de manera segura
    $consulta->fondo_ojo_posiciones = $this->parseFondoOjoPosiciones($consulta->fondo_ojo_posiciones);
    
    return Inertia::render('Consultas/Edit', [
        'consulta' => $consulta,
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
            'antecedentes_patologicos_familiares' => 'nullable|array',
            'antecedentes_patologicos_familiares.*' => 'string',
            'cirugias_previas' => 'nullable|array',
            'cirugias_previas.*' => 'string',
            //
            'motivo_consulta_inicio' => 'nullable|string',
            'motivo_consulta_signos' => 'nullable|string',
            'motivo_consulta_enfermedad' => 'nullable|string',
            'motivo_consulta_otros' => 'nullable|string',
            //
            'impresion_diagnostica' => 'nullable|string',
            'tratamiento' => 'nullable|array',
            'tratamiento.*' => 'string',
            'plan' => 'nullable|array',
            'plan.*' => 'string',
            //
            'examenes_indicados_img' => 'nullable|array', // Máximo 4 imágenes
            'examenes_indicados_img.*' => 'file|mimes:jpg,jpeg,png|max:10240', // Cada imagen debe ser un archivo válido
            'examenes_indicados_archivos' => 'nullable|array', // Máximo 4 archivos
            'examenes_indicados_archivos.*' => [
                'file',
                'mimes:pdf,doc,docx,xls,xlsx,zip,rar',
                'max:51200' // 50MB en KB
            ],
            //
            'evoluciones' => 'nullable|array',
            'evoluciones.*' => 'string',
            'tipo_consulta' => 'nullable|in:inicio,evolucion', // Asegurar que el tipo de consulta sea 
            'examen_av_sc_od' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_cae_od' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_cc_od' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_sc_oi' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_cae_oi' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_cc_oi' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_pi_tipo' => 'nullable|in:Aplanatica,Manual,Neumatica',
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
            'fondo_ojo_posiciones' => 'nullable|json',
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
            //
            'exam_new_distancia_esfera_od' => 'nullable|string',
            'exam_new_distancia_esfera_oi' => 'nullable|string',
            'exam_new_distancia_cilindro_od' => 'nullable|string',
            'exam_new_distancia_cilindro_oi' => 'nullable|string',
            'exam_new_distancia_eje_od' => 'nullable|string',
            'exam_new_distancia_eje_oi' => 'nullable|string',
            'exam_new_distancia_dip' => 'nullable|string',
            'exam_old_distancia_esfera_od' => 'nullable|string',
            'exam_old_distancia_esfera_oi' => 'nullable|string',
            'exam_old_distancia_cilindro_od' => 'nullable|string',
            'exam_old_distancia_cilindro_oi' => 'nullable|string',
            'exam_old_distancia_eje_od' => 'nullable|string',
            'exam_old_distancia_eje_oi' => 'nullable|string',
            'exam_old_distancia_dip' => 'nullable|string',
            //
            'exam_new_cerca_esfera_od' => 'nullable|string',
            'exam_new_cerca_esfera_oi' => 'nullable|string',
            'exam_new_cerca_cilindro_od' => 'nullable|string',
            'exam_new_cerca_cilindro_oi' => 'nullable|string',
            'exam_new_cerca_eje_od' => 'nullable|string',
            'exam_new_cerca_eje_oi' => 'nullable|string',
            'exam_new_cerca_dip' => 'nullable|string',
            'exam_old_cerca_esfera_od' => 'nullable|string',
            'exam_old_cerca_esfera_oi' => 'nullable|string',
            'exam_old_cerca_cilindro_od' => 'nullable|string',
            'exam_old_cerca_cilindro_oi' => 'nullable|string',
            'exam_old_cerca_eje_od' => 'nullable|string',
            'exam_old_cerca_eje_oi' => 'nullable|string',
            'exam_old_cerca_dip' => 'nullable|string',
            //
            'comentario' => 'nullable|array',
            'comentario.*' => 'string',
        ]);        

        // Verificar si ya existe una consulta de inicio para este paciente
        if ($request->tipo_consulta === 'inicio') {
            $existeConsultaInicio = Consulta::where('paciente_id', $request->paciente_id)
                ->where('tipo_consulta', 'inicio')
                ->exists(); 

            if ($existeConsultaInicio) {
                return redirect()->back()->withErrors(['message' => 'Ya existe una consulta de inicio para este paciente. No se puede generar más de una.']);
            }
        }

        // Si es una evolución, obtener el historial de diagnósticos
        if ($request->tipo_consulta === 'evolucion') {
            $historialDiagnosticos = Consulta::where('paciente_id', $request->paciente_id)
                ->whereNotNull('impresion_diagnostica')
                ->whereDate('created_at', '<', now())
                ->orderBy('created_at', 'desc')
                ->pluck('impresion_diagnostica', 'created_at')
                ->toArray();                
        }

        // Obtener el paciente
        $paciente = Paciente::findOrFail($request->paciente_id);

        if ($request->hasFile('nuevas_imagenes')) {
            foreach ($request->file('nuevas_imagenes') as $file) {
                $path = $file->store('pacientes/' . $paciente->id . '/imagenes');
                $imagenes[] = [
                    'ruta' => $path,
                    'nombre_original' => $file->getClientOriginalName() // Guardar nombre original
                ];
            }
        }
        
        if ($request->hasFile('nuevos_archivos')) {
            foreach ($request->file('nuevos_archivos') as $file) {
                $path = $file->store('pacientes/' . $paciente->id . '/archivos');
                $archivos[] = [
                    'ruta' => $path,
                    'nombre_original' => $file->getClientOriginalName() // Guardar nombre original
                ];
            }
        }

        // Configurar rutas
        $carpetaBase = 'pacientes/'.$paciente->dni;
        $carpetaImagenes = $carpetaBase.'/imagenes';
        $carpetaArchivos = $carpetaBase.'/archivos';

        // Crear las carpetas si no existen
        if (!Storage::disk('public')->exists($carpetaImagenes)) {
            Storage::disk('public')->makeDirectory($carpetaImagenes);
        }
        if (!Storage::disk('public')->exists($carpetaArchivos)) {
            Storage::disk('public')->makeDirectory($carpetaArchivos);
        }    

        // Procesar imágenes
        $imagenes = [];
        if ($request->hasFile('examenes_indicados_img')) {
            foreach ($request->file('examenes_indicados_img') as $file) {
                $nombreOriginal = $file->getClientOriginalName();
                $path = $file->storeAs(
                    $carpetaImagenes,
                    $nombreOriginal,
                    'public'
                );
                
                $imagenes[] = [
                    'ruta' => $path,
                    'nombre_original' => $nombreOriginal,
                    'tipo' => 'image'
                ];
            }
        }

        // Procesar archivos (similar a imágenes)
        $archivos = [];
        if ($request->hasFile('examenes_indicados_archivos')) {
            foreach ($request->file('examenes_indicados_archivos') as $file) {
                $nombreOriginal = $file->getClientOriginalName();
                $path = $file->storeAs(
                    $carpetaArchivos,
                    $nombreOriginal,
                    'public'
                );
                
                $archivos[] = [
                    'ruta' => $path,
                    'nombre_original' => $nombreOriginal,
                    'tipo' => 'file'
                ];
            }
        }

        // Contar las consultas previas del paciente
        $numeroConsultas = Consulta::where('paciente_id', $paciente->id)->count();

        // Generar código de historial si es la primera consulta
        if (!$paciente->codigo_historial) {
            $paciente->codigo_historial = 'HCL-' . $paciente->dni;
            $paciente->save();
        }
        
        // Crear la consulta
        $consulta = Consulta::create([
            'codigo_historial' => $paciente->codigo_historial,
            'paciente_id' => $request->paciente_id,
            'tipo_consulta' => $request->tipo_consulta,
            'antecedentes_personales_hta' => $request->antecedentes_personales_hta,
            'antecedentes_personales_alergias' => $request->antecedentes_personales_alergias,
            'antecedentes_personales_dm' => $request->antecedentes_personales_dm,
            'antecedentes_personales_otros' => $request->antecedentes_personales_otros,
            'antecedentes_patologicos_familiares' => $request->antecedentes_patologicos_familiares,
            'cirugias_previas' => $request->cirugias_previas,
            'motivo_consulta_inicio' => $request->motivo_consulta_inicio,
            'motivo_consulta_signos' => $request->motivo_consulta_signos,
            'motivo_consulta_enfermedad' => $request->motivo_consulta_enfermedad,
            'motivo_consulta_otros' => $request->motivo_consulta_otros,
            'impresion_diagnostica' => $request->impresion_diagnostica,
            'tratamiento' => $request->tratamiento,
            'plan' => $request->plan,
            'examenes_indicados_img' => json_encode($imagenes), // Guardar las rutas de las imágenes como JSON
            'examenes_indicados_archivos' => json_encode($archivos), // Guardar las rutas de los archivos como JSON
            'evoluciones' => $request->evoluciones,
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
            'fondo_ojo_posiciones' => $request->fondo_ojo_posiciones,
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
            'comentario' => $request->comentario,
        ]);

        // Crear el registro de refracción si hay datos
        if ($request->filled('exam_new_distancia_esfera_od') || 
            $request->filled('exam_old_distancia_esfera_od')) {

                $refraccionData = [
                'consulta_id' => $consulta->id,
                // Campos de examen previo - Distancia
                'exam_old_distancia_esfera_od' => $request->exam_old_distancia_esfera_od,
                'exam_old_distancia_cilindro_od' => $request->exam_old_distancia_cilindro_od,
                'exam_old_distancia_eje_od' => $request->exam_old_distancia_eje_od,
                'exam_old_distancia_esfera_oi' => $request->exam_old_distancia_esfera_oi,
                'exam_old_distancia_cilindro_oi' => $request->exam_old_distancia_cilindro_oi,
                'exam_old_distancia_eje_oi' => $request->exam_old_distancia_eje_oi,
                'exam_old_distancia_dip' => $request->exam_old_distancia_dip,
                // Campos de examen previo - Cerca
                'exam_old_cerca_esfera_od' => $request->exam_old_cerca_esfera_od,
                'exam_old_cerca_cilindro_od' => $request->exam_old_cerca_cilindro_od,
                'exam_old_cerca_eje_od' => $request->exam_old_cerca_eje_od,
                'exam_old_cerca_esfera_oi' => $request->exam_old_cerca_esfera_oi,
                'exam_old_cerca_cilindro_oi' => $request->exam_old_cerca_cilindro_oi,
                'exam_old_cerca_eje_oi' => $request->exam_old_cerca_eje_oi,
                'exam_old_cerca_dip' => $request->exam_old_cerca_dip,
                // Campos de examen actual - Distancia
                'exam_new_distancia_esfera_od' => $request->exam_new_distancia_esfera_od,
                'exam_new_distancia_cilindro_od' => $request->exam_new_distancia_cilindro_od,
                'exam_new_distancia_eje_od' => $request->exam_new_distancia_eje_od,
                'exam_new_distancia_esfera_oi' => $request->exam_new_distancia_esfera_oi,
                'exam_new_distancia_cilindro_oi' => $request->exam_new_distancia_cilindro_oi,
                'exam_new_distancia_eje_oi' => $request->exam_new_distancia_eje_oi,
                'exam_new_distancia_dip' => $request->exam_new_distancia_dip,
                // Campos de examen actual - Cerca
                'exam_new_cerca_esfera_od' => $request->exam_new_cerca_esfera_od,
                'exam_new_cerca_cilindro_od' => $request->exam_new_cerca_cilindro_od,
                'exam_new_cerca_eje_od' => $request->exam_new_cerca_eje_od,
                'exam_new_cerca_esfera_oi' => $request->exam_new_cerca_esfera_oi,
                'exam_new_cerca_cilindro_oi' => $request->exam_new_cerca_cilindro_oi,
                'exam_new_cerca_eje_oi' => $request->exam_new_cerca_eje_oi,
                'exam_new_cerca_dip' => $request->exam_new_cerca_dip,
                // Campos adicionales
                'instrucciones' => $request->instrucciones,
                'adiciones' => $request->adiciones,
            ];

            // Verificar datos antes de crear
                Log::debug('Creando refracción con datos:', $refraccionData);
                
                $refraccion = Refraccion::create($refraccionData);
                
                if (!$refraccion) {
                    Log::error('Fallo al crear refracción');
                }
            }

            // ===== NUEVO CÓDIGO PARA GUARDAR LA RECETA =====
        // Procesar receta si existe
        if ($request->has('receta') && $request->receta !== null) {
            $this->procesarReceta($request->receta, $consulta->id);
        }

        //BIOMICROSCOPIA

        // 1. Verificar que la consulta existe y tiene ID
        if (!isset($consulta->id)) {
            Log::error('No se puede guardar términos - Consulta no existe');
            throw new \Exception('La consulta no existe');
        }

        // 2. Procesar términos de biomicroscopia
        $camposBiomicroscopia = [
            'biomicroscopia_movoculares_od',
            'biomicroscopia_parpados_od',
            'biomicroscopia_cornea_od',
            'biomicroscopia_corneaconj_od',
            'biomicroscopia_ca_od',
            'biomicroscopia_iris_od',
            'biomicroscopia_cristalino_od',
            'biomicroscopia_movoculares_oi',
            'biomicroscopia_parpados_oi',
            'biomicroscopia_cornea_oi',
            'biomicroscopia_corneaconj_oi',
            'biomicroscopia_ca_oi',
            'biomicroscopia_iris_oi',
            'biomicroscopia_cristalino_oi'
        ];

        $terminosProcesados = [];

        foreach ($camposBiomicroscopia as $campo) {
            if (!empty($request->$campo)) {
                $terminos = array_map('trim', 
                    preg_split('/[,;]+/', $request->$campo)
                );
                $terminosProcesados = array_merge($terminosProcesados, $terminos);
            }
        }

        // 3. Filtrar y guardar términos únicos
        $terminosUnicos = array_unique(array_filter($terminosProcesados));

        foreach ($terminosUnicos as $termino) {
            try {
                TerminoBiomicroscopia::create([
                    'termino' => $termino,
                    'consulta_id' => $consulta->id // Asegurar el consulta_id
                ]);
                
            } catch (\Exception $e) {
                Log::error('Error al guardar término', [
                    'termino' => $termino,
                    'error' => $e->getMessage()
                ]);
            }
        }

        // Después de crear la consulta, asociar términos si es necesario
        if ($request->has('biomicroscopia_terms')) {
            $terms = explode(',', $request->biomicroscopia_terms);
            
            foreach ($terms as $term) {
                TerminoBiomicroscopia::updateOrCreate(
                    ['termino' => trim($term), 'consulta_id' => $consulta->id],
                    ['termino' => trim($term)]
                );
            }
        }

        //MOTIVO CONSULTA

        // 1. Verificar que la consulta existe y tiene ID
        if (!isset($consulta->id)) {
            Log::error('No se puede guardar términos MC - Consulta no existe');
            throw new \Exception('La consulta no existe');
        }

        // 2. Procesar términos de biomicroscopia
        $camposMotivoConsulta = [
            'motivo_consulta_inicio',
            'motivo_consulta_signos',
            'motivo_consulta_enfermedad',
            'motivo_consulta_otros',
        ];

        $terminosProcesados = [];

        foreach ($camposMotivoConsulta as $campo) {
            if (!empty($request->$campo)) {
                $terminos_mc = array_map('trim', 
                    preg_split('/[,;]+/', $request->$campo)
                );
                $terminosProcesados = array_merge($terminosProcesados, $terminos_mc);
            }
        }

        // 3. Filtrar y guardar términos únicos
        $terminosUnicos = array_unique(array_filter($terminosProcesados));

        foreach ($terminosUnicos as $terminos_mc) {
            try {
                TerminoMotivoConsulta::create([
                    'termino_mc' => $terminos_mc,
                    'consulta_id' => $consulta->id // Asegurar el consulta_id
                ]);
                
            } catch (\Exception $e) {
                Log::error('Error al guardar término', [
                    'termino_mc' => $terminos_mc,
                    'error' => $e->getMessage()
                ]);
            }
        }
        /////

        // Después de crear la consulta, asociar términos si es necesario
        if ($request->has('motivo_consulta_terms')) {
            $terms = explode(',', $request->motivo_consulta_terms);
            
            foreach ($terms as $term) {
                TerminoMotivoConsulta::updateOrCreate(
                    ['termino_mc' => trim($term), 'consulta_id' => $consulta->id],
                    ['termino_mc' => trim($term)]
                );
            }
        }
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'redirect' => route('consultas.index')
            ]);
        }
        Log::info('Consulta creada', ['consulta_id' => $consulta->id]);

        return redirect()->route('consultas.index')
        ->with('success', 'Consulta creada correctamente.');
        
    } catch (\Exception $e) {
        Log::error('Error en store method', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        if ($request->wantsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la consulta'
            ], 500);
        }
        
        return redirect()->back()
                ->withErrors(['message' => 'Error al crear la consulta: ' . $e->getMessage()]);
    }
}
protected function procesarReceta($recetaData, $consultaId)
{
    // Validar datos de receta
    $validated = validator($recetaData, [
        'paciente_id' => 'required|exists:pacientes,id',
        'medico_id' => 'required|exists:users,id',
        'cie10_codes' => 'required|array',
        'medicamentos' => 'required|array',
        'medicamentos.*.nombre_comercial' => 'required|string',
        'medicamentos.*.cantidad' => 'required|integer|min:1',
        'medicamentos.*.dosis' => 'required|string',
        'medicamentos.*.frecuencia' => 'required|string',
        'medicamentos.*.duracion' => 'required|string',
        'medicamentos.*.farmaco_id' => 'nullable|exists:farmacos,id',
        'indicaciones_generales' => 'nullable|string',
        'fecha' => 'required|date',
    ])->validate();

    // Crear receta
    $receta = Receta::create([
        'consulta_id' => $consultaId,
        'paciente_id' => $validated['paciente_id'],
        'medico_id' => $validated['medico_id'],
        'cie10_codes' => json_encode($validated['cie10_codes']),
        'indicaciones_generales' => $validated['indicaciones_generales'] ?? null,
        'fecha' => $validated['fecha']
    ]);

    // Procesar medicamentos
    foreach ($validated['medicamentos'] as $medicamento) {
        $receta->medicamentos()->create([
            'farmaco_id' => $medicamento['farmaco_id'] ?? null,
            'nombre_comercial' => $medicamento['nombre_comercial'],
            'cantidad' => $medicamento['cantidad'],
            'dosis' => $medicamento['dosis'],
            'frecuencia' => $medicamento['frecuencia'],
            'duracion' => $medicamento['duracion'],
            'es_manual' => empty($medicamento['farmaco_id']),
        ]);
    }
}
// Método para actualizar una consulta
public function update(Request $request, $id)
{
    Log::info('Datos recibidos en update:', $request->all());

    try {
        // Validación más flexible para actualización
        $validatedData = $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',
            'antecedentes_personales_hta' => 'nullable|string',
            'antecedentes_personales_alergias' => 'nullable|string',
            'antecedentes_personales_dm' => 'nullable|string',
            'antecedentes_personales_otros' => 'nullable|string',
            'antecedentes_patologicos_familiares' => 'nullable|array',
            'antecedentes_patologicos_familiares.*' => 'nullable',
            'cirugias_previas' => 'nullable|array',
            'cirugias_previas.*' => 'nullable',
            //
            'motivo_consulta_inicio' => 'nullable|string',
            'motivo_consulta_signos' => 'nullable|string',
            'motivo_consulta_enfermedad' => 'nullable|string',
            'motivo_consulta_otros' => 'nullable|string',
            //
            'impresion_diagnostica' => 'nullable|string',
            'tratamiento' => 'nullable|array',
            'tratamiento.*' => 'nullable',
            'plan' => 'nullable|array',
            'plan.*' => 'string',
            //
            'evoluciones' => 'nullable|array',
            'evoluciones.*' => 'string',
            'tipo_consulta' => 'nullable|in:inicio,evolucion', // Asegurar que el tipo de consulta sea 
            'fondo_ojo_posiciones' => 'nullable|json',
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
                // Agregar validación para archivos a eliminar
            'imagenes_a_eliminar' => 'nullable|json',
            'archivos_a_eliminar' => 'nullable|json',
            
            // Validación para nuevos archivos
            'nuevas_imagenes' => 'nullable|array',
            'nuevas_imagenes.*' => 'image|mimes:jpeg,png,jpg|max:10240',
            'nuevos_archivos' => 'nullable|array',
            'nuevos_archivos.*' => 'mimes:pdf,doc,docx,xls,xlsx|max:51200',
            'files_to_delete' => 'nullable|json',
            // Campos de biomicroscopía explícitos
            'biomicroscopia_movoculares_od' => 'nullable|string',
            'biomicroscopia_parpados_od' => 'nullable|string',
            'biomicroscopia_cornea_od' => 'nullable|string',
            'biomicroscopia_corneaconj_od' => 'nullable|string',
            'biomicroscopia_ca_od' => 'nullable|string',
            'biomicroscopia_iris_od' => 'nullable|string',
            'biomicroscopia_cristalino_od' => 'nullable|string',
            'biomicroscopia_movoculares_oi' => 'nullable|string',
            'biomicroscopia_parpados_oi' => 'nullable|string',
            'biomicroscopia_cornea_oi' => 'nullable|string',
            'biomicroscopia_corneaconj_oi' => 'nullable|string',
            'biomicroscopia_ca_oi' => 'nullable|string',
            'biomicroscopia_iris_oi' => 'nullable|string',
            'biomicroscopia_cristalino_oi' => 'nullable|string',
            //
            'comentario' => 'nullable|array',
            'comentario.*' => 'string',
            
            // Campo para términos de biomicroscopía
            'terminos_biomicroscopia' => 'nullable|string' // Cadena separada por coma
        ]);

        $validatedExamenData = $request->validate([
            'examen_av_sc_od' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_cae_od' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_cc_od' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_sc_oi' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_cae_oi' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_av_cc_oi' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
            'examen_pi_tipo' => 'nullable|in:Aplanatica,Manual,Neumatica',
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
            'exam_new_distancia_esfera_od' => 'nullable|string',
            'exam_new_distancia_esfera_oi' => 'nullable|string',
            'exam_new_distancia_cilindro_od' => 'nullable|string',
            'exam_new_distancia_cilindro_oi' => 'nullable|string',
            'exam_new_distancia_eje_od' => 'nullable|string',
            'exam_new_distancia_eje_oi' => 'nullable|string',
            'exam_new_distancia_dip' => 'nullable|string',
            'exam_old_distancia_esfera_od' => 'nullable|string',
            'exam_old_distancia_esfera_oi' => 'nullable|string',
            'exam_old_distancia_cilindro_od' => 'nullable|string',
            'exam_old_distancia_cilindro_oi' => 'nullable|string',
            'exam_old_distancia_eje_od' => 'nullable|string',
            'exam_old_distancia_eje_oi' => 'nullable|string',
            'exam_old_distancia_dip' => 'nullable|string',
            //
            'exam_new_cerca_esfera_od' => 'nullable|string',
            'exam_new_cerca_esfera_oi' => 'nullable|string',
            'exam_new_cerca_cilindro_od' => 'nullable|string',
            'exam_new_cerca_cilindro_oi' => 'nullable|string',
            'exam_new_cerca_eje_od' => 'nullable|string',
            'exam_new_cerca_eje_oi' => 'nullable|string',
            'exam_new_cerca_dip' => 'nullable|string',
            'exam_old_cerca_esfera_od' => 'nullable|string',
            'exam_old_cerca_esfera_oi' => 'nullable|string',
            'exam_old_cerca_cilindro_od' => 'nullable|string',
            'exam_old_cerca_cilindro_oi' => 'nullable|string',
            'exam_old_cerca_eje_od' => 'nullable|string',
            'exam_old_cerca_eje_oi' => 'nullable|string',
            'exam_old_cerca_dip' => 'nullable|string',
        ]);

        // Procesar archivos a eliminar
        $filesToDelete = $request->filled('files_to_delete') 
        ? json_decode($request->input('files_to_delete'), true) ?? []
        : [];

        foreach ($filesToDelete as $filePath) {
            if (Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
            }
        }

        // Agrega estas validaciones para los nuevos campos:
        if ($request->hasFile('nuevas_imagenes')) {
            $request->validate([
                'nuevas_imagenes.*' => 'image|mimes:jpeg,png,jpg|max:2048'
            ]);
        }

        if ($request->hasFile('nuevos_archivos')) {
            $request->validate([
                'nuevos_archivos.*' => 'mimes:pdf,doc,docx,xls,xlsx|max:5120'
            ]);
        }
        
        // Buscar la consulta
        $consulta = Consulta::findOrFail($id);

        // 1. Actualizar campos directos de biomicroscopía
        $biomicroscopiaFields = [
            'movoculares_od', 'parpados_od', 'cornea_od', 'corneaconj_od',
            'ca_od', 'iris_od', 'cristalino_od', 'movoculares_oi',
            'parpados_oi', 'cornea_oi', 'corneaconj_oi', 'ca_oi',
            'iris_oi', 'cristalino_oi'
        ];

        foreach ($biomicroscopiaFields as $field) {
            $key = 'biomicroscopia_' . $field;
            $consulta->$key = $request->input($key, '');
        }

        // 2. Manejar términos de biomicroscopía (solo catálogo, sin relación directa)
        if ($request->filled('terminos_biomicroscopia')) {
            $terminos = explode(',', $request->terminos_biomicroscopia);
            
            foreach ($terminos as $termino) {
                $termino = trim($termino);
                if (!empty($termino)) {
                    // Buscar o crear término sin asociar a consulta (catálogo general)
                    TerminoBiomicroscopia::firstOrCreate(
                        ['termino' => $termino],
                        ['termino' => $termino] // consulta_id permanecerá null
                    );
                }
            }
        }

        // Verificar si el paciente_id cambió
        if ($request->paciente_id != $consulta->paciente_id) {
            return back()->withErrors(['paciente_id' => 'No se puede cambiar el paciente asociado a la consulta']);
        }

            // Verificar consulta de inicio (excluyendo la actual)
        if ($request->tipo_consulta === 'inicio') {
            $existeOtraConsultaInicio = Consulta::where('paciente_id', $request->paciente_id)
                ->where('tipo_consulta', 'inicio')
                ->where('id', '!=', $id)
                ->exists();

            if ($existeOtraConsultaInicio) {
                return back()->withErrors(['message' => 'Ya existe una consulta de inicio para este paciente. No se puede generar más de una.']);
            }
        }
        // Obtener el paciente
        $paciente = $consulta->paciente;

        // Configuración de carpetas (sin 'public/' al inicio)
        $carpetaBase = 'pacientes/'.$paciente->dni;
        $carpetaImagenes = $carpetaBase.'/imagenes';
        $carpetaArchivos = $carpetaBase.'/archivos';

        // Crear las carpetas si no existen
        if (!Storage::disk('public')->exists($carpetaImagenes)) {
            Storage::disk('public')->makeDirectory($carpetaImagenes);
        }
        if (!Storage::disk('public')->exists($carpetaArchivos)) {
            Storage::disk('public')->makeDirectory($carpetaArchivos);
        }    

        // Procesar todos los archivos (existentes y nuevos) 
        $archivos = $this->procesarArchivos($request, $consulta, $filesToDelete);

            // Obtener archivos existentes (filtrados)
        $existingImages = $this->parseFileData($consulta->examenes_indicados_img);
        $existingFiles = $this->parseFileData($consulta->examenes_indicados_archivos);

        // Procesar nuevas imágenes
        $imagenes = [];
        if ($request->hasFile('examenes_indicados_img')) {
            foreach ($request->file('examenes_indicados_img') as $file) {
                $nombreOriginal = $file->getClientOriginalName();
                $path = $file->storeAs(
                    $carpetaImagenes,
                    $nombreOriginal,
                    'public'
                );
                
                $imagenes[] = [
                    'ruta' => $path,
                    'nombre_original' => $nombreOriginal,
                    'tipo' => 'image'
                ];
            }
        }

        // Procesar nuevos archivos
        $archivos = [];
        if ($request->hasFile('examenes_indicados_archivos')) {
            foreach ($request->file('examenes_indicados_archivos') as $file) {
                $nombreOriginal = $file->getClientOriginalName();
                $path = $file->storeAs(
                    $carpetaArchivos,
                    $nombreOriginal,
                    'public'
                );
                
                $archivos[] = [
                    'ruta' => $path,
                    'nombre_original' => $nombreOriginal,
                    'tipo' => 'file'
                ];
            }
        }

            // Combinar archivos existentes (excluyendo los eliminados) con los nuevos
        $existingImages = json_decode($consulta->examenes_indicados_img, true) ?? [];
        $existingFiles = json_decode($consulta->examenes_indicados_archivos, true) ?? [];

        $allImages = array_merge(   
            array_filter($existingImages, fn($img) => !in_array($img['ruta'], $filesToDelete ?? [])),
            $imagenes
        );
        
        $allFiles = array_merge(
            array_filter($existingFiles, fn($file) => !in_array($file['ruta'], $filesToDelete ?? [])),
            $archivos
        );
        
            // Procesar archivos primero
        $archivosProcesados = $this->procesarArchivos($request, $consulta);

            // Actualizar la consulta con los datos validados + archivos procesados
            $consulta->update(array_merge($validatedData, [
            'examenes_indicados_img' => json_encode($allImages),
            'examenes_indicados_archivos' => json_encode($allFiles),
            'fondo_ojo_posiciones' => $request->fondo_ojo_posiciones 
                ? json_decode($request->fondo_ojo_posiciones, true)
                : null,
        ]));
        
        // Actualizar el examen asociado si existe
        if ($consulta->examen) {
            $consulta->examen->update($validatedExamenData);
        } else {
            $consulta->examen()->create($validatedExamenData);
        }
        
        if ($request->filled('terminos_biomicroscopia')) {
            // 1. Eliminar términos antiguos asociados a esta consulta
            TerminoBiomicroscopia::where('consulta_id', $consulta->id)->delete();
            
            // 2. Procesar nuevos términos
            $terminos = array_unique(
                array_filter(
                    array_map('trim', explode(',', $request->terminos_biomicroscopia)),
                    fn($t) => !empty($t)
                )
            );
        
            foreach ($terminos as $termino) {
                TerminoBiomicroscopia::create([
                    'termino' => $termino,
                    'consulta_id' => $consulta->id // Asociar explícitamente a la consulta
                ]);
                
                // También agregar al catálogo general si no existe
                TerminoBiomicroscopia::firstOrCreate(
                    ['termino' => $termino, 'consulta_id' => null],
                    ['termino' => $termino]
                );
            }
        }          

        // Procesar términos de motivo de consulta
        $this->procesarTerminosMotivoConsulta($request, $consulta);
    
            return redirect()->route('consultas.index')->with('success', 'Consulta actualizada correctamente.');
            
        } catch (\Exception $e) {
            Log::error('Error al actualizar consulta:', ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors(['message' => 'Error al actualizar la consulta: ' . $e->getMessage()]);
        }
}
// Método unificado para guardar archivos
protected function guardarArchivos($files, $carpeta, $tipo) {
    $archivos = [];
    foreach ($files as $file) {
        $path = $file->storeAs(
            $carpeta,
            $file->getClientOriginalName(),
            'public'
        );
        $archivos[] = [
            'ruta' => $path,
            'nombre_original' => $file->getClientOriginalName(),
            'tipo' => $tipo
        ];
    }
    return $archivos;
}
protected function parseFileData($data)
{
    if (empty($data)) return [];
    
    try {
        $parsed = is_array($data) ? $data : json_decode($data, true);
        
        return array_map(function ($item) {
            if (is_array($item)) {
                return [
                    'ruta' => $item['ruta'] ?? $item['path'] ?? $item,
                    'nombre_original' => $item['nombre_original'] ?? basename($item['ruta'] ?? $item),
                    'tipo' => $item['tipo'] ?? (str_contains($item['ruta'] ?? $item, 'imagenes') ? 'image' : 'file')
                ];
            }
            return [
                'ruta' => $item,
                'nombre_original' => basename($item),
                'tipo' => str_contains($item, 'imagenes') ? 'image' : 'file'
            ];
        }, is_array($parsed) ? $parsed : [$parsed]);
    } catch (\Exception $e) {
        return [];
    }
}
// Método unificado para procesar archivos
protected function procesarArchivos(Request $request, Consulta $consulta, $filesToDelete = [])
{
    // Configurar rutas
    $carpetaBase = 'pacientes/'.$consulta->paciente->dni;
    $carpetaImagenes = $carpetaBase.'/imagenes';
    $carpetaArchivos = $carpetaBase.'/archivos';

    // Asegurar directorios
    Storage::disk('public')->makeDirectory($carpetaImagenes);
    Storage::disk('public')->makeDirectory($carpetaArchivos);

    // Procesar archivos existentes (filtrados)
    $existingImages = $this->parseFileData($consulta->examenes_indicados_img);
    $existingFiles = $this->parseFileData($consulta->examenes_indicados_archivos);
    
    // Filtrar para quitar los eliminados
    $filteredImages = array_filter($existingImages, fn($img) => !in_array($img['ruta'], $filesToDelete));
    $filteredFiles = array_filter($existingFiles, fn($file) => !in_array($file['ruta'], $filesToDelete));

    // Procesar nuevas imágenes
    $newImages = [];
    if ($request->hasFile('nuevas_imagenes')) {
        foreach ($request->file('nuevas_imagenes') as $file) {
            $path = $file->storeAs(
                $carpetaImagenes, 
                $file->getClientOriginalName(), // Usar nombre original
                'public'
            );
            $newImages[] = [
                'ruta' => $path,
                'nombre_original' => $file->getClientOriginalName(),
                'tipo' => 'image'
            ];
        }
    }

    // Procesar nuevos archivos
    $newFiles = [];
    if ($request->hasFile('nuevos_archivos')) {
        foreach ($request->file('nuevos_archivos') as $file) {
            $path = $file->storeAs(
                $carpetaArchivos,
                $file->getClientOriginalName(), // Usar nombre original
                'public'
            );
            $newFiles[] = [
                'ruta' => $path,
                'nombre_original' => $file->getClientOriginalName(),
                'tipo' => 'file'
            ];
        }
    }

    return [
        'imagenes' => array_merge($filteredImages, $newImages),
        'archivos' => array_merge($filteredFiles, $newFiles)
    ];
}
protected function procesarArchivoComprimido($file, $pacienteId)
{
    $extension = $file->getClientOriginalExtension();
    $nombreOriginal = $file->getClientOriginalName();
    $carpetaDestino = 'pacientes/'.$pacienteId.'/archivos_comprimidos';
    
    // Guardar el archivo comprimido
    $path = $file->storeAs(
        $carpetaDestino,
        $nombreOriginal,
        'public'
    );
    
    return [
        'ruta' => $path,
        'nombre_original' => $nombreOriginal,
        'tipo' => 'compressed',
        'extension' => $extension
    ];
}    
protected function procesarNuevosArchivos(Request $request, Consulta $consulta, &$imagenes, &$archivos)
{
    $carpetaPaciente = 'pacientes/' . $consulta->paciente->dni;

    if ($request->hasFile('nuevas_imagenes')) {
        foreach ($request->file('nuevas_imagenes') as $imagen) {
            $path = $imagen->store($carpetaPaciente . '/imagenes', 'public');
            $imagenes[] = $path;
        }
    }

    if ($request->hasFile('nuevos_archivos')) {
        foreach ($request->file('nuevos_archivos') as $archivo) {
            $path = $archivo->store($carpetaPaciente . '/archivos', 'public');
            $archivos[] = $path;
        }
    }
}    
// En tu controlador (ConsultasController.php)
public function buscarPaciente(Request $request)
{
    try {
        $request->validate([
            'dni' => 'required|string|max:12' // Usamos 'dni' que es el nombre real de la columna
        ]);

        $paciente = Paciente::where('dni', $request->dni)
            ->select('id', 'dni', 'tipo_documento', 'nombres', 'apellido_paterno', 'apellido_materno', 
                    'edad', 'sexo', 'telefono', 'direccion', 'email', 
                    'fecha_nacimiento', 'estado_civil', 'ocupacion',
                    'procedencia', 'acompañante', 'referido', 'peso', 'foto_perfil')
            ->first();

        if (!$paciente) {
            return response()->json([
                'success' => false,
                'message' => 'Paciente no encontrado'
            ], 404);
        }

        $tieneConsultaInicial = Consulta::where('paciente_id', $paciente->id)
            ->where('tipo_consulta', 'inicio')
            ->exists();

        return response()->json([
            'success' => true,
            'paciente' => $paciente,
            'tieneConsultaInicial' => $tieneConsultaInicial
        ]);

    } catch (\Exception $e) {
        Log::error('Error en buscarPaciente: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Error en el servidor al buscar paciente'
        ], 500);
    }
}
//Metodo para generar historial de diagnosticos
public function historialDiagnosticos($pacienteId)
{
    try {
        $diagnosticos = Consulta::where('paciente_id', $pacienteId)
            ->whereNotNull('impresion_diagnostica')
            ->orderBy('created_at', 'desc')
            ->get(['impresion_diagnostica', 'created_at', 'tipo_consulta'])
            ->map(function ($consulta) {
                return [
                    'fecha' => $consulta->created_at->format('d/m/Y H:i'), // Agregué hora para diferenciar
                    'diagnostico' => $consulta->impresion_diagnostica,
                    'tipo' => $consulta->tipo_consulta
                ];
            });

        return response()->json([
            'success' => true,
            'diagnosticos' => $diagnosticos
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error al obtener historial de diagnósticos'
        ], 500);
    }
}
// Función para parsear fondo_ojo_posiciones
protected function parseFondoOjoPosiciones($data)
{
    if (is_array($data)) {
        return $data; // Ya está decodificado
    }
    
    if (is_string($data) && !empty($data)) {
        try {
            return json_decode($data, true) ?: [];
        } catch (\Exception $e) {
            return [];
        }
    }
    
    return []; // Valor por defecto si está vacío o es inválido
}
// Método para generar el PDF
public function generarPDF($id)
{
    try {
        // Obtener la consulta con relaciones
        $consulta = Consulta::with(['paciente', 'examen'])->findOrFail($id);
        
        if (!$consulta->paciente) {
            Log::error('La consulta no tiene un paciente asociado:', ['consulta_id' => $id]);
            return redirect()->back()->with('error', 'La consulta no tiene un paciente asociado.');
        }

        // Fechas importantes
        $fechaActual = now()->format('d/m/Y');
        $horaActual = now()->format('H:i');
        $fechaConsulta = $consulta->created_at->format('d/m/Y');

        // Convertir imágenes a base64
        $images = [
            'logo' => $this->imageToBase64(public_path('img/logoVisualOsf.png')),
            'ojo_derecho' => $this->imageToBase64(public_path('img/fondo_ojo_derecho.png')),
            'ojo_izquierdo' => $this->imageToBase64(public_path('img/fondo_ojo_izquierdo.png'))

        ];

        // Obtener el código de consulta (usar el existente o generar uno)
        $codigoConsulta = $consulta->codigo_consulta ?? 'CON-' . str_pad($consulta->id, 6, '0', STR_PAD_LEFT);

        // Pasar datos a la vista
        $pdf = Pdf::loadView('consultas.pdf', [
            'consulta' => $consulta,
            'images' => $images,
            'fechaActual' => $fechaActual,
            'horaActual' => $horaActual,
            'fechaConsulta' => $fechaConsulta,
            'codigoConsulta' => $codigoConsulta  // Pasar el código a la vista
        ]);

        // Configurar DomPDF
        $pdf->setOptions([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
            'defaultFont' => 'sans-serif',
            'enable_css_float' => true,
            'dpi' => 300
        ]);

        // Guardar el PDF
        $filePath = $this->guardarPDF($consulta, $pdf);

        return response()->json([
            'success' => true,
            'message' => 'PDF generado y guardado correctamente.',
            'path' => $filePath,
            'download_url' => Storage::url($filePath)
        ]);

    } catch (\Exception $e) {
        Log::error('Error al generar el PDF:', ['error' => $e->getMessage()]);
        return response()->json([
            'success' => false,
            'message' => 'Error al generar el PDF: ' . $e->getMessage(),
        ], 500);
    }
}
// Método auxiliar para convertir imágenes a base64 para PDF
private function imageToBase64($path)
{
    if (!file_exists($path)) {
        throw new \Exception("Imagen no encontrada: $path");
    }
    $type = pathinfo($path, PATHINFO_EXTENSION);
    $data = file_get_contents($path);
    return 'data:image/' . $type . ';base64,' . base64_encode($data);
}
    // Método auxiliar para guardar el PDF
    private function guardarPDF($consulta, $pdf)
    {
        $directory = 'pacientes/' . $consulta->paciente->dni . '/historial_clinico';
        $filename = 'consulta_' . $consulta->id . '_' . now()->format('YmdHis') . '.pdf';
        
        if (!Storage::disk('public')->exists($directory)) {
            Storage::disk('public')->makeDirectory($directory);
        }
        
        Storage::disk('public')->put($directory . '/' . $filename, $pdf->output());
        
        return $directory . '/' . $filename;
    }
    // Verificar si existe una consulta de inicio para el paciente
    public function verificarConsultaInicio($pacienteId)
    {
        try {
            $existe = Consulta::where('paciente_id', $pacienteId)
                ->where('tipo_consulta', 'inicio')
                ->exists();

            // Obtener también el historial de diagnósticos si es necesario
            $historial = [];
            if ($existe) {
                $historial = Consulta::where('paciente_id', $pacienteId)
                    ->whereNotNull('impresion_diagnostica')
                    ->orderBy('created_at', 'desc')
                    ->get(['impresion_diagnostica', 'created_at']);
            }

            return response()->json([
                'existe' => $existe,
                'historial' => $historial
            ]);
        } catch (\Exception $e) {
            Log::error('Error al verificar consulta de inicio:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al verificar consulta de inicio'], 500);
        }
    }
    // Método para buscar términos de biomicroscopía
    public function buscarTerminosBiomicroscopia(Request $request)
    {
        $query = $request->input('query');
        
        $terminos = TerminoBiomicroscopia::when($query, function ($q) use ($query) {
                return $q->where('termino', 'like', "%{$query}%");
            })
            ->limit(10)
            ->pluck('termino');
        
        return response()->json($terminos);
    }
    public function guardarTerminoBiomicroscopia(Request $request)
    {
        $request->validate([
            'termino' => 'required|string|max:255',
            'consulta_id' => 'nullable|exists:consultas,id'
        ]);

        try {
            // Para el catálogo general (consulta_id = null)
            $terminoGeneral = TerminoBiomicroscopia::firstOrCreate(
                ['termino' => $request->termino, 'consulta_id' => null],
                ['termino' => $request->termino]
            );

            // Si viene consulta_id, crear también la relación específica
            if ($request->consulta_id) {
                TerminoBiomicroscopia::firstOrCreate(
                    ['termino' => $request->termino, 'consulta_id' => $request->consulta_id],
                    ['termino' => $request->termino]
                );
            }

            return response()->json($terminoGeneral, 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al guardar el término: ' . $e->getMessage()
            ], 500);
        }
    }
    protected function procesarTerminosBiomicroscopia($request, $consulta)
    {
        if (!$request->filled('terminos_biomicroscopia')) {
            return;
        }

        // Eliminar términos existentes para esta consulta
        TerminoBiomicroscopia::where('consulta_id', $consulta->id)->delete();

        $terminos = array_filter(
            array_map('trim', explode('.', $request->terminos_biomicroscopia)),
            fn($t) => !empty($t)
        );

        foreach ($terminos as $termino) {
            // Guardar término asociado a la consulta
            TerminoBiomicroscopia::create([
                'termino' => $termino,
                'consulta_id' => $consulta->id
            ]);
            
            // También agregar al catálogo general si no existe
            TerminoBiomicroscopia::firstOrCreate(
                ['termino' => $termino, 'consulta_id' => null],
                ['termino' => $termino]
            );
        }
    }
    // Método para buscar términos de motivo de consulta
    public function buscarTerminosMotivoConsulta(Request $request)
    {
        $query = $request->input('query');
        
        $terminos_mc = TerminoMotivoConsulta::when($query, function ($q) use ($query) {
                return $q->where('termino_mc', 'like', "%{$query}%");
            })
            ->limit(10)
            ->pluck('termino_mc');
        
        return response()->json($terminos_mc);
    }
    public function guardarTerminoMotivoConsulta(Request $request)
    {
        $request->validate([
            'termino_mc' => 'required|string|max:255',
            'consulta_id' => 'nullable|exists:consultas,id'
        ]);

        try {
            // Para el catálogo general (consulta_id = null)
            $terminoGeneral = TerminoMotivoConsulta::firstOrCreate(
                ['termino_mc' => $request->termino_mc, 'consulta_id' => null],
                ['termino_mc' => $request->termino_mc]
            );

            // Si viene consulta_id, crear también la relación específica
            if ($request->consulta_id) {
                TerminoMotivoConsulta::firstOrCreate(
                    ['termino_mc' => $request->termino_mc, 'consulta_id' => $request->consulta_id],
                    ['termino_mc' => $request->termino_mc]
                );
            }

            return response()->json($terminoGeneral, 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al guardar el término: ' . $e->getMessage()
            ], 500);
        }
    }
    protected function procesarTerminosMotivoConsulta($request, $consulta)
    {
        if (!$request->filled('terminos_motivo_consulta')) {
            return;
        }

        // Eliminar términos existentes para esta consulta
        TerminoMotivoConsulta::where('consulta_id', $consulta->id)->delete();

        $terminos_mc = array_filter(
            array_map('trim', explode(',', $request->terminos_motivo_consulta)),
            fn($t) => !empty($t)
        );

        foreach ($terminos_mc as $termino_mc) {
            // Guardar término asociado a la consulta
            TerminoMotivoConsulta::create([
                'termino_mc' => $termino_mc,
                'consulta_id' => $consulta->id
            ]);
            
            // También agregar al catálogo general si no existe
            TerminoMotivoConsulta::firstOrCreate(
                ['termino_mc' => $termino_mc, 'consulta_id' => null],
                ['termino_mc' => $termino_mc]
            );
        }
    }
}