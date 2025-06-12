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
            padding: 0 10px 80px 10px; /* Espacio para el footer */
        }
        .header { margin-bottom: 20px; }
        .patient-info { margin-bottom: 15px; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #000000; padding: 8px; text-align: left; }
        .section-title { 
            font-weight: bold; 
            color: #000000;
            border-bottom: 2px solid #000000;
            display: inline-block;
            margin-bottom: 5px;
            padding-bottom: 2px;
            width: auto;
        }
        .table-medicamentos th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .footer-info {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 10px 0;
            background-color: white;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <!-- Encabezado -->
    <div class="header">
        <table style="border: none;">
            <tr>
                <td style="width: 30%; text-align: left; border: none; vertical-align: middle;">
                    <img src="{{ public_path('img/logoVisualOsf.png') }}" alt="Logo" style="max-width: 150px; max-height: 80px;">
                </td>
                <td style="width: 40%; text-align: center; border: none; vertical-align: middle;">
                    <h2 style="margin: 0;">RECETA MÉDICA</h2>
                </td>
                <td style="width: 30%; text-align: right; border: none; vertical-align: middle;">
                </td>
            </tr>
        </table>
    </div>

    <!-- Información del paciente -->
    <div class="patient-info">
        <table style="border: none;">
            <tr>
                <td style="border: none; padding: 3px 5px 3px 0; width: 100px; vertical-align: top;">
                    <span class="section-title" style="border: none;">Paciente:</span>
                </td>
                <td style="border: none; padding: 3px 0; vertical-align: top;">
                    {{ $paciente->nombres }} {{ $paciente->apellido_paterno }} {{ $paciente->apellido_materno }}
                </td>
            </tr>
            <tr>
                <td style="border: none; padding: 3px 5px 3px 0; vertical-align: top;">
                    <span class="section-title" style="border: none;">DNI:</span>
                </td>
                <td style="border: none; padding: 3px 0; vertical-align: top;">
                    {{ $paciente->dni }}
                </td>
            </tr>
            <tr>
                <td style="border: none; padding: 3px 5px 3px 0; vertical-align: top;">
                    <span class="section-title" style="border: none;">Edad:</span>
                </td>
                <td style="border: none; padding: 3px 0; vertical-align: top;">
                    {{ $paciente->edad }} años
                </td>
            </tr>
            <tr>
                <td style="border: none; padding: 3px 5px 3px 0; vertical-align: top;">
                    <span class="section-title" style="border: none;">N° de Historia:</span>
                </td>
                <td style="border: none; padding: 3px 0; vertical-align: top;">
                    {{ $paciente->codigo_historial }}
                </td>
            </tr>
        </table>
    </div>

    <!-- Diagnóstico -->
    @if(!empty($cie10Codes) && count($cie10Codes) > 0)
    <div class="section">
        <div class="section-title">Diagnóstico:</div>
        <ul style="list-style-type: none; padding-left: 5px; margin: 5px 0;">
            @foreach($cie10Codes as $code)
                <li style="font-size: 14px; margin-bottom: 3px;">• {{ $code }}</li>
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
                    <td>{{ $medicamento['nombre_comercial'] }}</td>
                    <td>{{ $medicamento['cantidad'] }}</td>
                    <td>{{ $medicamento['dosis'] }}</td>
                    <td>{{ $medicamento['frecuencia'] }}</td>
                    <td>{{ $medicamento['duracion'] }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @else
        <p style="font-style: italic;">No se prescribieron medicamentos.</p>
        @endif
    </div>

    <!-- Indicaciones generales -->
    @if($receta->indicaciones_generales)
    <div class="section">
        <div class="section-title">Indicaciones Generales:</div>
        <div style="padding: 5px 0 0 10px; font-size: 14px;">
            {{ $receta->indicaciones_generales }}
        </div>
    </div>
    @endif

    <!-- Firma y fecha -->
    <div style="margin-top: 40px;">
        <table style="border: none; width: 100%;">
            <tr>
                <td style="border: none; text-align: left; width: 50%;">
                    <p style="font-size: 13px; margin: 0;">
                        Fecha: {{ \Carbon\Carbon::parse($receta['created_at'])->format('d/m/Y') }}
                    </p>
                </td>
                <td style="border: none; text-align: center; width: 50%;">
                    <div style="margin-top: 30px;">
                        <div style="border-top: 1px solid #000; width: 200px; margin: 0 auto;"></div>
                        <p style="margin: 5px 0 0 0; font-size: 13px;">Lic. Médico</p>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Información de contacto (footer) -->
    <div class="footer-info">
        <table style="border: none; width: 100%;">
            <tr>
                <td style="border: none; text-align: center;">
                    <span style="font-size: 12px;">
                        <img src="{{ public_path('img/ubicacion.png') }}" alt="Ubicación" style="width: 14px; height: 14px; vertical-align: middle;">
                        Av Gral José María Egúsquiza, Córdova 835
                    </span>
                    <span style="margin: 0 15px;">|</span>
                    <span style="font-size: 12px;">
                        <img src="{{ public_path('img/phone.png') }}" alt="Teléfono" style="width: 14px; height: 14px; vertical-align: middle;">
                        +51 999 495 085
                    </span>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>