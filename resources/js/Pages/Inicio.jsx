import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Inicio() {
    return (
        <AuthenticatedLayout>
            <Head title="Inicio" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-3xl font-bold text-center mb-8">Menú Principal</h1>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Gestión de Pacientes */}
                                <Link 
                                    href={route('pacientes.index')} 
                                    className="bg-blue-100 hover:bg-blue-200 p-6 rounded-lg shadow-md transition-all flex flex-col items-center"
                                >
                                    <div className="text-5xl mb-4">👨‍⚕️</div>
                                    <h2 className="text-xl font-semibold text-center">Gestión de Pacientes</h2>
                                    <p className="text-gray-600 mt-2 text-center">Registro y seguimiento de pacientes</p>
                                </Link>
                                
                                {/* Historial Clínico */}
                                <Link 
                                    href={route('consultas.index')} 
                                    className="bg-green-100 hover:bg-green-200 p-6 rounded-lg shadow-md transition-all flex flex-col items-center"
                                >
                                    <div className="text-5xl mb-4">📋</div>
                                    <h2 className="text-xl font-semibold text-center">Historial Clínico</h2>
                                    <p className="text-gray-600 mt-2 text-center">Registros médicos completos</p>
                                </Link>
                                
                                {/* Reportes */}
                                <Link 
                                    href={route('dashboard.index')} 
                                    className="bg-purple-100 hover:bg-purple-200 p-6 rounded-lg shadow-md transition-all flex flex-col items-center"
                                >
                                    <div className="text-5xl mb-4">📊</div>
                                    <h2 className="text-xl font-semibold text-center">Reportes</h2>
                                    <p className="text-gray-600 mt-2 text-center">Generación de reportes estadísticos</p>
                                </Link>
                                
                                {/* Gestión de Usuarios */}
                                <Link 
                                    href={route('admin.users.index')} 
                                    className="bg-yellow-100 hover:bg-yellow-200 p-6 rounded-lg shadow-md transition-all flex flex-col items-center"
                                >
                                    <div className="text-5xl mb-4">👥</div>
                                    <h2 className="text-xl font-semibold text-center">Gestión de Usuarios</h2>
                                    <p className="text-gray-600 mt-2 text-center">Administración de usuarios del sistema</p>
                                </Link>
                                
                                {/* Perfil */}
                                <Link 
                                    href={route('profile.edit')} 
                                    className="bg-red-100 hover:bg-red-200 p-6 rounded-lg shadow-md transition-all flex flex-col items-center"
                                >
                                    <div className="text-5xl mb-4">👤</div>
                                    <h2 className="text-xl font-semibold text-center">Mi Perfil</h2>
                                    <p className="text-gray-600 mt-2 text-center">Configuración de tu cuenta</p>
                                </Link>
                                
                                {/* Calendario de Citas (opcional) */}
                                <Link 
                                    href={route('citas.index')} 
                                    className="bg-teal-100 hover:bg-teal-200 p-6 rounded-lg shadow-md transition-all flex flex-col items-center"
                                >
                                    <div className="text-5xl mb-4">📅</div>
                                    <h2 className="text-xl font-semibold text-center">Calendario de Citas</h2>
                                    <p className="text-gray-600 mt-2 text-center">Agendar Citas</p>
                                </Link>
                                {/* Fármacos */}
                                <Link 
                                    href={route('farmacos.index')} 
                                    className="bg-teal-100 hover:bg-teal-200 p-6 rounded-lg shadow-md transition-all flex flex-col items-center"
                                >
                                    <div className="text-5xl mb-4">💊</div>
                                    <h2 className="text-xl font-semibold text-center">Farmacia</h2>
                                    <p className="text-gray-600 mt-2 text-center">Gestiona los fármacos en stock</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}