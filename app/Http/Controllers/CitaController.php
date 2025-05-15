<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CitaController extends Controller
{
public function index(Request $request)
    {
        $year = $request->input('year', date('Y'));
        $month = $request->input('month', date('m'));

        // Obtener días del mes con conteo de citas
        $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);
        $calendarData = [];

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $date = sprintf('%04d-%02d-%02d', $year, $month, $day);
            $citasCount = Cita::whereDate('fecha_hora', $date)
                            ->where('estado', 'programada')
                            ->count();

            $calendarData[] = [
                'day' => $day,
                'date' => $date,
                'status' => $this->getStatusColor($citasCount),
                'citas_count' => $citasCount,
            ];
        }

        // Obtener todas las citas con relaciones
        $citas = Cita::with(['paciente', 'medico'])
                    ->orderBy('fecha_hora', 'desc')
                    ->get();

        return Inertia::render('Citas/Index', [
            'calendarData' => $calendarData,
            'currentMonth' => $month,
            'currentYear' => $year,
            'medicos' => User::where('role', 'medico')->get(),
            'citas' => $citas,
        ]);
    }

public function store(Request $request)
{
    $request->validate([
        'paciente_id' => 'required|exists:pacientes,id',
        'medico_id' => 'required|exists:users,id',
        'fecha_hora' => [
            'required',
            'date',
            function ($attribute, $value, $fail) {
                try {
                    $date = \Carbon\Carbon::parse($value);
                    $now = \Carbon\Carbon::now();
                    
                    // Validar que no sea fecha pasada (solo comparando fecha, no hora)
                    if ($date->isBefore($now->startOfDay())) {
                        $fail('No se pueden programar citas para fechas pasadas');
                    }
                    
                    // Validar que sea hoy o mañana
                    $tomorrow = $now->copy()->addDay()->endOfDay();
                    if ($date->gt($tomorrow)) {
                        $fail('Solo se pueden programar citas para hoy y mañana');
                    }
                    
                    // Si es hoy, validar que la hora sea futura
                    if ($date->isToday() && $date->isPast()) {
                        $fail('Para citas de hoy, la hora debe ser mayor a la hora actual');
                    }
                    
                    // Forzar que los segundos sean 00
                    if ($date->second != 0) {
                        $date->second(0);
                    }
                } catch (\Exception $e) {
                    $fail('El formato de fecha y hora no es válido');
                }
            }
        ],
        'motivo' => 'required|string|max:255',
    ]);

    try {
        $fechaHora = \Carbon\Carbon::parse($request->fecha_hora)->second(0);
    } catch (\Exception $e) {
        return back()->withErrors(['fecha_hora' => 'La fecha y hora proporcionada no es válida']);
    }

    $fecha = $fechaHora->format('Y-m-d');
    
    // Verificar citas existentes para este médico en este día
    $citasDelDia = Cita::where('medico_id', $request->medico_id)
                    ->whereDate('fecha_hora', $fecha)
                    ->where('estado', 'programada')
                    ->get();

    // Verificar límite de citas por día
    if ($citasDelDia->count() >= 16) {
        return back()->withErrors(['limite' => 'Se ha alcanzado el límite de 16 citas para este médico en el día seleccionado']);
    }

    // Validar diferencia mínima de 20 minutos (sin importar el minuto exacto)
    $horaInicio = $fechaHora->copy()->subMinutes(19); // 19 minutos para incluir el límite
    $horaFin = $fechaHora->copy()->addMinutes(19);
    
    $citaExistente = Cita::where('medico_id', $request->medico_id)
                    ->whereBetween('fecha_hora', [$horaInicio, $horaFin])
                    ->where('estado', 'programada')
                    ->first();

    if ($citaExistente) {
        $nextAvailable = $fechaHora->copy()->addMinutes(20 - ($fechaHora->diffInMinutes($citaExistente->fecha_hora)));
        
        return back()->withErrors([
            'fecha_hora' => 'Debe haber al menos 20 minutos de diferencia entre citas. Próximo horario disponible: ' . $nextAvailable->format('H:i')
        ])->with('suggested_time', $nextAvailable->format('Y-m-d\TH:i'));
    }

    // Si no hay citas o no hay conflicto, crear la cita
    Cita::create([
        'paciente_id' => $request->paciente_id,
        'medico_id' => $request->medico_id,
        'fecha_hora' => $fechaHora,
        'motivo' => $request->motivo,
        'estado' => 'programada'
    ]);

    return redirect()->route('citas.index')->with('success', 'Cita creada correctamente');
}
protected function findNextAvailableSlot($medicoId, $startTime)
{
    try {
        if (!$startTime instanceof \Carbon\Carbon) {
            $startTime = \Carbon\Carbon::parse($startTime);
        }
    } catch (\Exception $e) {
        $startTime = now();
    }

    $attempts = 0;
    $currentTime = $startTime->copy();
    
    // Redondear al siguiente intervalo de 20 minutos si es necesario
    $minutes = $currentTime->minute;
    $remainder = $minutes % 20;
    if ($remainder != 0) {
        $currentTime->addMinutes(20 - $remainder)->setSeconds(0);
    } else {
        $currentTime->setSeconds(0);
    }
    
    while ($attempts < 48) {
        try {
            $horaInicio = $currentTime->copy()->subMinutes(19);
            $horaFin = $currentTime->copy()->addMinutes(19);
            
            $conflictingAppointment = Cita::where('medico_id', $medicoId)
                                        ->whereBetween('fecha_hora', [$horaInicio, $horaFin])
                                        ->where('estado', 'programada')
                                        ->first();
            
            if (!$conflictingAppointment) {
                return $currentTime;
            }
            
            $currentTime->addMinutes(20);
            $attempts++;
        } catch (\Exception $e) {
            $currentTime->addMinutes(20);
            $attempts++;
            continue;
        }
    }
    
    return $startTime->copy()->addDay()->setTime(8, 0);
}
    public function update(Request $request, Cita $cita)
    {
        $request->validate([
            'medico_id' => 'required|exists:users,id',
            'fecha_hora' => 'required|date',
            'motivo' => 'required|string|max:255',
            'estado' => 'required|in:programada,completada,cancelada',
        ]);

        $nuevaFechaHora = new Carbon($request->fecha_hora);
        $fecha = $nuevaFechaHora->format('Y-m-d');
        
        // Verificar si hay citas existentes para este médico en este día (excluyendo la actual)
        $citasDelDia = Cita::where('medico_id', $request->medico_id)
                        ->whereDate('fecha_hora', $fecha)
                        ->where('id', '!=', $cita->id)
                        ->where('estado', 'programada')
                        ->get();

        // Solo validar si hay citas existentes
        if ($citasDelDia->count() > 0) {
            // Validar intervalo de 20 minutos
            if ($nuevaFechaHora->minute % 20 !== 0) {
                return back()->withErrors(['fecha_hora' => 'Las citas deben programarse en intervalos de 20 minutos']);
            }

            // Verificar límite de 16 citas
            if ($citasDelDia->count() >= 16) {
                return back()->withErrors(['limite' => 'Se ha alcanzado el límite de 16 citas para este día']);
            }

            // Verificar diferencia de 20 minutos
            $horaInicio = $nuevaFechaHora->copy()->subMinutes(19);
            $horaFin = $nuevaFechaHora->copy()->addMinutes(19);

            $citaExistente = $citasDelDia->whereBetween('fecha_hora', [$horaInicio, $horaFin])
                                ->first();

            if ($citaExistente) {
                return back()->withErrors(['fecha_hora' => 'Debe haber al menos 20 minutos de diferencia entre citas']);
            }
        }

        $cita->update($request->all());

        return back()->with([
            'success' => 'Cita actualizada correctamente',
            'citas' => Cita::with(['paciente', 'medico'])->get()
        ]);
    }
    // Nuevo método para reprogramar citas
    public function reprogramar(Request $request, Cita $cita)
    {
        $request->validate([
            'fecha_hora' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    // Validar que sea en intervalos de 20 minutos
                    $date = new \DateTime($value);
                    $minutes = $date->format('i');
                    if ($minutes % 20 !== 0) {
                        $fail('Las citas deben programarse en intervalos de 20 minutos (ej: 08:00, 08:20, 08:40)');
                    }
                }
            ],
            'motivo' => 'sometimes|string|max:255'
        ]);

        // Verificar límite de 16 citas para la nueva fecha
        $nuevaFecha = date('Y-m-d', strtotime($request->fecha_hora));
        $citasCount = Cita::whereDate('fecha_hora', $nuevaFecha)
                        ->where('estado', 'programada')
                        ->where('id', '!=', $cita->id)
                        ->count();

        if ($citasCount >= 16) {
            return back()->withErrors(['limite' => 'Se ha alcanzado el límite de 16 citas para el nuevo día seleccionado']);
        }

        // Verificar diferencia de 20 minutos
        $nuevaFechaHora = new Carbon($request->fecha_hora);
        $horaInicio = $nuevaFechaHora->copy()->subMinutes(19);
        $horaFin = $nuevaFechaHora->copy()->addMinutes(19);

        $citaExistente = Cita::whereBetween('fecha_hora', [$horaInicio, $horaFin])
                        ->where('id', '!=', $cita->id)
                        ->first();

        if ($citaExistente) {
            return back()->withErrors(['fecha_hora' => 'Debe haber al menos 20 minutos de diferencia entre citas']);
        }

        $cita->update([
            'fecha_hora' => $request->fecha_hora,
            'motivo' => $request->motivo ?? $cita->motivo,
        ]);

        return redirect()->back()->with('success', 'Cita reprogramada correctamente');
    }

    protected function generateCalendarData($month, $year)
    {
        $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);
        $calendarData = [];

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $date = Carbon::create($year, $month, $day)->format('Y-m-d');
            $citasCount = Cita::whereDate('fecha_hora', $date)
                            ->where('estado', 'programada')
                            ->count();

            $calendarData[] = [
                'day' => $day,
                'date' => $date,
                'citas_count' => $citasCount,
                'status' => $this->getStatusColor($citasCount)
            ];
        }

        return $calendarData;
    }

    protected function getStatusColor($count)
    {
        if ($count === 0) return 'gray';
        if ($count >= 16) return 'red';       // Máximo de citas por día
        if ($count >= 12) return 'orange';    // 75% de capacidad
        return 'green';
    } 

    // En CitaController.php
    public function destroy(Cita $cita)
    {
        $cita->delete();
        return redirect()->back()->with('success', 'Cita eliminada correctamente');
    }
}