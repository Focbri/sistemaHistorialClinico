<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Consulta Médica - {{ $consulta->paciente->nombres }} {{ $consulta->paciente->apellido_paterno }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        
        /* Encabezado */
        .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15pt;
            padding-bottom: 10pt;
            border-bottom: 1pt solid #333;
        }
        
        .logo-container {
            width: 40%;
        }
        
        .logo {
            max-width: 100%;
        }
        
        .info-header {
            width: 100%;
            text-align: right;
        }
        
        .codigo-consulta {
            font-size: 12pt;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 5pt;
        }
        
        .fechas-consulta {
            font-size: 9pt;
            color: #7f8c8d;
        }
        
        /* Resto de estilos (mantener los que ya tienes) */
        .section {
            margin-bottom: 15pt;
            page-break-inside: avoid;
        }
        .section-title {
            background-color: #f0f0f0;
            padding: 3pt 5pt;
            font-weight: bold;
            border-left: 3pt solid #8FDBF1;
            margin-bottom: 8pt;
            font-size: 11pt;
        }
        .patient-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15pt;
        }
        .patient-table td {
            padding: 3pt;
            vertical-align: top;
            font-size: 9pt;
        }
        .patient-table .label {
            font-weight: bold;
            width: 25%;
            background-color: #f8f8f8;
        }
        .two-columns {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10pt;
        }
        .two-columns td {
            width: 50%;
            vertical-align: top;
            padding: 3pt;
            font-size: 9pt;
        }
        .exam-table {
            width: 100%;
            border-collapse: collapse;
            margin: 8pt 0;
            font-size: 8pt;
        }
        .exam-table th, .exam-table td {
            border: 0.5pt solid #ddd;
            padding: 3pt;
            text-align: center;
        }
        .exam-table th {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        .eye-diagram-container {
            position: relative;
            height: 120pt;
            margin: 15pt 0;
        }
        .eye-diagram {
            position: absolute;
            width: 100pt;
            height: 100pt;
            border-radius: 50%;
            border: 1pt solid #333;
            background-color: #f8f8f8;
        }
        .eye-diagram-od {
            left: 30pt;
        }
        .eye-diagram-oi {
            right: 30pt;
        }
        .marker {
            position: absolute;
            width: 6pt;
            height: 6pt;
            border-radius: 50%;
        }
        .marker-blue { background-color: #0000FF; }
        .marker-red { background-color: #FF0000; }
        .marker-green { background-color: #00AA00; }
        .marker-purple { background-color: #800080; }
        .marker-orange { background-color: #FFA500; }
        .diagnosis-tag {
            display: inline-block;
            background-color: #e0e0e0;
            padding: 1pt 3pt;
            margin: 1pt;
            border-radius: 2pt;
            font-size: 8pt;
        }
        .file-list {
            margin: 3pt 0;
            padding-left: 10pt;
        }
        .file-item {
            margin-bottom: 2pt;
            font-size: 9pt;
        }
        .page-break {
            page-break-after: always;
        }
        .signature-area {
            margin-top: 20pt;
            border-top: 0.5pt dashed #333;
            padding-top: 10pt;
            text-align: center;
            font-size: 9pt;
        }
    </style>
</head>
<body>
    <div class="page">
        <!-- Encabezado modificado para DOMPDF -->
    <div style="width: 100%; margin-bottom: 15pt; border-bottom: 1pt solid #333;">
        <!-- Fila superior: Logo a la izquierda, código/fecha a la derecha -->
        <table width="100%" cellspacing="0" cellpadding="0">
            <tr>
                <!-- Columna del logo -->
                <td width="50%" style="vertical-align: top; text-align: left;">
                    <img src="{{ $images['logo'] }}" style="height: 180px; width: auto;" alt="Logo">
                    <!-- Ajusta el height según necesites -->
                </td>
                
                <!-- Columna del código y fecha -->
                <td width="50%" style="vertical-align: top; text-align: right;">
                    <div class="codigo-consulta">{{ $codigoConsulta }}</div>
                    <div class="fechas-consulta">
                        Fecha: {{ $fechaConsulta }}<br>
                    </div>
                </td>
            </tr>
        </table>
        
        <!-- Título centrado debajo -->
        <div style="text-align: center; margin-top: 10pt;">
            <h2 style="margin: 0; padding: 0;">Historia Clínica</h2>
        </div>
    </div>
        <!-- Información del Paciente -->
        <div class="section">
            <div class="section-title">DATOS PERSONALES</div>
            <table class="patient-table">
                <tr>
                    <td><strong>Apellido Paterno:</strong> {{ $consulta->paciente->apellido_paterno }}</td>
                    <td><strong>Fecha Nacimiento:</strong> {{ $consulta->paciente->fecha_nacimiento }}</td>
                </tr>
                <tr>
                    <td><strong>Apellido Materno:</strong> {{ $consulta->paciente->apellido_materno }}</td>
                    <td><strong>Edad:</strong> {{ $consulta->paciente->edad }} años</td>
                </tr>
                <tr>
                    <td><strong>Nombres:</strong> {{ $consulta->paciente->nombres }}</td>
                    <td><strong>Peso:</strong> {{ $consulta->paciente->peso }} kg</td>
                </tr>
                <tr>
                    <td><strong>Sexo:</strong> {{ $consulta->paciente->sexo }}</td>
                    <td><strong>DNI:</strong> {{ $consulta->paciente->dni }}</td>
                </tr>
                <tr>
                    <td><strong>Estado Civil:</strong> {{ $consulta->paciente->estado_civil }}</td>
                    <td><strong>Teléfono:</strong> {{ $consulta->paciente->telefono }}</td>
                </tr>
                <tr>
                    <td><strong>Ocupación:</strong> {{ $consulta->paciente->ocupacion }}</td>
                    <td><strong>Email:</strong> {{ $consulta->paciente->email }}</td>
                </tr>
                <tr>
                    <td><strong>Procedencia:</strong> {{ $consulta->paciente->procedencia }}</td>
                    <td><strong>Acompañante:</strong> {{ $consulta->paciente->acompañante }}</td>
                </tr>
                <tr>
                    <td><strong>Domicilio:</strong> {{ $consulta->paciente->direccion }}</td>
                    <td><strong>Referido:</strong> {{ $consulta->paciente->referido }}</td>
                </tr>
            </table>
        </div>

        @if(strtoupper($consulta->tipo_consulta) === 'INICIO')
            <!-- 1. Antecedentes Personales -->
            <div class="section">
                <div class="section-title">1. ANTECEDENTES PERSONALES</div>
                <table class="two-columns">
                    <tr>
                        <td><strong>HTA:</strong> {{ $consulta->antecedentes_personales_hta ?: 'No' }}</td>
                        <td><strong>DM:</strong> {{ $consulta->antecedentes_personales_dm ?: 'No' }}</td>
                    </tr>
                    <tr>
                        <td><strong>Alergias:</strong> {{ $consulta->antecedentes_personales_alergias ?: 'No' }}</td>
                        <td><strong>Otros:</strong> {{ $consulta->antecedentes_personales_otros ?: 'Ninguno' }}</td>
                    </tr>
                </table>
            </div>

            <!-- 2. Antecedentes Familiares -->
            <div class="section">
                <div class="section-title">2. ANTECEDENTES PATOLÓGICOS FAMILIARES</div>
                <p style="font-size: 9pt;">{{ $consulta->antecedentes_patologicos_familiares ?: 'Ninguno registrado' }}</p>
            </div>

            <!-- 3. Cirugías Previas -->
            <div class="section">
                <div class="section-title">3. CIRUGÍAS PREVIAS</div>
                <p style="font-size: 9pt;">{{ $consulta->cirugias_previas ?: 'Ninguna registrada' }}</p>
            </div>

            <!-- 4. Motivo de Consulta -->
            <div class="section">
                <div class="section-title">4. MOTIVO DE CONSULTA</div>
                <p style="font-size: 9pt;">{{ $consulta->motivo_consulta }}</p>
            </div>
        @else
            <!-- 1. Evoluciones -->
            <div class="section">
                <div class="section-title">1. EVOLUCIONES</div>
                <p style="font-size: 9pt;">{{ $consulta->evoluciones }}</p>
            </div>
        @endif

        <!-- 5. Examen Ocular -->
        <div class="section">
            <div class="section-title">5. EXAMEN OCULAR</div>
            
            <!-- Agudeza Visual -->
            <div class="section-title" style="margin-top: 15pt;">5.1 Agudeza Visual</div>
            <table class="exam-table">
                <tr>
                    <th></th>
                    <th>SC</th>
                    <th>CAE</th>
                    <th>CC</th>
                </tr>
                <tr>
                    <th>Ojo Derecho</th>
                    <td>{{ $consulta->examen->examen_av_sc_od ?? '-' }}</th>
                    <td>{{ $consulta->examen->examen_av_cae_od ?? '-' }}</th>
                    <td>{{ $consulta->examen->examen_av_cc_od ?? '-' }}</th>
                </tr>
                <tr>
                    <th>Ojo Izquierdo</th>
                    <td>{{ $consulta->examen->examen_av_sc_od ?? '-' }}</th>
                    <td>{{ $consulta->examen->examen_av_cae_od ?? '-' }}</th>
                    <td>{{ $consulta->examen->examen_av_cc_od ?? '-' }}</th>
                </tr>
            </table>

            <!-- TIPO DE PRESION -->
            <div class="section-title" style="margin-top: 15pt;">5.2 Tipo de Presión: {{ $consulta->examen->examen_pi_tipo ?? '-' }}</div>
            <table class="exam-table">
                <tr>
                    <th>Ojo Derecho</th>
                    <th>Ojo Izquierdo</th>
                </tr>
                <tr>
                    <td>{{ $consulta->examen->examen_pi_od ?? '-' }}</th>
                    <td>{{ $consulta->examen->examen_pi_oi ?? '-' }}</th>
                </tr>
            </table>

            <!-- Autorefractometria -->
            <div class="section-title" style="margin-top: 15pt;">5.3 Autorefractometria</div>
            <table class="exam-table">
                <tr>
                    <th></th>
                    <th>Sph</th>
                    <th>Cyl</th>
                    <th>Ax</th>
                </tr>
                <tr>
                    <th>Ojo Derecho</th>
                    <td>{{ $consulta->examen->examen_ar_sph_od ?? '-' }}</th>
                    <td>{{ $consulta->examen->examen_ar_cyl_od ?? '-' }}</th>
                    <td>{{ $consulta->examen->examen_ar_ax_od ?? '-' }}</th>
                </tr>
                <tr>
                    <th>Ojo Izquierdo</th>
                    <td>{{ $consulta->examen->examen_ar_sph_oi ?? '-' }}</th>
                    <td>{{ $consulta->examen->examen_ar_cyl_oi ?? '-' }}</th>
                    <td>{{ $consulta->examen->examen_ar_ax_oi ?? '-' }}</th>
                </tr>
            </table>

            <!-- Keratometria -->
            <div class="section-title" style="margin-top: 15pt;">5.4 Keratometria</div>
            <table class="exam-table">
                <tr>
                    <th></th>
                    <th>QD1</th>
                    <th>QD2</th>
                    <th>EJE</th>
                </tr>
                <tr>
                    <th>Ojo Derecho</th>
                    <td>{{ $consulta->examen->examen_keratometria_qd1_od ?? '-' }}</th>
                    <td>{{ $consulta->examen->examen_keratometria_qd2_od ?? '-' }}</th>
                    <td>{{ $consulta->examen->examen_keratometria_eje_od ?? '-' }}</th>
                </tr>
                <tr>
                    <th>Ojo Izquierdo</th>
                    <td>{{ $consulta->examen->examen_keratometria_qd1_oi ?? '-' }}</th>
                    <td>{{ $consulta->examen->examen_keratometria_qd2_oi ?? '-' }}</th>
                    <td>{{ $consulta->examen->examen_keratometria_eje_oi ?? '-' }}</th>
                </tr>
            </table>

            <!-- Examen Antiguo - Distancia -->
            <div class="section-title" style="margin-top: 15pt;">5.5.1 EXAMEN ANTIGUO - Distancia</div>
            <table class="exam-table">
                <tr>
                    <th>Ojo</th>
                    <th>Esfera</th>
                    <th>Cilindro</th>
                    <th>Eje</th>
                    <th>DIP</th>
                </tr>
                <tr>
                    <td>OD</td>
                    <td>{{ $consulta->examen->exam_old_distancia_esfera_od ?? '-' }}</td>
                    <td>{{ $consulta->examen->exam_old_distancia_cilindro_od ?? '-' }}</td>
                    <td>{{ $consulta->examen->exam_old_distancia_eje_od ?? '-' }}</td>
                    <td rowspan="2">{{ $consulta->examen->exam_old_distancia_dip ?? '-' }}</td>
                </tr>
                <tr>
                    <td>OI</td>
                    <td>{{ $consulta->examen->exam_old_distancia_esfera_oi ?? '-' }}</td>
                    <td>{{ $consulta->examen->exam_old_distancia_cilindro_oi ?? '-' }}</td>
                    <td>{{ $consulta->examen->exam_old_distancia_eje_oi ?? '-' }}</td>
                </tr>
            </table>

            <!-- Examen Antiguo - Cerca -->
            <div class="section-title" style="margin-top: 15pt;">5.5.2 EXAMEN ANTIGUO - Cerca</div>
            <table class="exam-table">
                <tr>
                    <th>Ojo</th>
                    <th>Esfera</th>
                    <th>Cilindro</th>
                    <th>Eje</th>
                    <th>DIP</th>
                </tr>
                <tr>
                    <td>OD</td>
                    <td>{{ $consulta->examen->exam_old_cerca_esfera_od ?? '-' }}</td>
                    <td>{{ $consulta->examen->exam_old_cerca_cilindro_od ?? '-' }}</td>
                    <td>{{ $consulta->examen->exam_old_cerca_eje_od ?? '-' }}</td>
                    <td rowspan="2">{{ $consulta->examen->exam_old_cerca_dip ?? '-' }}</td>
                </tr>
                <tr>
                    <td>OI</td>
                    <td>{{ $consulta->examen->exam_old_cerca_esfera_oi ?? '-' }}</td>
                    <td>{{ $consulta->examen->exam_old_cerca_cilindro_oi ?? '-' }}</td>
                    <td>{{ $consulta->examen->exam_old_cerca_eje_oi ?? '-' }}</td>
                </tr>
            </table>

            <!-- Examen Nuevo - Distancia -->
            <div class="section-title" style="margin-top: 15pt;">5.6.1 EXAMEN NUEVO - Distancia</div>
            <table class="exam-table">
                <tr>
                    <th>Ojo</th>
                    <th>Esfera</th>
                    <th>Cilindro</th>
                    <th>Eje</th>
                    <th>DIP</th>
                </tr>
                <tr>
                    <td>OD</td>
                    <td>{{ $consulta->examen->exam_new_distancia_esfera_od ?? '-' }}</td>
                    <td>{{ $consulta->examen->exam_new_distancia_cilindro_od ?? '-' }}</td>
                    <td>{{ $consulta->examen->exam_new_distancia_eje_od ?? '-' }}</td>
                    <td rowspan="2">{{ $consulta->examen->exam_new_distancia_dip ?? '-' }}</td>
                </tr>
                <tr>
                    <td>OI</td>
                    <td>{{ $consulta->examen->exam_new_distancia_esfera_oi ?? '-' }}</td>
                    <td>{{ $consulta->examen->exam_new_distancia_cilindro_oi ?? '-' }}</td>
                    <td>{{ $consulta->examen->exam_new_distancia_eje_oi ?? '-' }}</td>
                </tr>
            </table>

            <!-- Examen Nuevo - Cerca -->
            <div class="section-title" style="margin-top: 15pt;">5.6.2 EXAMEN NUEVO - Cerca</div>
            <table class="exam-table">
                <tr>
                    <th>Ojo</th>
                    <th>Esfera</th>
                    <th>Cilindro</th>
                    <th>Eje</th>
                    <th>DIP</th>
                </tr>
                <tr>
                    <td>OD</td>
                    <td>{{ $consulta->examen->exam_new_cerca_esfera_od ?? '-' }}</td>
                    <td>{{ $consulta->examen->exam_new_cerca_cilindro_od ?? '-' }}</td>
                    <td>{{ $consulta->examen->exam_new_cerca_eje_od ?? '-' }}</td>
                    <td rowspan="2">{{ $consulta->examen->exam_new_cerca_dip ?? '-' }}</td>
                </tr>
                <tr>
                    <td>OI</td>
                    <td>{{ $consulta->examen->exam_new_cerca_esfera_oi ?? '-' }}</td>
                    <td>{{ $consulta->examen->exam_new_cerca_cilindro_oi ?? '-' }}</td>
                    <td>{{ $consulta->examen->exam_new_cerca_eje_oi ?? '-' }}</td>
                </tr>
            </table>
        </div>

        <!-- 6. Biomicroscopia -->
        <div class="section">
            <div class="section-title">6. BIOMICROSCOPIA</div>
            <table class="exam-table">
                <tr>
                    <th>Examen Físico</th>
                    <th>OD</th>
                    <th>OI</th>
                </tr>
                <tr>
                    <td>Movimientos Oculares</td>
                    <td>{{ $consulta->biomicroscopia_movoculares_od ?? '-' }}</td>
                    <td>{{ $consulta->biomicroscopia_movoculares_oi ?? '-' }}</td>
                </tr>
                <tr>
                    <td>Párpados</td>
                    <td>{{ $consulta->biomicroscopia_parpados_od ?? '-' }}</td>
                    <td>{{ $consulta->biomicroscopia_parpados_oi ?? '-' }}</td>
                </tr>
                <tr>
                    <td>Córnea</td>
                    <td>{{ $consulta->biomicroscopia_cornea_od ?? '-' }}</td>
                    <td>{{ $consulta->biomicroscopia_cornea_oi ?? '-' }}</td>
                </tr>
                <tr>
                    <td>Córnea Conjuntiva</td>
                    <td>{{ $consulta->biomicroscopia_corneaconj_od ?? '-' }}</td>
                    <td>{{ $consulta->biomicroscopia_corneaconj_oi ?? '-' }}</td>
                </tr>
                <tr>
                    <td>Cámara Anterior</td>
                    <td>{{ $consulta->biomicroscopia_ca_od ?? '-' }}</td>
                    <td>{{ $consulta->biomicroscopia_ca_oi ?? '-' }}</td>
                </tr>
                <tr>
                    <td>Iris</td>
                    <td>{{ $consulta->biomicroscopia_iris_od ?? '-' }}</td>
                    <td>{{ $consulta->biomicroscopia_iris_oi ?? '-' }}</td>
                </tr>
                <tr>
                    <td>Cristalino</td>
                    <td>{{ $consulta->biomicroscopia_cristalino_od ?? '-' }}</td>
                    <td>{{ $consulta->biomicroscopia_cristalino_oi ?? '-' }}</td>
                </tr>
            </table>
        </div>

        <!-- 7. Fondo de Ojo -->
        <div class="section">
    <div class="section-title">7. FONDO DE OJO</div>
    
    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
        <tr>
            <!-- Ojo Derecho -->
            <td width="50%" align="center" valign="top">
                <div style="position: relative; width: 250px; height: 250px; margin: 0 auto;">
                    <img src="{{ $images['ojo_derecho'] }}" 
                         style="width: 100%; height: 100%; object-fit: contain;" 
                         alt="Ojo Derecho">
                    
                    @php
                        // Procesamiento seguro de las posiciones
                        $posiciones = [];
                        if (!empty($consulta->fondo_ojo_posiciones)) {
                            $posiciones = is_array($consulta->fondo_ojo_posiciones) 
                                ? $consulta->fondo_ojo_posiciones 
                                : @json_decode($consulta->fondo_ojo_posiciones, true);
                        }
                        $colores = ['#0000FF', '#FF0000', '#00AA00', '#800080', '#FFA500'];
                    @endphp
                    
                    @if(is_array($posiciones))
                        @for($i = 1; $i <= 5; $i++)
                            @if(!empty($posiciones["OD_$i"]) && is_array($posiciones["OD_$i"]))
                                @php
                                    // Ajustar coordenadas al tamaño de la imagen (250x250)
                                    $x = $posiciones["OD_$i"]['x'] ?? 0;
                                    $y = $posiciones["OD_$i"]['y'] ?? 0;
                                    $left = min(max(($x / 250) * 100, 100), 0);
                                    $top = min(max(($y / 250) * 100, 100), 0);
                                @endphp
                                <div style="
                                    position: absolute;
                                    width: 12px;
                                    height: 12px;
                                    border-radius: 50%;
                                    background-color: {{ $colores[$i-1] ?? '#000000' }};
                                    left: {{ $left }}%;
                                    top: {{ $top }}%;
                                    margin-left: -6px;
                                    margin-top: -6px;
                                    border: 1px solid white;
                                    box-shadow: 0 0 3px rgba(0,0,0,0.5);
                                "></div>
                            @endif
                        @endfor
                    @endif
                </div>
                <div style="margin-top: 5px; font-size: 9pt; font-weight: bold;">Ojo Derecho (OD)</div>
            </td>
            
            <!-- Ojo Izquierdo -->
            <td width="50%" align="center" valign="top">
                <div style="position: relative; width: 250px; height: 250px; margin: 0 auto;">
                    <img src="{{ $images['ojo_izquierdo'] }}" 
                         style="width: 100%; height: 100%; object-fit: contain;" 
                         alt="Ojo Izquierdo">
                    
                    @if(is_array($posiciones))
                        @for($i = 1; $i <= 5; $i++)
                            @if(!empty($posiciones["OI_$i"]) && is_array($posiciones["OI_$i"]))
                                @php
                                    // Ajustar coordenadas al tamaño de la imagen (250x250)
                                    $x = $posiciones["OI_$i"]['x'] ?? 0;
                                    $y = $posiciones["OI_$i"]['y'] ?? 0;
                                    $left = min(max(($x / 250) * 100, 100), 0);
                                    $top = min(max(($y / 250) * 100, 100), 0);
                                @endphp
                                <div style="
                                    position: absolute;
                                    width: 12px;
                                    height: 12px;
                                    border-radius: 50%;
                                    background-color: {{ $colores[$i-1] ?? '#000000' }};
                                    left: {{ $left }}%;
                                    top: {{ $top }}%;
                                    margin-left: -6px;
                                    margin-top: -6px;
                                    border: 1px solid white;
                                    box-shadow: 0 0 3px rgba(0,0,0,0.5);
                                "></div>
                            @endif
                        @endfor
                    @endif
                </div>
                <div style="margin-top: 5px; font-size: 9pt; font-weight: bold;">Ojo Izquierdo (OI)</div>
            </td>
        </tr>
    </table>
    
    <!-- Tabla de resultados -->
    <table class="exam-table">
        <tr>
            <th>Estructura</th>
            <th>OD</th>
            <th>OI</th>
        </tr>
        <tr>
            <td>Vítreo</td>
            <td>{{ $consulta->fondo_ojo_vitreo_od ?? '-' }}</td>
            <td>{{ $consulta->fondo_ojo_vitreo_oi ?? '-' }}</td>
        </tr>
        <tr>
            <td>Mácula</td>
            <td>{{ $consulta->fondo_ojo_macula_od ?? '-' }}</td>
            <td>{{ $consulta->fondo_ojo_macula_oi ?? '-' }}</td>
        </tr>
        <tr>
            <td>Retina Periférica</td>
            <td>{{ $consulta->fondo_ojo_retina_p_od ?? '-' }}</td>
            <td>{{ $consulta->fondo_ojo_retina_p_oi ?? '-' }}</td>
        </tr>
        <tr>
            <td>Disco Óptico</td>
            <td>{{ $consulta->fondo_ojo_disco_o_od ?? '-' }}</td>
            <td>{{ $consulta->fondo_ojo_disco_o_oi ?? '-' }}</td>
        </tr>
        <tr>
            <td>Vasos Sanguíneos</td>
            <td>{{ $consulta->fondo_ojo_vasos_od ?? '-' }}</td>
            <td>{{ $consulta->fondo_ojo_vasos_oi ?? '-' }}</td>
        </tr>
    </table>
</div>

        <!-- 8. Impresión Diagnóstica -->
        <div class="section">
            <div class="section-title">8. IMPRESIÓN DIAGNÓSTICA</div>
            @if($consulta->impresion_diagnostica)
                @foreach(explode(';', $consulta->impresion_diagnostica) as $diagnostico)
                    <span class="diagnosis-tag">{{ trim($diagnostico) }}</span>
                @endforeach
            @else
                <p style="font-size: 9pt;">No se registraron diagnósticos</p>
            @endif
        </div>

        <!-- 9. Tratamiento -->
        <div class="section">
            <div class="section-title">9. TRATAMIENTO</div>
            <p style="font-size: 9pt;">{{ $consulta->tratamiento ?: 'No se indicó tratamiento' }}</p>
        </div>

        <!-- 10. Plan -->
        <div class="section">
            <div class="section-title">10. PLAN</div>
            <p style="font-size: 9pt;">{{ $consulta->plan ?: 'No se definió plan' }}</p>
        </div>

        <!-- 11. Exámenes Indicados -->
        <div class="section">
            <div class="section-title">11. EXÁMENES INDICADOS</div>
            
            @if($consulta->examenes_indicados_img || $consulta->examenes_indicados_archivos)
                <p style="font-weight: bold; font-size: 9pt;">Imágenes:</p>
                @if($consulta->examenes_indicados_img && count(json_decode($consulta->examenes_indicados_img, true)))
                    <div class="file-list">
                        @foreach(json_decode($consulta->examenes_indicados_img, true) as $imagen)
                            <div class="file-item">- {{ $imagen['nombre_original'] ?? basename($imagen['ruta']) }}</div>
                        @endforeach
                    </div>
                @else
                    <p style="font-size: 9pt;">No hay imágenes adjuntas</p>
                @endif
                
                <p style="font-weight: bold; font-size: 9pt; margin-top: 5pt;">Documentos:</p>
                @if($consulta->examenes_indicados_archivos && count(json_decode($consulta->examenes_indicados_archivos, true)))
                    <div class="file-list">
                        @foreach(json_decode($consulta->examenes_indicados_archivos, true) as $archivo)
                            <div class="file-item">- {{ $archivo['nombre_original'] ?? basename($archivo['ruta']) }}</div>
                        @endforeach
                    </div>
                @else
                    <p style="font-size: 9pt;">No hay documentos adjuntos</p>
                @endif
            @else
                <p style="font-size: 9pt;">No se indicaron exámenes complementarios</p>
            @endif
        </div>

        <!-- Firma y fecha -->
        <div class="signature-area">
            <table width="100%">
                <tr>
                    <td width="50%" style="text-align: center;">
                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>
                        <p>___________________________</p>
                        <p>Firma del Médico</p>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>