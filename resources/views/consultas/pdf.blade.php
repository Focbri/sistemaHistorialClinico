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
            text-decoration: underline;
            margin-bottom: 16px;
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
                <p>HLC: {{ $consulta->codigo_consulta }}</p>
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

        <div class="section">
            <label>DATOS PERSONALES</label>
            <p>{{ $consulta->paciente->nombres }} {{ $consulta->paciente->apellido_paterno }} {{ $consulta->paciente->apellido_materno }}</p>
        </div>

        <!-- Campos específicos para Consulta de Evolución -->
        @if ($consulta->tipo_consulta === 'inicio')
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
            <label>EXAMENES INDICADOS</label>
            <p>{{ $consulta->examenes_indicados }}</p>
        </div>

        <div class="section">
            <label>EVOLUCIONES</label>
            <p>{{ $consulta->evoluciones }}</p>
        </div>
        @endif
    </div> <!-- Fin del contenedor principal -->
</body>
</html>