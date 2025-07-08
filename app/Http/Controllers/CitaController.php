<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use App\Mail\ReporteCitasMail;
use App\Mail\ReporteCitasSimpleMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Exports\CitasExport;
use Maatwebsite\Excel\Facades\Excel;

class CitaController extends Controller
{
    public function index(Request $request)
{
    $query = Cita::with(['paciente', 'medico'])
        ->where('sede', session('sede_actual')); // Filtro por sede en sesión

    // Aplicar filtros si existen
    $query->when($request->filled('sex'), function($q) use ($request) {
        $q->whereHas('paciente', function($q) use ($request) {
            $q->where('sexo', $request->sex);
        });
    });
    
    $query->when($request->filled('min_age') || $request->filled('max_age'), function($q) use ($request) {
        $q->whereHas('paciente', function($q) use ($request) {
            if ($request->filled('min_age')) {
                $q->where('edad', '>=', $request->min_age);
            }
            if ($request->filled('max_age')) {
                $q->where('edad', '<=', $request->max_age);
            }
        });
    });
    
    $query->when($request->filled('start_date') && $request->filled('end_date'), function($q) use ($request) {
        $q->whereBetween('fecha_hora', [
            $request->start_date,
            $request->end_date
        ]);
    });
    
    $query->when($request->filled('procedencia'), function($q) use ($request) {
        $q->whereHas('paciente', function($q) use ($request) {
            $q->where('procedencia', $request->procedencia);
        });
    });
    
    $query->when($request->filled('terms'), function($q) use ($request) {
        $terms = explode(',', $request->terms);
        $q->where(function($q) use ($terms) {
            foreach ($terms as $term) {
                $q->orWhere('motivo', 'LIKE', "%{$term}%");
            }
        });
    });

    // Obtener citas filtradas
    $citas = $query->orderBy('fecha_hora', 'desc')->get();

    // Generar datos del calendario (solo si no hay filtros de fecha)
    $calendarData = [];
    if (!$request->filled('start_date') && !$request->filled('end_date')) {
        $year = $request->input('year', date('Y'));
        $month = $request->input('month', date('m'));
        $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $date = sprintf('%04d-%02d-%02d', $year, $month, $day);
            $citasCount = Cita::where('sede', session('sede_actual')) // Filtro por sede
                            ->whereDate('fecha_hora', $date)
                            ->where('estado', 'programada')
                            ->count();

            $calendarData[] = [
                'day' => $day,
                'date' => $date,
                'status' => $this->getStatusColor($citasCount),
                'citas_count' => $citasCount,
            ];
        }
    }

