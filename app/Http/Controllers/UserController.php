<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Models\Consulta;
use \App\Models\User;
use Illuminate\Support\Facades\Auth;
use \App\Models\Paciente;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Obtén todos los usuarios excepto el que tiene un ID específico
        $users = User::where('id', '!=', 1)->get(); // Cambia 1 por el ID del usuario que no quieres mostrar

        return Inertia::render('Admin/Users/Index', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'users' => $users,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        // Validar los datos del formulario
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
            'role' => 'required|in:admin,usuario', // Solo permite 'admin' o 'usuario'
        ]);

        // Crear el usuario
        \App\Models\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'role' => $request->role, // Asignar el rol seleccionado
        ]);

        // Redirigir con un mensaje de éxito
        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario creado exitosamente.');
    }

    public function show($id)
    {
        // Obtener el usuario por su ID
        $user = \App\Models\User::findOrFail($id);

        // Retornar la vista con los detalles del usuario
        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
        ]);
    }

    public function destroy($id)
    {
        // Obtener el usuario por su ID
        $user = \App\Models\User::findOrFail($id);

        // Eliminar el usuario
        $user->delete();

        // Redirigir con un mensaje de éxito
        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario eliminado exitosamente.');
    }

    public function edit($id)
    {
        // Obtener el usuario por su ID
        $user = \App\Models\User::findOrFail($id);

        // Retornar la vista con los datos del usuario
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, $id)
    {
        // Obtener el usuario por su ID
        $user = \App\Models\User::findOrFail($id);

        // Validar los datos del formulario
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
            'role' => 'required|in:admin,usuario', // Solo permite 'admin' o 'usuario'
        ]);

        // Actualizar los datos del usuario
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ]);

        // Actualizar la contraseña si se proporciona
        if ($request->password) {
            $user->update([
                'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            ]);
        }

        // Redirigir con un mensaje de éxito
        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario actualizado exitosamente.');
    }
}