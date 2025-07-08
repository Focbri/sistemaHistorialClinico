<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Receta Médica</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.4;
            margin: 0;
            padding: 0 10px 80px 10px;
            font-size: 10pt; /* Tamaño base */
        }
        .header { 
            margin-bottom: 15px; 
        }
        .patient-info { 
            margin-bottom: 15px; 
            font-size: 10pt;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 8px 0;
            font-size: 9.5pt; /* Tablas más compactas */
        }
        th, td { 
            border: 1px solid #000000; 
            padding: 6px 5px; /* Padding reducido */
            text-align: left; 
            vertical-align: top;
        }
        .section-title { 
            font-weight: bold; 
            color: #000000;
            border-bottom: 2px solid #000000;
            display: inline-block;
            margin-bottom: 5px;
            padding-bottom: 2px;
            font-size: 11pt; /* Títulos de sección */
        }
        .table-medicamentos th {
            background-color: #f2f2f2;
            font-weight: bold;
            font-size: 9.5pt; /* Encabezados de tabla */
        }
        .footer-info {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 8px 0;
            background-color: white;
            border-top: 1px solid #ddd;
            font-size: 8.5pt; /* Footer más pequeño */
        }
        .firma-container {
            margin-top: 96px;
            text-align: right;
        }
        .linea-firma {
            border-top: 1px solid #000;
            display: inline-block;
            width: 200px;
            margin-bottom: 3px;
        }
        .info-medicamento {
            font-size: 9.5pt; /* Nombre medicamento */
            margin: 0 0 1px 0;
            line-height: 1.3;
            font-weight: bold;
        }
        .componente-activo {
            font-size: 8.5pt; /* Componente activo */
            margin: 0;
            line-height: 1.3;
            color: #555;
        }
        .diagnostico-item {
            font-size: 9.5pt;
            margin-bottom: 2px;
        }
        .indicaciones-text {
            font-size: 9.5pt;
            padding: 5px 0 0 5px;
        }
        .logo {
            max-width: 150px;
            max-height: 70px;
        }
        .titulo-principal {
            font-size: 12pt; /* Título principal */
            margin: 0;
            font-weight: bold;
        }
        .fecha {
            font-size: 9pt;
        }
        .no-medicamentos {
            font-style: italic;
            font-size: 9.5pt;
        }
        
        /* Estilos para datos paciente */
        .dato-paciente {
            font-size: 9.5pt;
            vertical-align: top;
        }
        .etiqueta-paciente {
            font-weight: bold;
            width: 100px;
            display: inline-block;
            font-size: 9.5pt;
        }
        
        @media print {
            body {
                padding: 0 10px 70px 10px;
                font-size: 10pt;
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
                <td style="width: 30%; text-align: left; border: none; vertical-align: middle;">
                    <img src="{{ public_path('img/logoVisualOsf.png') }}" alt="Logo" class="logo">
                </td>
                <td style="width: 40%; text-align: center; border: none; vertical-align: middle;">
                    <h2 class="titulo-principal">RECETA MÉDICA</h2>
                </td>
                <td style="width: 30%; text-align: right; border: none; vertical-align: middle;">
                    <p class="fecha">
                        Fecha: {{ \Carbon\Carbon::parse($receta['created_at'])->format('d/m/Y') }}
                    </p>
                </td>
            </tr>
        </table>
    </div>

    <!-- Información del paciente -->
    <div class="patient-info">
        <table style="border: none;">
            <tr>
                <td style="border: none; padding: 2px 5px 2px 0; width: 100px; vertical-align: top;">
                    <span class="etiqueta-paciente">Paciente:</span>
                </td>
                <td style="border: none; padding: 2px 0; vertical-align: top;" class="dato-paciente">
                    {{ $paciente->nombres }} {{ $paciente->apellido_paterno }} {{ $paciente->apellido_materno }}
                </td>
            </tr>
            <tr>
                <td style="border: none; padding: 2px 5px 2px 0; vertical-align: top;">
                    <span class="etiqueta-paciente">DNI:</span>
                </td>
                <td style="border: none; padding: 2px 0; vertical-align: top;" class="dato-paciente">
                    {{ $paciente->dni }}
                </td>
            </tr>
            <tr>
                <td style="border: none; padding: 2px 5px 2px 0; vertical-align: top;">
                    <span class="etiqueta-paciente">Edad:</span>
                </td>
                <td style="border: none; padding: 2px 0; vertical-align: top;" class="dato-paciente">
                    {{ $paciente->edad }} años
                </td>
            </tr>
            <tr>
                <td style="border: none; padding: 2px 5px 2px 0; vertical-align: top;">
                    <span class="etiqueta-paciente">N° Historia:</span>
                </td>
                <td style="border: none; padding: 2px 0; vertical-align: top;" class="dato-paciente">
                    {{ $paciente->codigo_historial }}
                </td>
            </tr>
        </table>
    </div>

    <!-- Diagnóstico -->
    @if(!empty($cie10Codes) && count($cie10Codes) > 0)
    <div class="section">
        <div class="section-title">Diagnóstico:</div>
        <ul style="list-style-type: none; padding-left: 5px; margin: 3px 0;">
            @foreach($cie10Codes as $code)
                <li class="diagnostico-item">• {{ $code }}</li>
            @endforeach
        </ul>
    </div>
    @endif

    <!-- Medicamentos -->
    <div class="section">    
        @if(count($medicamentos) > 0)
        <div class="section-title">Medicamentos:</div>
        <table class="table-medicamentos">
            <thead>
                <tr>
                    <th style="width: 35%;">Medicamento</th>
                    <th style="width: 15%;">Cantidad</th>
                    <th style="width: 15%;">Dosis</th>
                    <th style="width: 15%;">Frecuencia</th>
                    <th style="width: 20%;">Duración</th>
                </tr>
            </thead>
            <tbody>
                @foreach($medicamentos as $medicamento)
                <tr>
                    <td>
                        <div class="info-medicamento">{{ $medicamento['nombre_comercial'] }}</div>
                        <div class="componente-activo">{{ $medicamento['componente_activo'] }}</div>
                    </td>
                    <td>{{ $medicamento['cantidad'] }}</td>
                    <td>{{ $medicamento['dosis'] }}</td>
                    <td>{{ $medicamento['frecuencia'] }}</td>
                    <td>{{ $medicamento['duracion'] }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @else
        <p class="no-medicamentos">No se prescribieron medicamentos.</p>
        @endif
    </div>

    <!-- Indicaciones generales -->
    @if($receta->indicaciones_generales)
    <div class="section">
        <div class="section-title">Indicaciones Generales:</div>
        <div class="indicaciones-text">
            {{ $receta->indicaciones_generales }}
        </div>
    </div>
    @endif

    <!-- Firma -->
    <div class="firma-container">
        <div class="linea-firma"></div>
        <p style="margin: 3px 0 0 0; font-size: 9.5pt;">Lic. Médico</p>
    </div>

    <!-- Información de contacto (footer) -->
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