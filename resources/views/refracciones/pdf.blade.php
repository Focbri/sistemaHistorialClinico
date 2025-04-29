<!-- resources/views/refracciones/pdf.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Examen de Refracción</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 20px; }
        .title { font-size: 18px; font-weight: bold; }
        .patient-info { margin-bottom: 15px; }
        .section { margin: 15px 0; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .section-title { font-weight: bold; margin-bottom: 5px; }
        .exam-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .exam-table th, .exam-table td { border: 1px solid #ddd; padding: 8px; text-align: center; }
        .footer { margin-top: 30px; text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">EXAMEN DE REFRACCIÓN</div>
        <div>Código: {{ $codigoRefraccion }}</div>
    </div>

    <div class="patient-info">
        <p><strong>Paciente:</strong> {{ $paciente->nombres }} {{ $paciente->apellido_paterno }} {{ $paciente->apellido_materno }}</p>
        <p><strong>DNI:</strong> {{ $paciente->dni }}</p>
        <p><strong>Fecha:</strong> {{ $fechaActual }}</p>
    </div>

    <!-- Refracción para Distancia -->
    <div class="section">
        <div class="section-title">Refracción - Distancia</div>
        <table class="exam-table">
            <thead>
                <tr>
                    <th></th>
                    <th>Esfera</th>
                    <th>Cilindro</th>
                    <th>Eje</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>OD</td>
                    <td>{{ $refraccion->distancia_esfera_od ?? '-' }}</td>
                    <td>{{ $refraccion->distancia_cilindro_od ?? '-' }}</td>
                    <td>{{ $refraccion->distancia_eje_od ?? '-' }}</td>
                </tr>
                <tr>
                    <td>OI</td>
                    <td>{{ $refraccion->distancia_esfera_oi ?? '-' }}</td>
                    <td>{{ $refraccion->distancia_cilindro_oi ?? '-' }}</td>
                    <td>{{ $refraccion->distancia_eje_oi ?? '-' }}</td>
                </tr>
            </tbody>
        </table>
        <p><strong>DIP:</strong> {{ $refraccion->distancia_dip ?? '-' }}</p>
    </div>

    <!-- Refracción para Cerca (si existe) -->
    @if($refraccion->cerca_esfera_od || $refraccion->cerca_esfera_oi)
    <div class="section">
        <div class="section-title">Refracción - Cerca</div>
        <table class="exam-table">
            <thead>
                <tr>
                    <th></th>
                    <th>Esfera</th>
                    <th>Cilindro</th>
                    <th>Eje</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>OD</td>
                    <td>{{ $refraccion->cerca_esfera_od ?? '-' }}</td>
                    <td>{{ $refraccion->cerca_cilindro_od ?? '-' }}</td>
                    <td>{{ $refraccion->cerca_eje_od ?? '-' }}</td>
                </tr>
                <tr>
                    <td>OI</td>
                    <td>{{ $refraccion->cerca_esfera_oi ?? '-' }}</td>
                    <td>{{ $refraccion->cerca_cilindro_oi ?? '-' }}</td>
                    <td>{{ $refraccion->cerca_eje_oi ?? '-' }}</td>
                </tr>
            </tbody>
        </table>
        <p><strong>DIP:</strong> {{ $refraccion->cerca_dip ?? '-' }}</p>
        <p><strong>Adición para cerca:</strong> {{ $refraccion->adicion_cerca ?? '-' }}</p>
    </div>
    @endif

    <!-- Instrucciones -->
    @if($refraccion->instrucciones)
    <div class="section">
        <div class="section-title">Instrucciones</div>
        <p>{{ $refraccion->instrucciones }}</p>
    </div>
    @endif

    <div class="footer">
        <p>_________________________________</p>
        <p>Firma del Especialista</p>
    </div>
</body>
</html>