    return Inertia::render('Citas/Index', [
        'calendarData' => $calendarData,
        'currentMonth' => $request->input('month', date('m')),
        'currentYear' => $request->input('year', date('Y')),
        'medicos' => User::whereIn('role', ['medico', 'medico_externo'])
                    ->orderBy('name')
                    ->get(),
        'citas' => $citas,
        'filters' => $request->only(['sex', 'min_age', 'max_age', 'start_date', 'end_date', 'procedencia', 'terms']),
        'auth' => [
            'user' => Auth::user()
        ],
        'sedeActual' => session('sede_actual') // Añadir sede actual al response
    ]);
}

    public function store(Request $request)    {
        $request->validate([
        'paciente_id' => 'required|exists:pacientes,id',
        'medico_id' => [
            'required',
            Rule::exists('users', 'id')->where(function ($query) {
                $query->whereIn('role', ['medico', 'medico_externo']);
            }),
        ],
        'fecha_hora' => [
            'required',
            'date',
            function ($attribute, $value, $fail) {
                try {
                    $date = \Carbon\Carbon::parse($value);
                    $now = \Carbon\Carbon::now();
                    
                    // Validar que no sea fecha pasada
                    if ($date->isBefore($now->startOfDay())) {
                        $fail('No se pueden programar citas para fechas pasadas');
                    }
                    
                    // Validar que no sea más de 2 meses en el futuro
                    $twoMonthsLater = $now->copy()->addMonths(2)->endOfDay();
                    if ($date->gt($twoMonthsLater)) {
                        $fail('Solo se pueden programar citas hasta 2 meses en el futuro');
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
        'cotizacion' => 'nullable|string|max:255',
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
            'estado' => 'programada',
            'cotizacion' => $request->cotizacion,
            'sede' => session('sede_actual'), // Añadir la sede de la sesión actual
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
           'medico_id' => [
                'required',
                Rule::exists('users', 'id')->where(function ($query) {
                    $query->whereIn('role', ['medico', 'medico_externo']);
                }),
            ],
            'fecha_hora' => 'required|date',
            'motivo' => 'required|string|max:255',
            'cotizacion' => 'nullable|string|max:255',
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
    //CITAS ASIGNADAS PARA MÉDICO
    public function asignadas(Request $request)
    {
        // Citas programadas paginadas
        $citasProgramadas = Cita::with(['paciente'])
            ->where('medico_id', Auth::id())
            ->where('sede', session('sede_actual'))
            ->where('fecha_hora', '>=', now()->startOfDay()) // Solo citas de hoy o futuras
            ->orderBy('fecha_hora', 'desc') // Orden ascendente (próximas primero)
            ->paginate(10); // 10 citas por página

        // Citas atendidas paginadas
         $citasAtendidas = Cita::with(['paciente'])
            ->where('medico_id', Auth::id())
            ->where('sede', session('sede_actual'))
            ->where('estado', 'completada')
            ->orderBy('fecha_hora', 'desc') // Orden descendente (más recientes primero)
            ->paginate(10);

        return Inertia::render('Citas/Asignadas', [
            'citas' => $citasProgramadas,
            'citasAtendidas' => $citasAtendidas
        ]);
    }
    public function updateStatus(Request $request, Cita $cita)
    {
        $request->validate([
            'estado' => 'required|in:programada,completada,cancelada'
        ]);

        $cita->update([
            'estado' => $request->estado,
            'atendida_por' => Auth::id(),
            'fecha_atencion' => now()
        ]);

        return back()->with('success', 'Estado de la cita actualizado correctamente');
    }
    public function filtrar(Request $request)
    {
        $query = Cita::with(['paciente', 'medico']);
        
        // Filtro por sexo
        if ($request->filled('sex')) {
            $query->whereHas('paciente', function($q) use ($request) {
                $q->where('sexo', $request->sex);
            });
        }
        
        // Filtro por edad
        if ($request->filled('minAge') || $request->filled('maxAge')) {
            $query->whereHas('paciente', function($q) use ($request) {
                if ($request->filled('minAge')) {
                    $q->where('edad', '>=', $request->minAge);
                }
                if ($request->filled('maxAge')) {
                    $q->where('edad', '<=', $request->maxAge);
                }
            });
        }
        
        // Filtro por rango de fechas
        if ($request->filled('startDate') && $request->filled('endDate')) {
            $query->whereBetween('fecha_hora', [
                $request->startDate,
                $request->endDate
            ]);
        }
        
        // Filtro por procedencia
        if ($request->filled('procedencia')) {
            $query->whereHas('paciente', function($q) use ($request) {
                $q->where('procedencia', $request->procedencia);
            });
        }
        
        // Filtro por términos CIE10
        if ($request->filled('terms') && is_array($request->terms)) {
            $query->where(function($q) use ($request) {
                foreach ($request->terms as $term) {
                    $q->orWhere('motivo', 'LIKE', "%{$term}%");
                }
            });
        }
        
        return response()->json($query->get());
    }

public function generarReporteSimple(Request $request)
{
    Log::info('Generando reporte para sede: ' . session('sede_actual'));
    Log::info('Usuario solicitante: ' . Auth::user()->email);

    $request->validate([
        'correo_destino' => 'required|email|max:100',
        'limite' => 'nullable|integer|min:1|max:1000',
        'descargar_excel' => 'nullable|boolean'
    ]);

    try {
        $sedeActual = session('sede_actual');
        
        if (!$sedeActual) {
            throw new \Exception('No se ha definido una sede en la sesión actual');
        }

        // Obtener citas de la sede actual
        $citas = Cita::with(['paciente', 'medico'])
            ->where('sede', $sedeActual)
            ->whereDate('fecha_hora', now()->toDateString())
            ->orderBy('fecha_hora', 'desc')
            ->get();

        Log::info("Reporte solicitado para sede: {$sedeActual}, citas encontradas: " . $citas->count());

        if ($citas->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No hay citas programadas para la sede ' . $sedeActual . ' en la fecha actual.'
            ], 200);
        }

        // Preparar datos para el correo
        $reporteData = [
            'total_citas' => $citas->count(),
            'sede' => session('sede_actual') ?? 'Sede no definida',
            'fecha_reporte' => now()->format('d/m/Y H:i'),
            'citas' => $citas->map(function($cita) {
                $fechaHora = is_string($cita->fecha_hora) 
                    ? \Carbon\Carbon::parse($cita->fecha_hora)
                    : $cita->fecha_hora;

                return [
                    'fecha' => $fechaHora->format('d/m/Y H:i'),
                    'paciente' => $cita->paciente->nombre_completo ?? 'Paciente no disponible',
                    'medico' => $cita->medico->name ?? 'Médico no asignado',
                    'motivo' => $cita->motivo ?? 'No definido',
                    'estado' => $cita->estado ?? 'No definido',
                    'cotizacion' => $cita->cotizacion ?? 0,
                    'observaciones' => $cita->observaciones ?? 'Ninguna',
                    'dni' => $cita->paciente->dni ?? 'N/A',
                ];
            }),
            'total_cotizacion' => $citas->sum('cotizacion') // Suma total de cotizaciones
        ];

        // Generar archivo Excel temporal
        $excelFileName = 'reporte_citas_' . now()->format('Ymd_His') . '.xlsx';
        $excelPath = storage_path('app/' . $excelFileName);
        $totalCotizacion = $citas->sum('cotizacion');
        
        Excel::store(new CitasExport($citas, $totalCotizacion), $excelFileName);

        // Enviar correo con adjunto
        Mail::to($request->correo_destino)
            ->send(new ReporteCitasSimpleMail($reporteData, $excelPath));

        // Eliminar archivo temporal después de enviar
        if (file_exists($excelPath)) {
            unlink($excelPath);
        }

        return response()->json([
            'success' => true,
            'message' => 'Reporte de citas enviado correctamente al correo: ' . $request->correo_destino,
            'total_citas' => $citas->count(),
            'total_cotizacion' => number_format($reporteData['total_cotizacion'], 2)
        ]);

    } catch (\Exception $e) {
        Log::error('Error al generar reporte simple: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Error al generar el reporte: ' . $e->getMessage()
        ], 500);
    }
}
public function updateCotizacion(Request $request, Cita $cita)
{
    $request->validate([
        'cotizacion' => 'nullable|numeric|min:0'
    ]);

    // Convertir el valor a float para asegurar el formato decimal
    $cotizacion = $request->cotizacion ? (float)$request->cotizacion : null;

    $cita->update([
        'cotizacion' => $cotizacion
    ]);

    return back()->with('success', 'Cotización actualizada correctamente');
}

public function updateObservaciones(Request $request, Cita $cita)
{
    $request->validate([
        'observaciones' => 'nullable|string|max:1000'
    ]);

    $cita->update([
        'observaciones' => $request->observaciones
    ]);

    return back()->with('success', 'Observaciones actualizadas correctamente');
}
}