import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-modal'],
    },
    server: {
        hmr: {
            host: 'localhost',
        },
        proxy: {
            // Redirige todas las solicitudes que comiencen con "/consultas" al backend de Laravel
            '/consultas': {
                target: 'http://localhost:8000', // URL de tu backend Laravel
                changeOrigin: true, // Cambia el origen de la solicitud al backend
                secure: false, // Desactiva la verificación de certificados SSL (útil en desarrollo)
            },
        },
    },
});