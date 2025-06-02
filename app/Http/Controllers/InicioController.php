<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
class InicioController extends Controller
{
    //
    public function index() 
    {
         return Inertia::render('Inicio', [
            'auth' => [
                'user' => Auth::user()
            ],
            // Otras props que necesites
        ]);
    }
}
