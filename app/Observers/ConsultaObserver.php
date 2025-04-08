<?php

namespace App\Observers;

use App\Models\Consulta;
use App\Models\Cie10;

class ConsultaObserver
{
    /**
     * Handle the Consulta "created" event.
     */
    public function created(Consulta $consulta): void
    {
        //
    }

    /**
     * Handle the Consulta "updated" event.
     */
    public function updated(Consulta $consulta): void
    {
        //
    }

    /**
     * Handle the Consulta "deleted" event.
     */
    public function deleted(Consulta $consulta): void
    {
        //
    }

    /**
     * Handle the Consulta "restored" event.
     */
    public function restored(Consulta $consulta): void
    {
        //
    }

    /**
     * Handle the Consulta "force deleted" event.
     */
    public function forceDeleted(Consulta $consulta): void
    {
        //
    }
}
