<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte de Cirugía</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 5px; }
        .title { font-size: 20px; font-weight: bold; }
        .section { margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
        .footer { margin-top: 20px; text-align: right; }
        .vertical-center { vertical-align: middle; }
    </style>
</head>
<body>
    <img src="{{ public_path('img/logoVisualOsf.png') }}" alt="Logo" style="width: 100px; height: auto;">
    <div class="header">
        <div class="title">INFORME OPERATORIO</div>
    </div>
    <div class="section">
        <table>
            <!--REPORTE OPERATORIO - 3 columnas como solicitado -->
            <tr>
                <td width="25%" style="vertical-align: middle; text-align: center;" rowspan="4">
                    <strong>REPORTE OPERATORIO</strong>
                </td>
                <td width="25%" style="vertical-align: top;">
                    <strong>NUMERO DE HCL</strong>
                </td>
                <td width="50%" style="vertical-align: top;">
                    {{ $cirugia->codigo_historial }}
                </td>
            </tr>
            <tr>
                <td style="vertical-align: top;">
                    <strong>FECHA</strong>
                </td>
                <td style="vertical-align: top;">
                    {{ date('d/m/Y', strtotime($cirugia->fecha_cirugia)) }}
                </td>
            </tr>
            <tr>
                <td style="vertical-align: top;">
                    <strong>HORA INICIO</strong>
                </td>
                <td style="vertical-align: top;">
                    {{ date('H:i', strtotime($cirugia->hora_inicio)) }}
                </td>
            </tr>
            <tr>
                <td style="vertical-align: top;">
                    <strong>HORA DE TERMINO</strong>
                </td>
                <td style="vertical-align: top;">
                    {{ date('H:i', strtotime($cirugia->hora_fin)) }}
                </td>
            </tr>
            
            <!--INFO. PACIENTE-->
            <tr>
                <td><strong>APELLIDOS:</strong> {{ $cirugia->paciente->apellido_paterno }} {{ $cirugia->paciente->apellido_materno }}</td>
                <td colspan="2"><strong>NOMBRES:</strong> {{ $cirugia->paciente->nombres }}</td>
            </tr>
            
            <!--CIRUGIA-->
            <tr>
                <td><strong>DIAGNÓSTICO PRE-OPERATORIO</strong></td>
                <td colspan="2">{{ $cirugia->diagnostico_preoperatorio }}</td>
            </tr>
            @if($cirugia->diagnostico_postoperatorio)
            <tr>
                <td><strong>DIAGNÓSTICO POST-OPERATORIO</strong></td>
                <td colspan="2">{{ $cirugia->diagnostico_postoperatorio }}</td>
            </tr>
            @endif
            <tr>
                <td width="25%"><strong>CIRUGÍA</strong></td>
                <td colspan="2">{{ $cirugia->cirugia }}</td>
            </tr>
            
            <!--EQUIPO QUIRÚRGICO - CORREGIDO PARA COLUMNAS DE IGUAL ANCHO -->
            <tr>
                <td style="vertical-align: middle; text-align: center;">
                    <strong>CIRUJANOS</strong>
                </td>            
                <td style="vertical-align: top; width: 37.5%;">
                    <strong>CIRUJANO PRINCIPAL</strong><br>
                    {{ $cirugia->cirujano_principal }}
                </td>            
                <td style="vertical-align: top; width: 37.5%;">
                    @if($cirugia->cirujano_ayudante)
                    <strong>CIRUJANO AYUDANTE</strong><br>
                    {{ $cirugia->cirujano_ayudante }}
                    @endif
                </td>
            </tr>
            <tr>
                <td style="vertical-align: middle; text-align: center;">
                    <strong>ANESTESISTA</strong>
                </td>
                <td style="vertical-align: top;">
                    <strong>ANESTESIOLOGO</strong><br>
                    {{ $cirugia->anestesiologo }}
                </td>            
                <td style="vertical-align: top;">
                    @if($cirugia->tipo_anestesia)
                    <strong>TIPO DE ANESTESIA</strong><br>
                    {{ $cirugia->tipo_anestesia }}
                    @endif
                </td>
            </tr>
            <tr>
                <td style="vertical-align: middle; text-align: center;">
                    <strong>PERSONAL DE ENFERMERÍA</strong>
                </td>
                <td colspan="2" style="vertical-align: top;">
                    @if(!empty($personalEnfermeria))
                        @foreach($personalEnfermeria as $enfermero)
                            • {{ $enfermero }}<br>
                        @endforeach
                    @endif
                </td>
            </tr>
            
            <!--HALLAZOS Y PROCEDIMIENTO-->
            <tr>
                <td>
                    <strong>HALLAZGOS</strong>
                </td>
                <td colspan="2">{{ $cirugia->hallazgos }}</td>
            </tr>
            <tr>
                <td><strong>PROCEDIMIENTO</strong></td>
                <td colspan="2">{{ $cirugia->procedimiento }}</td>
            </tr>       
        </table>
    </div>

    <div class="footer">
        <div style="margin-top: 30px;">
            __________________________<br>
            Lic. Médico Cirujano
        </div>
    </div>
</body>
</html>