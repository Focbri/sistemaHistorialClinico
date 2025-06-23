<?php

namespace App\Http\Controllers;

use \App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\LengthAwarePaginator;

class PacienteController extends Controller
{ 
    public function index(Request $request)
{
    $query = Paciente::query()
        // Filtro principal por sede del usuario
         ->where('sede', session('sede_actual')) // Filtro por sede en sesión
        
        // Filtros adicionales
        ->when($request->filled('dni'), function($q) use ($request) {
            $q->where('dni', 'like', '%'.$request->dni.'%');
        })
        ->when($request->filled('sex'), function($q) use ($request) {
            $q->where('sexo', $request->sex);
        })
        ->when($request->filled('minAge') && $request->filled('maxAge'), function($q) use ($request) {
            $minDate = now()->subYears($request->maxAge)->format('Y-m-d');
            $maxDate = now()->subYears($request->minAge)->format('Y-m-d');
            $q->whereBetween('fecha_nacimiento', [$minDate, $maxDate]);
        })
        ->when($request->filled('startDate'), function($q) use ($request) {
            $q->whereDate('created_at', '>=', $request->startDate);
        })
        ->when($request->filled('endDate'), function($q) use ($request) {
            $q->whereDate('created_at', '<=', $request->endDate);
        })
        ->when($request->filled('procedencia'), function($q) use ($request) {
            $q->where('procedencia', $request->procedencia);
        })
        ->orderBy('created_at', 'desc');

    $pacientes = $query->paginate(10);

    return Inertia::render('Pacientes/Index', [
        'pacientes' => $pacientes,
        'filters' => $request->only([
            'dni',
            'sex',
            'minAge',
            'maxAge',
            'startDate',
            'endDate',
            'procedencia'
        ]),
        'auth' => [
            'user' => Auth::user()
        ],
        'sedeActual' => session('sede_actual')
    ]);
}

    public function create(Request $request)
    {
        return Inertia::render('Pacientes/Create', [
            'dni' => $request->query('dni', ''),
            'auth' => [
            'user' => Auth::user()
        ],
        ]);
    }

