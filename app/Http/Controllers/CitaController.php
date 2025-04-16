<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

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
            $citasCount = Cita::whereDate('fecha_hora', $date)->count();

            $status = 'green'; // Sin citas
            if ($citasCount > 0 && $citasCount < 16) {
                $status = 'orange'; // Citas pero no lleno
            } elseif ($citasCount >= 16) {
                $status = 'red'; // Día lleno
            }

            $calendarData[] = [
                'day' => $day,
                'date' => $date,
                'status' => $status,
                'citas_count' => $citasCount,
            ];
        }

        return Inertia::render('Citas/Index', [
            'calendarData' => $calendarData,
            'currentMonth' => $month,
            'currentYear' => $year,
            'medicos' => User::where('role', 'medico')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',
            'medico_id' => 'required|exists:users,id',
            'fecha_hora' => 'required|date',
            'motivo' => 'required|string|max:255',
        ]);

        // Verificar límite de 16 citas por día
        $fecha = date('Y-m-d', strtotime($request->fecha_hora));
        $citasCount = Cita::whereDate('fecha_hora', $fecha)->count();

        if ($citasCount >= 16) {
            return back()->withErrors(['limite' => 'Se ha alcanzado el límite de 16 citas para este día']);
        }

        Cita::create($request->all());

        return redirect()->route('citas.index')->with('success', 'Cita creada correctamente');
    }
}