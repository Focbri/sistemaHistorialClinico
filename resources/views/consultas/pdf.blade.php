<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Consulta PDF</title>
    <style>
        body { 
            font-family: Georgia, 'Times New Roman', Times, serif; /* Fuente del documento */ 
            margin: 0; /* Elimina el margen predeterminado del body */
        }
        .container {
            max-width: 650px; /* Ancho máximo del contenido */
            width: 100%; /* Ocupa el 100% del ancho disponible hasta el máximo */
            margin: 0 auto; /* Centrar el contenedor */
            padding: 20px; /* Espaciado interno */
        }
        .header { 
            width: 100%; 
            box-sizing: border-box; /* Incluye el padding en el ancho total */
        }
        .content-logo { 
            display: inline-block; /* Alinea a la izquierda */
            width: 60%; /* Ancho del logo */
            vertical-align: middle; /* Alinea verticalmente */
        }
        .codigo { 
            display: inline-block; /* Alinea a la derecha */
            width: 28%; /* Ancho del código */
            vertical-align: middle; /* Alinea verticalmente */  
            text-align: center; /* Alinea el texto al centro */
            box-sizing: border-box; /* Incluye el padding en el ancho total */
            margin-left: 60px;
        }
        .logo { 
            width: 200px; 
        }
        .title-fecha {
            display: flex; /* Usar flexbox para alinear elementos */
            justify-content: space-between; /* Espacio entre título y fecha */
            align-items: center; /* Centrar verticalmente */
            margin-bottom: 20px; 
        }
        .title { 
            text-align: center; /* Centrar el título */
            text-decoration: underline;
            flex: 1; /* Ocupa el espacio disponible */
        }
        .fecha { 
            text-align: right; /* Alinear la fecha a la derecha */
            margin-left: 20px; /* Espacio entre título y fecha */
        }
        .section { 
            margin-bottom: 15px; 
        } 
        .section label { 
            font-weight: bold; 
        }
        .section p { 
            margin: 5px 0; 
        }
        .fondo-ojo-container {
            width: 100%;
        }
        .fondo-ojo-texto {
            display: inline-block; /* Alinea a la izquierda */
            width: 70%; /* Ancho del texto */
            vertical-align: top; /* Alinea verticalmente */
        }
        .fondo-ojo-imagen {
            display: inline-block; /* Alinea a la derecha */
            width: 29%; /* Ancho de la imagen */
            text-align: right; /* Alinea la imagen a la derecha */
            vertical-align: top; /* Alinea verticalmente */
        }
        .fondo-ojo-imagen img {
            width: 100%; /* La imagen ocupa el 100% del contenedor */
            max-width: 200px; /* Máximo ancho de la imagen */
        }
        label { 
            font-weight: bold;
            margin-bottom: 16px;
        }
        .section-datos-personales{
            text-align: left;
            margin-bottom: 20px;
            width: 100%;
        }
        .apellido-paterno{
            width: 100%;
            margin-bottom: 20px;
        }
        .section-datos-p{
            width: 100%;
            border: 2px solid black;
        }
        .section-datos-hijo{
            width: 100%;
        }
        .datos-principales{
            width: 40%;
            border: 2px solid black;
        }
        .datos-secundarios{
            width: 40%;
            border: 2px solid black;
        }
    </style>
</head>
<body>
    <div class="container"> <!-- Contenedor principal con ancho máximo -->
        <div class="header">
            <div class="content-logo">
                <img src="{{ $imageSrcLogo }}" alt="Logo Visual OSF" class="logo">
            </div>
            <div class="codigo">
                <p>{{ $consulta->codigo_consulta }}</p>
            </div>
        </div>
        
        <!-- Contenedor para título y fecha -->
        <div class="title-fecha">
            <div class="title">
                <h1>Historia Clínica</h1>
            </div>
            <div class="fecha">
                <p>Fecha: {{ $fechaActual }}</p>
            </div>
        </div>