    public function store(Request $request)
{
    DB::beginTransaction();
    
    try {
        // Validación de datos
        $validatedData = $request->validate([
            'nombres' => 'required|string|max:255',
            'apellido_paterno' => 'required|string|max:255',
            'apellido_materno' => 'required|string|max:255',
            'tipo_documento' => 'required|in:dni,ce',
            'dni' => [
                'required',
                'string',
                Rule::when($request->tipo_documento === 'dni', 'digits:8'),
                Rule::when($request->tipo_documento === 'ce', 'digits_between:9,12'),
                Rule::unique('pacientes')->where(function ($query) use ($request) {
                    return $query->where('tipo_documento', $request->tipo_documento);
                })
            ],
            'fecha_nacimiento' => 'nullable|date',
            'edad' => 'nullable|integer|min:0|max:120',
            'sexo' => 'nullable|in:M,F',
            'estado_civil' => 'nullable|string|max:50',
            'ocupacion' => 'nullable|string|max:100',
            'direccion' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:15',
            'email' => 'nullable|email|max:255',
            'acompañante' => 'nullable|string|max:100',
            'referido' => 'nullable|string|max:100',
            'peso' => 'nullable|numeric|min:0|max:300',
            'foto_perfil' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Crear el paciente con el código generado
        $paciente = new Paciente();
        $paciente->fill($validatedData);

        // CAMBIO AQUÍ: Usar la sede de la sesión en lugar de la sede del usuario
        $paciente->sede = session('sede_actual');

        // Procesar foto de perfil
        if ($request->hasFile('foto_perfil')) {
            $file = $request->file('foto_perfil');
            $filename = time().'_'.$file->getClientOriginalName();
            
            // Almacenar en la carpeta pública
            $path = $file->storeAs(
                'pacientes/'.$request->tipo_documento.'_'.$request->dni,
                $filename,
                'public'
            );
            
            // Guardar solo la ruta relativa
            $paciente->foto_perfil = $path;
        }

        $paciente->save();
        DB::commit();

        return redirect()->route('pacientes.index')
            ->with('success', 'Paciente creado correctamente.');
            
    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Error al crear paciente: '.$e->getMessage());
        return redirect()->back()
            ->with('error', 'Error al crear el paciente: '.$e->getMessage())
            ->withInput();
    }
}

    public function show(Paciente $paciente)
    {
        $pacienteData = $this->preparePacienteData($paciente);
        
        // Añade la URL de la foto de perfil
        $pacienteData['foto_perfil_url'] = $paciente->foto_perfil 
        ? Storage::url($paciente->foto_perfil)
        : null;

        return Inertia::render('Pacientes/Show', [
            'paciente' => $pacienteData
        ]);
    }

    public function edit($id)
    {
        $paciente = Paciente::findOrFail($id);
    
        return Inertia::render('Pacientes/Edit', [
            'paciente' => $paciente,
            'foto_perfil_url' => $paciente->foto_perfil 
                ? Storage::url($paciente->foto_perfil)
                : null,
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                // Datos del paciente
                'nombres' => 'required|string|max:255',
                'apellido_paterno' => 'required|string|max:255',
                'apellido_materno' => 'required|string|max:255',
                'tipo_documento' => 'required|in:dni,ce',
                'dni' => [
                    'required',
                    'string',
                    Rule::when($request->tipo_documento === 'dni', 'digits:8'),
                    Rule::when($request->tipo_documento === 'ce', 'digits_between:9,12'),
                    Rule::unique('pacientes')->where(function ($query) use ($request, $id) {
                        return $query->where('tipo_documento', $request->tipo_documento)
                                    ->where('id', '!=', $id);
                    })
                ],
                'fecha_nacimiento' => 'date',
                'edad' => 'integer|min:0|max:120',
                'sexo' => 'in:M,F',
                'estado_civil' => 'nullable|string|max:50',
                'ocupacion' => 'nullable|string|max:100',
                'procedencia' => 'nullable|string|max:100',
                'direccion' => 'string|max:255',
                'telefono' => 'string|max:15',
                'email' => 'nullable|email|max:255',
                'acompañante' => 'nullable|string|max:100',
                'referido' => 'nullable|string|max:100',
                'peso' => 'nullable|numeric|min:0|max:300',
                
                // Foto de perfil
                'foto_perfil' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'foto_perfil_existente' => 'nullable|string',
                'files_to_delete' => 'nullable|json',
            ]);

            $paciente = Paciente::findOrFail($id);

             // Verificar si cambió el documento
            $documentoCambiado = ($paciente->dni != $request->dni) || 
            ($paciente->tipo_documento != $request->tipo_documento);


            // Procesar archivos a eliminar
        $filesToDelete = $request->filled('files_to_delete') 
        ? json_decode($request->input('files_to_delete'), true) ?? []
        : [];

        foreach ($filesToDelete as $filePath) {
            if (Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
            }
        }

        // Procesar nueva foto de perfil
        $fotoPerfil = $paciente->foto_perfil;
        
        if ($request->hasFile('foto_perfil')) {
            // Eliminar foto anterior si existe
            if ($fotoPerfil && Storage::disk('public')->exists($fotoPerfil)) {
                Storage::disk('public')->delete($fotoPerfil);
            }
            
            // Guardar nueva foto con nombre original
            $file = $request->file('foto_perfil');
            $nombreOriginal = $file->getClientOriginalName();
            $nombreArchivo = pathinfo($nombreOriginal, PATHINFO_FILENAME);
            $extension = $file->extension();
            $nombreUnico = $this->sanitizeFileName($nombreArchivo) . '_' . time() . '.' . $extension;
            
            // Usar nueva estructura de carpetas
            $path = $file->storeAs(
                'pacientes/' . $request->tipo_documento . '_' . $request->dni . '/fotos_perfil',
                $nombreUnico,
                'public'
            );
            
            $fotoPerfil = $path;
        } elseif (empty($request->foto_perfil_existente) && $fotoPerfil) {
            // Si se eliminó la foto existente y no se subió una nueva
            if (Storage::disk('public')->exists($fotoPerfil)) {
                Storage::disk('public')->delete($fotoPerfil);
            }
            $fotoPerfil = null;
        }

        // Si cambió el documento, renombrar carpeta
        if ($documentoCambiado) {
            $this->renombrarCarpetaPaciente(
                $paciente, 
                $request->dni, 
                $request->tipo_documento
            );
        }

        // Actualizar paciente
        $paciente->update(array_merge($validatedData, [
            'foto_perfil' => $fotoPerfil
        ]));


                return redirect()->route('pacientes.index')->with('success', 'Paciente actualizado correctamente.');
                
            } catch (\Exception $e) {
                return redirect()->back()
                    ->withErrors(['message' => 'Error al actualizar el paciente: ' . $e->getMessage()])
                    ->withInput();
            }
    }

    public function destroy(Paciente $paciente)
    {
        DB::beginTransaction();
        
        try {
            // Eliminar foto de perfil si existe
            $this->eliminarFotoPerfil($paciente);
            
            // Eliminar carpeta del paciente
            $this->eliminarCarpetaPaciente($paciente->dni);
            
            // Eliminar el paciente
            $paciente->delete();

            DB::commit();

            return redirect()->route('pacientes.index')
                ->with('success', 'Paciente eliminado correctamente');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al eliminar paciente: '.$e->getMessage());
            
            return redirect()->back()
                ->withErrors(['error' => 'Error al eliminar paciente: '.$e->getMessage()]);
        }
    }

    protected function sanitizeFileName($filename)
    {
        // Reemplaza caracteres no permitidos
        $filename = preg_replace("/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_]/", "", $filename);
        // Reemplaza múltiples espacios o guiones por un solo guión bajo
        $filename = preg_replace("/[\s-]+/", "_", $filename);
        // Convierte a minúsculas
        $filename = strtolower($filename);
        // Elimina guiones bajos al inicio y final
        $filename = trim($filename, "_");
        
        return $filename;
    }

    protected function validatePacienteData(Request $request, $id = null, $forUpdate = false)
    {
        $rules = [
            'apellido_paterno' => 'string|max:255',
            'apellido_materno' => 'string|max:255',
            'nombres' => 'string|max:255',
            'fecha_nacimiento' => 'date',
            'edad' => 'integer',
            'peso' => 'numeric',
            'dni' => 'string|max:20|unique:pacientes,dni,'.$id,
            'sexo' => 'in:M,F',
            'estado_civil' => 'in:soltero,casado,divorciado,viudo',
            'ocupacion' => 'string|max:255',
            'direccion' => 'string|max:255',
            'telefono' => 'string|max:20',
            'email' => 'nullable|email|max:255',
            'procedencia' => 'in:Ancon,Ate,Barranco,Breña,Carabayllo,Chaclacayo,Chorrillos,Cienegilla,Comas,El Agustino,Independencia,Jesús María,La Molina,La Victoria,Lima,Lince,Los Olivos,Lurigancho,Lurín,Magdalena del Mar,Miraflores,Pachacamac,Pucusana,Pueblo Libre,Puente Piedra,Punta Hermosa,Punta Negra,Rimac,San Bartolo,San Borja,San Isidro,San Juan de Lurigancho,San Juan de Miraflores,San Luis,San Martín de Porres,San Miguel,Santa Anita,Santa María del Mar,Santa Rosa,Santiago de Surco,Surquillo,Villa El Salvador,Villa María del Triunfo',
            'acompañante' => 'nullable|string|max:255',
            'referido' => 'in:Recomendación de un amigo o familiar,Facebook,Instagram,TikTok,WhatsApp,Búsqueda en Google,Publicidad en línea,Boca a boca,Sitio web o blog,Reseñas en línea,Correo electrónico,Eventos o ferias',
            'foto_perfil' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'eliminar_foto' => 'nullable|boolean',
        ];

        return $request->validate($rules);
    }

    protected function preparePacienteData(Paciente $paciente)
    {
        $pacienteData = $paciente->toArray();
        
        // Procesar foto de perfil
        $pacienteData['foto_perfil'] = $this->parseFileData($paciente->foto_perfil);
        
        // Agregar URL de la foto
        if (!empty($pacienteData['foto_perfil']) && isset($pacienteData['foto_perfil']['ruta'])) {
            $pacienteData['foto_perfil_url'] = url(Storage::url($pacienteData['foto_perfil']['ruta'])).'?t='.time();
        } else {
            $pacienteData['foto_perfil_url'] = null;
        }
        
        return $pacienteData;
    }

    protected function guardarArchivosPaciente($files, $dni, $tipo = 'otros')
    {
        $dniClean = preg_replace('/[^A-Za-z0-9]/', '', $dni);
        $archivos = [];
        
        $carpetaBase = "pacientes/{$dniClean}";
        $subcarpeta = ($tipo === 'imagen') ? 'imagenes' : 'archivos';
        $carpetaCompleta = "{$carpetaBase}/{$subcarpeta}";

        // Crear directorio si no existe
        Storage::disk('public')->makeDirectory($carpetaCompleta, 0755, true);

        foreach ($files as $file) {
            $nombreOriginal = $file->getClientOriginalName();
            $extension = $file->extension();
            $nombreUnico = pathinfo($nombreOriginal, PATHINFO_FILENAME) . '_' . time() . '.' . $extension;
            
            $path = $file->storeAs(
                $carpetaCompleta,
                $nombreUnico,
                'public'
            );
            
            $archivos[] = [
                'ruta' => $path,
                'nombre_original' => $nombreOriginal,
                'nombre_guardado' => $nombreUnico,
                'tipo' => $tipo
            ];
        }        
        return $archivos;
    }

    protected function procesarArchivosPaciente(Request $request, Paciente $paciente, $filesToDelete = [])
    {
        $dniClean = preg_replace('/[^A-Za-z0-9]/', '', $paciente->dni);
        $carpetaBase = "pacientes/{$dniClean}";
        
        // Procesar foto de perfil (caso especial)
        if ($request->hasFile('foto_perfil')) {
            $this->eliminarFotoPerfil($paciente);
            $path = $this->guardarFotoPerfil($request->file('foto_perfil'), $paciente->dni);
            $paciente->foto_perfil = $path;
        } elseif ($request->input('eliminar_foto')) {
            $this->eliminarFotoPerfil($paciente);
            $paciente->foto_perfil = null;
        }

        // Procesar otros archivos (similar al de consultas pero adaptado)
        $archivosProcesados = [
            'imagenes' => [],
            'archivos' => []
        ];

        // Procesar imágenes médicas si existen
        if ($request->hasFile('imagenes_medicas')) {
            $archivosProcesados['imagenes'] = $this->guardarArchivosPaciente(
                $request->file('imagenes_medicas'),
                $paciente->dni,
                'imagen'
            );
        }

        // Procesar documentos si existen
        if ($request->hasFile('documentos')) {
            $archivosProcesados['archivos'] = $this->guardarArchivosPaciente(
                $request->file('documentos'),
                $paciente->dni,
                'documento'
            );
        }

        // Eliminar archivos marcados para borrar
        if (!empty($filesToDelete)) {
            foreach ($filesToDelete as $filePath) {
                if (Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->delete($filePath);
                }
            }
        }

        return $archivosProcesados;
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
                        'nombre_guardado' => $item['nombre_guardado'] ?? basename($item['ruta'] ?? $item),
                        'tipo' => $item['tipo'] ?? (str_contains($item['ruta'] ?? $item, 'imagenes') ? 'image' : 'file')
                    ];
                }
                return [
                    'ruta' => $item,
                    'nombre_original' => basename($item),
                    'nombre_guardado' => basename($item),
                    'tipo' => str_contains($item, 'imagenes') ? 'image' : 'file'
                ];
            }, is_array($parsed) ? $parsed : [$parsed]);
        } catch (\Exception $e) {
            Log::error('Error al parsear datos de archivo: '.$e->getMessage());
            return [];
        }
    }

    public function updateImagen($id, Request $request)
    {
        $paciente = Paciente::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'foto_perfil' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        
        try {
            // Eliminar imagen anterior si existe
            $this->eliminarFotoPerfil($paciente);

            // Guardar nueva imagen
            $path = $this->guardarFotoPerfil($request->file('foto_perfil'), $paciente->dni);

            // Actualizar en base de datos
            $paciente->foto_perfil = $path;
            $paciente->save();

            DB::commit();
            
            return response()->json([
                'success' => true,
                'foto_perfil_url' => Storage::url($path),
                'message' => 'Imagen actualizada correctamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al actualizar imagen: '.$e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Error al actualizar la imagen',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteImagen(Paciente $paciente)
    {
        DB::beginTransaction();
        
        try {
            $this->eliminarFotoPerfil($paciente);
            $paciente->foto_perfil = null;
            $paciente->save();

            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Imagen eliminada correctamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al eliminar imagen: '.$e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la imagen',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    protected function eliminarFotoPerfil(Paciente $paciente)
    {
        if ($paciente->foto_perfil && Storage::disk('public')->exists($paciente->foto_perfil)) {
            Storage::disk('public')->delete($paciente->foto_perfil);
            
            // Opcional: eliminar carpeta si está vacía
            $carpeta = dirname($paciente->foto_perfil);
            if (count(Storage::disk('public')->files($carpeta)) === 0) {
                Storage::disk('public')->deleteDirectory($carpeta);
            }
        }
    }

    protected function guardarFotoPerfil($file, $paciente)
    {
        try {
            $dniClean = preg_replace('/[^A-Za-z0-9]/', '', $paciente->dni);
            if (empty($dniClean)) {
                throw new \Exception('Documento no válido para crear carpeta');
            }
            
            $carpeta = "pacientes/{$paciente->tipo_documento}_{$dniClean}/perfil";
                
                // Crear directorio si no existe
                Storage::disk('public')->makeDirectory($carpeta, 0755, true);
                
                // Generar nombre único para el archivo
                $nombreArchivo = 'perfil_'.time().'.'.$file->extension();
                
                // Guardar el archivo
                $path = $file->storeAs(
                    $carpeta,
                    $nombreArchivo,
                    'public'
                );
                
                return $path;
            } catch (\Exception $e) {
                Log::error('Error al guardar foto: '.$e->getMessage());
                return null;
            }
        }

    protected function eliminarCarpetaPaciente($dni)
    {
        $dniClean = preg_replace('/[^A-Za-z0-9]/', '', $dni);
        $carpeta = "pacientes/{$dniClean}";
        
        if (Storage::disk('public')->exists($carpeta)) {
            Storage::disk('public')->deleteDirectory($carpeta);
        }
    }

    protected function renombrarCarpetaPaciente($paciente, $newDni, $newTipoDocumento)
    {
        $oldDniClean = preg_replace('/[^A-Za-z0-9]/', '', $paciente->dni);
        $newDniClean = preg_replace('/[^A-Za-z0-9]/', '', $newDni);
        
        $oldPath = "pacientes/{$paciente->tipo_documento}_{$oldDniClean}";
        $newPath = "pacientes/{$newTipoDocumento}_{$newDniClean}";

        if (Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->move($oldPath, $newPath);
            
            // Actualizar rutas en la base de datos
            $paciente = Paciente::where('dni', $newDni)->first();
            
            if ($paciente) {
                // Actualizar foto de perfil si existe
                if ($paciente->foto_perfil) {
                    $paciente->foto_perfil = Str::replaceFirst(
                        "pacientes/{$oldDniClean}/", 
                        "pacientes/{$newDniClean}/", 
                        $paciente->foto_perfil
                    );
                }
                
                $paciente->save();
            }
        }
    }

    public function buscarPaciente(Request $request)
    {
        $documento = trim($request->input('identificacion'));
        $tipo = $request->input('tipo_documento', 'dni'); // Por defecto busca DNI

        $paciente = Paciente::where('dni', $documento)
                    ->orWhere('ce', $documento)
                    ->first();

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
                    'fecha_nacimiento' => $paciente->fecha_nacimiento ? $paciente->fecha_nacimiento->format('Y-m-d') : null,
                    'edad' => $paciente->edad,
                    'sexo' => $paciente->sexo,
                    'peso' => $paciente->peso,
                    'estado_civil' => $paciente->estado_civil,
                    'ocupacion' => $paciente->ocupacion,
                    'direccion' => $paciente->direccion,
                    'procedencia' => $paciente->procedencia,
                    'acompañante' => $paciente->acompañante,
                    'referido' => $paciente->referido,
                    'foto_perfil' => $paciente->foto_perfil,
                    // Agrega cualquier otro campo necesario
                ],
            ]);
        }
        
        Log::warning('Paciente no encontrado para documento:', ['tipo' => $tipo, 'documento' => $documento]);
        return response()->json(['success' => false, 'message' => 'Paciente no encontrado'], 404);
    }

    public function buscarPacienteParaCita(Request $request)
    {
        $request->validate([
            'dni' => 'required|string|size:8'
        ]);

        $paciente = Paciente::where('dni', $request->dni)->first();

        if (!$paciente) {
            return response()->json([
                'success' => false,
                'message' => 'Paciente no encontrado'
            ], 404);
        }

        // Devuelve los datos en un formato compatible con Inertia
        return response()->json([
            'success' => true,
            'paciente' => [
                'id' => $paciente->id,
                'nombres' => $paciente->nombres,
                'apellido_paterno' => $paciente->apellido_paterno,
                'apellido_materno' => $paciente->apellido_materno,
                'dni' => $paciente->dni,
                'telefono' => $paciente->telefono ?? 'No registrado',
                'edad' => $paciente->edad ?? 'No registrada',
                'fecha_nacimiento' => optional($paciente->fecha_nacimiento)->format('d/m/Y') ?? 'No registrada'
            ]
        ]);
    }

public function buscarPorDNI(Request $request)
{
    $request->validate(['dni' => 'required|string']);

    $paciente = Paciente::where('dni', $request->dni)->first();

    if (!$paciente) {
        return response()->json(['success' => false, 'message' => 'Paciente no encontrado'], 404);
    }

    return response()->json([
        'success' => true,
        'paciente' => $paciente
    ]);
}

    public function consultas(Paciente $paciente)
    {
        $consultas = $paciente->consultas()
            ->with(['paciente', 'medico'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($consulta) {
                return [
                    'id' => $consulta->id,
                    'tipo' => 'consulta',
                    'tipo_consulta' => $consulta->tipo_consulta,
                    'codigo_historial' => $consulta->codigo_historial,
                    'codigo_cirugia' => null, // Para consistencia
                    'created_at' => $consulta->created_at->format('Y-m-d H:i:s'),
                    'impresion_diagnostica' => $consulta->impresion_diagnostica,
                    'diagnostico_preoperatorio' => null,
                ];
            });

        $cirugias = $paciente->cirugias()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($cirugia) {
                return [
                    'id' => $cirugia->id,
                    'tipo' => 'cirugia',
                    'tipo_consulta' => 'Cirugía',
                    'codigo_historial' => $cirugia->codigo_historial, // Asumiendo que existe este campo
                    'created_at' => $cirugia->created_at->format('Y-m-d H:i:s'),
                    'impresion_diagnostica' => $cirugia->diagnostico_preoperatorio,
                    'diagnostico_preoperatorio' => $cirugia->diagnostico_preoperatorio,
                ];
            });

        $historial = $consultas->concat($cirugias)
            ->sortByDesc('created_at')
            ->values();

        return response()->json([
            'paciente' => [
                'id' => $paciente->id,
                'nombres' => $paciente->nombres,
                'apellido_paterno' => $paciente->apellido_paterno,
                'dni' => $paciente->dni
            ],
            'consultas' => $historial
        ]);
    }

}
