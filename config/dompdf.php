<?php

return [
    'mode' => 'utf-8', // Codificación de caracteres
    'format' => 'A4',  // Formato de papel
    'defaultFont' => 'sans-serif', // Fuente predeterminada
    'fontDir' => storage_path('fonts/'), // Directorio de fuentes
    'fontCache' => storage_path('fonts/'), // Caché de fuentes
    'tempDir' => storage_path('app/dompdf'), // Directorio temporal
    'chroot' => base_path(), // Directorio raíz
    'logOutputFile' => storage_path('logs/dompdf.log'), // Archivo de logs
    'enableRemote' => true, // Habilitar carga de recursos remotos (imágenes, CSS, etc.)
    'debug' => true, // Habilitar modo de depuración
];