<!-- Campos comunes para Consulta de Inicio y Consulta de Evolución -->
        <!-- Datos personales -->
        <div class="section">
            <label>DATOS PERSONALES</label>
            <div class="section-datosP">
                <div class="section-datos-hijo">
                    <div class="datos-principales">
                        <p>Apellido Paterno: {{ $consulta->paciente->apellido_paterno }}</p>
                        <p>Apellido Materno: {{ $consulta->paciente->apellido_materno }}</p>
                        <p>Nombres: {{ $consulta->paciente->nombres }}</p>
                    </div>
                    <div class="datos-secundarios">
                        <p>Fecha de Nacimiento: {{ $consulta->paciente->fecha_nacimiento }}</p>
                        <p>Edad: {{ $consulta->paciente->edad }}</p>
                        <p>Sexo: {{ $consulta->paciente->sexo }}</p>
                        <p>Peso: {{ $consulta->paciente->peso }}</p>
                        <p>DNI: {{ $consulta->paciente->dni }}</p>
                    </div>
                </div>
                <div class="section-datos-hijo-2">
                    <div class="datos-otros-1">
                        <p>Estado Civil: {{ $consulta->paciente->estado_civil }}</p>
                        <p>Ocupación: {{ $consulta->paciente->ocupacion }}</p>
                        <p>Procedencia: {{ $consulta->paciente->procedencia }}</p>
                        <p>Domicilio: {{ $consulta->paciente->direccion }}</p>
                    </div>
                    <div class="datos-otros-2">
                        <p>Telf. Casa: {{ $consulta->paciente->telefono }}</p>
                        <p>Acompañante: {{ $consulta->paciente->acompañante }}</p>
                        <p>Referido: {{ $consulta->paciente->referido }}</p>
                        <p>Email: {{ $consulta->paciente->email }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Campos específicos para Consulta de Evolución -->
        @if ($consulta->tipo_consulta === 'inicio')
        <div class="title">
            <h2>
                CONSULTA DE INICIO
            </h2>
        </div>
        <div class="section">
            <label>ANTECEDENTES PERSONALES</label>
            <p>HTA: {{ $consulta->antecedentes_personales_hta ? 'SI' : 'NO' }}</p>
            <p>Alergias: {{ $consulta->antecedentes_personales_alergias ? 'SI' : 'NO' }}</p>
            <p>DM: {{ $consulta->antecedentes_personales_dm ? 'SI' : 'NO' }}</p>
            <p>Otros: {{ $consulta->antecedentes_personales_otros }}</p>
        </div>

        <div class="section">
            <label>ANTECEDENTES PATOLOGICOS FAMILIARES</label>
            <p>{{ $consulta->antecedentes_patologicos_familiares }}</p>
        </div>

        <div class="section">
            <label>CIRUGIAS PREVIAS</label>
            <p>{{ $consulta->cirugias_previas }}</p>
        </div>

        <div class="section">
            <label>MOTIVO DE CONSULTA</label>
            <p>{{ $consulta->motivo_consulta }}</p>
        </div>

        <div class="section">
            <label>FONDO DE OJO</label>
            <div class="fondo-ojo-container">
                <div class="fondo-ojo-texto">
                    <p>{{ $consulta->fondo_ojo }}</p>
                </div>
                <div class="fondo-ojo-imagen">
                    <img src="{{ $imageSrcFondoOjo }}" alt="Fondo de Ojo">
                </div>
            </div>
        </div>

        <div class="section">
            <label>IMPRESION DIAGNOSTICA</label>
            <p>{{ $consulta->impresion_diagnostica }}</p>
        </div>

        <div class="section">
            <label>Tratamiento</label>
            <p>{{ $consulta->tratamiento }}</p>
        </div>

        <div class="section">
            <label>PLAN</label>
            <p>{{ $consulta->plan }}</p>
        </div>
        @endif

        <!-- Campos específicos para Consulta de Evolución -->
        @if ($consulta->tipo_consulta === 'evolucion')
        <div class="section">
            <label>EVOLUCIONES</label>
            <p>{{ $consulta->evoluciones }}</p>
        </div>
        <div>
            <label>Examen</label>
                <table width="50%" style="border-collapse: collapse; margin-bottom: 20px;">
                    <label>Agudeza Visual</label>
                    <tr>
                        <th style=" padding: 5px; text-align: left;">Tipo</th>
                        <th style=" padding: 5px; text-align: left;">SC</th>
                        <th style=" padding: 5px; text-align: left;">CAE</th>
                        <th style=" padding: 5px; text-align: left;">CC</th>
                    </tr>
                    <tr>
                        <td style=" padding: 5px;">OD</td>
                        <td style="border: 1px solid #000; padding: 5px;">{{ $consulta->examen_av_sc_od }}</td>
                        <td style="border: 1px solid #000; padding: 5px;">{{ $consulta->examen_av_cae_od }}</td>
                        <td style="border: 1px solid #000; padding: 5px;">{{ $consulta->examen_av_cc_od }}</td>

                    </tr>
                    <tr>
                        <td style=" padding: 5px;">OI</td>
                        <td style="border: 1px solid #000; padding: 5px;">{{ $consulta->examen_av_sc_oi }}</td>
                        <td style="border: 1px solid #000; padding: 5px;">{{ $consulta->examen_av_cae_oi }}</td>
                        <td style="border: 1px solid #000; padding: 5px;">{{ $consulta->examen_av_cc_oi }}</td>
                    </tr>
                </table>
                <table width="50%" style="border-collapse: collapse; margin-bottom: 20px;">
                    <label>Presión Intraocular</label>
                    <tr>
                        <th style=" padding: 5px; text-align: left;">OD</th>
                        <th style=" padding: 5px; text-align: left;">OI</th>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 5px;">{{ $consulta->examen_pi_od }}</td>
                        <td style="border: 1px solid #000; padding: 5px;">{{ $consulta->examen_pi_oi }}</td>
                    </tr>                    
                </table>
        </div>
        <div class="section">
            <label>EXAMENES INDICADOS</label>
            <p>{{ $consulta->examenes_indicados }}</p>
        </div>
        @endif
    </div> <!-- Fin del contenedor principal -->
</body>
</html>