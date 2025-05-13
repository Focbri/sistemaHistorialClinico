<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Consulta Médica - {{ $paciente['nombres'] ?? '' }} {{ $paciente['apellido_paterno'] ?? '' }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { font-size: 18px; margin: 0; }
        .header p { font-size: 12px; margin: 5px 0; }
        .section { margin-bottom: 15px; }
        .section-title { background-color: #f0f0f0; padding: 5px; font-weight: bold; }
        .two-columns { display: flex; justify-content: space-between; }
        .column { width: 48%; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        table, th, td { border: 1px solid #ddd; }
        th, td { padding: 5px; text-align: left; }
        .signature-area { margin-top: 50px; display: flex; justify-content: space-between; }
        .page-break { page-break-after: always; }
    </style>
</head>
<body>
    <div class="header">
        <h1>CONSULTA OFTALMOLÓGICA</h1>
        <p>{{ config('app.name') }}</p>
        <p>Fecha: {{ now()->format('d/m/Y H:i') }}</p>
    </div>

    <!-- Datos del Paciente -->
    <div class="section">
        <div class="section-title">DATOS DEL PACIENTE</div>
        <div class="two-columns">
            <div class="column">
                <p><strong>Nombre:</strong> {{ $paciente['nombres'] ?? '' }} {{ $paciente['apellido_paterno'] ?? '' }} {{ $paciente['apellido_materno'] ?? '' }}</p>
                <p><strong>DNI:</strong> {{ $paciente['dni'] ?? 'No especificado' }}</p>
                <p><strong>Edad:</strong> {{ $paciente['edad'] ?? '' }} años</p>
                <p><strong>Sexo:</strong> {{ $paciente['sexo'] ?? '' }}</p>
            </div>
            <div class="column">
                <p><strong>Teléfono:</strong> {{ $paciente['telefono'] ?? 'No especificado' }}</p>
                <p><strong>Email:</strong> {{ $paciente['email'] ?? 'No especificado' }}</p>
                <p><strong>Dirección:</strong> {{ $paciente['direccion'] ?? 'No especificado' }}</p>
                <p><strong>Fecha Nac.:</strong> {{ $paciente['fecha_nacimiento'] ?? 'No especificado' }}</p>
            </div>
        </div>
    </div>

    <!-- Antecedentes -->
    <div class="section">
        <div class="section-title">ANTECEDENTES PERSONALES</div>
        @if(!empty($consulta['antecedentes_personales_hta']))
        <p><strong>HTA:</strong> {{ is_array($consulta['antecedentes_personales_hta']) ? implode(', ', $consulta['antecedentes_personales_hta']) : $consulta['antecedentes_personales_hta'] }}</p>
        @endif
        @if(!empty($consulta['antecedentes_personales_dm']))
        <p><strong>DM:</strong> {{ is_array($consulta['antecedentes_personales_dm']) ? implode(', ', $consulta['antecedentes_personales_dm']) : $consulta['antecedentes_personales_dm'] }}</p>
        @endif
        @if(!empty($consulta['antecedentes_personales_alergias']))
        <p><strong>ALERGIAS:</strong> {{ is_array($consulta['antecedentes_personales_alergias']) ? implode(', ', $consulta['antecedentes_personales_alergias']) : $consulta['antecedentes_personales_alergias'] }}</p>
        @endif
        @if(!empty($consulta['antecedentes_personales_otros']))
        <p><strong>OTROS:</strong> {{ is_array($consulta['antecedentes_personales_otros']) ? implode(', ', $consulta['antecedentes_personales_otros']) : $consulta['antecedentes_personales_otros'] }}</p>
        @endif
        
        @if(!empty($consulta['antecedentes_patologicos_familiares']))
        <p><strong>Familiares:</strong> {{ is_array($consulta['antecedentes_patologicos_familiares']) ? implode(', ', $consulta['antecedentes_patologicos_familiares']) : $consulta['antecedentes_patologicos_familiares'] }}</p>
        @endif
        
        @if(!empty($consulta['cirugias_previas']))
        <p><strong>Cirugías Previas:</strong> {{ is_array($consulta['cirugias_previas']) ? implode(', ', $consulta['cirugias_previas']) : $consulta['cirugias_previas'] }}</p>
        @endif
    </div>

    <!-- Motivo de Consulta -->
    <div class="section">
        <div class="section-title">MOTIVO DE CONSULTA</div>
        @if(!empty($consulta['motivo_consulta_inicio']))
        <p><strong>Inicio:</strong> {{ is_array($consulta['motivo_consulta_inicio']) ? implode(', ', $consulta['motivo_consulta_inicio']) : $consulta['motivo_consulta_inicio'] }}</p>
        @endif
        @if(!empty($consulta['motivo_consulta_inicio']))
        <p><strong>Signos:</strong> {{ is_array($consulta['motivo_consulta_signos']) ? implode(', ', $consulta['motivo_consulta_signos']) : $consulta['motivo_consulta_signos'] }}</p>
        @endif
        @if(!empty($consulta['motivo_consulta_enfermedad']))
        <p><strong>Enfermedad:</strong> {{ is_array($consulta['motivo_consulta_enfermedad']) ? implode(', ', $consulta['motivo_consulta_enfermedad']) : $consulta['motivo_consulta_enfermedad'] }}</p>
        @endif
        @if(!empty($consulta['motivo_consulta_otros']))
        <p><strong>Otros:</strong> {{ is_array($consulta['motivo_consulta_otros']) ? implode(', ', $consulta['motivo_consulta_otros']) : $consulta['motivo_consulta_otros'] }}</p>
        @endif
    </div>

    <!-- Examen Ocular -->
    @if(!empty($consulta['examen_av_sc_od']) || !empty($consulta['examen_av_sc_oi']) || 
        !empty($consulta['examen_av_cc_od']) || !empty($consulta['examen_av_cc_oi']))
    <div class="section">
        <div class="section-title">EXAMEN OCULAR</div>
        <table>
            <thead>
                <tr>
                    <th>Prueba</th>
                    <th>OD</th>
                    <th>OI</th>
                </tr>
            </thead>
            <tbody>
                @if(!empty($consulta['examen_av_sc_od']) || !empty($consulta['examen_av_sc_oi']))
                <tr>
                    <td>Agudeza Visual SC</td>
                    <td>{{ $consulta['examen_av_sc_od'] ?? '-' }}</td>
                    <td>{{ $consulta['examen_av_sc_oi'] ?? '-' }}</td>
                </tr>
                @endif
                
                @if(!empty($consulta['examen_av_cc_od']) || !empty($consulta['examen_av_cc_oi']))
                <tr>
                    <td>Agudeza Visual CC</td>
                    <td>{{ $consulta['examen_av_cc_od'] ?? '-' }}</td>
                    <td>{{ $consulta['examen_av_cc_oi'] ?? '-' }}</td>
                </tr>
                @endif
            </tbody>
        </table>
    </div>
    @endif

    <!-- Resto de las secciones (Biomicroscopia, Fondo de Ojo, etc.) -->
    <!-- ... (implementa el mismo patrón de validación para las demás secciones) ... -->

    <!-- Firmas -->
    <div class="signature-area">
        <div>
            <p>_________________________</p>
            <p>Dr. {{ $medico['name'] ?? 'Nombre del Médico' }}</p>
            <p>Médico Oftalmólogo</p>
            <p>COP: {{ $medico['numero_colegiatura'] ?? 'N° Colegiatura' }}</p>
        </div>
        <div>
            <p>_________________________</p>
            <p>Paciente</p>
        </div>
    </div>
</body>
</html>