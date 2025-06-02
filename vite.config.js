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
        host: 'localhost', // Cambiado de 0.0.0.0 para evitar problemas CORS
        port: 3000, // Puerto explícito para el frontend
        hmr: {
            host: 'localhost',
        },
        proxy: {
            // Proxy para todas las rutas API
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
                ws: true, // Habilita WebSockets
            },
            // Proxy para autenticación (sanctum/csrf-cookie)
            '/sanctum': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            },
            // Proxy para archivos de almacenamiento
            '/storage': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            }
        },
    },
    // Configuración de build para producción
    build: {
        outDir: 'public/build',
        emptyOutDir: true,
        manifest: true,
    }
});