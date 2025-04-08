<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
//use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Consulta;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class Paciente extends Model
{
    //use SoftDeletes;

    /**
     * Los campos que se pueden asignar masivamente.
     *
     * @var array
     */
    protected $fillable = [ 
        'apellido_paterno',
        'apellido_materno',
        'nombres',
        'fecha_nacimiento',
        'edad',
        'peso',
        'dni',
        'sexo',
        'estado_civil',
        'ocupacion',
        'direccion',
        'telefono',
        'email',
        'procedencia',
        'acompañante',
        'referido',
        'foto_perfil',
    ];

    /**
     * Relación con el modelo Consulta (un paciente puede tener muchas consultas).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function consultas(): HasMany
    {
        return $this->hasMany(Consulta::class);
    }

    /**
     * Accesores: Para obtener el nombre completo del paciente.
     *
     * @return string
     */
    public function getNombreCompletoAttribute(): string
    {
        return "{$this->nombres} {$this->apellido_paterno} {$this->apellido_materno}";
    }

    /**
     * Mutadores: Para asegurar que el nombre siempre se guarde con la primera letra en mayúscula.
     *
     * @param string $value
     */
    public function setNombreAttribute($value): void
    {
        $this->attributes['nombre'] = $value ? ucfirst(strtolower($value)) : null;
    }

    /**
     * Mutadores: Para asegurar que el apellido siempre se guarde con la primera letra en mayúscula.
     *
     * @param string $value
     */
    public function setApellidoAttribute($value): void
    {
        $this->attributes['apellido'] = $value ? ucfirst(strtolower($value)) : null;
    }

    /**
     * Reglas de validación para crear o actualizar un paciente.
     *
     * @return array
     */
    public static function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'dni' => 'required|string|unique:pacientes,dni|max:20',
            'telefono' => 'nullable|string|max:20',
            'email' => 'required|email|unique:pacientes,email|max:255',
            'direccion' => 'required|string|max:255',
        ];
    }

    /**
     * Mensajes personalizados para las reglas de validación.
     *
     * @return array
     */
    public static function messages(): array
    {
        return [
            'nombre.required' => 'El nombre es requerido.',
            'nombre.string' => 'El nombre debe ser un texto.',
            'nombre.max' => 'El nombre no debe exceder los 255 caracteres.',
            'apellido.required' => 'El apellido es requerido.',
            'apellido.string' => 'El apellido debe ser un texto.',
            'apellido.max' => 'El apellido no debe exceder los 255 caracteres.',
            'dni.required' => 'El DNI es requerido.',
            'dni.string' => 'El DNI debe ser un texto.',
            'dni.unique' => 'El DNI ya está registrado.',
            'dni.max' => 'El DNI no debe exceder los 20 caracteres.',
            'telefono.string' => 'El teléfono debe ser un texto.',
            'telefono.max' => 'El teléfono no debe exceder los 20 caracteres.',
            'email.required' => 'El correo electrónico es requerido.',
            'email.email' => 'El correo electrónico debe ser una dirección válida.',
            'email.unique' => 'El correo electrónico ya está registrado.',
            'email.max' => 'El correo electrónico no debe exceder los 255 caracteres.',
            'direccion.required' => 'La dirección es requerida.',
            'direccion.string' => 'La dirección debe ser un texto.',
            'direccion.max' => 'La dirección no debe exceder los 255 caracteres.',
        ];
    }
}