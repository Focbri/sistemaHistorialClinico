import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex flex-col items-center justify-center bg-gray-50 m-0 p-0 min-h-screen">            
            {/* Contenedor principal que limita el ancho máximo */}
            <div className="relative w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 ">
                {/* Tarjeta contenedora */}
                <div className="w-full overflow-hidden bg-white shadow-xl rounded-xl">
                    {children}
                </div>
            </div>
        </div>
    );
}