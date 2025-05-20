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
        <h1>VISUAL OPHTHALMICS</h1>
        <p>Fecha: {{ now()->format('d/m/Y H:i') }}</p>
        <p>Tipo de Consulta: {{ $consulta['tipo_consulta'] ?? 'No especificado' }}</p>
    </div>

    <!-- Datos del Paciente (SIEMPRE) -->
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

    @if($consulta['tipo_consulta'] == 'inicio')
        <!-- Antecedentes SOLO INICIO -->
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
            
            <div class="section-title">FAMILIARES</div>
            @if(!empty($consulta['antecedentes_patologicos_familiares']))
            <p><strong>Familiares:</strong> {{ is_array($consulta['antecedentes_patologicos_familiares']) ? implode(', ', $consulta['antecedentes_patologicos_familiares']) : $consulta['antecedentes_patologicos_familiares'] }}</p>
            @endif
            
            <div class="section-title">CIRUGIAS PREVIAS</div>
            @if(!empty($consulta['cirugias_previas']))
            <p><strong>Cirugías Previas:</strong> {{ is_array($consulta['cirugias_previas']) ? implode(', ', $consulta['cirugias_previas']) : $consulta['cirugias_previas'] }}</p>
            @endif
        </div>

        <!-- Motivo de Consulta SOLO INICIO -->
        <div class="section">
            <div class="section-title">MOTIVO DE CONSULTA</div>
            @if(!empty($consulta['motivo_consulta_inicio']))
            <p><strong>Inicio:</strong> {{ is_array($consulta['motivo_consulta_inicio']) ? implode(', ', $consulta['motivo_consulta_inicio']) : $consulta['motivo_consulta_inicio'] }}</p>
            @endif
            @if(!empty($consulta['motivo_consulta_signos']))
            <p><strong>Signos:</strong> {{ is_array($consulta['motivo_consulta_signos']) ? implode(', ', $consulta['motivo_consulta_signos']) : $consulta['motivo_consulta_signos'] }}</p>
            @endif
            @if(!empty($consulta['motivo_consulta_enfermedad']))
            <p><strong>Enfermedad:</strong> {{ is_array($consulta['motivo_consulta_enfermedad']) ? implode(', ', $consulta['motivo_consulta_enfermedad']) : $consulta['motivo_consulta_enfermedad'] }}</p>
            @endif
            @if(!empty($consulta['motivo_consulta_otros']))
            <p><strong>Otros:</strong> {{ is_array($consulta['motivo_consulta_otros']) ? implode(', ', $consulta['motivo_consulta_otros']) : $consulta['motivo_consulta_otros'] }}</p>
            @endif
        </div>
    @endif

    @if($consulta['tipo_consulta'] == 'evolucion')
        <!-- EVOLUCIONES SOLO EVOLUCION-->
        <div class="section">
            <div class="section-title">EVOLUCIONES</div>
            @if(!empty($consulta['evoluciones']))
            <p><strong>Evoluciones:</strong> {{ is_array($consulta['evoluciones']) ? implode(', ', $consulta['evoluciones']) : $consulta['evoluciones'] }}</p>
            @endif
        </div>
    @endif

    <!-- Examen Ocular (AMBOS) -->
    @if(!empty($consulta['examen']))
    <div class="section">
        <div class="section-title">EXAMEN OCULAR</div>
            <!-- AV (Agudeza Visual) -->
            <p><strong>AV SC OD:</strong> {{ $consulta['examen']['examen_av_sc_od'] ?? 'No registrado' }}</p>
            <p><strong>AV CAE OD:</strong> {{ $consulta['examen']['examen_av_cae_od'] ?? 'No registrado' }}</p>
            <p><strong>AV CC OD:</strong> {{ $consulta['examen']['examen_av_cc_od'] ?? 'No registrado' }}</p>
            <p><strong>AV SC OI:</strong> {{ $consulta['examen']['examen_av_sc_oi'] ?? 'No registrado' }}</p>
            <p><strong>AV CAE OI:</strong> {{ $consulta['examen']['examen_av_cae_oi'] ?? 'No registrado' }}</p>
            <p><strong>AV CC OI:</strong> {{ $consulta['examen']['examen_av_cc_oi'] ?? 'No registrado' }}</p>

            <!-- PI (Presión Intraocular) -->
            <p><strong>PI TIPO:</strong> {{ $consulta['examen']['examen_pi_tipo'] ?? 'No registrado' }}</p>
            <p><strong>PI OD:</strong> {{ $consulta['examen']['examen_pi_od'] ?? 'No registrado' }}</p>
            <p><strong>PI OI:</strong> {{ $consulta['examen']['examen_pi_oi'] ?? 'No registrado' }}</p>

            <!-- Autorefractometria -->
            <p><strong>AR SPH OD:</strong> {{ $consulta['examen']['examen_ar_sph_od'] ?? 'No registrado' }}</p>
            <p><strong>AR CYL OD:</strong> {{ $consulta['examen']['examen_ar_cyl_od'] ?? 'No registrado' }}</p>
            <p><strong>AR AX OD:</strong> {{ $consulta['examen']['examen_ar_ax_od'] ?? 'No registrado' }}</p>
            <p><strong>AR SPH OI:</strong> {{ $consulta['examen']['examen_ar_sph_oi'] ?? 'No registrado' }}</p>
            <p><strong>AR CYL OI:</strong> {{ $consulta['examen']['examen_ar_cyl_oi'] ?? 'No registrado' }}</p>
            <p><strong>AR AX OI:</strong> {{ $consulta['examen']['examen_ar_ax_oi'] ?? 'No registrado' }}</p>

            <!-- Queratometría -->
            <p><strong>QD1 OD:</strong> {{ $consulta['examen']['examen_keratometria_qd1_od'] ?? 'No registrado' }}</p>
            <p><strong>QD2 OD:</strong> {{ $consulta['examen']['examen_keratometria_qd2_od'] ?? 'No registrado' }}</p>
            <p><strong>EJE OD:</strong> {{ $consulta['examen']['examen_keratometria_eje_od'] ?? 'No registrado' }}</p>
            <p><strong>QD1 OI:</strong> {{ $consulta['examen']['examen_keratometria_qd1_oi'] ?? 'No registrado' }}</p>
            <p><strong>QD2 OI:</strong> {{ $consulta['examen']['examen_keratometria_qd2_oi'] ?? 'No registrado' }}</p>
            <p><strong>EJE OI:</strong> {{ $consulta['examen']['examen_keratometria_eje_oi'] ?? 'No registrado' }}</p>
    </div>
    @endif

    <!-- BIOMICROSCOPIA (AMBOS) -->
    <div class="section">
        <div class="section-title">BIOMICROSCOPIA</div>
        @if(!empty($consulta['biomicroscopia_movoculares_od']))
        <p><strong>Movimiento Ocular OD:</strong> {{ is_array($consulta['biomicroscopia_movoculares_od']) ? implode(', ', $consulta['biomicroscopia_movoculares_od']) : $consulta['biomicroscopia_movoculares_od'] }}</p>
        @endif
        @if(!empty($consulta['biomicroscopia_parpados_od']))
        <p><strong>Párpados OD:</strong> {{ is_array($consulta['biomicroscopia_parpados_od']) ? implode(', ', $consulta['biomicroscopia_parpados_od']) : $consulta['biomicroscopia_parpados_od'] }}</p>
        @endif
        @if(!empty($consulta['biomicroscopia_cornea_od']))
        <p><strong>Cornea OD:</strong> {{ is_array($consulta['biomicroscopia_cornea_od']) ? implode(', ', $consulta['biomicroscopia_cornea_od']) : $consulta['biomicroscopia_cornea_od'] }}</p>
        @endif
        @if(!empty($consulta['biomicroscopia_corneaconj_od']))
        <p><strong>Conjuntiva OD:</strong> {{ is_array($consulta['biomicroscopia_corneaconj_od']) ? implode(', ', $consulta['biomicroscopia_corneaconj_od']) : $consulta['biomicroscopia_corneaconj_od'] }}</p>
        @endif
        @if(!empty($consulta['biomicroscopia_ca_od']))
        <p><strong>Cámara Anterior OD:</strong> {{ is_array($consulta['biomicroscopia_ca_od']) ? implode(', ', $consulta['biomicroscopia_ca_od']) : $consulta['biomicroscopia_ca_od'] }}</p>
        @endif
        @if(!empty($consulta['biomicroscopia_iris_od']))
        <p><strong>Iris OD:</strong> {{ is_array($consulta['biomicroscopia_iris_od']) ? implode(', ', $consulta['biomicroscopia_iris_od']) : $consulta['biomicroscopia_iris_od'] }}</p>
        @endif
        @if(!empty($consulta['biomicroscopia_cristalino_od']))
        <p><strong>Cristalino OD:</strong> {{ is_array($consulta['biomicroscopia_cristalino_od']) ? implode(', ', $consulta['biomicroscopia_cristalino_od']) : $consulta['biomicroscopia_cristalino_od'] }}</p>
        @endif

        @if(!empty($consulta['biomicroscopia_movoculares_oi']))
        <p><strong>Movimiento Ocular OI:</strong> {{ is_array($consulta['biomicroscopia_movoculares_oi']) ? implode(', ', $consulta['biomicroscopia_movoculares_oi']) : $consulta['biomicroscopia_movoculares_oi'] }}</p>
        @endif
        @if(!empty($consulta['biomicroscopia_parpados_oi']))
        <p><strong>Párpados OI:</strong> {{ is_array($consulta['biomicroscopia_parpados_oi']) ? implode(', ', $consulta['biomicroscopia_parpados_oi']) : $consulta['biomicroscopia_parpados_oi'] }}</p>
        @endif
        @if(!empty($consulta['biomicroscopia_cornea_oi']))
        <p><strong>Cornea OI:</strong> {{ is_array($consulta['biomicroscopia_cornea_oi']) ? implode(', ', $consulta['biomicroscopia_cornea_oi']) : $consulta['biomicroscopia_cornea_oi'] }}</p>
        @endif
        @if(!empty($consulta['biomicroscopia_corneaconj_oi']))
        <p><strong>Conjuntiva OI:</strong> {{ is_array($consulta['biomicroscopia_corneaconj_oi']) ? implode(', ', $consulta['biomicroscopia_corneaconj_oi']) : $consulta['biomicroscopia_corneaconj_oi'] }}</p>
        @endif
        @if(!empty($consulta['biomicroscopia_ca_oi']))
        <p><strong>Cámara Anterior OI:</strong> {{ is_array($consulta['biomicroscopia_ca_oi']) ? implode(', ', $consulta['biomicroscopia_ca_oi']) : $consulta['biomicroscopia_ca_oi'] }}</p>
        @endif
        @if(!empty($consulta['biomicroscopia_iris_oi']))
        <p><strong>Iris OI:</strong> {{ is_array($consulta['biomicroscopia_iris_oi']) ? implode(', ', $consulta['biomicroscopia_iris_oi']) : $consulta['biomicroscopia_iris_oi'] }}</p>
        @endif
        @if(!empty($consulta['biomicroscopia_cristalino_oi']))
        <p><strong>Cristalino OI:</strong> {{ is_array($consulta['biomicroscopia_cristalino_oi']) ? implode(', ', $consulta['biomicroscopia_cristalino_oi']) : $consulta['biomicroscopia_cristalino_oi'] }}</p>
        @endif
    </div>

    <!-- FONDO DE OJO (AMBOS) -->
    <div class="section">
        <div class="section-title">FONDO DE OJO</div>   
        
        <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
            <tr>
                <!-- Ojo Derecho -->
                <td width="50%" align="center" valign="top">
                    <div style="position: relative; width: 200px; height: 200px; margin: 0 auto; border: 1px solid #f0f0f0; overflow: hidden;">
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
                <td width="50%" align="center" valign="top">
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
                <th style="border: 1px solid #ddd; padding: 5px; text-align: left;">Estructura</th>
                <th style="border: 1px solid #ddd; padding: 5px; text-align: left;">OD</th>
                <th style="border: 1px solid #ddd; padding: 5px; text-align: left;">OI</th>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 5px;">Vítreo</td>
                <td style="border: 1px solid #ddd; padding: 5px;">{{ $consulta['fondo_ojo_vitreo_od'] ?? '-' }}</td>
                <td style="border: 1px solid #ddd; padding: 5px;">{{ $consulta['fondo_ojo_vitreo_oi'] ?? '-' }}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 5px;">Mácula</td>
                <td style="border: 1px solid #ddd; padding: 5px;">{{ $consulta['fondo_ojo_macula_od'] ?? '-' }}</td>
                <td style="border: 1px solid #ddd; padding: 5px;">{{ $consulta['fondo_ojo_macula_oi'] ?? '-' }}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 5px;">Retina Periférica</td>
                <td style="border: 1px solid #ddd; padding: 5px;">{{ $consulta['fondo_ojo_retina_p_od'] ?? '-' }}</td>
                <td style="border: 1px solid #ddd; padding: 5px;">{{ $consulta['fondo_ojo_retina_p_oi'] ?? '-' }}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 5px;">Disco Óptico</td>
                <td style="border: 1px solid #ddd; padding: 5px;">{{ $consulta['fondo_ojo_disco_o_od'] ?? '-' }}</td>
                <td style="border: 1px solid #ddd; padding: 5px;">{{ $consulta['fondo_ojo_disco_o_oi'] ?? '-' }}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 5px;">Vasos Sanguíneos</td>
                <td style="border: 1px solid #ddd; padding: 5px;">{{ $consulta['fondo_ojo_vasos_od'] ?? '-' }}</td>
                <td style="border: 1px solid #ddd; padding: 5px;">{{ $consulta['fondo_ojo_vasos_oi'] ?? '-' }}</td>
            </tr>
        </table>

        <!-- Campos adicionales del fondo de ojo -->
        @if(!empty($consulta['f_o_dilat_pup_od']))
        <p><strong>Dilatación Pupilar OD:</strong> {{ is_array($consulta['f_o_dilat_pup_od']) ? implode(', ', $consulta['f_o_dilat_pup_od']) : $consulta['f_o_dilat_pup_od'] }}</p>
        @endif
        @if(!empty($consulta['f_o_dilat_pup_oi']))
        <p><strong>Dilatación Pupilar OI:</strong> {{ is_array($consulta['f_o_dilat_pup_oi']) ? implode(', ', $consulta['f_o_dilat_pup_oi']) : $consulta['f_o_dilat_pup_oi'] }}</p>
        @endif
        @if(!empty($consulta['f_o_locs_tres_od']))
        <p><strong>Clasificación LOCS III OD:</strong> {{ is_array($consulta['f_o_locs_tres_od']) ? implode(', ', $consulta['f_o_locs_tres_od']) : $consulta['f_o_locs_tres_od'] }}</p>
        @endif
        @if(!empty($consulta['f_o_locs_tres_oi']))
        <p><strong>Clasificación LOCS III OI:</strong> {{ is_array($consulta['f_o_locs_tres_oi']) ? implode(', ', $consulta['f_o_locs_tres_oi']) : $consulta['f_o_locs_tres_oi'] }}</p>
        @endif
        @if(!empty($consulta['f_o_conclusion']))
        <p><strong>Conclusión:</strong> {{ is_array($consulta['f_o_conclusion']) ? implode(', ', $consulta['f_o_conclusion']) : $consulta['f_o_conclusion'] }}</p>
        @endif
        @if(!empty($consulta['f_o_plan']))
        <p><strong>Plan:</strong> {{ is_array($consulta['f_o_plan']) ? implode(', ', $consulta['f_o_plan']) : $consulta['f_o_plan'] }}</p>
        @endif
    </div>

    <!-- DIAGNOSTICO (AMBOS) -->
    <div class="section">
        <div class="section-title">DIAGNOSTICO</div>
        @if(!empty($consulta['impresion_diagnostica']))
        <p><strong>Diagnóstico:</strong> {{ is_array($consulta['impresion_diagnostica']) ? implode(', ', $consulta['impresion_diagnostica']) : $consulta['impresion_diagnostica'] }}</p>
        @endif
    </div>

    <!-- Tratamiento (AMBOS) -->
    <div class="section">
        <div class="section-title">TRATAMIENTO</div>
        @if(!empty($consulta['tratamiento']))
        <p><strong>Tratamiento:</strong> {{ is_array($consulta['tratamiento']) ? implode(', ', $consulta['tratamiento']) : $consulta['tratamiento'] }}</p>
        @endif
    </div>

    <!-- Plan (AMBOS) -->
    <div class="section">
        <div class="section-title">PLAN</div>
        @if(!empty($consulta['plan']))
        <p><strong>Plan:</strong> {{ is_array($consulta['plan']) ? implode(', ', $consulta['plan']) : $consulta['plan'] }}</p>
        @endif
    </div>

    <!-- Comentarios (AMBOS) -->
    <div class="section">
        <div class="section-title">COMENTARIOS</div>
        @if(!empty($consulta['comentario']))
        <p><strong>Comentario:</strong> {{ is_array($consulta['comentario']) ? implode(', ', $consulta['comentario']) : $consulta['comentario'] }}</p>
        @endif
    </div>

    <!-- Firmas (SIEMPRE) -->
    <div class="signature-area">
        <div>
            <p>_________________________</p>
            <p>Dr. {{ $medico['name'] ?? 'Nombre del Médico' }}</p>
            <p>Médico Oftalmólogo</p>
        </div>
        <div>
            <p>_________________________</p>
            <p>Paciente</p>
        </div>
    </div>
</body>
</html>