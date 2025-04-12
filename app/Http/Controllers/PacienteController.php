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

class PacienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $pacientes = Paciente::when($request->dni, function ($query, $dni) {
            return $query->where('dni', 'like', "%$dni%");
        })
        ->orderBy('apellido_paterno')
        ->orderBy('apellido_materno')
        ->orderBy('nombres')
        ->get();

        return inertia('Pacientes/Index', ['pacientes' => $pacientes]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Pacientes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                // Datos del paciente
                'nombres' => 'required|string|max:255',
                'apellido_paterno' => 'required|string|max:255',
                'apellido_materno' => 'required|string|max:255',
                'dni' => 'required|string|size:8|unique:pacientes,dni,',
                'fecha_nacimiento' => 'required|date',
                'edad' => 'required|integer|min:0|max:120',
                'sexo' => 'required|in:M,F',
                'estado_civil' => 'nullable|string|max:50',
                'ocupacion' => 'nullable|string|max:100',
                'procedencia' => 'nullable|string|max:100',
                'direccion' => 'required|string|max:255',
                'telefono' => 'required|string|max:15',
                'email' => 'nullable|email|max:255',
                'acompañante' => 'nullable|string|max:100',
                'referido' => 'nullable|string|max:100',
                'peso' => 'nullable|numeric|min:0|max:300',
                
                // Foto de perfil
                'foto_perfil' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ]);

            // Crear el paciente
            $paciente = new Paciente();
            $paciente->fill($validatedData);

            // Procesar foto de perfil
        if ($request->hasFile('foto_perfil')) {
            $file = $request->file('foto_perfil');
            $nombreOriginal = $file->getClientOriginalName();
            
            // Limpiar el nombre del archivo
            $nombreArchivo = pathinfo($nombreOriginal, PATHINFO_FILENAME);
            $extension = $file->extension();
            $nombreUnico = $this->sanitizeFileName($nombreArchivo) . '_' . time() . '.' . $extension;
            
            $path = $file->storeAs(
                'pacientes/' . $request->dni . '/fotos_perfil',
                $nombreUnico,
                'public'
            );
            
            $paciente->foto_perfil = $path;
        }

        $paciente->save();

            return redirect()->route('pacientes.index')
            ->with('success', 'Paciente creado correctamente.');
            
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['message' => 'Error al crear el paciente: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Paciente $paciente)
    {
        $pacienteData = $this->preparePacienteData($paciente);
        return Inertia::render('Pacientes/Show', ['paciente' => $pacienteData]);
    }

    /**
     * Show the form for editing the specified resource.
     */
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

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                // Datos del paciente
                'nombres' => 'required|string|max:255',
                'apellido_paterno' => 'required|string|max:255',
                'apellido_materno' => 'required|string|max:255',
                'dni' => 'required|string|size:8|unique:pacientes,dni,'.$id,
                'fecha_nacimiento' => 'required|date',
                'edad' => 'required|integer|min:0|max:120',
                'sexo' => 'required|in:M,F',
                'estado_civil' => 'nullable|string|max:50',
                'ocupacion' => 'nullable|string|max:100',
                'procedencia' => 'nullable|string|max:100',
                'direccion' => 'required|string|max:255',
                'telefono' => 'required|string|max:15',
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
                
                $path = $file->storeAs(
                    'pacientes/' . $paciente->dni . '/fotos_perfil',
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

    /**
     * Remove the specified resource from storage.
     */
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

    /**
     * Validación de datos del paciente
     */
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

    /**
     * Prepara los datos del paciente para la vista
     */
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

    /**
     * Store a newly created resource in storage.
     */
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

    /**
     * Método para procesar y validar archivos de pacientes
     */
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

    /**
     * Método para parsear datos de archivos (compatible con ambos controladores)
     */
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

    /**
     * Método para actualizar imagen de perfil (API)
     */
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

    /**
     * Método para eliminar imagen de perfil (API)
     */
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

    /**
     * Método para eliminar la foto de perfil
     */
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

    /**
     * Método para guardar foto de perfil
     */
    protected function guardarFotoPerfil($file, $dni)
    {
        try {
            $dniClean = preg_replace('/[^A-Za-z0-9]/', '', $dni);
            if (empty($dniClean)) {
                throw new \Exception('DNI no válido para crear carpeta');
            }
            
            $carpeta = "pacientes/{$dniClean}/perfil";
            
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

    /**
     * Método para eliminar toda la carpeta de un paciente
     */
    protected function eliminarCarpetaPaciente($dni)
    {
        $dniClean = preg_replace('/[^A-Za-z0-9]/', '', $dni);
        $carpeta = "pacientes/{$dniClean}";
        
        if (Storage::disk('public')->exists($carpeta)) {
            Storage::disk('public')->deleteDirectory($carpeta);
        }
    }

    /**
     * Método para renombrar carpeta cuando cambia el DNI
     */
    protected function renombrarCarpetaPaciente($oldDni, $newDni)
    {
        $oldDniClean = preg_replace('/[^A-Za-z0-9]/', '', $oldDni);
        $newDniClean = preg_replace('/[^A-Za-z0-9]/', '', $newDni);
        
        $oldPath = "pacientes/{$oldDniClean}";
        $newPath = "pacientes/{$newDniClean}";

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

    public function buscarPacientePorDNI(Request $request)
{
    $dni = trim($request->input('dni'));
    Log::info('Buscando paciente con DNI:', ['dni' => $dni]);

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
                // Agrega cualquier otro campo necesario
            ],
        ]);
    }
    
    Log::warning('Paciente no encontrado para DNI:', ['dni' => $dni]);
    return response()->json(['success' => false, 'message' => 'Paciente no encontrado'], 404);
}
}
