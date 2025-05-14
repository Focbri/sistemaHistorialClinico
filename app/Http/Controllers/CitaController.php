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
                    // Validar que sea en intervalos de 20 minutos
                    $date = new \DateTime($value);
                    $minutes = $date->format('i');
                    if ($minutes % 20 !== 0) {
                        $fail('Las citas deben programarse en intervalos de 20 minutos (ej: 08:00, 08:20, 08:40)');
                    }
                }
            ],
            'motivo' => 'required|string|max:255',
        ]);

        // Verificar límite de 16 citas por día
        $fecha = date('Y-m-d', strtotime($request->fecha_hora));
        $citasCount = Cita::whereDate('fecha_hora', $fecha)
                        ->where('estado', 'programada')
                        ->count();

        if ($citasCount >= 16) {
            return back()->withErrors(['limite' => 'Se ha alcanzado el límite de 16 citas para este día']);
        }

        // Verificar diferencia de 20 minutos
        $nuevaFechaHora = new Carbon($request->fecha_hora);
        $horaInicio = $nuevaFechaHora->copy()->subMinutes(19); // 19 para evitar solapamiento
        $horaFin = $nuevaFechaHora->copy()->addMinutes(19);

        $citaExistente = Cita::whereBetween('fecha_hora', [$horaInicio, $horaFin])
                        ->where('id', '!=', $request->id ?? null)
                        ->first();

        if ($citaExistente) {
            return back()->withErrors(['fecha_hora' => 'Debe haber al menos 20 minutos de diferencia entre citas']);
        }

        Cita::create([
            'paciente_id' => $request->paciente_id,
            'medico_id' => $request->medico_id,
            'fecha_hora' => $request->fecha_hora,
            'motivo' => $request->motivo,
            'estado' => 'programada'
        ]);

        return redirect()->route('citas.index')->with('success', 'Cita creada correctamente');
    }

    public function update(Request $request, Cita $cita)
    {
        $request->validate([
            'medico_id' => 'required|exists:users,id',
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
            'motivo' => 'required|string|max:255',
            'estado' => 'required|in:programada,completada,cancelada',
        ]);

        // Verificación de diferencia de 20 minutos
        $nuevaFechaHora = new Carbon($request->fecha_hora);
        $horaInicio = $nuevaFechaHora->copy()->subMinutes(19);
        $horaFin = $nuevaFechaHora->copy()->addMinutes(19);

        $citaExistente = Cita::whereBetween('fecha_hora', [$horaInicio, $horaFin])
                        ->where('id', '!=', $cita->id)
                        ->first();

        if ($citaExistente) {
            return back()->withErrors(['fecha_hora' => 'Debe haber al menos 20 minutos de diferencia entre citas']);
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