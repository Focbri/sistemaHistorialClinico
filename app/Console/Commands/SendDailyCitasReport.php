<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Cita;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReporteCitasSimpleMail;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SendDailyCitasReport extends Command
{
    protected $signature = 'citas:send-daily-report';
    protected $description = 'Envía el reporte diario de citas a los administradores';

    public function handle()
    {
        try {
            // Obtener todas las sedes activas
            $sedes = ['ate', 'pueblo_libre', 'abubillas']; // Asegúrate que coincidan con tus sedes en la BD
            
            foreach ($sedes as $sede) {
                // Obtener citas de la sede (últimas 100)
                $citas = Cita::with(['paciente', 'medico'])
                    ->where('sede', $sede)
                    ->orderBy('fecha_hora', 'desc')
                    ->limit(100)
                    ->get();

                // Datos para el correo
                $reporteData = [
                    'total_citas' => $citas->count(),
                    'sede' => $sede,
                    'fecha_reporte' => now()->format('d/m/Y H:i'),
                    'citas' => $citas->map(function($cita) {
                        // Convertir fecha_hora a Carbon si es string
                        $fechaHora = is_string($cita->fecha_hora) 
                            ? Carbon::parse($cita->fecha_hora)
                            : $cita->fecha_hora;

                        return [
                            'fecha' => $fechaHora->format('d/m/Y H:i'),
                            'paciente' => optional($cita->paciente)->nombre_completo ?? 'Paciente no disponible',
                            'medico' => optional($cita->medico)->name ?? 'Médico no asignado',
                            'motivo' => $cita->motivo ?? 'No definido',
                            'estado' => $cita->estado ?? 'No definido'
                        ];
                    })
                ];

                // Correo destino (configurable por sede si es necesario)
                $correoDestino = config('app.reporte_email', 'joanfpg2002@gmail.com');
                
                // Enviar correo
                Mail::to($correoDestino)
                    ->send(new ReporteCitasSimpleMail($reporteData));

                Log::info("Reporte diario de citas enviado para la sede $sede a $correoDestino");
            }

            $this->info('Reporte enviado exitosamente a todas las sedes');
            return 0;
        } catch (\Exception $e) {
            Log::error('Error al enviar reporte diario: ' . $e->getMessage());
            $this->error('Error al enviar reporte: ' . $e->getMessage());
            return 1;
        }
    }
}