<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Examen de Refracción</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.5;
            color: #333;
            padding: 20px;
            max-width: 900px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #0066cc;
        }
        .header h1 {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #0066cc;
            text-transform: uppercase;
        }
        .header p {
            margin: 3px 0;
            color: #666;
        }
        .patient-info {
            margin-bottom: 20px;
            background: #f8f9fa;
            padding: 12px;
            border-radius: 5px;
            border-left: 4px solid #0066cc;
        }
        .patient-info p {
            margin: 5px 0;
            display: flex;
        }
        .patient-info strong {
            min-width: 80px;
            display: inline-block;
            color: #555;
        }
        .exam-container {
            display: flex;
            margin-bottom: 25px;
            gap: 20px;
            flex-wrap: wrap;
        }
        .exam-column {
            flex: 1;
            min-width: 300px;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .exam-title {
            background-color: #0066cc;
            color: white;
            padding: 8px;
            text-align: center;
            font-weight: bold;
            font-size: 13px;
            text-transform: uppercase;
        }
        .exam-content {
            padding: 15px;
        }
        .exam-subtitle {
            font-weight: bold;
            margin: 15px 0 8px;
            color: #0066cc;
            font-size: 12px;
            text-transform: uppercase;
            border-bottom: 1px dashed #ddd;
            padding-bottom: 4px;
        }
        .exam-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }
        .exam-table th {
            background-color: #f1f5f9;
            text-align: center;
            padding: 6px;
            font-weight: bold;
            border: 1px solid #dee2e6;
        }
        .exam-table td {
            text-align: center;
            padding: 6px;
            border: 1px solid #dee2e6;
        }
        .exam-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .dip-field {
            margin-top: 10px;
            font-weight: bold;
            text-align: center;
            padding: 5px;
            background-color: #f1f5f9;
            border-radius: 4px;
        }
        .notes-section {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-top: 20px;
        }
        .notes-box {
            border: 1px solid #dee2e6;
            padding: 12px;
            border-radius: 6px;
            min-height: 80px;
            background-color: #f8f9fa;
        }
        .notes-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #0066cc;
            border-bottom: 1px solid #dee2e6;
            padding-bottom: 4px;
        }
        .footer {
            margin-top: 30px;
            text-align: right;
            padding-top: 15px;
            border-top: 1px solid #dee2e6;
        }
        .footer p {
            margin: 5px 0;
            color: #666;
        }
        .signature-line {
            display: inline-block;
            width: 200px;
            border-top: 1px solid #333;
            margin-top: 30px;
        }
        @media print {
            body {
                padding: 0;
                font-size: 11px;
            }
            .exam-column {
                page-break-inside: avoid;
            }
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
            <div class="exam-content">
                <div class="exam-subtitle">Distancia</div>
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
                            <td>{{ $refraccion->exam_old_distancia_esfera_od ?? '-' }}</td>
                            <td>{{ $refraccion->exam_old_distancia_cilindro_od ?? '-' }}</td>
                            <td>{{ $refraccion->exam_old_distancia_eje_od ?? '-' }}</td>
                        </tr>
                        <tr>
                            <td>OI</td>
                            <td>{{ $refraccion->exam_old_distancia_esfera_oi ?? '-' }}</td>
                            <td>{{ $refraccion->exam_old_distancia_cilindro_oi ?? '-' }}</td>
                            <td>{{ $refraccion->exam_old_distancia_eje_oi ?? '-' }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="dip-field">DIP: {{ $refraccion->exam_old_distancia_dip ?? '-' }}</div>

                @if($refraccion->exam_old_cerca_esfera_od || $refraccion->exam_old_cerca_esfera_oi || 
                $refraccion->exam_old_cerca_cilindro_od || $refraccion->exam_old_cerca_cilindro_oi ||
                $refraccion->exam_old_cerca_eje_od || $refraccion->exam_old_cerca_eje_oi ||
                $refraccion->exam_old_cerca_dip)
                <div class="exam-subtitle">Cerca</div>
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
                            <td>{{ $refraccion->exam_old_cerca_esfera_od ?? '-' }}</td>
                            <td>{{ $refraccion->exam_old_cerca_cilindro_od ?? '-' }}</td>
                            <td>{{ $refraccion->exam_old_cerca_eje_od ?? '-' }}</td>
                        </tr>
                        <tr>
                            <td>OI</td>
                            <td>{{ $refraccion->exam_old_cerca_esfera_oi ?? '-' }}</td>
                            <td>{{ $refraccion->exam_old_cerca_cilindro_oi ?? '-' }}</td>
                            <td>{{ $refraccion->exam_old_cerca_eje_oi ?? '-' }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="dip-field">DIP: {{ $refraccion->exam_old_cerca_dip ?? '-' }}</div>
                @endif
            </div>
        </div>

        <!-- Columna Examen Actual -->
        <div class="exam-column">
            <div class="exam-title">Examen Actual</div>
            <div class="exam-content">
                <div class="exam-subtitle">Distancia</div>
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
                            <td>{{ $refraccion->exam_new_distancia_esfera_od ?? '-' }}</td>
                            <td>{{ $refraccion->exam_new_distancia_cilindro_od ?? '-' }}</td>
                            <td>{{ $refraccion->exam_new_distancia_eje_od ?? '-' }}</td>
                        </tr>
                        <tr>
                            <td>OI</td>
                            <td>{{ $refraccion->exam_new_distancia_esfera_oi ?? '-' }}</td>
                            <td>{{ $refraccion->exam_new_distancia_cilindro_oi ?? '-' }}</td>
                            <td>{{ $refraccion->exam_new_distancia_eje_oi ?? '-' }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="dip-field">DIP: {{ $refraccion->exam_new_distancia_dip ?? '-' }}</div>

                @if($refraccion->exam_new_cerca_esfera_od || $refraccion->exam_new_cerca_esfera_oi || 
                $refraccion->exam_new_cerca_cilindro_od || $refraccion->exam_new_cerca_cilindro_oi ||
                $refraccion->exam_new_cerca_eje_od || $refraccion->exam_new_cerca_eje_oi ||
                $refraccion->exam_new_cerca_dip)
                <div class="exam-subtitle">Cerca</div>
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
                            <td>{{ $refraccion->exam_new_cerca_esfera_od ?? '-' }}</td>
                            <td>{{ $refraccion->exam_new_cerca_cilindro_od ?? '-' }}</td>
                            <td>{{ $refraccion->exam_new_cerca_eje_od ?? '-' }}</td>
                        </tr>
                        <tr>
                            <td>OI</td>
                            <td>{{ $refraccion->exam_new_cerca_esfera_oi ?? '-' }}</td>
                            <td>{{ $refraccion->exam_new_cerca_cilindro_oi ?? '-' }}</td>
                            <td>{{ $refraccion->exam_new_cerca_eje_oi ?? '-' }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="dip-field">DIP: {{ $refraccion->exam_new_cerca_dip ?? '-' }}</div>
                @endif
            </div>
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
        <div class="signature-line"></div>
        <p>Firma del Especialista</p>
    </div>
</body>
</html>