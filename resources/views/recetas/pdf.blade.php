<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Receta Médica</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; }
        .header img { max-width: 150px; }
        .title { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
        .patient-info { margin-bottom: 20px; }
        .section { margin-bottom: 15px; }
        .section-title { font-weight: bold; margin-bottom: 5px; }
        .footer { margin-top: 40px; text-align: right; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        table, th, td { border: 1px solid #ddd; }
        th, td { padding: 8px; text-align: left; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">RECETA MÉDICA</div>
        <div>N° {{ $codigoReceta }}</div>
    </div>

    <div class="patient-info">
        <div class="section">
            <span class="section-title">Paciente:</span>
            {{ $paciente->nombres }} {{ $paciente->apellido_paterno }} {{ $paciente->apellido_materno }}
        </div>
        <div class="section">
            <span class="section-title">DNI:</span>
            {{ $paciente->dni }}
        </div>
        <div class="section">
            <span class="section-title">Fecha:</span>
            {{ $fechaActual }}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Diagnóstico:</div>
        <div>{{ $receta->diagnostico }}</div>
    </div>

    <div class="section">
    <div class="section-title">Medicamentos:</div>
    @if(!empty($medicamentos))
        <table>
            <thead>
                <tr>
                    <th>Medicamento</th>
                    <th>Dosis</th>
                    <th>Frecuencia</th>
                    <th>Duración</th>
                </tr>
            </thead>
            <tbody>
                @foreach($medicamentos as $med)
                <tr>
                    <td>{{ $med['nombre'] ?? 'N/A' }}</td>
                    <td>{{ $med['dosis'] ?? 'N/A' }}</td>
                    <td>{{ $med['frecuencia'] ?? 'N/A' }}</td>
                    <td>{{ $med['duracion'] ?? 'N/A' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No se especificaron medicamentos</p>
    @endif
</div>

    @if($receta->indicaciones_generales)
    <div class="section">
        <div class="section-title">Indicaciones Generales:</div>
        <div>{{ $receta->indicaciones_generales }}</div>
    </div>
    @endif

    <div class="footer">
        <div style="margin-top: 50px;">__________________________</div>
    </div>
</body>
</html>