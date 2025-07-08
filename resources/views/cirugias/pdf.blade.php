<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte de Cirugía</title>
    <style>
        @page {
            margin: 1cm;
            size: A4 portrait;
        }
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.3;
            margin: 0;
            padding: 0 10px 60px;
            font-size: 10pt; /* Tamaño base */
            color: #333;
        }
        .header { 
            margin-bottom: 8px;
            border-bottom: 2px solid #0066cc;
            padding-bottom: 5px;
        }
        .title { 
            font-size: 12pt; /* Título principal */
            font-weight: bold;
            margin: 0;
            color: #0066cc;
            text-align: center;
        }
        .section { 
            margin-bottom: 10px; 
        }
        .section-title { 
            font-weight: bold; 
            color: #0066cc;
            border-bottom: 1px solid #0066cc;
            display: inline-block;
            margin-bottom: 8px;
            padding-bottom: 1px;
            font-size: 11pt; /* Títulos de sección */
            margin-top: 10px;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 5px 0;
            font-size: 9.5pt; /* Tablas más compactas */
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 5px; 
            text-align: left; 
            vertical-align: top;
        }
        .table-header th {
            background-color: #f0f8ff;
            font-weight: bold;
            color: #0066cc;
            vertical-align: middle;
            font-size: 9.5pt;
        }
        .footer-info {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 6px 0;
            background-color: #f8f8f8;
            border-top: 1px solid #ddd;
            font-size: 8.5pt; /* Footer más pequeño */
            text-align: center;
        }
        .signature {
            margin-top: 80px;
            text-align: right;
        }
        .text-box {
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 8px;
            min-height: 200px;
            font-size: 9.5pt; /* Texto contenido */
            line-height: 1.4;
        }
        .text-box-h {
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 8px;
            font-size: 9.5pt; /* Texto contenido */
            line-height: 1.4;
        }
        .logo {
            height: 50px;
        }
        .highlight {
            background-color: #f0f8ff;
            padding: 2px 4px;
            border-radius: 2px;
            border: 1px solid #d0e0f0;
            font-size: 9.5pt;
        }
        .data-label {
            font-weight: bold;
            color: #555;
            font-size: 9.5pt;
        }
        .surgical-info {
            font-size: 9.5pt;
        }
        .signature-line {
            border-top: 1px solid #0066cc;
            width: 250px;
            margin-left: auto;
        }
        .signature-name {
            font-size: 9.5pt;
            color: #666;
            margin: 3px 0 0 0;
        }
        .signature-title {
            font-size: 8.5pt;
            color: #999;
            margin: 0;
        }
        
        /* Estructuras tipo flexbox compatibles con dompdf */
        .flex-container {
            display: table;
            width: 100%;
        }
        .flex-item {
            display: table-cell;
            vertical-align: middle;
        }
        .left-align {
            text-align: left;
        }
        .right-align {
            text-align: right;
        }


         .patient-data-table {
            width: 100%;
            border-collapse: collapse;
        }
        .patient-data-table td {
            padding: 3px 0;
            vertical-align: top;
            border: none;
        }
        .patient-data-row {
            display: table;
            width: 100%;
        }
        .patient-data-label {
            width: 12%;
            font-weight: bold;
            color: #555;
            font-size: 9.5pt;
            display: table-cell;
        }
        .patient-data-value {
            width: 38%;
            font-size: 9.5pt;
            display: table-cell;
        }
        
        @media print {
            body {
                padding: 0 10px 60px;
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
        <table style="border: none;">
            <tr>
                <td style="width: 25%; text-align: left; border: none; vertical-align: middle;">
                    <img src="{{ public_path('img/logoVisualOsf.png') }}" alt="Logo" class="logo">
                </td>
                <td style="width: 50%; text-align: center; border: none; vertical-align: middle;">
                    <h1 class="title">INFORME OPERATORIO</h1>
                </td>
                <td style="width: 25%; text-align: right; border: none; vertical-align: middle;">
                    <span class="highlight">Fecha: {{ \Carbon\Carbon::parse($cirugia->created_at)->format('d/m/Y') }}</span>
                </td>
            </tr>
        </table>
    </div>

    <!-- Información del paciente -->
    <!-- Información del paciente - Versión corregida -->
    <div class="section">
        <table class="patient-data-table">
            <!-- Fila 1: Paciente y H. Clínica -->
            <tr>
                <td>
                    <div class="patient-data-row">
                        <span class="patient-data-label">Paciente:</span>
                        <span class="patient-data-value">{{ $cirugia->paciente->apellido_paterno }} {{ $cirugia->paciente->apellido_materno }}, {{ $cirugia->paciente->nombres }}</span>
                        <span class="patient-data-label">H. Clínica:</span>
                        <span class="patient-data-value">{{ $cirugia->codigo_historial }}</span>
                    </div>
                </td>
            </tr>
            <!-- Fila 2: Edad y DNI -->
            <tr>
                <td>
                    <div class="patient-data-row">
                        <span class="patient-data-label">Edad:</span>
                        <span class="patient-data-value">{{ $cirugia->paciente->edad }} años</span>
                        <span class="patient-data-label">DNI:</span>
                        <span class="patient-data-value">{{ $cirugia->paciente->dni }}</span>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Datos de la cirugía -->
    <div class="section">
        <div class="flex-container">
            <div class="flex-item left-align">
                <div class="section-title">Datos Quirúrgicos</div>
            </div>
            <div class="flex-item right-align">
                <span class="highlight">{{ date('d/m/Y', strtotime($cirugia->fecha_cirugia)) }}</span>
                <span style="margin: 0 5px;">|</span>
                <span class="highlight">{{ date('H:i', strtotime($cirugia->hora_inicio)) }} - {{ date('H:i', strtotime($cirugia->hora_fin)) }}</span>
            </div>
        </div>
        
        <table class="table-header">
            <tr>
                <th style="width: 30%;">Cirugía</th>
                <th style="width: 35%;">Diagnóstico Pre-operatorio</th>
                <th style="width: 35%;">Diagnóstico Post-operatorio</th>
            </tr>
            <tr>
                <td class="surgical-info">{{ $cirugia->cirugia }}</td>
                <td class="surgical-info">{{ $cirugia->diagnostico_preoperatorio }}</td>
                <td class="surgical-info">{{ $cirugia->diagnostico_postoperatorio ?? 'N/A' }}</td>
            </tr>
        </table>
    </div>

    <!-- Equipo quirúrgico -->
    <div class="section">
        <div class="section-title">Equipo Quirúrgico</div>
        <table class="table-header">
            <tr>
                <th style="width: 25%;">Rol</th>
                <th style="width: 25%;">Nombre</th>
                <th style="width: 25%;">Rol</th>
                <th style="width: 25%;">Detalle</th>
            </tr>
            <tr>
                <td><strong>Cirujano Principal</strong></td>
                <td class="surgical-info">{{ $cirugia->cirujano_principal }}</td>
                <td><strong>Anestesista</strong></td>
                <td class="surgical-info">{{ $cirugia->anestesiologo }}</td>
            </tr>
            <tr>
                <td><strong>Cirujano Ayudante</strong></td>
                <td class="surgical-info">{{ $cirugia->cirujano_ayudante ?? 'N/A' }}</td>
                <td><strong>Tipo Anestesia</strong></td>
                <td class="surgical-info">{{ $cirugia->tipo_anestesia ?? 'N/A' }}</td>
            </tr>
            @if(!empty($personalEnfermeria))
            <tr>
                <td colspan="4" class="surgical-info">
                    <strong style="margin-right: 4px;">Personal de Enfermería:</strong> 
                    @foreach($personalEnfermeria as $enfermero)
                    {{ $enfermero }} &nbsp;
                    @endforeach
                </td>
            </tr>
            @endif
        </table>
    </div>

    <!-- Hallazgos y procedimiento -->
    <div class="section">
        <div class="section-title">Hallazgos</div>
        <div class="text-box-h">
            {{ $cirugia->hallazgos }}
        </div>
        
        <div class="section-title">Procedimiento</div>
        <div class="text-box">
            {{ $cirugia->procedimiento }}
        </div>
    </div>

    <!-- Firma -->
    <div class="signature">
        <div class="signature-line"></div>
        <p class="signature-name">Lic. {{ $cirugia->cirujano_principal }}</p>
        <p class="signature-title">Médico Cirujano</p>
    </div>

    <!-- Información de contacto (footer) -->
    <div class="footer-info">
        <span>
            <img src="{{ public_path('img/ubicacion.png') }}" alt="Ubicación" style="width: 10px; height: 10px; vertical-align: middle;">
            Av Gral José María Egúsquiza, Córdova 835
        </span>
        <span style="margin: 0 8px; color: #ccc;">|</span>
        <span>
            <img src="{{ public_path('img/phone.png') }}" alt="Teléfono" style="width: 10px; height: 10px; vertical-align: middle;">
            +51 999 495 085
        </span>
    </div>
</body>
</html>