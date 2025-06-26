@component('mail::message')
# Reporte Diario de Citas - {{ $sede }}

**Fecha del reporte:** {{ $fecha_reporte }}  
**Total de citas:** {{ $total_citas }}  
**Total cotización:** S/. {{ $total_cotizacion }}

@component('mail::table')
| Fecha/Hora           | Paciente                | Médico                | Motivo            | Observaciones      | Estado      | Costo (S/.) |
|----------------------|-------------------------|-----------------------|-------------------|--------------------|-------------|-------------|
@foreach ($citas as $cita)
| {{ $cita['fecha'] }} | {{ $cita['paciente'] }} | {{ $cita['medico'] }} | {{ $cita['motivo'] ? ucfirst(mb_strimwidth($cita['motivo'], 0, 20, '...')) : 'N/A' }} | {{ $cita['observaciones'] ? wordwrap($cita['observaciones'], 25, true) : 'N/A' }} | {{ ucfirst($cita['estado']) }} | {{ number_format($cita['cotizacion'] ?? 0, 2) }} |
@endforeach
@endcomponent

**Total cotización:** S/. {{ $total_cotizacion }}

@component('mail::button', ['url' => url('/citas'), 'color' => 'primary'])
Ver Citas en el Sistema
@endcomponent

<small>Se adjunta un archivo Excel con el detalle completo de las citas.</small>

Gracias,<br>
Visual Ophthalmics
@endcomponent