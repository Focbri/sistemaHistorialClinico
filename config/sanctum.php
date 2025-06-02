<?php

use Laravel\Sanctum\Sanctum;

return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:3000,127.0.0.1'.
        parse_url(env('APP_URL'), PHP_URL_HOST)
    )),

    'guard' => ['web'], // Mantener 'web' para compatibilidad con Breeze

    'expiration' => null, // Tokens no expiran (para SPA persistentes)

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''), // Opcional para seguridad

    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
        'validate_csrf_token' => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    ],
];
