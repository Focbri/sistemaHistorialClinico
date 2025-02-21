import { Head, Link } from '@inertiajs/react'; // Importa Link desde @inertiajs/react
import logoVO from '../../assets/logoVisualO.jpeg';

export default function Welcome() {
    return (
        <>
            <Head title="Inicio | Visual Ophtalmics" />
            <div className="bg-gray-50 text-black/50 bg-[#7CDBFB] text-#000">
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-4xl font-bold mb-4">Bienvenido al Sistema de Historial Clínico de:</h1>
                    <div className='w-full flex justify-center mb-8'>
                        <img src={logoVO} alt="" className='rounded-lg'/>
                    </div>
                    {/* Botón que redirige al login usando Link */}
                    <Link
                        href="/login" // Ruta del login
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Click para Ingresar al Sistema
                    </Link>
                </div>
            </div>
        </>
    );
}