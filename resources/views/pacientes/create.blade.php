<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crear Paciente</title>
</head>
<body>
    <h1>Crear Nuevo Paciente</h1>

    <form action="{{ route('pacientes.store') }}" method="POST">
        @csrf <!-- Token de seguridad -->

        <div>
            <label for="nombre">Nombre:</label>
            <input type="text" name="nombre" id="nombre" value="{{ old('nombre') }}" required>
            @error('nombre')
                <span>{{ $message }}</span>
            @enderror
        </div>

        <div>
            <label for="apellido">Apellido:</label>
            <input type="text" name="apellido" id="apellido" value="{{ old('apellido') }}" required>
            @error('apellido')
                <span>{{ $message }}</span>
            @enderror
        </div>

        <div>
            <label for="dni">DNI:</label>
            <input type="text" name="dni" id="dni" value="{{ old('dni') }}" required>
            @error('dni')
                <span>{{ $message }}</span>
            @enderror
        </div>

        <div>
            <label for="telefono">Teléfono:</label>
            <input type="text" name="telefono" id="telefono" value="{{ old('telefono') }}">
            @error('telefono')
                <span>{{ $message }}</span>
            @enderror
        </div>

        <div>
            <label for="email">Email:</label>
            <input type="email" name="email" id="email" value="{{ old('email') }}" required>
            @error('email')
                <span>{{ $message }}</span>
            @enderror
        </div>

        <div>
            <label for="direccion">Dirección:</label>
            <input type="text" name="direccion" id="direccion" value="{{ old('direccion') }}" required>
            @error('direccion')
                <span>{{ $message }}</span>
            @enderror
        </div>

        <button type="submit">Guardar</button>
    </form>
</body>
</html>