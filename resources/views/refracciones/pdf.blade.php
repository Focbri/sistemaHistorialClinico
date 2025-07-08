<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Examen de Refracción</title>
    <style>
        @page {
            margin: 1cm;
            size: A4 portrait;
        }
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.4;
            margin: 0;
            padding: 0 10px 80px;
            font-size: 10pt; /* Tamaño base para el PDF */
            color: #333;
        }
        .header {
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #0066cc;
        }
        .header h1 {
            font-size: 14pt; /* Título principal */
            font-weight: bold;
            margin: 0;
            color: #0066cc;
            text-align: center;
            text-transform: uppercase;
        }
        .patient-info {
            margin-bottom: 15px;
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            border-left: 4px solid #0066cc;
            font-size: 10pt;
        }
        .patient-info strong {
            font-weight: bold;
            color: #555;
            width: 120px;
            display: inline-block;
        }
        .exam-container {
            margin-bottom: 15px;
        }
        .exam-column {
            width: 100%;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 15px;
        }
        .exam-title {
            background-color: #0066cc;
            color: white;
            padding: 8px;
            text-align: center;
            font-weight: bold;
            font-size: 11pt; /* Título de sección */
        }
        .exam-content {
            padding: 12px;
        }
        .exam-subtitle {
            font-weight: bold;
            margin: 12px 0 6px;
            color: #0066cc;
            font-size: 10.5pt; /* Subtítulos */
            border-bottom: 1px dashed #ddd;
            padding-bottom: 3px;
        }
        .exam-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
            font-size: 9.5pt; /* Tablas */
        }
        .exam-table th {
            background-color: #f1f5f9;
            text-align: center;
            padding: 6px;
            font-weight: bold;
            border: 1px solid #dee2e6;
            font-size: 9.5pt;
        }
        .exam-table td {
            text-align: center;
            padding: 6px;
            border: 1px solid #dee2e6;
        }
        .notes-section {
            margin-top: 15px;
        }
        .notes-box {
            border: 1px solid #dee2e6;
            padding: 10px;
            border-radius: 6px;
            min-height: 70px;
            background-color: #f8f9fa;
            margin-bottom: 12px;
            font-size: 9.5pt; /* Notas */
        }
        .notes-title {
            font-weight: bold;
            margin-bottom: 6px;
            color: #0066cc;
            border-bottom: 1px solid #dee2e6;
            padding-bottom: 3px;
            font-size: 10pt;
        }
        .footer-info {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 8px 0;
            background-color: white;
            border-top: 1px solid #ddd;
            font-size: 9pt; /* Footer más pequeño */
            text-align: center;
        }
        .signature-area {
            margin-top: 96px;
            text-align: right;
        }
        .signature-line {
            display: inline-block;
            width: 200px;
            border-top: 1px solid #333;
            margin-bottom: 5px;
        }
        .signature-text {
            font-size: 10pt; /* Texto firma */
            margin: 3px 0 0 0;
        }
        
        /* Estilos específicos para tablas de datos */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 5px 0;
            font-size: 9.5pt;
        }
        .data-table td {
            padding: 5px;
            vertical-align: top;
        }
        .data-label {
            font-weight: bold;
            width: 120px;
            color: #555;
        }
        
        /* Ajustes para impresión */
        @media print {
            body {
                padding: 0 10px 80px;
                font-size: 10pt;
            }
            .exam-column {
                page-break-inside: avoid;
            }
            .footer-info {
                position: fixed;
                bottom: 0;
            }
        }
    </style>
