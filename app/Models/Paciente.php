<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
//use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Consulta;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

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
        //asignar sede
        'sede', // Agregar el campo 'sede'
    ];

protected static function booted()
{
    static::creating(function ($paciente) {
        if (empty($paciente->codigo_historial)) {
            // Usa lockForUpdate para evitar race conditions
            $lastCode = self::lockForUpdate()
                ->orderBy('id', 'desc')
                ->value('codigo_historial');
            
            $nextNumber = 1; // Valor por defecto
            
            if ($lastCode && preg_match('/HCL-(\d+)/', $lastCode, $matches)) {
                $nextNumber = (int)$matches[1] + 1;
            }
            
            $paciente->codigo_historial = 'HCL-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
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

    protected $appends = ['foto_perfil_url'];

public function getFotoPerfilUrlAttribute()
{
    if (!$this->foto_perfil) {
        return null;
    }
    
    // Si ya es una URL completa (por ejemplo, de un servicio externo)
    if (filter_var($this->foto_perfil, FILTER_VALIDATE_URL)) {
        return $this->foto_perfil;
    }
    
    // Generar URL para archivos locales
    return Storage::url($this->foto_perfil);
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
            'nombres' => 'required|string|max:255',
            'apellido_paterno' => 'required|string|max:255',
            'apellido_materno' => 'required|string|max:255',
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
        });
    }

    public function scopeDeSedeActual($query)
    {
        // Usa la sede de la sesión en lugar de la del usuario
        return $query->where('sede', session('sede_actual'));
    }
}