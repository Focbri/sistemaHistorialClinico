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
use Illuminate\Support\Carbon;

class ConsultaController extends Controller
{
    public function index(Request $request){
        // Consultas médicas con relaciones
        $queryConsultas = Consulta::with(['paciente', 'receta', 'user', 'refraccion'])
            ->when($request->filled('dni'), function($q) use ($request) {
                $q->whereHas('paciente', function($q) use ($request) {
                    $q->where('dni', 'like', '%'.$request->dni.'%');
                });
            })
            ->when($request->filled('startDate'), function($q) use ($request) {
                $q->whereDate('created_at', '>=', $request->startDate);
            })
            ->when($request->filled('endDate'), function($q) use ($request) {
                $q->whereDate('created_at', '<=', $request->endDate);
            })
            ->when($request->filled('sex'), function($q) use ($request) {
                $q->whereHas('paciente', function($q) use ($request) {
                    $q->where('sexo', $request->sex);
                });
            })
            ->when($request->filled('minAge') && $request->filled('maxAge'), function($q) use ($request) {
                $minDate = now()->subYears($request->maxAge)->format('Y-m-d');
                $maxDate = now()->subYears($request->minAge)->format('Y-m-d');
                $q->whereHas('paciente', function($q) use ($minDate, $maxDate) {
                    $q->whereBetween('fecha_nacimiento', [$minDate, $maxDate]);
                });
            })
            ->when($request->filled('procedencia'), function($q) use ($request) {
                $q->whereHas('paciente', function($q) use ($request) {
                    $q->where('distrito', $request->procedencia);
                });
            })
            ->when($request->filled('tipo_consulta'), function($q) use ($request) {
                $q->where('tipo_consulta', $request->tipo_consulta);
            })
            ->when($request->filled('medico_id'), function($q) use ($request) {
                $q->where('user_id', $request->medico_id);
            });

        // Cirugías con relaciones (mantener los mismos filtros)
        $queryCirugias = Cirugia::with(['paciente', 'user'])
            ->when($request->filled('dni'), function($q) use ($request) {
                $q->whereHas('paciente', function($q) use ($request) {
                    $q->where('dni', 'like', '%'.$request->dni.'%');
                });
            })
            ->when($request->filled('startDate'), function($q) use ($request) {
                $q->whereDate('created_at', '>=', $request->startDate);
            })
            ->when($request->filled('endDate'), function($q) use ($request) {
                $q->whereDate('created_at', '<=', $request->endDate);
            })
            ->when($request->filled('sex'), function($q) use ($request) {
                $q->whereHas('paciente', function($q) use ($request) {
                    $q->where('sexo', $request->sex);
                });
            })
            ->when($request->filled('minAge') && $request->filled('maxAge'), function($q) use ($request) {
                $minDate = now()->subYears($request->maxAge)->format('Y-m-d');
                $maxDate = now()->subYears($request->minAge)->format('Y-m-d');
                $q->whereHas('paciente', function($q) use ($minDate, $maxDate) {
                    $q->whereBetween('fecha_nacimiento', [$minDate, $maxDate]);
                });
            })
            ->when($request->filled('procedencia'), function($q) use ($request) {
                $q->whereHas('paciente', function($q) use ($request) {
                    $q->where('distrito', $request->procedencia);
                });
            })
            ->when($request->filled('medico_id'), function($q) use ($request) {
                $q->where('user_id', $request->medico_id);
            });

        // Combinar y paginar resultados
        $resultadosCombinados = $queryConsultas->get()
            ->merge($queryCirugias->get())
            ->sortByDesc('created_at');

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
                'query' => $request->query()
            ]
        );

        return Inertia::render('Consultas/Index', [
            'consultas' => $paginatedResults,
            'filters' => $request->only([
                'dni', 
                'startDate', 
                'endDate', 
                'sex',
                'minAge',
                'maxAge',
                'procedencia',
                'tipo_consulta',
                'medico_id'
            ]),
        ]);
    }
    public function create(Request $request){
        $request->validate([
            'tipo' => 'nullable|in:inicio,evolucion',
            'paciente_id' => 'nullable|exists:pacientes,id',
            'cita_id' => 'nullable|exists:citas,id',
            'dni' => 'nullable|string|max:20'
        ]);

        $tipoConsulta = $request->input('tipo', 'inicio');
        $paciente = null;
        $historialDiagnosticos = [];

        if ($request->has('paciente_id')) {
            $paciente = Paciente::with(['consultas' => function($query) {
                $query->whereNotNull('impresion_diagnostica')
                    ->orderBy('created_at', 'desc')
                    ->select('id', 'paciente_id', 'impresion_diagnostica', 'created_at', 'tipo_consulta');
            }])->find($request->input('paciente_id'));

            // Asegurarse de que la URL de la foto esté disponible
            if ($paciente && $paciente->foto_perfil) {
                $paciente->foto_perfil_url = Storage::url($paciente->foto_perfil);
            }

            if ($paciente && $tipoConsulta === 'evolucion') {
                $historialDiagnosticos = $paciente->consultas->map(function ($consulta) {
                    return [
                        'fecha' => $consulta->created_at->format('d/m/Y'),
                        'diagnostico' => $consulta->impresion_diagnostica,
                        'tipo' => $consulta->tipo_consulta
                    ];
                });
            }
        }

        return Inertia::render('Consultas/Create', [
            'paciente' => $paciente,
            'cita_id' => $request->input('cita_id'),
            'dni' => $request->input('dni', ''),
            'tipoConsulta' => $tipoConsulta,
            'historialDiagnosticos' => $historialDiagnosticos,
        ]);
    }
    public function show($id)
    {
        $consulta = Consulta::with([
            'paciente', 
            'receta', 
            'user',
            'examen',
            'refraccion'
        ])->findOrFail($id);

        // Usar la misma función de parseo que en edit()
        $parseFiles = function ($jsonData) {
            if (empty($jsonData)) return [];
            
            try {
                $parsed = is_array($jsonData) ? $jsonData : json_decode($jsonData, true);
                
                return array_map(function ($item) {
                    $path = $item['ruta'] ?? $item['path'] ?? $item;
                    $name = $item['nombre_original'] ?? $item['name'] ?? basename($path);
                    
                    return [
                        'path' => str_replace('public/', '', $path),
                        'original_name' => $name,
                        'type' => $item['tipo'] ?? (preg_match('/\.(jpg|jpeg|png|gif)$/i', $path) ? 'image' : 'file'),
                        'url' => Storage::url($path)
                    ];
                }, is_array($parsed) ? $parsed : [$parsed]);
            } catch (\Exception $e) {
                return [];
            }
        };

        // Parsear archivos igual que en edit
        $consulta->examenes_indicados_img = $parseFiles($consulta->examenes_indicados_img);
        $consulta->examenes_indicados_archivos = $parseFiles($consulta->examenes_indicados_archivos);
        $consulta->ciit_archivos = $parseFiles($consulta->ciit_archivos);

        // Para peticiones AJAX/API
        if (request()->expectsJson()) {
            return response()->json([
                'consulta' => $consulta,
                'receta' => $consulta->receta
            ]);
        }
        
        // Para navegación normal
        return Inertia::render('Consultas/Show', [
            'consulta' => $consulta,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }
    public function edit($id)    {
    $consulta = Consulta::with(['paciente', 'examen', 'refraccion'])->findOrFail($id);
            // Función mejorada para parsear archivos
            $parseFiles = function ($jsonData) {
                if (empty($jsonData)) return [];
                
                try {
                    $parsed = is_array($jsonData) ? $jsonData : json_decode($jsonData, true);
                    
                    return array_map(function ($item) {
                        $path = $item['ruta'] ?? $item['path'] ?? $item;
                        $name = $item['nombre_original'] ?? $item['name'] ?? basename($path);
                        
                        return [
                            'path' => str_replace('public/', '', $path), // Asegurar ruta correcta
                            'original_name' => $name,
                            'type' => $item['tipo'] ?? (preg_match('/\.(jpg|jpeg|png|gif)$/i', $path) ? 'image' : 'file'),
                            'url' => Storage::url($path) // URL pública del archivo
                        ];
                    }, is_array($parsed) ? $parsed : [$parsed]);
                } catch (\Exception $e) {
                    return [];
                }
            };

            // Parsear archivos manteniendo estructura consistente
            $consulta->examenes_indicados_img = $parseFiles($consulta->examenes_indicados_img);
            $consulta->examenes_indicados_archivos = $parseFiles($consulta->examenes_indicados_archivos);
            $consulta->ciit_archivos = $parseFiles($consulta->ciit_archivos);
            
            return Inertia::render('Consultas/Edit', [
                'consulta' => $consulta,
                'auth' => [
                    'user' => Auth::user()
                ]
            ]);
    }
    public function destroy($id){
        // Buscar y eliminar la consulta
        $consulta = Consulta::findOrFail($id);
        $consulta->delete();

        // Redirigir a la lista de consultas con un mensaje de éxito
        return redirect()->route('consultas.index')->with('success', 'Consulta eliminada correctamente.');
    }
    // Guardar la consulta de inicio
    public function store(Request $request){
        try {
            // Verificar autenticación
            if (!Auth::check()) {
                throw new \Exception('Usuario no autenticado');
            }
            // Validar los datos del formulario
            $request->validate([ 
                'paciente_id' => 'required|exists:pacientes,id',
                'user_id' => 'sometimes|exists:users,id',
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
                'ciit_archivos' => 'nullable|array',
                'ciit_archivos.*' => [
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
                'f_o_dilat_pup_od' => 'nullable|string',
                'f_o_dilat_pup_oi' => 'nullable|string',
                'f_o_locs_tres_od' => 'nullable|string',
                'f_o_locs_tres_oi' => 'nullable|string',
                'f_o_fundoscopia_od' => 'nullable|string',
                'f_o_fundoscopia_oi' => 'nullable|string',
                'f_o_conclusion' => 'nullable|string',
                'f_o_plan' => 'nullable|string',
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

            // IMPORTANTE Configurar rutas 
            $carpetaBase = 'pacientes/'.$paciente->dni;
            $carpetaImagenes = $carpetaBase.'/imagenes';
            $carpetaArchivos = $carpetaBase.'/archivos';
            $carpetaArchivosCiit = $carpetaBase.'/archivos_ciit';

            // Crear las carpetas si no existen
            if (!Storage::disk('public')->exists($carpetaImagenes)) {
                Storage::disk('public')->makeDirectory($carpetaImagenes);
            }
            if (!Storage::disk('public')->exists($carpetaArchivos)) {
                Storage::disk('public')->makeDirectory($carpetaArchivos);
            }    

            if (!Storage::disk('public')->exists($carpetaArchivosCiit)) {
                Storage::disk('public')->makeDirectory($carpetaArchivosCiit);
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
            // Generar código de historial si es la primera consulta
            if (!$paciente->codigo_historial) {
                $paciente->save(); // Esto activará el boot() del modelo y generará el código
            }
            $ciitArchivos = [];
            if ($request->hasFile('ciit_archivos')) {
                foreach ($request->file('ciit_archivos') as $file) {
                    $nombreOriginal = $file->getClientOriginalName();
                    $path = $file->storeAs(
                        $carpetaArchivosCiit,
                        $nombreOriginal,
                        'public'
                    );
                    
                    $ciitArchivos[] = [
                        'ruta' => $path,
                        'nombre_original' => $nombreOriginal,
                        'tipo' => 'file'
                    ];
                }
            }
            $ciitArchivos = [];
            if ($request->hasFile('ciit_archivos')) {
                foreach ($request->file('ciit_archivos') as $file) {
                    $nombreOriginal = $file->getClientOriginalName();
                    $path = $file->storeAs(
                        $carpetaArchivosCiit,
                        $nombreOriginal,
                        'public'
                    );
                    
                    $ciitArchivos[] = [
                        'ruta' => $path,
                        'nombre_original' => $nombreOriginal,
                        'tipo' => 'file'
                    ];
                }
            }
            // Crear la consulta
            $consulta = Consulta::create([
                'user_id' => Auth::id(),
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
                'ciit_archivos' => json_encode($ciitArchivos),
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
                'f_o_dilat_pup_od' => $request->f_o_dilat_pup_od,
                'f_o_dilat_pup_oi' => $request->f_o_dilat_pup_oi,
                'f_o_locs_tres_od' => $request->f_o_locs_tres_od,
                'f_o_locs_tres_oi' => $request->f_o_locs_tres_oi,
                'f_o_fundoscopia_od' => $request->f_o_fundoscopia_od,
                'f_o_fundoscopia_oi' => $request->f_o_fundoscopia_oi,
                'f_o_conclusion' => $request->f_o_conclusion,
                'f_o_plan' => $request->f_o_plan,
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

            $examenData = [
                'consulta_id' => $consulta->id,
                'examen_av_sc_od' => $request->examen_av_sc_od,
                'examen_av_cae_od' => $request->examen_av_cae_od,
                'examen_av_cc_od' => $request->examen_av_cc_od,
                'examen_av_sc_oi' => $request->examen_av_sc_oi,
                'examen_av_cae_oi' => $request->examen_av_cae_oi,
                'examen_av_cc_oi' => $request->examen_av_cc_oi,
                'examen_pi_tipo' => $request->examen_pi_tipo,
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
            ];

            // Crear el examen
            $examen = Examen::create($examenData);

            if (!$examen) {
                Log::error('Fallo al crear examen ocular');
                throw new \Exception('No se pudo crear el registro del examen ocular');
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
     protected function procesarReceta($recetaData, $consultaId) {
        // Validar datos de receta
        $validated = validator($recetaData, [
            'paciente_id' => 'required|exists:pacientes,id',
            'medico_id' => 'required|exists:users,id',
            'cie10_codes' => 'required|array',
            'medicamentos' => 'required|array',
            'medicamentos.*.nombre_comercial' => 'required|string',
            'medicamentos.*.componente_activo' =>'required|string',
            'medicamentos.*.cantidad' => 'required|integer|min:1',
            'medicamentos.*.dosis' => 'required|string',
            'medicamentos.*.frecuencia' => 'required|string',
            'medicamentos.*.duracion' => 'required|string', 
            'medicamentos.*.farmaco_id' => 'nullable|exists:farmacos,id',
            'medicamentos.*.es_manual' => 'nullable|boolean',
            'indicaciones_generales' => 'nullable|string',
            'fecha' => 'required|date',
        ])->validate();

        // Separar medicamentos manuales de los registrados
        $medicamentosRegistrados = [];
        $medicamentosManuales = [];

        foreach ($validated['medicamentos'] as $medicamento) {
            if ($medicamento['es_manual'] ?? false) {
                // Eliminar campos de stock para manuales
                unset($medicamento['stock_total']);
                unset($medicamento['stock_disponible']);
                unset($medicamento['stock_detalle']);
                $medicamentosManuales[] = $medicamento;
            } else {
                $medicamentosRegistrados[] = $medicamento;
            }
        }
        // Crear receta
        $receta = Receta::create([
            'consulta_id' => $consultaId,
            'paciente_id' => $validated['paciente_id'],
            'medico_id' => $validated['medico_id'],
            'cie10_codes' => json_encode($validated['cie10_codes']),
            'medicamentos' => json_encode($medicamentosRegistrados),
            'medicamentos_manuales' => json_encode($medicamentosManuales),
            'indicaciones_generales' => $validated['indicaciones_generales'] ?? null,
            'fecha' => $validated['fecha']
        ]);
        // Procesar solo medicamentos registrados (para actualizar stock)
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

            return $receta;
    }
    // Método para actualizar una consulta
public function update(Request $request, $id){
    try {
        // Primero obtener la consulta      
        $consulta = Consulta::with(['examen', 'refraccion'])->findOrFail($id);

        // Convertir fondo_ojo_posiciones a JSON si es array
        if ($request->has('fondo_ojo_posiciones') && is_array($request->fondo_ojo_posiciones)) {
            $request->merge(['fondo_ojo_posiciones' => json_encode($request->fondo_ojo_posiciones)]);
        }
        
        // Preparar arrays
        $this->prepareArrayInputs($request);

        // Validar los datos básicos
        $validatedData = $this->validateConsultaData($request, $consulta);
        
        // Procesar archivos
        $fileData = $this->processFiles($request, $consulta);

            // Combinar datos validados con datos de archivos
        $updateData = array_merge($validatedData, $fileData);
        
        // Convertir arrays a JSON para campos específicos
        $arrayFields = ['examenes_indicados_img', 'examenes_indicados_archivos', 'ciit_archivos'];
        foreach ($arrayFields as $field) {
            if (isset($updateData[$field])) {
                $updateData[$field] = json_encode($updateData[$field]);
            }
        }
        
        // Actualizar la consulta
        $consulta->update($updateData);
        
        // Actualizar relaciones
        $this->updateRelatedModels($request, $consulta);
        
        return redirect()->route('consultas.index')->with('success', 'Consulta actualizada correctamente.');
    
    } catch (\Exception $e) {
        Log::error('Error completo:', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'request' => $request->all()
        ]);
        return back()->withErrors(['error' => 'Error al actualizar la consulta: ' . $e->getMessage()]);
    }
}
protected function validateConsultaData(Request $request, Consulta $consulta)
{
    // Convertir campos que podrían venir como strings a arrays
    $this->prepareArrayInputs($request);
    
    return $request->validate([
    'paciente_id' => 'required|exists:pacientes,id',
        'user_id' => 'sometimes|exists:users,id',
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
        'ciit_archivos' => 'nullable|array',
        'ciit_archivos.*' => [
            'file',
            'mimes:pdf,doc,docx,xls,xlsx,zip,rar',
            'max:51200' // 50MB en KB
        ],
        //
        'evoluciones' => 'nullable|array',
        'evoluciones.*' => 'string',
        'tipo_consulta' => 'nullable|in:inicio,evolucion', // Asegurar que el tipo de consulta sea 
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
        'f_o_dilat_pup_od' => 'nullable|string',
        'f_o_dilat_pup_oi' => 'nullable|string',
        'f_o_locs_tres_od' => 'nullable|string',
        'f_o_locs_tres_oi' => 'nullable|string',
        'f_o_fundoscopia_od' => 'nullable|string',
        'f_o_fundoscopia_oi' => 'nullable|string',
        'f_o_conclusion' => 'nullable|string',
        'f_o_plan' => 'nullable|string',
        //
        'comentario' => 'nullable|array',
        'comentario.*' => 'string',
    ]);
}
protected function prepareArrayInputs(Request $request){
    $arrayFields = [
        'tratamiento',
        'plan',
        'evoluciones',
        'comentario',
        'antecedentes_patologicos_familiares',
        'cirugias_previas',
        'fondo_ojo_posiciones' 
    ];
    
    foreach ($arrayFields as $field) {
        if ($request->has($field)) {
            // Manejo especial para fondo_ojo_posiciones que debe ser JSON
            if ($field === 'fondo_ojo_posiciones') {
                if (is_array($request->input($field))) {
                    $request->merge([$field => json_encode($request->input($field))]);
                }
                continue;
            }
            // Si viene como string JSON, decodificarlo
            if (is_string($request->input($field))) {
                try {
                    $decoded = json_decode($request->input($field), true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $request->merge([$field => $decoded]);
                    } else {
                        // Si no es JSON válido, convertirlo a array
                        $request->merge([$field => [$request->input($field)]]);
                    }
                } catch (\Exception $e) {
                    // Si falla el decode, crear array con el valor
                    $request->merge([$field => [$request->input($field)]]);
                }
            }
            
            // Asegurarse que siempre es array
            if (!is_array($request->input($field))) {
                $request->merge([$field => [$request->input($field)]]);
            }
            
            // Filtrar valores vacíos
            $filtered = array_filter($request->input($field), function($item) {
                return !empty(trim($item));
            });
            
            $request->merge([$field => array_values($filtered)]);
        }
    }
}
protected function processFiles(Request $request, Consulta $consulta)
{
    $fileData = [];
    
    try {
        // Procesar archivos a eliminar
        if ($request->filled('files_to_delete')) {
            $filesToDelete = json_decode($request->input('files_to_delete'), true) ?? [];
            foreach ($filesToDelete as $file) {
                if (isset($file['path']) && Storage::disk('public')->exists($file['path'])) {
                    Storage::disk('public')->delete($file['path']);
                }
            }
        }
        
        // Definir rutas base con el DNI del paciente
        $basePath = 'pacientes/'.$consulta->paciente->dni;
        
        // Procesar imágenes
        $fileData['examenes_indicados_img'] = $this->processFileGroup(
            $request, 
            'examenes_indicados_img',
            'examenes_indicados_img_existentes',
            $basePath.'/imagenes' // Ruta completa
        );
        
        // Procesar archivos
        $fileData['examenes_indicados_archivos'] = $this->processFileGroup(
            $request, 
            'examenes_indicados_archivos',
            'examenes_indicados_archivos_existentes',
            $basePath.'/archivos' // Ruta completa
        );
        
        // Procesar CIIT
        $fileData['ciit_archivos'] = $this->processFileGroup(
            $request, 
            'ciit_archivos',
            'ciit_archivos_existentes',
            $basePath.'/archivos_ciit' // Ruta completa
        );
        
    } catch (\Exception $e) {
        Log::error('Error al procesar archivos: ' . $e->getMessage());
        throw $e;
    }
    
    return $fileData;
}
protected function processFileGroup(Request $request, $fileKey, $existingKey, $storagePath)
{
    $files = [];
    
    // Procesar archivos existentes (si no fueron eliminados)
    if ($request->has($existingKey)) {
        $existingFiles = $request->input($existingKey);
        
        if (is_string($existingFiles)) {
            $existingFiles = json_decode($existingFiles, true) ?? [];
        }
        
        $existingFiles = is_array($existingFiles) ? $existingFiles : [];
        
        $filesToDelete = $request->filled('files_to_delete') 
            ? json_decode($request->input('files_to_delete'), true) ?? []
            : [];
            
        foreach ($existingFiles as $file) {
            if (empty($file)) continue;
            
            if (is_string($file)) {
                $file = [
                    'path' => $file,
                    'original_name' => basename($file),
                    'type' => strpos($fileKey, 'img') !== false ? 'image' : 'file'
                ];
            }
            
            if (!is_array($file) || !isset($file['path'])) continue;
            
            $shouldDelete = false;
            foreach ($filesToDelete as $fileToDelete) {
                if (isset($fileToDelete['path']) && $fileToDelete['path'] === $file['path']) {
                    $shouldDelete = true;
                    break;
                }
            }
            
            if (!$shouldDelete) {
                $files[] = [
                    'path' => $file['path'],
                    'original_name' => $file['original_name'] ?? $file['nombre_original'] ?? basename($file['path']),
                    'type' => $file['type'] ?? (strpos($fileKey, 'img') !== false ? 'image' : 'file')
                ];
            }
        }
    }
    
    // Procesar nuevos archivos - MODIFICADO PARA CONSERVAR NOMBRES ORIGINALES
    if ($request->hasFile($fileKey)) {
        foreach ($request->file($fileKey) as $file) {
            try {
                // Usar storeAs para conservar el nombre original
                $nombreOriginal = $file->getClientOriginalName();
                $path = $file->storeAs(
                    $storagePath, // La carpeta base ya está definida
                    $nombreOriginal, // Conservar nombre original
                    'public'
                );
                
                $files[] = [
                    'path' => $path,
                    'original_name' => $nombreOriginal,
                    'type' => $fileKey === 'examenes_indicados_img' ? 'image' : 'file'
                ];
            } catch (\Exception $e) {
                Log::error('Error al guardar archivo: ' . $e->getMessage());
                continue;
            }
        }
    }
    
    return $files;
}
    protected function updateRelatedModels(Request $request, Consulta $consulta)    {
        // Actualizar examen ocular
        if ($consulta->examen) {
            $consulta->examen->update($request->only([
                'examen_av_sc_od',
                'examen_av_cae_od',
                'examen_av_cc_od',
                'examen_av_sc_oi',
                'examen_av_cae_oi',
                'examen_av_cc_oi',
                'examen_pi_tipo',
                'examen_pi_od',
                'examen_pi_oi',
                'examen_ar_sph_od',
                'examen_ar_cyl_od',
                'examen_ar_ax_od',
                'examen_ar_sph_oi',
                'examen_ar_cyl_oi',
                'examen_ar_ax_oi',
                'examen_keratometria_qd1_od' ,
                'examen_keratometria_qd2_od' ,
                'examen_keratometria_eje_od' ,
                'examen_keratometria_qd1_oi' ,
                'examen_keratometria_qd2_oi' ,
                'examen_keratometria_eje_oi' ,
            ]));
        }
        
        // Actualizar refracción
        $refraccionData = $request->only([
                'exam_old_distancia_esfera_od',
                'exam_old_distancia_cilindro_od',
                'exam_old_distancia_eje_od',
                'exam_old_distancia_esfera_oi',
                'exam_old_distancia_cilindro_oi',
                'exam_old_distancia_eje_oi',
                'exam_old_distancia_dip',
                // Campos de examen previo - Cerca
                'exam_old_cerca_esfera_od',
                'exam_old_cerca_cilindro_od',
                'exam_old_cerca_eje_od',
                'exam_old_cerca_esfera_oi',
                'exam_old_cerca_cilindro_oi',
                'exam_old_cerca_eje_oi',
                'exam_old_cerca_dip',
                // Campos de examen actual - Distancia
                'exam_new_distancia_esfera_od',
                'exam_new_distancia_cilindro_od',
                'exam_new_distancia_eje_od',
                'exam_new_distancia_esfera_oi',
                'exam_new_distancia_cilindro_oi',
                'exam_new_distancia_eje_oi',
                'exam_new_distancia_dip',
                // Campos de examen actual - Cerca
                'exam_new_cerca_esfera_od',
                'exam_new_cerca_cilindro_od',
                'exam_new_cerca_eje_od',
                'exam_new_cerca_esfera_oi',
                'exam_new_cerca_cilindro_oi',
                'exam_new_cerca_eje_oi',
                'exam_new_cerca_dip',
                // Campos adicionales
                'instrucciones',
                'adiciones',
        ]);
        // Filtrar datos vacíos (opcional, depende de tus requisitos)
    $refraccionData = array_filter($refraccionData, function($value) {
        return $value !== null && $value !== '';
    });
    
    if ($consulta->refraccion) {
        // Si existe la refracción, actualizarla
        $consulta->refraccion->update($refraccionData);
    } elseif (!empty(array_filter($refraccionData))) {
        // Si no existe pero hay datos, crear nueva refracción
        $consulta->refraccion()->create($refraccionData);
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
    protected function parseFileData($data){
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
    protected function procesarArchivos(Request $request, Consulta $consulta, $filesToDelete = []){
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
        $existingCiit = $this->parseFileData($consulta->ciit_archivos);
        // Filtrar para quitar los eliminados
        $filteredImages = array_filter($existingImages, fn($img) => !in_array($img['ruta'], $filesToDelete));
        $filteredFiles = array_filter($existingFiles, fn($file) => !in_array($file['ruta'], $filesToDelete));
        $filteredCiit = array_filter($existingCiit, fn($ciit) => !in_array($ciit['ruta'], $filesToDelete));

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
    protected function procesarArchivoComprimido($file, $pacienteId){
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
    protected function procesarNuevosArchivos(Request $request, Consulta $consulta, &$imagenes, &$archivos){
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
    public function buscarPaciente(Request $request){
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

             // Añadir la URL completa de la foto
            if ($paciente->foto_perfil) {
                $paciente->foto_perfil_url = Storage::url($paciente->foto_perfil);
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
    public function buscarPacienteCompleto($dni){
        $paciente = Paciente::where('dni', $dni)
            ->orWhere('carnet_extranjeria', $dni)
            ->first();

        if (!$paciente) {
            return response()->json([
                'success' => false,
                'message' => 'Paciente no encontrado'
            ], 404);
        }

        $tieneConsultaInicial = $paciente->consultas()
            ->where('tipo_consulta', 'inicio')
            ->exists();

        $historial = $tieneConsultaInicial 
            ? $paciente->consultas()
                ->whereNotNull('impresion_diagnostica')
                ->orderBy('created_at', 'desc')
                ->get(['impresion_diagnostica', 'created_at', 'tipo_consulta'])
                ->map(function ($consulta) {
                    return [
                        'fecha' => $consulta->created_at->format('d/m/Y'),
                        'diagnostico' => $consulta->impresion_diagnostica,
                        'tipo' => $consulta->tipo_consulta
                    ];
                })
            : [];

        return response()->json([
            'success' => true,
            'paciente' => $paciente,
            'tieneConsultaInicial' => $tieneConsultaInicial,
            'historial' => $historial
        ]);
    }
    //Metodo para generar historial de diagnosticos
    public function historialDiagnosticos($pacienteId){
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
    protected function parseFondoOjoPosiciones($data){
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
    public function generarPDF(Consulta $consulta){
        try {
            // Cargar relaciones necesarias
            $consulta->load(['paciente', 'medico', 'examen']);
            
            if (!$consulta->paciente) {
                throw new \Exception("No se encontró el paciente asociado a esta consulta");
            }

            $filtredData = $this->filtrarDatosParaPDF($consulta);
            
            // Configurar DOMPDF para manejar imágenes
            $pdf = PDF::loadView('consultas.consulta_pdf', $filtredData);
            $pdf->setOption('enable_remote', true); // Habilitar carga de imágenes remotas
            $pdf->setOption('chroot', public_path()); // Establecer el directorio raíz
            
            return $pdf->download("consulta_{$consulta->paciente->dni}_{$consulta->created_at->format('YmdHis')}.pdf");
            
        } catch (\Exception $e) {
            Log::error("Error al generar PDF: " . $e->getMessage());
            abort(500, "Error al generar el documento. Por favor intente nuevamente.");
        }
    }
    private function filtrarDatosParaPDF(Consulta $consulta)
    {
        // Obtener datos del examen si existe
        $examenData = $consulta->examen ? $consulta->examen->toArray() : [];

        return [
            'paciente' => [
                'nombres' => $consulta->paciente->nombres,
                'apellido_paterno' => $consulta->paciente->apellido_paterno,
                'apellido_materno' => $consulta->paciente->apellido_materno,
                'dni' => $consulta->paciente->dni,
                'edad' => $consulta->paciente->edad,
                'sexo' => $consulta->paciente->sexo,
                'telefono' => $consulta->paciente->telefono,
                'email' => $consulta->paciente->email,
                'direccion' => $consulta->paciente->direccion,
                'fecha_nacimiento' => $consulta->paciente->fecha_nacimiento,
            ],
            'consulta' => array_merge(
                $consulta->only([
                    'antecedentes_personales_hta',
                    'antecedentes_personales_dm',
                    'antecedentes_personales_alergias',
                    'antecedentes_personales_otros',
                    'antecedentes_patologicos_familiares',
                    'cirugias_previas',
                    'motivo_consulta_inicio',
                    'motivo_consulta_signos',
                    'motivo_consulta_enfermedad',
                    'motivo_consulta_otros',
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
                    'biomicroscopia_cristalino_oi',
                    'fondo_ojo_posiciones',
                    'fondo_ojo_retina_p_od',
                    'fondo_ojo_macula_od',
                    'fondo_ojo_vitreo_od',
                    'fondo_ojo_disco_o_od',
                    'fondo_ojo_vasos_od',
                    'fondo_ojo_macula_oi',
                    'fondo_ojo_vitreo_oi',
                    'fondo_ojo_disco_o_oi',
                    'fondo_ojo_vasos_oi',
                    'fondo_ojo_retina_p_oi',
                    'f_o_dilat_pup_od',
                    'f_o_dilat_pup_oi',
                    'f_o_locs_tres_od',
                    'f_o_locs_tres_oi',
                    'f_o_fundoscopia_od',
                    'f_o_fundoscopia_oi',
                    'f_o_conclusion',
                    'f_o_plan',
                    'impresion_diagnostica',
                    'tratamiento',
                    'plan',
                    'comentario',
                    'evoluciones',
                    'tipo_consulta',
                ]),
                ['examen' => $examenData] // Incluye todos los datos del examen con sus nombres reales
            ),
            'medico' => [
                'name' => $consulta->medico->name ?? 'Médico no asignado',
                'numero_colegiatura' => $consulta->medico->numero_colegiatura ?? 'N/A'
            ]
        ];
    }
    public function verificarConsultaInicio($pacienteId){
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
    public function buscarTerminosBiomicroscopia(Request $request){
        $query = $request->input('query');
        
        $terminos = TerminoBiomicroscopia::when($query, function ($q) use ($query) {
                return $q->where('termino', 'like', "%{$query}%");
            })
            ->limit(10)
            ->pluck('termino');
        
        return response()->json($terminos);
    }
    public function guardarTerminoBiomicroscopia(Request $request){
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
    protected function procesarTerminosBiomicroscopia($request, $consulta){
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
    public function buscarTerminosMotivoConsulta(Request $request){
        $query = $request->input('query');
        
        $terminos_mc = TerminoMotivoConsulta::when($query, function ($q) use ($query) {
                return $q->where('termino_mc', 'like', "%{$query}%");
            })
            ->limit(10)
            ->pluck('termino_mc');
        
        return response()->json($terminos_mc);
    }
    public function guardarTerminoMotivoConsulta(Request $request){
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
    protected function procesarTerminosMotivoConsulta($request, $consulta){
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