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

    protected $fillable = [
        'user_id',
        'apellido_paterno',
        'apellido_materno',
        'nombres',
        'fecha_nacimiento',
        'edad',
        'peso',
        'tipo_documento',
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
        'codigo_historial',
    ];

    protected static function booted()
    {
        static::creating(function ($paciente) {
            // Generar código de historial al crear un nuevo paciente
            if (empty($paciente->codigo_historial)) {
                $paciente->codigo_historial = 'HCL-' . $paciente->dni;
            }
        });
    }

    /**
     * Relación con el modelo Consulta (un paciente puede tener muchas consultas).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function consultas(): HasMany
    {
        return $this->hasMany(Consulta::class)->orderBy('created_at', 'desc');
    }

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

    public static function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'dni' => 'required|string|unique:pacientes,dni|max:20',
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|unique:pacientes,email|max:255',
            'direccion' => 'nullable|string|max:255',
            'edad' => 'nullable|integer|min:0',
        ];
    }

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'fecha_nacimiento' => 'date:Y-m-d',
    ];

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
            'dni.max' => 'El DNI no debe exceder los 8 caracteres.',
        ];
    }

    public function cirugias()
{
    return $this->hasMany(Cirugia::class);
}

protected static function boot()
{
    parent::boot();

    static::creating(function ($paciente) {
        // Usa el facade Auth en lugar del helper auth()
        if (\Illuminate\Support\Facades\Auth::check()) {
            $paciente->user_id = \Illuminate\Support\Facades\Auth::id();
        } else {
            throw new \Exception('No hay usuario autenticado al crear un paciente');
        }

        // Generar código de historial
        if (empty($paciente->codigo_historial)) {
            $paciente->codigo_historial = 'HCL-' . $paciente->dni;
        }
    });
}
}