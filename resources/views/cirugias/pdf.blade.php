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
            line-height: 1.25;
            margin: 0;
            padding: 0 10px 60px;
            font-size: 11pt;
            color: #333;
        }
        .header { 
            margin-bottom: 8px;
            border-bottom: 2px solid #0066cc;
            padding-bottom: 5px;
        }
        .title { 
            font-size: 14pt; 
            font-weight: bold;
            margin: 0;
            color: #0066cc;
            text-align: center;
        }
        .section { 
            margin-bottom: 8px; 
        }
        .section-title { 
            font-weight: bold; 
            color: #0066cc;
            border-bottom: 1px solid #0066cc;
            display: inline-block;
            margin-bottom: 8px;
            padding-bottom: 1px;
            font-size: 12pt;
            margin-top: 10px;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 4px 0;
            font-size: 10pt;
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 6px 5px; 
            text-align: left; 
            vertical-align: top;
        }
        .table-header th {
            background-color: #f0f8ff;
            font-weight: bold;
            color: #0066cc;
            vertical-align: middle;
        }
        .footer-info {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 6px 0;
            background-color: #f8f8f8;
            border-top: 1px solid #ddd;
            font-size: 9pt;
            text-align: center;
        }
        .signature {
            margin-top: 12px;
            text-align: right;
        }
        .compact-text {
            font-size: 10pt;
            line-height: 1.3;
            padding: 5px;
        }
        .no-border {
            border: none !important;
        }
        .logo {
            height: 50px;
        }
        .text-box {
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 6px;
            min-height: 80px;
            background-color: #f9f9f9;
        }
        .highlight {
            background-color: #fff;;
            padding: 2px 4px;
            border-radius: 2px;
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
                <td style="width: 25%; text-align: right; border: none; vertical-align: middle; font-size: 10pt; background-color: #fff;">
                    <span class="highlight">Fecha: {{ \Carbon\Carbon::parse($cirugia->created_at)->format('d/m/Y') }}</span>
                </td>
            </tr>
        </table>
    </div>

    <!-- Información del paciente -->
    <div class="section">
        <div class="section-title">Datos del Paciente</div>
        <table>
            <tr>
                <td style="width: 15%; border: none;"><strong>Paciente:</strong></td>
                <td style="width: 35%; border: none;">{{ $cirugia->paciente->apellido_paterno }} {{ $cirugia->paciente->apellido_materno }}, {{ $cirugia->paciente->nombres }}</td>
                <td style="width: 15%; border: none;"><strong>H. Clínica:</strong></td>
                <td style="width: 35%; border: none;">{{ $cirugia->codigo_historial }}</td>
            </tr>
        </table>
    </div>

    <!-- Datos de la cirugía -->
    <div class="section">
        <div class="section-title">Datos Quirúrgicos</div>
        <table class="table-header">
            <tr>
                <th style="width: 15%;">Fecha</th>
                <th style="width: 20%;">Horario</th>
                <th style="width: 25%;">Procedimiento</th>
                <th style="width: 20%;">Diagnóstico Pre-operatorio</th>
                <th style="width: 20%;">Diagnóstico Post-operatorio</th>
            </tr>
            <tr>
                <td>{{ date('d/m/Y', strtotime($cirugia->fecha_cirugia)) }}</td>
                <td>{{ date('H:i', strtotime($cirugia->hora_inicio)) }} - {{ date('H:i', strtotime($cirugia->hora_fin)) }}</td>
                <td>{{ $cirugia->cirugia }}</td>
                <td>{{ $cirugia->diagnostico_preoperatorio }}</td>
                <td>{{ $cirugia->diagnostico_postoperatorio ?? 'N/A' }}</td>
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
                <td>{{ $cirugia->cirujano_principal }}</td>
                <td><strong>Anestesista</strong></td>
                <td>{{ $cirugia->anestesiologo }}</td>
            </tr>
            <tr>
                <td><strong>Cirujano Ayudante</strong></td>
                <td>{{ $cirugia->cirujano_ayudante ?? 'N/A' }}</td>
                <td><strong>Tipo Anestesia</strong></td>
                <td>{{ $cirugia->tipo_anestesia ?? 'N/A' }}</td>
            </tr>
            @if(!empty($personalEnfermeria))
            <tr>
                <td colspan="4">
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
        <table class="no-border">
            <tr>
                <td style="width: 50%; vertical-align: top; padding-right: 5px; border: none;">
                    <div class="section-title">Hallazgos</div>
                    <div class="text-box compact-text">
                        {{ $cirugia->hallazgos }}
                    </div>
                </td>
                <td style="width: 50%; vertical-align: top; padding-left: 5px; border: none;">
                    <div class="section-title">Procedimiento</div>
                    <div class="text-box compact-text">
                        {{ $cirugia->procedimiento }}
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Firma -->
    <div class="signature" style="margin-top: 96px;">
        <div style="border-top: 1px solid #0066cc; width: 250px; margin-left: auto;"></div>
        <p style="margin: 3px 0 0 0; font-size: 10pt; color: #666;">Lic. {{ $cirugia->cirujano_principal }}</p>
        <p style="margin: 0; font-size: 9pt; color: #999;">Médico Cirujano</p>
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