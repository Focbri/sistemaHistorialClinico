<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

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
        'telefonoE',
        'email',
        'procedencia',
        'acompañante',
        'referido',
        'foto_perfil',
        'codigo_historial',
        'sede',
    ];

    protected $appends = ['foto_perfil_url', 'nombre_completo'];
    
    protected $dates = [
        'created_at',
        'updated_at',
        'fecha_nacimiento'
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date:Y-m-d',
    ];

    protected static function boot()
{
    parent::boot();

    static::creating(function ($paciente) {
        // Generar código de historial si no existe
        if (empty($paciente->codigo_historial)) {
            $sede = session('sede_actual');
            $lastCode = self::where('sede', $sede)
                ->orderBy('id', 'desc')
                ->value('codigo_historial');
            
            $nextNumber = 1;
            if ($lastCode && preg_match('/HCL-(\d+)/', $lastCode, $matches)) {
                $nextNumber = (int)$matches[1] + 1;
            }
            
            $paciente->codigo_historial = 'HCL-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
        }

        // Asignar usuario y sede
        $paciente->user_id = Auth::id();
        $paciente->sede = session('sede_actual');
    });

    static::updating(function ($paciente) {
        // Actualizar códigos en consultas/cirugías si cambia el código
        if ($paciente->isDirty('codigo_historial')) {
            $codigoAnterior = $paciente->getOriginal('codigo_historial');
            
            $paciente->consultas()
                ->where('codigo_historial', $codigoAnterior)
                ->update(['codigo_historial' => $paciente->codigo_historial]);
                
            $paciente->cirugias()
                ->where('codigo_historial', $codigoAnterior)
                ->update(['codigo_historial' => $paciente->codigo_historial]);
        }
    });
}

    public function consultas(): HasMany
    {
        return $this->hasMany(Consulta::class)->orderBy('created_at', 'desc');
    }

    public function cirugias(): HasMany
    {
        return $this->hasMany(Cirugia::class);
    }

    public function getFotoPerfilUrlAttribute()
    {
        if (!$this->foto_perfil) {
            return null;
        }
        
        if (filter_var($this->foto_perfil, FILTER_VALIDATE_URL)) {
            return $this->foto_perfil;
        }
        
        return Storage::url($this->foto_perfil);
    }

    public function getNombreCompletoAttribute(): string 
    {
        return trim("{$this->nombres} {$this->apellido_paterno} {$this->apellido_materno}");
    }

    public function setFotoPerfilAttribute($value)
    {
        if (is_string($value)) {
            $this->attributes['foto_perfil'] = $value;
        } elseif ($value instanceof \Illuminate\Http\UploadedFile) {
            $path = $value->store('pacientes/fotos', 'public');
            $this->attributes['foto_perfil'] = $path;
        }
    }

    public static function rules(): array
    {
        return [
            'nombres' => 'required|string|max:255',
            'apellido_paterno' => 'required|string|max:255',
            'apellido_materno' => 'required|string|max:255',
            'tipo_documento' => 'required|in:dni,ce',
            'dni' => [
                'required',
                'string',
                Rule::when(request()->tipo_documento === 'dni', 'digits:8'),
                Rule::when(request()->tipo_documento === 'ce', 'digits_between:9,12'),
                Rule::unique('pacientes')->ignore(request()->id)
            ],
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|unique:pacientes,email,'.request()->id,
            'direccion' => 'nullable|string|max:255',
            'edad' => 'nullable|integer|min:0',
            'sede' => 'required|string',
        ];
    }

    public static function messages(): array
    {
        return [
            'nombres.required' => 'El nombre es requerido.',
            'nombres.string' => 'El nombre debe ser un texto.',
            'nombres.max' => 'El nombre no debe exceder los 255 caracteres.',
            'apellido_paterno.required' => 'El apellido paterno es requerido.',
            'apellido_paterno.string' => 'El apellido paterno debe ser un texto.',
            'apellido_paterno.max' => 'El apellido paterno no debe exceder los 255 caracteres.',
            'tipo_documento.required' => 'El tipo de documento es requerido.',
            'tipo_documento.in' => 'El tipo de documento debe ser DNI o CE.',
            'dni.required' => 'El número de documento es requerido.',
            'dni.digits' => 'El DNI debe tener 8 dígitos.',
            'dni.digits_between' => 'El CE debe tener entre 9 y 12 dígitos.',
            'dni.unique' => 'Este número de documento ya está registrado.',
        ];
    }

    public function scopeDeSedeActual($query)
    {
        return $query->where('sede', session('sede_actual'));
    }
}