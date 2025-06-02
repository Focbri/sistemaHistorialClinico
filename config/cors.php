<?php

return [
    'paths' => [
        'api/*', 
        'login',
        'logout',
        'register',
        'forgot-password'
    ],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => [
        'http://localhost:3000',
        env('APP_URL')
    ],
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'X-XSRF-TOKEN'
    ],
    
    'exposed_headers' => [],
    
    'max_age' => 60 * 60 * 24, // 24 horas de caché para preflight
    
    'supports_credentials' => true,
];