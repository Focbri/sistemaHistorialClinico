<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetSedeMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
         // Si no hay sede en sesión pero el usuario tiene sede predeterminada
        if (!session('sede_actual') && $request->user()?->sede) {
            session(['sede_actual' => $request->user()->sede]);
        }

        return $next($request);
    }
}
