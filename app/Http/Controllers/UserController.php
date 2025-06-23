<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request) 
    {
        // Verificar autenticación y rol
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            abort(403, 'No tienes permiso para acceder a esta sección');
        }

        $users = User::all();
        
        return Inertia::render('Admin/Users/Index', [
            'auth' => ['user' => Auth::user()],
            'users' => $users,
            'roles' => User::ROLES,
            'sede' => Auth::user()->sede, // Agregar sede del usuario autenticado
        ]);
    }

    public function create()
    {
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            abort(403);
        }

        return Inertia::render('Admin/Users/Create', [
            'roles' => User::ROLES
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
    
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Acceso no autorizado');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => 'required|in:'.implode(',', array_keys(User::ROLES)),
            'sede' => 'nullable|string|max:255', // Asegúrate de que el campo sede esté en $fillable
        ]);

        User::create([
            'name' => $validated['name'],
            'apellido' => $validated['apellido'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'sede' => $validated['sede'] ?? $user->sede, // Asignar sede del usuario autenticado si no se proporciona
            'created_by' => Auth::id(), // Asegúrate que created_by esté en $fillable
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario creado exitosamente.');
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        
        // Solo admin o el mismo usuario pueden ver el perfil
        if (!Auth::check() || (Auth::user()->role !== 'admin' && Auth::id() != $id)) {
            abort(403);
        }

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
        ]);
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);
        
        // Solo admin puede editar, y no puede editar a otros admins
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            abort(403);
        }

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'roles' => User::ROLES
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            abort(403);
        }
        Log::info('Intentando actualizar usuario', ['id' => $id, 'request' => $request->all()]);

        $request->validate([
            'name' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'role' => 'required|in:'.implode(',', array_keys(User::ROLES)),
            'sede' => 'nullable|string|max:255', // Asegúrate de que el campo sede esté en $fillable
        ]);

        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ];

        if ($request->password) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario actualizado exitosamente.');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        if (!Auth::check() || Auth::user()->role !== 'admin' || $user->role === 'admin') {
            abort(403);
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario eliminado exitosamente.');
    }
}