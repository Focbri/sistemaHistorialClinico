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
        .section-title {
            font-weight: bold;
            padding-bottom: 0px;
            margin-bottom: 5px;
            display: inline-block; /* Hace que el elemento solo ocupe el ancho del contenido */
            border-bottom: 2px solid #000; /* Línea inferior como subrayado */
        }
        .espacio-titulo {
            margin-top: 10px;
            margin-bottom: 5px;
        }
        .two-columns { display: flex; justify-content: space-between; }
        .column { width: 48%; }
        table { width: 100%; border-collapse: collapse; margin: 5px 0; }
        table, th, td { border: 1px solid #ddd; }
        th, td { padding: 2px; text-align: left; }
        .signature-area { margin-top: 50px; display: flex; justify-content: space-between; }
        .page-break { page-break-after: always; }
        .table-paciente { width: 100%; border-collapse: collapse; }
        .texto-parrafo{
            display: block;
            margin: 5px 0 10px 0; /* Margen superior e inferior mejorado */
            padding: 0;
            font-size: 12px;
            border-bottom: 1px dotted #000; /* Línea inferior como subrayado */
            min-height: 16px; /* Altura mínima garantizada */
            padding: 2px 0;   /* Espacio interno superior/inferior */
        }
        hr {
            margin: 2px 0;  /* Reduce el margen vertical */
            padding: 0;
            border: none;
            border-top: 1px solid #ddd;  /* Línea más delgada */
            height: 1px;  /* Altura exacta */
        }
        .texto-centrado{
            text-align: center;
        }
        .exam-table td, .exam-table th {
        min-height: 20px; /* Altura mínima para todas las celdas */
        }
        
        .exam-table td p:empty::before {
            content: "-"; /* Mostrar un guión cuando no hay contenido */
            color: #999; /* Color gris para el marcador de vacío */
        }
        
        .exam-table td p {
            min-height: 16px; /* Altura mínima para el párrafo dentro de la celda */
            margin: 0; /* Eliminar márgenes para evitar espacios desiguales */
        }
    </style>
</head>
<body>
    <div class="header">
        <table style="border: none;">
            <tr style="border: none;">
                <td style="width: 30%; text-align: left; border: none;">
                    <img src="{{ public_path('img/logoVisualOsf.png') }}" alt="Logo" style="max-width: 150px; max-height: 80px;">
                </td>
                <td style="width: 40%; text-align: center; vertical-align: bottom; border: none;">
                    <h1 style="display: inline-block; border-bottom: 2px solid #000; border: none;">HISTORIA CLÍNICA</h1>
                </td>
                <td style="width: 30%; text-align: right; border: none;">
                    <p style="font-size: 18px; border: none;">{{ is_array($consulta['codigo_historial']) ? implode(', ', $consulta['codigo_historial']) : $consulta['codigo_historial'] }}</p>
                </td>
            </tr>
        </table>
        <table style="border: none;">
            <tr>
                <td style="width: 30%; border: none;">
                    <p style="border: none;"></p>
                </td>
                <td style="width: 40%; text-align: center; border: none;">
                    <p style="border: none;">Tipo de Consulta: {{ $consulta['tipo_consulta'] ?? 'No especificado' }}</p>
                </td>
                <td style="width: 30%; text-align: right; border: none;">
                    <p style="border: none;">Fecha: 
                        @if(isset($consulta['created_at']) && isset($consulta['updated_at']))
                            {{ max(\Carbon\Carbon::parse($consulta['created_at']), \Carbon\Carbon::parse($consulta['updated_at']))->format('d/m/Y') }}
                        @elseif(isset($consulta['created_at']))
                            {{ \Carbon\Carbon::parse($consulta['created_at'])->format('d/m/Y') }}
                        @else
                            {{ now()->format('d/m/Y') }}
                        @endif
                    </p>
                </td>
            </tr>
        </table>
    </div>

    <!-- Datos del Paciente (SIEMPRE) -->
    <div class="section">
        <div class="section-title">DATOS DEL PACIENTE</div>
            <table class="table-paciente" style="width: 100%; border: none; border-collapse: collapse;">
                <tr>
                    <td style="width: 40%;  vertical-align: top; border: none">
                        <p><strong>Apellido Paterno:</strong> {{ $paciente['apellido_paterno'] ?? '' }}</p>
                        <p><strong>Apellido Materno:</strong> {{ $paciente['apellido_materno'] ?? '' }}</p>
                        <p><strong>Nombre:</strong> {{ $paciente['nombres'] ?? '' }}</p>
                    </td>
                    <td style="width: 30%; vertical-align: top; border: none">
                        <p><strong>Fecha Nac.:</strong> {{ $paciente['fecha_nacimiento'] ?? 'No especificado' }}</p>
                        <p><strong>Edad:</strong> {{ $paciente['edad'] ?? '' }} años</p>
                        <p><strong>Peso:</strong> {{ $paciente['peso'] ?? '' }} kg</p>
                    </td>
                    <td style="width: 30%;  vertical-align: top; border: none">
                        <p><strong style="text-transform: uppercase;">{{ $paciente['tipo_documento'] }}:</strong> {{ $paciente['dni'] ?? 'No especificado' }}</p>
                        <p><strong>Sexo:</strong> {{ $paciente['sexo'] ?? '' }}</p>
                    </td>
                </tr>
            </table>
            <hr>
            <table class="table-paciente" style="width: 100%; border: none; border-collapse: collapse;">
                <tr>
                    <td style="width: 40%;  vertical-align: top; border: none">
                        <p><strong>Estado Civil:</strong> {{ $paciente['estado_civil'] ?? 'No especificado' }}</p>
                        <p><strong>Ocupación:</strong> {{ $paciente['ocupacion'] ?? 'No especificado' }}</p>
                        <p><strong>Procedencia:</strong> {{ $paciente['procedencia'] ?? 'No especificado' }}</p>
                        <p><strong>Domicilio:</strong> {{ $paciente['direccion'] ?? 'No especificado' }}</p>
                    </td>
                    <td style="width: 30%;  vertical-align: top; border: none">
                        <p><strong>Teléfono:</strong> {{ $paciente['telefono'] ?? 'No especificado' }}</p>
                        <p><strong>Acompañante:</strong> {{ $paciente['acompañante'] ?? 'No especificado' }}</p>
                        <p><strong>Referido por:</strong> {{ $paciente['referido'] ?? 'No especificado' }}</p>
                        <p><strong>Email:</strong> {{ $paciente['email'] ?? 'No especificado' }}</p>
                    </td>
                </tr>
            </table>
    </div>

    @if($consulta['tipo_consulta'] == 'inicio')
        <!-- Antecedentes SOLO INICIO -->
        <div class="section">
            <div class="section-title">ANTECEDENTES PERSONALES</div>

            <table class="exam-table" width="100%" style="border-color: red;"> 
                <thead>
                    <tr>
                        <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">HTA</th>
                        <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">DM</th>
                        <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">Alergias</th>
                        <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">Otros</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td width="25%" style="border-color: #000;"><p>{{ is_array($consulta['antecedentes_personales_hta']) ? implode(', ', $consulta['antecedentes_personales_hta']) : $consulta['antecedentes_personales_hta'] ?? '' }}</p></td>
                        <td width="25%" style="border-color: #000;"><p>{{ is_array($consulta['antecedentes_personales_dm']) ? implode(', ', $consulta['antecedentes_personales_dm']) : $consulta['antecedentes_personales_dm'] ?? '' }}</p></td>
                        <td width="25%" style="border-color: #000;"><p>{{ is_array($consulta['antecedentes_personales_alergias']) ? implode(', ', $consulta['antecedentes_personales_alergias']) : $consulta['antecedentes_personales_alergias'] ?? '' }}</p></td>
                        <td width="25%" style="border-color: #000;"><p>{{ is_array($consulta['antecedentes_personales_otros']) ? implode(', ', $consulta['antecedentes_personales_otros']) : $consulta['antecedentes_personales_otros'] ?? '' }}</p></td>
                    </tr>
                </tbody>
            </table>

            <div class="section-title espacio-titulo">ANTECEDENTES PATOLÓGICOS FAMILIARES</div>
            <p class="texto-parrafo">{{ is_array($consulta['antecedentes_patologicos_familiares']) ? implode(', ', $consulta['antecedentes_patologicos_familiares']) : $consulta['antecedentes_patologicos_familiares'] ?? '' }}</p>

            <div class="section-title espacio-titulo">CIRUGIAS PREVIAS</div>
            <p class="texto-parrafo">{{ is_array($consulta['cirugias_previas']) ? implode(', ', $consulta['cirugias_previas']) : $consulta['cirugias_previas'] ?? '' }}</p>

        </div>

        <!-- Motivo de Consulta SOLO INICIO -->
        <div class="section">
            <div class="section-title">MOTIVO DE CONSULTA</div>
            <table class="exam-table" width="100%"> 
                <thead>
                    <tr>
                        <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">Inicio</th>
                        <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">Signos</th>
                        <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">Enfermedad</th>
                        <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">Otros</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td width="25%" style="border-color: #000;"><p>{{ is_array($consulta['motivo_consulta_inicio']) ? implode(', ', $consulta['motivo_consulta_inicio']) : $consulta['motivo_consulta_inicio'] ?? '' }}</p></td>
                        <td width="25%" style="border-color: #000;"><p>{{ is_array($consulta['motivo_consulta_signos']) ? implode(', ', $consulta['motivo_consulta_signos']) : $consulta['motivo_consulta_signos'] ?? '' }}</p></td>
                        <td width="25%" style="border-color: #000;"><p>{{ is_array($consulta['motivo_consulta_enfermedad']) ? implode(', ', $consulta['motivo_consulta_enfermedad']) : $consulta['motivo_consulta_enfermedad'] ?? '' }}</p></td>
                        <td width="25%" style="border-color: #000;"><p>{{ is_array($consulta['motivo_consulta_otros']) ? implode(', ', $consulta['motivo_consulta_otros']) : $consulta['motivo_consulta_otros'] ?? '' }}</p></td>
                    </tr>
                </tbody>
            </table>
        </div>
    @endif

    @if($consulta['tipo_consulta'] == 'evolucion')
        <!-- EVOLUCIONES SOLO EVOLUCION-->
        <div class="section">
            <div class="section-title">EVOLUCIONES</div>            
            <p>{{ is_array($consulta['evoluciones']) ? implode(', ', $consulta['evoluciones']) : $consulta['evoluciones'] ?? '' }}</p>
        </div>
    @endif

    <!-- Examen Ocular (AMBOS) -->
    @if(!empty($consulta['examen']) && 
    (isset($consulta['examen']['examen_av_sc_od']) || 
     isset($consulta['examen']['examen_av_cae_od']) ||
     isset($consulta['examen']['examen_av_cc_od']) ||
     isset($consulta['examen']['examen_av_sc_oi']) ||
     isset($consulta['examen']['examen_av_cae_oi']) ||
     isset($consulta['examen']['examen_av_cc_oi']) ||
     isset($consulta['examen']['examen_pi_tipo']) ||
     isset($consulta['examen']['examen_pi_od']) ||
     isset($consulta['examen']['examen_pi_oi']) ||
     isset($consulta['examen']['examen_ar_sph_od']) ||
     isset($consulta['examen']['examen_ar_cyl_od']) ||
     isset($consulta['examen']['examen_ar_ax_od']) ||
     isset($consulta['examen']['examen_ar_sph_oi']) ||
     isset($consulta['examen']['examen_ar_cyl_oi']) ||
     isset($consulta['examen']['examen_ar_ax_oi']) ||
     isset($consulta['examen']['examen_keratometria_qd1_od']) ||
     isset($consulta['examen']['examen_keratometria_qd2_od']) ||
     isset($consulta['examen']['examen_keratometria_eje_od']) ||
     isset($consulta['examen']['examen_keratometria_qd1_oi']) ||
     isset($consulta['examen']['examen_keratometria_qd2_oi']) ||
     isset($consulta['examen']['examen_keratometria_eje_oi']))
    )
    <div class="section">
        <div class="section-title">EXAMEN OCULAR</div>
             <!-- Primera parte del examen ocular -->
        <table width="100%" cellspacing="0" cellpadding="0" style="border: none;">
            <tr style="border: none;">
                <!-- Primera tabla -->
                <td width="48%" valign="top" style="padding-right: 15px; border: none;">
                    <p class="texto-centrado" style="font-weight: bold;">Agudeza Visual</p>
                    <table class="exam-table" width="100%" style="border: none;"> 
                        <thead>
                            <tr>
                                <th style="border-color: #000; background-color: #f2f2f2;"></th>
                                <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">SC</th>
                                <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">CAE</th>
                                <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">CC</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="texto-centrado" style="border-color: #000;">OD</td>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_av_sc_od'] ?? '' }}</p>
                                </td>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_av_cae_od'] ?? ''  }}</p>
                                </td>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_av_cc_od'] ?? ''  }}</p>
                                </td>
                            </tr>
                            <tr>
                                <td class="texto-centrado" style="border-color: #000;">OI</td>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_av_sc_oi'] ?? ''  }}</p>
                                </td>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_av_cae_oi'] ?? ''  }}</p>
                                </td>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_av_cc_oi'] ?? ''  }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                
                <!-- Espacio entre tablas -->
                <td width="4%" style="border: none;"></td>
                
                <!-- Segunda tabla -->
                <td width="48%" valign="top" style="padding-left: 15px; border: none;">
                    <p class="texto-centrado"><strong>Presión Intraocular: {{ $consulta['examen']['examen_pi_tipo'] ?? 'No registrado' }}</strong></p>
                    <table class="exam-table" width="100%" style="border: none;"> 
                        <thead>
                            <tr>
                                <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">OD</th>
                                <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">OI</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_pi_od'] ?? ''  }}</p>
                                </td>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_pi_oi'] ?? ''  }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </table>
        <!--Segunda parte del examen ocular-->
        <table width="100%" cellspacing="0" cellpadding="0" style="border: none;">
            <tr style="border: none;">
                <!-- Primera tabla -->
                <td width="48%" valign="top" style="padding-right: 15px; border: none;">
                    <p class="texto-centrado" style="font-weight: bold;">Autorefractometría</p>
                    <table class="exam-table" width="100%"> 
                        <thead>
                            <tr>
                                <th style="border-color: #000; background-color: #f2f2f2;"></th>
                                <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">Sph</th>
                                <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">Cyl</th>
                                <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">Ax</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="texto-centrado" style="border-color: #000;">OD</td>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_ar_sph_od'] ?? ''  }}</p>
                                </td>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_ar_cyl_od'] ?? ''  }}</p>
                                </td>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_ar_ax_od'] ?? ''  }}</p>
                                </td>
                            </tr>
                            <tr>
                                <td class="texto-centrado" style="border-color: #000;">OI</td>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_ar_sph_oi'] ?? ''  }}</p>
                                </td>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_ar_cyl_oi'] ?? ''  }}</p>
                                </td>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_ar_ax_oi'] ?? ''  }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                
                <!-- Espacio entre tablas -->
                <td width="4%" style="border: none;"></td>
                
                <!-- Segunda tabla -->
                <td width="48%" valign="top" style="padding-right: 15px; border: none;">
                    <p class="texto-centrado" style="font-weight: bold;">Queratometría</p>
                    <table class="exam-table" width="100%"> 
                        <thead>
                            <tr>
                                <th style="border-color: #000; background-color: #f2f2f2;"></th>
                                <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">QD1</th>
                                <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">QD2</th>
                                <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">EJE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="texto-centrado" style="border-color: #000;">OD</td>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_keratometria_qd1_od'] ?? '' }}</p>
                                </td>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_keratometria_qd2_od'] ?? '' }}</p>
                                </td>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_keratometria_eje_od'] ?? '' }}</p>
                                </td>
                            </tr>
                            <tr>
                                <td class="texto-centrado" style="border-color: #000;">OI</td>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_keratometria_qd1_oi'] ?? '' }}</p>
                                </td>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_keratometria_qd2_oi'] ?? '' }}</p>
                                </td>
                                <td style="border-color: #000;">
                                    <p>{{ $consulta['examen']['examen_keratometria_eje_oi'] ?? '' }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </table>           
    </div>
    @endif
    <div class="page-break"></div>

    <!-- BIOMICROSCOPIA (AMBOS) -->
    <div class="section">
        <div class="section-title">BIOMICROSCOPIA</div>
        <table class="exam-table"> 
            <thead>
                <tr>
                    <th style="border-color: #000; width: 30%; background-color: #f2f2f2;"></th>
                    <th class="texto-centrado" style="border-color: #000; width: 35%; background-color: #f2f2f2;">OD</th>
                    <th class="texto-centrado" style="border-color: #000; width: 35%; background-color: #f2f2f2;">OI</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border-color: #000;">Movimientos Oculares</td>
                    <td style="border-color: #000;">
                        <p>{{ is_array($consulta['biomicroscopia_movoculares_od']) ? implode(', ', $consulta['biomicroscopia_movoculares_od']) : $consulta['biomicroscopia_movoculares_od'] }}</p>
                    </td>
                    <td style="border-color: #000;">
                        <p>{{ is_array($consulta['biomicroscopia_movoculares_oi']) ? implode(', ', $consulta['biomicroscopia_movoculares_oi']) : $consulta['biomicroscopia_movoculares_oi'] }}</p>
                    </td>
                </tr>
                <tr>
                    <td style="border-color: #000;">Párpados</td>
                    <td style="border-color: #000;">
                        <p>{{ is_array($consulta['biomicroscopia_parpados_od']) ? implode(', ', $consulta['biomicroscopia_parpados_od']) : $consulta['biomicroscopia_parpados_od'] }}</p>
                    </td>
                    <td style="border-color: #000;">
                        <p>{{ is_array($consulta['biomicroscopia_parpados_oi']) ? implode(', ', $consulta['biomicroscopia_parpados_oi']) : $consulta['biomicroscopia_parpados_oi'] }}</p>
                    </td>
                </tr>
                <tr>
                    <td style="border-color: #000;">Cornea</td>
                    <td style="border-color: #000;">
                        <p>{{ is_array($consulta['biomicroscopia_cornea_od']) ? implode(', ', $consulta['biomicroscopia_cornea_od']) : $consulta['biomicroscopia_cornea_od'] }}</p>
                    </td>
                    <td style="border-color: #000;">
                        <p>{{ is_array($consulta['biomicroscopia_cornea_oi']) ? implode(', ', $consulta['biomicroscopia_cornea_oi']) : $consulta['biomicroscopia_cornea_oi'] }}</p>
                    </td>
                </tr>
                <tr>
                    <td style="border-color: #000;">Conjuntiva</td>
                    <td style="border-color: #000;">
                        <p>{{ is_array($consulta['biomicroscopia_corneaconj_od']) ? implode(', ', $consulta['biomicroscopia_corneaconj_od']) : $consulta['biomicroscopia_corneaconj_od'] }}</p>
                    </td>
                    <td style="border-color: #000;">
                        <p>{{ is_array($consulta['biomicroscopia_corneaconj_oi']) ? implode(', ', $consulta['biomicroscopia_corneaconj_oi']) : $consulta['biomicroscopia_corneaconj_oi'] }}</p>
                    </td>
                </tr>
                <tr>
                    <td style="border-color: #000;">Cámara Anterior</td>
                    <td style="border-color: #000;">
                        <p>{{ is_array($consulta['biomicroscopia_ca_od']) ? implode(', ', $consulta['biomicroscopia_ca_od']) : $consulta['biomicroscopia_ca_od'] }}</p>
                    </td>
                    <td style="border-color: #000;">
                        <p>{{ is_array($consulta['biomicroscopia_ca_oi']) ? implode(', ', $consulta['biomicroscopia_ca_oi']) : $consulta['biomicroscopia_ca_oi'] }}</p>
                    </td>
                </tr>
                <tr>
                    <td style="border-color: #000;">Iris</td>
                    <td style="border-color: #000;">
                        <p>{{ is_array($consulta['biomicroscopia_iris_od']) ? implode(', ', $consulta['biomicroscopia_iris_od']) : $consulta['biomicroscopia_iris_od'] }}</p>
                    </td>
                    <td style="border-color: #000;">
                        <p>{{ is_array($consulta['biomicroscopia_iris_oi']) ? implode(', ', $consulta['biomicroscopia_iris_oi']) : $consulta['biomicroscopia_iris_oi'] }}</p>
                    </td>
                </tr>
                <tr>
                    <td style="border-color: #000;">Cristalino</td>
                    <td style="border-color: #000;">
                        <p>{{ is_array($consulta['biomicroscopia_cristalino_od']) ? implode(', ', $consulta['biomicroscopia_cristalino_od']) : $consulta['biomicroscopia_cristalino_od'] }}</p>
                    </td>
                    <td style="border-color: #000;">
                        <p>{{ is_array($consulta['biomicroscopia_cristalino_oi']) ? implode(', ', $consulta['biomicroscopia_cristalino_oi']) : $consulta['biomicroscopia_cristalino_oi'] }}</p>
                    </td>
                </tr>
            </tbody>
        </table>        
    </div>

    <!-- FONDO DE OJO (AMBOS) -->
    <div class="section">
        <div class="section-title">FONDO DE OJO</div>   
        
        <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px; border: none;">
            <tr style="border:none;">
                <!-- Ojo Derecho -->
                <td width="50%" align="center" valign="top" style="border: none;">
                    <div style="position: relative; width: 200px; height: 200px; margin: 0 auto; border: none; overflow: hidden;">
                        <img src="{{ public_path('img/fondo_ojo_derecho.png') }}" 
                            style="width: 100%; height: 100%; object-fit: cover; display: block; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" 
                            alt="Ojo Derecho">
                        
                        @php
                            $posiciones = [];
                            if (!empty($consulta['fondo_ojo_posiciones'])) {
                                $posiciones = is_array($consulta['fondo_ojo_posiciones']) 
                                    ? $consulta['fondo_ojo_posiciones'] 
                                    : @json_decode($consulta['fondo_ojo_posiciones'], true);
                            }
                            $colores = ['#0000FF', '#FF0000', '#00AA00', '#800080', '#FFA500'];
                            $scaleFactor = 0.5;
                        @endphp
                        
                        @if(is_array($posiciones))
                            @for($i = 1; $i <= 5; $i++)
                                @if(!empty($posiciones["OD_$i"]) && is_array($posiciones["OD_$i"]))
                                    @php
                                        $x = ($posiciones["OD_$i"]['x'] ?? 0) * $scaleFactor;
                                        $y = ($posiciones["OD_$i"]['y'] ?? 0) * $scaleFactor;
                                    @endphp
                                    <div style="
                                        position: absolute;
                                        width: 8px;
                                        height: 8px;
                                        border-radius: 50%;
                                        background-color: {{ $colores[$i-1] ?? '#000000' }};
                                        left: {{ $x }}px;
                                        top: {{ $y }}px;
                                        transform: translate(-50%, -50%);
                                        border: 1px solid white;
                                        box-shadow: 0 0 2px rgba(0,0,0,0.5);
                                    "></div>
                                @endif
                            @endfor
                        @endif
                    </div>
                </td>
                
                <!-- Ojo Izquierdo -->
                <td width="50%" align="center" valign="top" style="border: none;">
                    <div style="position: relative; width: 200px; height: 200px; margin: 0 auto; border: 1px solid #f0f0f0; overflow: hidden;">
                        <img src="{{ public_path('img/fondo_ojo_izquierdo.png') }}" 
                            style="width: 100%; height: 100%; object-fit: cover; display: block; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" 
                            alt="Ojo Izquierdo">

                        @if(is_array($posiciones))
                            @for($i = 1; $i <= 5; $i++)
                                @if(!empty($posiciones["OI_$i"]) && is_array($posiciones["OI_$i"]))
                                    @php
                                        $x = ($posiciones["OI_$i"]['x'] ?? 0) * $scaleFactor;
                                        $y = ($posiciones["OI_$i"]['y'] ?? 0) * $scaleFactor;
                                    @endphp
                                    <div style="
                                        position: absolute;
                                        width: 8px;
                                        height: 8px;
                                        border-radius: 50%;
                                        background-color: {{ $colores[$i-1] ?? '#000000' }};
                                        left: {{ $x }}px;
                                        top: {{ $y }}px;
                                        transform: translate(-50%, -50%);
                                        border: 1px solid white;
                                        box-shadow: 0 0 2px rgba(0,0,0,0.5);
                                    "></div>
                                @endif
                            @endfor
                        @endif
                    </div>
                </td>
            </tr>
        </table>
        
        <!-- Tabla de resultados -->
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
            <tr>
                <th style="border: 1px solid #000; padding: 5px; text-align: center; background-color: #f2f2f2;">
                    <span style="display:inline-block; margin-right: 8px"><div style="background-color: #0000FF; width: 8px; height: 8px; border-radius: 50%; display:inline-block; margin-right: 3px;"></div>Vítreo</span>
                    <span style="display:inline-block; margin-right: 8px"><div style="background-color: #FF0000; width: 8px; height: 8px; border-radius: 50%; display:inline-block; margin-right: 3px"></div>Mácula</span>
                    <span style="display:inline-block; margin-right: 8px"><div style="background-color: #00AA00; width: 8px; height: 8px; border-radius: 50%; display:inline-block; margin-right: 3px"></div>Retina Periférica</span>
                    <span style="display:inline-block; margin-right: 8px"><div style="background-color: #800080; width: 8px; height: 8px; border-radius: 50%; display:inline-block; margin-right: 3px"></div>Disco Óptico</span>
                    <span style="display:inline-block; margin-right: 8px"><div style="background-color: #FFA500; width: 8px; height: 8px; border-radius: 50%; display:inline-block; margin-right: 3px"></div>Vasos Sanguíneos</span>
                </th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center; background-color: #f2f2f2;">OD</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center; background-color: #f2f2f2;">OI</th>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 5px;">Vítreo</td>
                <td style="border: 1px solid #000; padding: 5px;">{{ $consulta['fondo_ojo_vitreo_od'] ?? '' }}</td>
                <td style="border: 1px solid #000; padding: 5px;">{{ $consulta['fondo_ojo_vitreo_oi'] ?? '' }}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 5px;">Mácula</td>
                <td style="border: 1px solid #000; padding: 5px;">{{ $consulta['fondo_ojo_macula_od'] ?? '' }}</td>
                <td style="border: 1px solid #000; padding: 5px;">{{ $consulta['fondo_ojo_macula_oi'] ?? '' }}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 5px;">Retina Periférica</td>
                <td style="border: 1px solid #000; padding: 5px;">{{ $consulta['fondo_ojo_retina_p_od'] ?? '' }}</td>
                <td style="border: 1px solid #000; padding: 5px;">{{ $consulta['fondo_ojo_retina_p_oi'] ?? '' }}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 5px;">Disco Óptico</td>
                <td style="border: 1px solid #000; padding: 5px;">{{ $consulta['fondo_ojo_disco_o_od'] ?? '' }}</td>
                <td style="border: 1px solid #000; padding: 5px;">{{ $consulta['fondo_ojo_disco_o_oi'] ?? '' }}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 5px;">Vasos Sanguíneos</td>
                <td style="border: 1px solid #000; padding: 5px;">{{ $consulta['fondo_ojo_vasos_od'] ?? '' }}</td>
                <td style="border: 1px solid #000; padding: 5px;">{{ $consulta['fondo_ojo_vasos_oi'] ?? '' }}</td>
            </tr>
        </table>

        <table width="100%" cellspacing="0" cellpadding="0" style="border: none;">
            <tr style="border: none;">
                <!-- Primera tabla -->
                <td width="48%" valign="top" style="padding-right: 15px; border: none;">
                    <table class="exam-table" width="100%" style="border: none;">
                        <thead>
                            <tr>
                                <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">Dilatación Pupilar OD</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border-color: #000;">
                                    <p>{{ is_array($consulta['f_o_dilat_pup_od']) ? implode(', ', $consulta['f_o_dilat_pup_od']) : $consulta['f_o_dilat_pup_od'] ?? '' }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                
                <!-- Espacio entre tablas -->
                <td width="4%" style="border: none;"></td>
                
                <!-- Segunda tabla -->
                <td width="48%" valign="top" style="padding-left: 15px; border: none;">
                    <table class="exam-table" width="100%" style="border: none;"> 
                        <thead>
                            <tr>
                                <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">Dilatación Pupilar OI</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border-color: #000;">
                                    <p>{{ is_array($consulta['f_o_dilat_pup_oi']) ? implode(', ', $consulta['f_o_dilat_pup_oi']) : $consulta['f_o_dilat_pup_oi'] ?? '' }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </table>

        <table width="100%" cellspacing="0" cellpadding="0" style="border: none;">
            <tr style="border: none;">
                <!-- Primera tabla -->
                <td width="48%" valign="top" style="padding-right: 15px; border: none;">
                    <table class="exam-table" width="100%" style="border: none;">
                        <thead>
                            <tr>
                                <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">LOCS tres OD</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border-color: #000;">
                                    <p>{{ is_array($consulta['f_o_locs_tres_od']) ? implode(', ', $consulta['f_o_locs_tres_od']) : $consulta['f_o_locs_tres_od'] ?? '' }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                
                <!-- Espacio entre tablas -->
                <td width="4%" style="border: none;"></td>
                
                <!-- Segunda tabla -->
                <td width="48%" valign="top" style="padding-left: 15px; border: none;">
                    <table class="exam-table" width="100%" style="border: none;"> 
                        <thead>
                            <tr>
                                <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">LOCS tres OI</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border-color: #000;">
                                    <p>{{ is_array($consulta['f_o_locs_tres_oi']) ? implode(', ', $consulta['f_o_locs_tres_oi']) : $consulta['f_o_locs_tres_oi'] ?? '' }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </table>

        <table width="100%" cellspacing="0" cellpadding="0" style="border: none;">
            <tr style="border: none;">
                <!-- Primera tabla -->
                <td width="48%" valign="top" style="padding-right: 15px; border: none;">
                    <table class="exam-table" width="100%" style="border: none;">
                        <thead>
                            <tr>
                                <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">Fundoscopia OD</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border-color: #000;">
                                    <p>{{ is_array($consulta['f_o_fundoscopia_od']) ? implode(', ', $consulta['f_o_fundoscopia_od']) : $consulta['f_o_fundoscopia_od'] ?? '' }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                
                <!-- Espacio entre tablas -->
                <td width="4%" style="border: none;"></td>
                
                <!-- Segunda tabla -->
                <td width="48%" valign="top" style="padding-left: 15px; border: none;">
                    <table class="exam-table" width="100%" style="border: none;">
                        <thead>
                            <tr>
                                <th class="texto-centrado" style="border-color: #000; background-color: #f2f2f2;">Fundoscopia OI</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border-color: #000;">
                                    <p>{{ is_array($consulta['f_o_fundoscopia_oi']) ? implode(', ', $consulta['f_o_fundoscopia_oi']) : $consulta['f_o_fundoscopia_oi'] ?? '' }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </table>
        <!-- Campos adicionales del fondo de ojo -->
        <strong>Conclusión:</strong>
        <p class="texto-parrafo">{{ is_array($consulta['f_o_conclusion']) ? implode(', ', $consulta['f_o_conclusion']) : $consulta['f_o_conclusion'] ?? '' }}</p>
        <strong style="margin-top: 10px;">Plan:</strong>
        <p class="texto-parrafo">{{ is_array($consulta['f_o_plan']) ? implode(', ', $consulta['f_o_plan']) : $consulta['f_o_plan'] ?? '' }}</p>
    </div>

    <div class="page-break"></div>

    <!-- DIAGNOSTICO (AMBOS) -->
    <div class="section">
        <div class="section-title">DIAGNOSTICO</div>
        <p class="texto-parrafo">{{ is_array($consulta['impresion_diagnostica']) ? implode(', ', $consulta['impresion_diagnostica']) : $consulta['impresion_diagnostica'] ?? '' }}</p>
    </div>

    <!-- Tratamiento (AMBOS) -->
    <div class="section">
        <div class="section-title">TRATAMIENTO</div>
        <p class="texto-parrafo">{{ is_array($consulta['tratamiento']) ? implode(', ', $consulta['tratamiento']) : $consulta['tratamiento'] ?? '' }}</p>
    </div>

    <!-- Plan (AMBOS) -->
    <div class="section">
        <div class="section-title">PLAN</div>
        <p class="texto-parrafo">{{ is_array($consulta['plan']) ? implode(', ', $consulta['plan']) : $consulta['plan'] ?? '' }}</p>
    </div>

    <!-- Comentarios (AMBOS) -->
    <div class="section">
        <div class="section-title">COMENTARIOS</div>
        <p class="texto-parrafo">{{ is_array($consulta['comentario']) ? implode(', ', $consulta['comentario']) : $consulta['comentario'] ?? '' }}</p>
    </div>

    <!-- Firmas (SIEMPRE) -->
    <div class="footer" style="display: block;">
        <div style="margin-top: 50px; display: block; text-align: right;">
            __________________________<br>
            Lic. Médico
        </div>
    </div>
</body>
</html>