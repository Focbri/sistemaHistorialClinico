<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */ 
    use HasFactory, Notifiable;

    const ROLES = [
        'admin' => 'Administrador',
        'medico' => 'Médico',
        'medico_externo' => 'Médico Externo',
        'recepcionista' => 'Recepcionista',
        'invitado' => 'Invitado'
    ];

    protected $fillable = [
        'name',
        'apellido',
        'email',
        'password',
        'sede',
        'role', // Agregar el campo 'role'
        'created_by', // Agregar el campo 'user_id'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => 'string', // Cast para el campo 'role'
            'sede' => 'string', // Cast para el campo 'sede'
        ];
    }

    public function creador()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Relación con usuarios creados por este usuario
    public function usuariosCreados()
    {
        return $this->hasMany(User::class, 'created_by');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            // Auto-asignar el usuario creador si hay alguien autenticado
            if (Auth::check()) {
                $user->created_by = Auth::id();
            }
            // Si no hay usuario autenticado (ej: seeder), será null
        });
    }

    /**
     * Verifica si el usuario es administrador.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Verifica si el usuario es un usuario normal.
     */
    public function isMedico(): bool
    {
        return $this->role === 'medico';
    }

    /**
     * Verifica si el usuario es un médico externo.
     */
    public function isMedicoExterno(): bool
    {
        return $this->role === 'medico_externo';
    }
    /**
     * Verifica si el usuario es recepcionista.
     */
    public function isRecepcionista(): bool
    {
        return $this->role === 'recepcionista';
    }
    /**
     * Verifica si el usuario es invitado.
     */
    public function isInvitado(): bool
    {
        return $this->role === 'invitado';
    }    

    // En app/Models/User.php
    public function pacientes()
    {
        return $this->hasMany(Paciente::class, 'user_id')->where('sede', $this->sede);
    }
    public function citas()
    {
        return $this->hasMany(Cita::class, 'medico_id');
    }
}