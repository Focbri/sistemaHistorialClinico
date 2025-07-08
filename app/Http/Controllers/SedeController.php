<?
// app/Http/Controllers/SedeController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SedeController extends Controller
{
    public function select()
    {
        return inertia('Auth/SelectSede', [
            'sedes' => ['ate', 'pueblo_libre', 'abubillas'] // Puedes personalizar esto
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'sede' => 'required|in:ate,pueblo_libre,abubillas',
        ]);

        session(['sede_actual' => $request->sede]);

        return redirect()->route('inicio'); 
    }
}