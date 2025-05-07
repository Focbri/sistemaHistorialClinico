<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

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
        'email',
        'password',
        'role', // Agregar el campo 'role'
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
        ];
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
    
}