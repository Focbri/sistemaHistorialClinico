import axios from 'axios';

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

axios.defaults.baseURL = 'http://localhost:8000'; // Asegúrate de que sea 'http://localhost:8000/api'

window.axios.defaults.withCredentials = true; // Permite cookies (CRUCIAL para Sanctum)

// Obtener el token CSRF al cargar la app (antes de cualquier solicitud)
/*window.axios.get('/sanctum/csrf-cookie').then(response => {
    console.log('CSRF token obtenido correctamente');
}).catch(error => {
    console.error('Error al obtener CSRF token:', error);
});*/