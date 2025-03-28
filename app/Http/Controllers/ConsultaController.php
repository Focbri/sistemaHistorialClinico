<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Models\Consulta;
use \App\Models\Paciente;
use \App\Models\TerminoBiomicroscopia;
use \App\Models\Examen;
use App\Models\TerminoMotivoConsulta;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use phpDocumentor\Reflection\DocBlock\Tags\Var_;

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
        // Obtener la consulta (si es necesario)
        $pacientes = Paciente::select('id', 'dni', 'nombres', 'apellido_paterno', 'apellido_materno','edad')
            ->orderBy('nombres')
            ->get();

        // Determinar el tipo de consulta (inicio o evolución)
        $tipoConsulta = $request->query('tipo', 'inicio'); // Por defecto es 'inicio'
        // Obtener la edad del paciente si se selecciona uno
        $edad = null;
        if ($request->has('paciente_id')) {
            $paciente = Paciente::find($request->query('paciente_id'));
            if ($paciente) {
                $edad = $paciente->edad;
            }
        }

        return Inertia::render('Consultas/Create', [
            'pacientes' => $pacientes,
            'tipoConsulta' => $tipoConsulta, // Pasar el tipo de consulta a la vista
            'edad' => $edad, // Pasar la edad del paciente
        ]);
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

    // Nuevo método auxiliar en el controlador
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
                'examen_pi_tipo' => 'nullable|in:aplanatica,manual,neumatica',
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
            ]);
            Log::info('Datos recibidos en request:', $request->all());            

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
            ]);

            // Crear el examen asociado a la consulta
            $examen = Examen::create([
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
                'exam_new_distancia_esfera_od' => $request->exam_new_distancia_esfera_od,
                'exam_new_distancia_esfera_oi' => $request->exam_new_distancia_esfera_oi,
                'exam_new_distancia_cilindro_od' => $request->exam_new_distancia_cilindro_od,
                'exam_new_distancia_cilindro_oi' => $request->exam_new_distancia_cilindro_oi,
                'exam_new_distancia_eje_od' => $request->exam_new_distancia_eje_od,
                'exam_new_distancia_eje_oi' => $request->exam_new_distancia_eje_oi,
                'exam_new_distancia_dip' => $request->exam_new_distancia_dip,
                'exam_old_distancia_esfera_od' => $request->exam_old_distancia_esfera_od,
                'exam_old_distancia_esfera_oi' => $request->exam_old_distancia_esfera_oi,
                'exam_old_distancia_cilindro_od' => $request->exam_old_distancia_cilindro_od,
                'exam_old_distancia_cilindro_oi' => $request->exam_old_distancia_cilindro_oi,
                'exam_old_distancia_eje_od' => $request->exam_old_distancia_eje_od,
                'exam_old_distancia_eje_oi' => $request->exam_old_distancia_eje_oi,
                'exam_old_distancia_dip' => $request->exam_old_distancia_dip,
                'exam_new_cerca_esfera_od' => $request->exam_new_cerca_esfera_od,
                'exam_new_cerca_esfera_oi' => $request->exam_new_cerca_esfera_oi,
                'exam_new_cerca_cilindro_od' => $request->exam_new_cerca_cilindro_od,
                'exam_new_cerca_cilindro_oi' => $request->exam_new_cerca_cilindro_oi,
                'exam_new_cerca_eje_od' => $request->exam_new_cerca_eje_od,
                'exam_new_cerca_eje_oi' => $request->exam_new_cerca_eje_oi,
                'exam_new_cerca_dip' => $request->exam_new_cerca_dip,
                'exam_old_cerca_esfera_od' => $request->exam_old_cerca_esfera_od,
                'exam_old_cerca_esfera_oi' => $request->exam_old_cerca_esfera_oi,
                'exam_old_cerca_cilindro_od' => $request->exam_old_cerca_cilindro_od,
                'exam_old_cerca_cilindro_oi' => $request->exam_old_cerca_cilindro_oi,
                'exam_old_cerca_eje_od' => $request->exam_old_cerca_eje_od,
                'exam_old_cerca_eje_oi' => $request->exam_old_cerca_eje_oi,
                'exam_old_cerca_dip' => $request->exam_old_cerca_dip,
            ]);

            Log::info('Examen creado:', $examen->toArray());

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

            try {
                $test = TerminoBiomicroscopia::create([
                    'termino' => 'TERMINO_PRUEBA',
                    'consulta_id' => $consulta->id
                ]);
                Log::info('Prueba exitosa', $test->toArray());
            } catch (\Exception $e) {
                Log::error('Prueba fallida', ['error' => $e->getMessage()]);
            }

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
                    
                    Log::info('Término guardado exitosamente', [
                        'termino' => $termino,
                        'consulta_id' => $consulta->id
                    ]);
                } catch (\Exception $e) {
                    Log::error('Error al guardar término', [
                        'termino' => $termino,
                        'error' => $e->getMessage()
                    ]);
                }
            }
            

            // Procesar términos de motivo de consulta - Versión corregida
            $terminos_mc = [];
            if (!empty($request->motivo_consulta)) {
                $terminos = array_map('trim', preg_split('/[,;.\n]+/', $request->motivo_consulta));
                $terminos = array_filter(array_unique($terminos));
                
                foreach ($terminos as $termino) {
                    try {
                        // VERIFICACIÓN EXPLÍCITA DE LA CONSULTA
                        if (!isset($consulta->id)) {
                            throw new \Exception('El ID de consulta no está disponible');
                        }
                        
                        // FORMA ALTERNATIVA DE CREACIÓN QUE ASEGURA EL CONSULTA_ID
                        $terminoModel = new TerminoMotivoConsulta();
                        $terminoModel->consulta_id = $consulta->id;
                        $terminoModel->termino_mc = $termino;
                        $terminoModel->save();
                        
                        Log::info('Término guardado EXITOSAMENTE', [
                            'consulta_id' => $consulta->id,
                            'termino' => $termino
                        ]);
                    } catch (\Exception $e) {
                        Log::error('FALLO al guardar término', [
                            'error' => $e->getMessage(),
                            'consulta_id' => $consulta->id ?? 'null',
                            'termino' => $termino
                        ]);
                    }
                }
            }

            $terminosUnicosMC = array_unique($terminos_mc);
            Log::info('Términos únicos de motivo consulta:', ['terminos' => $terminosUnicosMC]);

            foreach ($terminosUnicosMC as $termino_mc) {
                if (!empty($termino_mc)) {
                    TerminoMotivoConsulta::create([
                        'consulta_id' => $consulta->id, // Asegurarse que $consulta está definido
                        'termino_mc' => $termino_mc
                    ]);
                    Log::info('Término de motivo de consulta guardado:', [
                        'consulta_id' => $consulta->id,
                        'termino_mc' => $termino_mc
                    ]);
                }
            }

            // PRUEBA DE DIAGNÓSTICO
            Log::info('DIAGNÓSTICO PRE-INSERCIÓN', [
                'consulta_existe' => isset($consulta),
                'consulta_id' => $consulta->id ?? 'NO EXISTE',
                'terminos_a_insertar' => $terminosUnicosMC,
                'request_data' => $request->all()
            ]);

            Log::info('Archivos recibidos:', [
                'imagenes' => $request->file('examenes_indicados_img'),
                'archivos' => $request->file('examenes_indicados_archivos'),
            ]);

            return redirect()->route('consultas.index')->with('success', 'Consulta creada correctamente.');
        } catch (\Exception $e) {
            Log::error('Error en redirección:', ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors(['message' => 'Error al crear la consulta: ' . $e->getMessage()]);
        }
    }

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
                'antecedentes_patologicos_familiares' => 'nullable|string',
                'cirugias_previas' => 'nullable|string',
                'motivo_consulta' => 'nullable|string',
                'impresion_diagnostica' => 'nullable|string',
                'tratamiento' => 'nullable|string',
                'plan' => 'nullable|string',
                //
                'evoluciones' => 'nullable|string',
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
                'nuevas_imagenes' => 'nullable|array|max:4',
                'nuevas_imagenes.*' => 'image|mimes:jpeg,png,jpg|max:2048',
                'nuevos_archivos' => 'nullable|array|max:4',
                'nuevos_archivos.*' => 'mimes:pdf,doc,docx,xls,xlsx|max:5120',
                'files_to_delete' => 'nullable|json'
            ]);

            $validatedExamenData = $request->validate([
                'examen_av_sc_od' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
                'examen_av_cae_od' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
                'examen_av_cc_od' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
                'examen_av_sc_oi' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
                'examen_av_cae_oi' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
                'examen_av_cc_oi' => 'nullable|in:CD,MB,PPL,PL,NPL,20/200,20/100,20/70,20/50,20/40,20/30,20/25,20/20,N/M',
                'examen_pi_tipo' => 'nullable|in:aplanatica,manual,neumatica',
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
            
             // Filtrar para quitar los eliminados
            $filteredImages = array_filter($existingImages, function($img) use ($filesToDelete) {
                return !in_array($img['ruta'], $filesToDelete);
            });
            
            $filteredFiles = array_filter($existingFiles, function($file) use ($filesToDelete) {
                return !in_array($file['ruta'], $filesToDelete);
            });


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
            
              // Procesar términos de biomicroscopia
            $this->procesarTerminosBiomicroscopia($request, $consulta);           

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

    // Métodos auxiliares para procesar términos
    private function procesarTerminosBiomicroscopia($request, $consulta)
    {
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

        // Eliminar términos existentes para evitar duplicados
        TerminoBiomicroscopia::where('consulta_id', $consulta->id)->delete();

        foreach ($camposBiomicroscopia as $campo) {
            if (!empty($request->$campo)) {
                $terminos = array_map('trim', preg_split('/[,;]+/', $request->$campo));
                $terminosUnicos = array_unique(array_filter($terminos));

                foreach ($terminosUnicos as $termino) {
                    TerminoBiomicroscopia::create([
                        'termino' => $termino,
                        'consulta_id' => $consulta->id
                    ]);
                }
            }
        }
    }
    
    private function procesarTerminosMotivoConsulta($request, $consulta)
    {
        if (!empty($request->motivo_consulta)) {
            // Eliminar términos existentes para evitar duplicados
            TerminoMotivoConsulta::where('consulta_id', $consulta->id)->delete();

            $terminos = array_map('trim', preg_split('/[,;.\n]+/', $request->motivo_consulta));
            $terminosUnicos = array_unique(array_filter($terminos));

            foreach ($terminosUnicos as $termino) {
                TerminoMotivoConsulta::create([
                    'consulta_id' => $consulta->id,
                    'termino_mc' => $termino
                ]);
            }
        }
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

    public function buscarTerminosBiomicroscopia(Request $request)
    {
        $query = $request->input('query');

        $terminos = TerminoBiomicroscopia::where('termino', 'LIKE', "%$query%")
            ->pluck('termino');

        return response()->json($terminos);
    }

    public function buscarTerminosMotivoConsulta(Request $request)
    {
        $query = $request->input('query');

        $terminos_mc = TerminoMotivoConsulta::where('termino_mc', 'LIKE', "%$query%")
            ->pluck('termino_mc');

        return response()->json($terminos_mc);
    }
}