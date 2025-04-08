<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\Consulta; // Cambiado a la ubicación correcta
use App\Observers\ConsultaObserver; // Cambiado a la ubicación correcta

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Consulta::observe(ConsultaObserver::class);

        \Inertia\Inertia::share([
            'flash' => function () {
                return [
                    'success' => session('success'),
                    'error' => session('error'),
                ];
            },
            // Otras shares si las tienes
        ]);
    }
}
