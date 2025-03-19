<?php

namespace App\Http\Controllers;

use \App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validar los datos del formulario
        $request->validate([
            'apellido_paterno' => 'required|string|max:255',
            'apellido_materno' => 'required|string|max:255',
            'nombres' => 'required|string|max:255',
            'fecha_nacimiento' => 'required|date',
            'edad' => 'required|integer',
            'peso' => 'required|numeric',
            'dni' => 'required|string|max:20|unique:pacientes',
            'sexo' => 'required|in:M,F',
            'estado_civil' => 'required|in:soltero,casado,divorciado,viudo',
            'ocupacion' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'procedencia' => 'required|in:Ancon,Ate,Barranco,Breña,Carabayllo,Chaclacayo,Chorrillos,Cienegilla,Comas,El Agustino,Independencia,Jesús María,La Molina,La Victoria,Lima,Lince,Los Olivos,Lurigancho,Lurín,Magdalena del Mar,Miraflores,Pachacamac,Pucusana,Pueblo Libre,Puente Piedra,Punta Hermosa,Punta Negra,Rimac,San Bartolo,San Borja,San Isidro,San Juan de Lurigancho,San Juan de Miraflores,San Luis,San Martín de Porres,San Miguel,Santa Anita,Santa María del Mar,Santa Rosa,Santiago de Surco,Surquillo,Villa El Salvador,Villa María del Triunfo',
            'acompañante' => 'nullable|string|max:255',
            'referido' => 'required|in:Recomendación de un amigo o familiar,Facebook,Instagram,TikTok,WhatsApp,Búsqueda en Google,Publicidad en línea,Boca a boca,Sitio web o blog,Reseñas en línea,Correo electrónico,Eventos o ferias',
        ]);

        // Crear el paciente
        $paciente = Paciente::create($request->all());

        // Crear carpeta para el paciente
        $carpetaPaciente = 'pacientes/' . $request->dni;
        Storage::makeDirectory($carpetaPaciente);

        return redirect()->route('pacientes.index')->with('success', 'Paciente registrado exitosamente.');
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
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Buscar el paciente por su ID
        $paciente = Paciente::findOrFail($id);

        // Retornar la vista de Inertia con los datos del paciente
        return inertia('Pacientes/Edit', ['paciente' => $paciente]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Validar los datos del formulario
        $request->validate([
            'apellido_paterno' => 'required|string|max:255',
            'apellido_materno' => 'required|string|max:255',
            'nombres' => 'required|string|max:255',
            'fecha_nacimiento' => 'required|date',
            'edad' => 'required|integer',
            'peso' => 'required|numeric',
            'dni' => 'required|string|max:20|unique:pacientes,dni,' . $id,
            'sexo' => 'required|in:M,F',
            'estado_civil' => 'required|in:soltero,casado,divorciado,viudo',
            'ocupacion' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'procedencia' => 'required|in:Ancon,Ate,Barranco,Breña,Carabayllo,Chaclacayo,Chorrillos,Cienegilla,Comas,El Agustino,Independencia,Jesús María,La Molina,La Victoria,Lima,Lince,Los Olivos,Lurigancho,Lurín,Magdalena del Mar,Miraflores,Pachacamac,Pucusana,Pueblo Libre,Puente Piedra,Punta Hermosa,Punta Negra,Rimac,San Bartolo,San Borja,San Isidro,San Juan de Lurigancho,San Juan de Miraflores,San Luis,San Martín de Porres,San Miguel,Santa Anita,Santa María del Mar,Santa Rosa,Santiago de Surco,Surquillo,Villa El Salvador,Villa María del Triunfo',
            'acompañante' => 'nullable|string|max:255',
            'referido' => 'required|in:Recomendación de un amigo o familiar,Facebook,Instagram,TikTok,WhatsApp,Búsqueda en Google,Publicidad en línea,Boca a boca,Sitio web o blog,Reseñas en línea,Correo electrónico,Eventos o ferias',
        ]);

        // Buscar el paciente por su ID
        $paciente = Paciente::findOrFail($id);

        // Actualizar el paciente
        $paciente->update($request->all());

        // Redirigir a la lista de pacientes con un mensaje de éxito
        return redirect()->route('pacientes.index')->with('success', 'Paciente actualizado correctamente.');
    }

    public function destroy($id)
    {
        try {
            $paciente = Paciente::findOrFail($id);
            Log::info('Eliminando paciente:', ['id' => $paciente->id]);

            $paciente->delete();
            Log::info('Paciente eliminado correctamente');
            return redirect()->route('pacientes.index')->with('success', 'Paciente y consultas eliminados correctamente.');
        } catch (\Exception $e) {
            Log::error('Error al eliminar paciente:', ['error' => $e->getMessage()]);
            return redirect()->route('pacientes.index')->with('error', 'Ocurrió un error al eliminar el paciente.');
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
            ],
        ]);
    }
    
    Log::warning('Paciente no encontrado para DNI:', ['dni' => $dni]);
    return response()->json(['success' => false, 'message' => 'Paciente no encontrado'], 404);
}
}
