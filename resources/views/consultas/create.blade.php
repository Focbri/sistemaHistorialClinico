<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crear Consulta</title>
</head>
<body>
    <h1>Crear Nueva Consulta</h1>

    <form action="{{ route('consultas.store') }}" method="POST">
    @csrf
    <div>
        <label for="dni">DNI del Paciente:</label>
        <input type="text" name="dni" id="dni" required>
    </div>
    <div>
        <label for="codigo_consulta">Código de Consulta:</label>
        <input type="text" name="codigo_consulta" id="codigo_consulta" required>
    </div>
    <div>
        <label for="informacion_consulta">Información de la Consulta:</label>
        <textarea name="informacion_consulta" id="informacion_consulta"></textarea>
    </div>
    <div>
        <label for="recetas">Recetas:</label>
        <textarea name="recetas" id="recetas"></textarea>
    </div>
    <div>
        <label for="imagenes">Imágenes:</label>
        <textarea name="imagenes" id="imagenes"></textarea>
    </div>
    <button type="submit">Crear Consulta</button>
</form>
</body>
</html>