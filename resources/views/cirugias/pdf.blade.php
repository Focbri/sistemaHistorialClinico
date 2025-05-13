<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte de Cirugía</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
        .patient-info { margin-bottom: 20px; }
        .section { margin-bottom: 15px; }
        .section-title { 
            font-weight: bold; 
            margin-bottom: 5px; 
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .footer { margin-top: 40px; text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">REPORTE QUIRÚRGICO</div>
        <div>Código: {{ $cirugia->codigo_historial }}</div>
    </div>

    <div class="patient-info">
        <div><strong>Paciente:</strong> {{ $cirugia->paciente->nombres }} {{ $cirugia->paciente->apellido_paterno }}</div>
        <div><strong>DNI:</strong> {{ $cirugia->paciente->dni }}</div>
        <div><strong>Fecha de Cirugía:</strong> {{ date('d/m/Y', strtotime($cirugia->fecha_cirugia)) }}</div>
    </div>

    <div class="section">
        <div class="section-title">DATOS DE LA INTERVENCIÓN</div>
        <table>
            <tr>
                <td width="30%"><strong>Cirugía:</strong></td>
                <td>{{ $cirugia->cirugia }}</td>
            </tr>
            <tr>
                <td><strong>Diagnóstico Preoperatorio:</strong></td>
                <td>{{ $cirugia->diagnostico_preoperatorio }}</td>
            </tr>
            @if($cirugia->diagnostico_postoperatorio)
            <tr>
                <td><strong>Diagnóstico Postoperatorio:</strong></td>
                <td>{{ $cirugia->diagnostico_postoperatorio }}</td>
            </tr>
            @endif
            <tr>
                <td><strong>Descripción del Procedimiento:</strong></td>
                <td>{{ $cirugia->procedimiento }}</td>
            </tr>
            @if($cirugia->hallazgos)
            <tr>
                <td><strong>Hallazgos:</strong></td>
                <td>{{ $cirugia->hallazgos }}</td>
            </tr>
            @endif
        </table>
    </div>

    <div class="section">
        <div class="section-title">EQUIPO QUIRÚRGICO</div>
        <table>
            <tr>
                <td width="30%"><strong>Cirujano Principal:</strong></td>
                <td>{{ $cirugia->cirujano_principal }}</td>
            </tr>
            @if($cirugia->cirujano_ayudante)
            <tr>
                <td><strong>Cirujano Ayudante:</strong></td>
                <td>{{ $cirugia->cirujano_ayudante }}</td>
            </tr>
            @endif
            <tr>
                <td><strong>Anestesiológo:</strong></td>
                <td>{{ $cirugia->anestesiologo }}</td>
            </tr>
            <tr>
                <td><strong>Tipo de Anestesia:</strong></td>
                <td>{{ $cirugia->tipo_anestesia }}</td>
            </tr>
            @if(!empty($personalEnfermeria))
            <tr>
                <td><strong>Personal de Enfermería:</strong></td>
                <td>
                    @foreach($personalEnfermeria as $enfermero)
                        • {{ $enfermero }}<br>
                    @endforeach
                </td>
            </tr>
            @endif
        </table>
    </div>

    <div class="section">
        <div class="section-title">TIEMPOS QUIRÚRGICOS</div>
        <table>
            <tr>
                <td width="30%"><strong>Hora de Inicio:</strong></td>
                <td>{{ date('H:i', strtotime($cirugia->hora_inicio)) }}</td>
            </tr>
            @if($cirugia->hora_fin)
            <tr>
                <td><strong>Hora de Finalización:</strong></td>
                <td>{{ date('H:i', strtotime($cirugia->hora_fin)) }}</td>
            </tr>
            @endif
        </table>
    </div>

    <div class="footer">
        <div style="margin-top: 50px;">
            <strong>Fecha de Emisión:</strong> {{ $fechaActual }}
        </div>
        <div style="margin-top: 30px;">
            __________________________<br>
            {{ $cirugia->user->name ?? 'Médico Responsable' }}<br>
            Lic. Médico Cirujano
        </div>
    </div>
</body>
</html>