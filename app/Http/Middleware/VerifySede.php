<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifySede
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Si no hay sede seleccionada, redirigir a selección
        if (!session('sede_actual') && $request->route()->getName() != 'seleccionar-sede') {
            return redirect()->route('seleccionar-sede');
        }

        return $next($request);
    }
}
