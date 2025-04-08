<?php

namespace App\Http\Controllers;

use \App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class PacienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Filtrar pacientes por DNI si se proporciona
        $pacientes = Paciente::when($request->dni, function ($query, $dni) {
            return $query->where('dni', 'like', "%$dni%");
        })->get();

        return inertia('Pacientes/Index', ['pacientes' => $pacientes]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Obtener la lista de pacientes para el formulario
        $pacientes = Paciente::all();

        // Retornar la vista de Inertia con los datos de los pacientes
        return inertia('Pacientes/Create', ['pacientes' => $pacientes]);
    }

        /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $paciente = Paciente::findOrFail($id);
        
        // Preparar datos para la vista
        $pacienteData = $paciente->toArray();

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

        $paciente->foto_perfil = $parseFiles($paciente->foto_perfil);
        
        // Agregar la URL completa de la imagen si existe
        if ($paciente->foto_perfil) {
            $cleanPath = str_replace(['public/', 'storage/'], '', $paciente->foto_perfil);
            $pacienteData['foto_perfil_url'] = asset('storage/'.$cleanPath);
        } else {
            $pacienteData['foto_perfil_url'] = null;
        }
        
        return inertia('Pacientes/Edit', ['paciente' => $pacienteData]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate($this->getValidationRules());

        DB::beginTransaction();
        
        try {
            $paciente = Paciente::create($request->except('foto_perfil'));

            if ($request->hasFile('nuevas_imagenes')) {
                foreach ($request->file('nuevas_imagenes') as $file) {
                    $path = $file->store('pacientes/' . $paciente->id . '/imagenes');
                    $imagenes[] = [
                        'ruta' => $path,
                        'nombre_original' => $file->getClientOriginalName() // Guardar nombre original
                    ];
                }
            }

            DB::commit();
            
            return redirect()->route('pacientes.index')
                ->with('success', 'Paciente registrado exitosamente.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al crear paciente: '.$e->getMessage());
            return back()->with('error', 'Error al registrar el paciente: '.$e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Paciente $paciente)
    {
        return Inertia::render('Pacientes/Show', [
            'paciente' => $paciente,
        ]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        
        try {
            $paciente = Paciente::findOrFail($id);
            $rules = $this->getValidationRules($id, true);
            $validatedData = $request->validate($rules);

            // Procesar eliminación de imagen
            if ($request->input('eliminar_foto')) { // No 'eliminar_foto'
                $this->limpiarImagenesPaciente($paciente->dni);
                $paciente->foto_perfil = null;
            }

            // Procesar nueva imagen
            if ($request->hasFile('foto_perfil')) {
                $this->limpiarImagenesPaciente($paciente->dni);
                
                $path = $this->guardarFotoPerfil($request->file('foto_perfil'), $paciente->dni);
                
                if (!Storage::disk('public')->exists($path)) {
                    throw new \Exception("La imagen no existe en la ruta especificada");
                }
                
                // Actualizar directamente el modelo, no usar update()
                $paciente->foto_perfil = $path;
            }

            // Actualizar los demás campos
            $paciente->fill($validatedData);
            $paciente->save(); // Esto guardará todos los cambios, incluido foto_perfil

            DB::commit();
            
            return redirect()->route('pacientes.index')
                ->with('success', 'Paciente actualizado correctamente.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error en update: '.$e->getMessage(), [
                'paciente_id' => $id,
                'error_trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Error al actualizar: '.$e->getMessage());
        }
    }

    protected function guardarFotoPerfil($file, $dni, $useOriginalName = false)
    {
        $dniClean = preg_replace('/[^A-Za-z0-9]/', '', $dni);
        $carpeta = "pacientes/{$dniClean}/perfil";
        
        // Crear directorio si no existe (con permisos 0755)
        if (!Storage::disk('public')->exists($carpeta)) {
            Storage::disk('public')->makeDirectory($carpeta, 0755, true);
        }
        
        // Generar nombre único para el archivo
        $nombreArchivo = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME))
                       . '_' . time()
                       . '.' . $file->getClientOriginalExtension();
        
        // Guardar el archivo
        $path = $file->storeAs(
            $carpeta,
            $nombreArchivo,
            'public' // Asegúrate de usar el disco 'public'
        );
        
        return $path; // Esto retornará algo como "pacientes/12345678/perfil/nombre_1234567890.jpg"
    }

    protected function limpiarImagenesPaciente($dni)
    {
        $dniClean = preg_replace('/[^A-Za-z0-9]/', '', $dni);
        $carpeta = "pacientes/{$dniClean}/perfil";
        
        if (Storage::disk('public')->exists($carpeta)) {
            // Eliminar solo los archivos dentro del directorio, no el directorio mismo
            $files = Storage::disk('public')->files($carpeta);
            Storage::disk('public')->delete($files);
        }
    }

    public function updateImagen(Paciente $paciente, Request $request)
    {
        $request->validate([
            'foto_perfil' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        DB::beginTransaction();
        
        try {
            // Eliminar imagen anterior si existe
            if ($paciente->foto_perfil) {
                Storage::disk('public')->delete($paciente->foto_perfil);
            }

            // Guardar nueva imagen
            $path = $request->file('foto_perfil')->store(
                "pacientes/{$paciente->dni}/perfil", 
                'public'
            );

            // Actualizar en base de datos
            $paciente->foto_perfil = $path;
            $paciente->save();

            DB::commit();
            
            return response()->json([
                'success' => true,
                'foto_perfil_url' => asset(Storage::url($path)),
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
            if ($paciente->foto_perfil) {
                Storage::disk('public')->delete($paciente->foto_perfil);
                $paciente->foto_perfil = null;
                $paciente->save();
            }

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


    private function getValidationRules($id = null, $forUpdate = false)
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
            'foto_perfil' => 'nullable|array|max:4', // Máximo 4 imágenes
            'foto_perfil.*' => 'file|mimes:jpg,jpeg,png|max:2048', // Cada imagen debe ser un archivo válido
        ];

        // Solo hacer campos requeridos para creación (store)
        if (!$forUpdate) {
            $requiredRules = [
                'apellido_paterno', 'apellido_materno', 'nombres', 'fecha_nacimiento',
                'edad', 'peso', 'dni', 'sexo', 'estado_civil', 'ocupacion',
                'direccion', 'telefono', 'procedencia', 'referido'
            ];
            
            foreach ($requiredRules as $field) {
                $rules[$field] = 'required|'.$rules[$field];
            }
        }

        return $rules;
    }

    public function destroy($id)
    {
        try {
            $paciente = Paciente::findOrFail($id);
            Log::info('Eliminando paciente:', ['id' => $paciente->id]);

            // Eliminar la carpeta del paciente con todo su contenido
            $this->eliminarCarpetaPaciente($paciente->dni);

            $paciente->delete();
            Log::info('Paciente eliminado correctamente');
            return redirect()->route('pacientes.index')->with('success', 'Paciente y consultas eliminados correctamente.');
        } catch (\Exception $e) {
            Log::error('Error al eliminar paciente:', ['error' => $e->getMessage()]);
            return redirect()->route('pacientes.index')->with('error', 'Ocurrió un error al eliminar el paciente.');
        }
    }

    protected function eliminarCarpetaPaciente($dni)
    {
        $carpetaPaciente = "pacientes/{$dni}";
        if (Storage::disk('public')->exists($carpetaPaciente)) {
            Storage::disk('public')->deleteDirectory($carpetaPaciente);
        }
    }

    protected function renombrarCarpetaPaciente($oldDni, $newDni)
    {
        $oldPath = "pacientes/{$oldDni}";
        $newPath = "pacientes/{$newDni}";

        if (Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->move($oldPath, $newPath);
            
            // Obtener el paciente primero
            $paciente = Paciente::where('dni', $newDni)->first();
            
            // Verificar si existe el paciente y tiene foto_perfil
            if ($paciente && $paciente->foto_perfil) {
                // Actualizar rutas en la base de datos
                $paciente->update([
                    'foto_perfil' => Str::replaceFirst(
                        "pacientes/{$oldDni}/", 
                        "pacientes/{$newDni}/", 
                        $paciente->foto_perfil
                    )
                ]);
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