</head>
<body>
    <!-- Encabezado -->
    <div class="header">
        <table class="data-table" style="border: none;">
            <tr>
                <td style="width: 30%; text-align: left; border: none; vertical-align: middle;">
                    <img src="{{ public_path('img/logoVisualOsf.png') }}" alt="Logo" style="max-width: 150px; max-height: 80px;">
                </td>
                <td style="width: 40%; text-align: center; border: none; vertical-align: middle;">
                    <h1>EXAMEN DE REFRACCIÓN</h1>
                </td>
                <td style="width: 30%; text-align: right; border: none; vertical-align: middle;">
                    <span style="font-size: 10pt;">Fecha: {{ \Carbon\Carbon::parse($refraccion->created_at)->format('d/m/Y') }}</span>
                </td>
            </tr>
        </table>
    </div>

    <!-- Información del paciente -->
    <div class="patient-info">
        <table class="data-table" style="border: none;">
            <tr>
                <td class="data-label">Paciente:</td>
                <td>{{ $paciente->nombres }} {{ $paciente->apellido_paterno }} {{ $paciente->apellido_materno }}</td>
                <td class="data-label">N° Historia:</td>
                <td>{{ $paciente->codigo_historial }}</td>
            </tr>
            <tr>
                <td class="data-label">DNI:</td>
                <td>{{ $paciente->dni }}</td>
                <td class="data-label">Edad:</td>
                <td>{{ $paciente->edad }} años</td>
            </tr>
        </table>
    </div>

    @php
        $edadPaciente = is_numeric($paciente->edad) ? (int)$paciente->edad : 0;
        $mostrarCerca = $edadPaciente >= 30;
    @endphp

    <!-- Contenido del examen -->
    <div class="exam-container">
        <div class="exam-column">
            <div class="exam-title">Examen Actual</div>
            <div class="exam-content">
                <div class="exam-subtitle">Distancia</div>
                <table class="exam-table">
                    <thead>
                        <tr>
                            <th style="width: 15%;"></th>
                            <th style="width: 25%;">Esfera</th>
                            <th style="width: 25%;">Cilindro</th>
                            <th style="width: 15%;">Eje</th>
                            <th style="width: 20%;">DIP</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>OD</td>
                            <td>{{ $refraccion->exam_new_distancia_esfera_od ?? '-' }}</td>
                            <td>{{ $refraccion->exam_new_distancia_cilindro_od ?? '-' }}</td>
                            <td>{{ $refraccion->exam_new_distancia_eje_od ?? '-' }}</td>
                            <td rowspan="2">{{ $refraccion->exam_new_distancia_dip ?? '-' }}</td>
                        </tr>
                        <tr>
                            <td>OI</td>
                            <td>{{ $refraccion->exam_new_distancia_esfera_oi ?? '-' }}</td>
                            <td>{{ $refraccion->exam_new_distancia_cilindro_oi ?? '-' }}</td>
                            <td>{{ $refraccion->exam_new_distancia_eje_oi ?? '-' }}</td>
                        </tr>
                    </tbody>
                </table>

                @if($mostrarCerca)
                <div class="exam-subtitle">Cerca</div>
                <table class="exam-table">
                    <thead>
                        <tr>
                            <th style="width: 15%;"></th>
                            <th style="width: 25%;">Esfera</th>
                            <th style="width: 25%;">Cilindro</th>
                            <th style="width: 15%;">Eje</th>
                            <th style="width: 20%;">DIP</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>OD</td>
                            <td>{{ $refraccion->exam_new_cerca_esfera_od ?? '-' }}</td>
                            <td>{{ $refraccion->exam_new_cerca_cilindro_od ?? '-' }}</td>
                            <td>{{ $refraccion->exam_new_cerca_eje_od ?? '-' }}</td>
                            <td rowspan="2">{{ $refraccion->exam_new_cerca_dip ?? '-' }}</td>
                        </tr>
                        <tr>
                            <td>OI</td>
                            <td>{{ $refraccion->exam_new_cerca_esfera_oi ?? '-' }}</td>
                            <td>{{ $refraccion->exam_new_cerca_cilindro_oi ?? '-' }}</td>
                            <td>{{ $refraccion->exam_new_cerca_eje_oi ?? '-' }}</td>
                        </tr>
                    </tbody>
                </table>
                @endif
            </div>
        </div>
    </div>

    <!-- Notas e instrucciones -->
    <div class="notes-section">
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="width: 48%; vertical-align: top; padding-right: 10px;">
                    <div class="notes-box">
                        <div class="notes-title">Instrucciones</div>
                        <div>{{ $refraccion->instrucciones ?? 'Ninguna' }}</div>
                    </div>
                </td>
                <td style="width: 48%; vertical-align: top; padding-left: 10px;">
                    <div class="notes-box">
                        <div class="notes-title">Adiciones</div>
                        <div>{{ $refraccion->adiciones ?? 'Ninguna' }}</div>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Firma -->
    <div class="signature-area">
        <div class="signature-line"></div>
        <p class="signature-text">Lic. Médico</p>
    </div>

    <!-- Footer con información de contacto -->
    <div class="footer-info">
        <table style="border: none; width: 100%;">
            <tr>
                <td style="border: none; text-align: center;">
                    <span>
                        <img src="{{ public_path('img/ubicacion.png') }}" alt="Ubicación" style="width: 12px; height: 12px; vertical-align: middle;">
                        Av Gral José María Egúsquiza, Córdova 835
                    </span>
                    <span style="margin: 0 10px;">|</span>
                    <span>
                        <img src="{{ public_path('img/phone.png') }}" alt="Teléfono" style="width: 12px; height: 12px; vertical-align: middle;">
                        +51 999 495 085
                    </span>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>