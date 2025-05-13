<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Examen de Refracción</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            padding: 15px;
        }
        .header {
            text-align: center;
            margin-bottom: 15px;
        }
        .header h1 {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
            text-transform: uppercase;
        }
        .patient-info {
            margin-bottom: 15px;
        }
        .patient-info p {
            margin: 3px 0;
        }
        .exam-container {
            display: flex;
            margin-bottom: 15px;
            gap: 15px;
        }
        .exam-column {
            flex: 1;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 5px;
        }
        .exam-title {
            font-weight: bold;
            text-align: center;
            margin-bottom: 10px;
            text-transform: uppercase;
            font-size: 13px;
        }
        .exam-subtitle {
            font-weight: bold;
            margin: 8px 0 5px;
            text-transform: uppercase;
            font-size: 12px;
        }
        .exam-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 5px;
            margin-bottom: 8px;
        }
        .grid-header {
            font-weight: bold;
            text-align: center;
            padding: 3px;
            background-color: #f5f5f5;
        }
        .grid-cell {
            text-align: center;
            padding: 3px;
            border: 1px solid #eee;
        }
        .dip-field {
            margin-top: 5px;
            font-weight: bold;
        }
        .notes-section {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 15px;
        }
        .notes-box {
            border: 1px solid #ddd;
            padding: 8px;
            border-radius: 5px;
            min-height: 60px;
        }
        .notes-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .footer {
            margin-top: 20px;
            text-align: right;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Examen de Refracción</h1>
        <p>Código: {{ $codigoRefraccion }} | Fecha: {{ $fechaActual }}</p>
    </div>

    <div class="patient-info">
        <p><strong>Paciente:</strong> {{ $paciente->nombres }} {{ $paciente->apellido_paterno }} {{ $paciente->apellido_materno }}</p>
        <p><strong>DNI:</strong> {{ $paciente->dni }} | <strong>Edad:</strong> {{ \Carbon\Carbon::parse($paciente->fecha_nacimiento)->age }} años</p>
    </div>

    <div class="exam-container">
        <!-- Columna Examen Previo -->
        <div class="exam-column">
            <div class="exam-title">Examen Previo</div>
            
            <div class="exam-subtitle">Distancia</div>
            <div class="exam-grid">
                <div class="grid-header"></div>
                <div class="grid-header">Esfera</div>
                <div class="grid-header">Cilindro</div>
                <div class="grid-header">Eje</div>
                
                <div class="grid-cell">OD</div>
                <div class="grid-cell">{{ $refraccion->exam_old_distancia_esfera_od ?? '-' }}</div>
                <div class="grid-cell">{{ $refraccion->exam_old_distancia_cilindro_od ?? '-' }}</div>
                <div class="grid-cell">{{ $refraccion->exam_old_distancia_eje_od ?? '-' }}</div>
                
                <div class="grid-cell">OI</div>
                <div class="grid-cell">{{ $refraccion->exam_old_distancia_esfera_oi ?? '-' }}</div>
                <div class="grid-cell">{{ $refraccion->exam_old_distancia_cilindro_oi ?? '-' }}</div>
                <div class="grid-cell">{{ $refraccion->exam_old_distancia_eje_oi ?? '-' }}</div>
            </div>
            <div class="dip-field">DIP: {{ $refraccion->exam_old_distancia_dip ?? '-' }}</div>

            @if($refraccion->exam_old_cerca_esfera_od || $refraccion->exam_old_cerca_esfera_oi || 
            $refraccion->exam_old_cerca_cilindro_od || $refraccion->exam_old_cerca_cilindro_oi ||
            $refraccion->exam_old_cerca_eje_od || $refraccion->exam_old_cerca_eje_oi ||
            $refraccion->exam_old_cerca_dip)
        <div class="exam-subtitle">Cerca</div>
            <div class="exam-grid">
                <div class="grid-header"></div>
                <div class="grid-header">Esfera</div>
                <div class="grid-header">Cilindro</div>
                <div class="grid-header">Eje</div>
                
                <div class="grid-cell">OD</div>
                <div class="grid-cell">{{ $refraccion->exam_old_cerca_esfera_od ?? '-' }}</div>
                <div class="grid-cell">{{ $refraccion->exam_old_cerca_cilindro_od ?? '-' }}</div>
                <div class="grid-cell">{{ $refraccion->exam_old_cerca_eje_od ?? '-' }}</div>
                
                <div class="grid-cell">OI</div>
                <div class="grid-cell">{{ $refraccion->exam_old_cerca_esfera_oi ?? '-' }}</div>
                <div class="grid-cell">{{ $refraccion->exam_old_cerca_cilindro_oi ?? '-' }}</div>
                <div class="grid-cell">{{ $refraccion->exam_old_cerca_eje_oi ?? '-' }}</div>
            </div>
            <div class="dip-field">DIP: {{ $refraccion->exam_old_cerca_dip ?? '-' }}</div>
            @endif
        </div>

        <!-- Columna Examen Actual -->
        <div class="exam-column">
            <div class="exam-title">Examen Actual</div>
            
            <div class="exam-subtitle">Distancia</div>
            <div class="exam-grid">
                <div class="grid-header"></div>
                <div class="grid-header">Esfera</div>
                <div class="grid-header">Cilindro</div>
                <div class="grid-header">Eje</div>
                
                <div class="grid-cell">OD</div>
                <div class="grid-cell">{{ $refraccion->exam_new_distancia_esfera_od ?? '-' }}</div>
                <div class="grid-cell">{{ $refraccion->exam_new_distancia_cilindro_od ?? '-' }}</div>
                <div class="grid-cell">{{ $refraccion->exam_new_distancia_eje_od ?? '-' }}</div>
                
                <div class="grid-cell">OI</div>
                <div class="grid-cell">{{ $refraccion->exam_new_distancia_esfera_oi ?? '-' }}</div>
                <div class="grid-cell">{{ $refraccion->exam_new_distancia_cilindro_oi ?? '-' }}</div>
                <div class="grid-cell">{{ $refraccion->exam_new_distancia_eje_oi ?? '-' }}</div>
            </div>
            <div class="dip-field">DIP: {{ $refraccion->exam_new_distancia_dip ?? '-' }}</div>

            @if($refraccion->exam_new_cerca_esfera_od || $refraccion->exam_new_cerca_esfera_oi || 
            $refraccion->exam_new_cerca_cilindro_od || $refraccion->exam_new_cerca_cilindro_oi ||
            $refraccion->exam_new_cerca_eje_od || $refraccion->exam_new_cerca_eje_oi ||
            $refraccion->exam_new_cerca_dip)
        <div class="exam-subtitle">Cerca</div>
            <div class="exam-grid">
                <div class="grid-header"></div>
                <div class="grid-header">Esfera</div>
                <div class="grid-header">Cilindro</div>
                <div class="grid-header">Eje</div>
                
                <div class="grid-cell">OD</div>
                <div class="grid-cell">{{ $refraccion->exam_new_cerca_esfera_od ?? '-' }}</div>
                <div class="grid-cell">{{ $refraccion->exam_new_cerca_cilindro_od ?? '-' }}</div>
                <div class="grid-cell">{{ $refraccion->exam_new_cerca_eje_od ?? '-' }}</div>
                
                <div class="grid-cell">OI</div>
                <div class="grid-cell">{{ $refraccion->exam_new_cerca_esfera_oi ?? '-' }}</div>
                <div class="grid-cell">{{ $refraccion->exam_new_cerca_cilindro_oi ?? '-' }}</div>
                <div class="grid-cell">{{ $refraccion->exam_new_cerca_eje_oi ?? '-' }}</div>
            </div>
            <div class="dip-field">DIP: {{ $refraccion->exam_new_cerca_dip ?? '-' }}</div>
            @endif
        </div>
    </div>

    <div class="notes-section">
        <div class="notes-box">
            <div class="notes-title">Instrucciones</div>
            <div>{{ $refraccion->instrucciones ?? 'Ninguna' }}</div>
        </div>
        <div class="notes-box">
            <div class="notes-title">Adiciones</div>
            <div>{{ $refraccion->adiciones ?? 'Ninguna' }}</div>
        </div>
    </div>

    <div class="footer">
        <p>____________________________</p>
        <p>Firma del Especialista</p>
    </div>
</body>
</html>