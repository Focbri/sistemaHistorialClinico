<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consultas de {{ $paciente->nombre }} {{ $paciente->apellido }}</title>
</head>
<body>
    <h1>Consultas de {{ $paciente->nombre }} {{ $paciente->apellido }}</h1>

    @if(session('success'))
        <div>{{ session('success') }}</div>
    @endif

    <a href="{{ route('consultas.create', $paciente->id) }}">Crear Nueva Consulta</a>

    <table>
        <thead>
            <tr>
                <th>Código de Consulta</th>
                <th>Información</th>
                <th>Recetas</th>
                <th>Imágenes</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($paciente->consultas as $consulta)
                <tr>
                    <td>{{ $consulta->codigo_consulta }}</td>
                    <td>{{ $consulta->informacion_consulta }}</td>
                    <td>{{ $consulta->recetas }}</td>
                    <td>{{ $consulta->imagenes }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>