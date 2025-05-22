<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Receta Médica</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; }
        .patient-info { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .section-title { font-weight: bold; margin-bottom: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>RECETA MÉDICA</h2>
        <p>N° {{ $codigoReceta }}</p>
    </div>

    <div class="patient-info">
        <div><span class="section-title">Paciente:</span> {{ $paciente->nombres }} {{ $paciente->apellido_paterno }} {{ $paciente->apellido_materno }}</div>
        <div><span class="section-title">DNI:</span> {{ $paciente->dni }}</div>
        <div><span class="section-title">Fecha:</span> {{ $fechaActual }}</div>
    </div>

    @if(!empty($cie10Codes) && count($cie10Codes) > 0)
    <div class="section">
        <div class="section-title">Diagnóstico:</div>
        <ul>
            @foreach($cie10Codes as $code)
                <li>{{ $code }}</li>
            @endforeach
        </ul>
    </div>
    @endif

    <!-- Sección de Medicamentos -->
<div class="section">
    <div class="section-title">Medicamentos:</div>
    
    @if(count($medicamentos) > 0)
    <table class="table-medicamentos">
        <thead>
            <tr>
                <th>Medicamento</th>
                <th>Cantidad</th>
                <th>Dosis</th>
                <th>Frecuencia</th>
                <th>Duración</th>
            </tr>
        </thead>
        <tbody>
           @foreach($medicamentos as $medicamento)
            <tr>
                <td class="border px-4 py-2">{{ $medicamento['nombre_comercial'] }}</td>
                <td class="border px-4 py-2">{{ $medicamento['cantidad'] }}</td>
                <td class="border px-4 py-2">{{ $medicamento['dosis'] }}</td>
                <td class="border px-4 py-2">{{ $medicamento['frecuencia'] }}</td>
                <td class="border px-4 py-2">{{ $medicamento['duracion'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <p class="no-medicamentos">No se prescribieron medicamentos.</p>
    @endif
</div>

    @if($receta->indicaciones_generales)
    <div class="section">
        <div class="section-title">Indicaciones Generales:</div>
        <div>{{ $receta->indicaciones_generales }}</div>
    </div>
    @endif

    <div style="margin-top: 50px; text-align: right;">
        <div>__________________________</div>
        <div>{{ $medico->name ?? 'Médico' }}</div>
        <div>Lic. Médico Cirujano</div>
    </div>
</body>
</html>