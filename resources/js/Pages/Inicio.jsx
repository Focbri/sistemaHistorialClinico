import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect } from 'react';
import pacienteImage from '../../assets/pacientes2.png';
import historiaImage from '../../assets/historiaclinica.jpeg';
import farmaciaImage from '../../assets/farmacia.jpg';
import usuariosImage from '../../assets/usuarios2.png';
import perfilImage from '../../assets/perfil2.png';

export default function Inicio({auth}) {
    // Determinar si el usuario es médico o médico_externo usando el campo role
    const isMedico = ['medico', 'medico_externo'].includes(auth.user.role);
    const isAdmin = ['admin'].includes(auth.user.role);
    const isMedicoExterno = auth.user.role === 'medico_externo';
    const isRecepcionistaAdmin = ['admin', 'recepcionista'].includes(auth.user.role);
    const isMedicoAdmin = ['admin', 'medico'].includes(auth.user.role);

     useEffect(() => {
        // Verificar si acabamos de iniciar sesión
        const justLoggedIn = sessionStorage.getItem('justLoggedIn') === 'true';
        
        if (justLoggedIn) {
            // Eliminar el indicador para que no se recargue en futuras visitas
            sessionStorage.removeItem('justLoggedIn');
            // Recargar la página
            window.location.reload();
        }
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user} 
        >
            <Head title="Inicio" />
            
            <div className="py-12 lg:py-8 2xl:py-20">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-[#F5F5F5] overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 lg:p-0">                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Gestión de Pacientes */}
                                <Link 
                                    href={route('pacientes.index')} 
                                    className="bg-blue-100 hover:bg-blue-200 p-6 2xl:p-10 rounded-lg shadow-md transition-all flex flex-col items-center justify-center"
                                >
                                    <div className="text-5xl max-w-28 mb-2 2xl:text-8xl">
                                        <img 
                                            src={pacienteImage} 
                                            alt="Paciente" 
                                            className="w-full rounded-md object-cover"
                                        />
                                    </div>
                                    <h2 className="text-xl font-semibold text-center 2xl:text-3xl">Gestión de Pacientes</h2>
                                    <p className="text-gray-600 mt-2 text-center 2xl:text-xl">Registro y seguimiento de pacientes</p>
                                </Link>
                                
                                {/* Historial Clínico */}
                                <Link 
                                    href={route('consultas.index')} 
                                    className="bg-green-100 hover:bg-green-200 p-6 2xl:p-10 rounded-lg shadow-md transition-all flex flex-col items-center justify-center"
                                >
                                    <div className="text-5xl max-w-20 max-h-28 mb-2 2xl:text-8xl">
                                        <img 
                                            src={historiaImage} 
                                            alt="Historial Clínico" 
                                            className="w-full h-full rounded-md object-cover"
                                        />
                                    </div>
                                    <h2 className="text-xl font-semibold text-center 2xl:text-3xl">Historial Clínico</h2>
                                    <p className="text-gray-600 mt-2 text-center 2xl:text-xl">Registros médicos completos</p>
                                </Link>
                                
                                {/* Reportes - Solo visible si no es médico_externo */}
                                    <Link 
                                        href={route('dashboard.index')} 
                                        className="bg-purple-100 hover:bg-purple-200 p-6 2xl:p-10 rounded-lg shadow-md transition-all flex flex-col items-center justify-center "
                                    >
                                        <div className="text-5xl mb-4 2xl:text-8xl">📊</div>
                                        <h2 className="text-xl font-semibold text-center 2xl:text-3xl">Panel de Control</h2>
                                        <p className="text-gray-600 mt-2 text-center 2xl:text-xl">Estadísticas clave en tiempo real</p>
                                    </Link>
                                
                                {/* Gestión de Usuarios */}
                                {isAdmin &&(
                                <Link 
                                    href={route('admin.users.index')} 
                                    className="bg-yellow-100 hover:bg-yellow-200 p-6 2xl:p-10 rounded-lg shadow-md transition-all flex flex-col items-center justify-center"
                                >
                                    <div className="text-5xl max-w-28 mb-2 2xl:text-8xl">
                                        <img 
                                            src={usuariosImage} 
                                            alt="Usuarios" 
                                            className="w-full rounded-md object-cover"
                                        />
                                    </div>
                                    <h2 className="text-xl font-semibold text-center 2xl:text-3xl">Gestión de Usuarios</h2>
                                    <p className="text-gray-600 mt-2 text-center 2xl:text-xl">Administración de usuarios del sistema</p>
                                </Link>
                                )}
                                
                                {/* Perfil */}
                                <Link 
                                    href={route('profile.edit')} 
                                    className="bg-red-100 hover:bg-red-200 p-6 2xl:p-10 rounded-lg shadow-md transition-all flex flex-col items-center justify-center"
                                >
                                    <div className="text-5xl max-h-28 max-w-28 mb-2 2xl:text-8xl">
                                        <img 
                                            src={perfilImage} 
                                            alt="Perfil" 
                                            className="w-full h-full rounded-md object-cover"
                                        />
                                    </div>
                                    <h2 className="text-xl font-semibold text-center 2xl:text-3xl">Mi Perfil</h2>
                                    <p className="text-gray-600 mt-2 text-center 2xl:text-xl">Configuración de tu cuenta</p>
                                </Link>
                                
                                {/* Citas Asignadas - Solo para médicos */}
                                {isMedico && (
                                    <Link 
                                        href={route('citas.asignadas')} 
                                        className="bg-indigo-100 hover:bg-indigo-200 p-6 2xl:p-10 rounded-lg shadow-md transition-all flex flex-col items-center justify-center"
                                    >
                                        <div className="text-5xl mb-4 2xl:text-8xl">📝</div>
                                        <h2 className="text-xl font-semibold text-center 2xl:text-3xl">Mis Citas</h2>
                                        <p className="text-gray-600 mt-2 text-center 2xl:text-xl">Citas asignadas pendientes</p>
                                    </Link>
                                )}
                                
                                {/* Calendario de Citas */}
                                {isRecepcionistaAdmin && (
                                <Link 
                                    href={route('citas.index')} 
                                    className="bg-teal-100 hover:bg-teal-200 p-6 2xl:p-10 rounded-lg shadow-md transition-all flex flex-col items-center justify-center"
                                >
                                    <div className="text-5xl mb-4 2xl:text-8xl">📅</div>
                                    <h2 className="text-xl font-semibold text-center 2xl:text-3xl">Calendario de Citas</h2>
                                    <p className="text-gray-600 mt-2 text-center 2xl:text-xl">Agendar Citas</p>
                                </Link>
                                )}
                                
                                {/* Fármacos */}
                                <Link 
                                    href={route('farmacos.index')} 
                                    className="bg-orange-100 hover:bg-orange-200 p-6 2xl:p-10 rounded-lg shadow-md transition-all flex flex-col items-center justify-center"
                                >
                                    <div className="text-5xl max-w-28 mb-2 2xl:text-8xl">
                                        <img 
                                            src={farmaciaImage} 
                                            alt="Farmacia" 
                                            className="w-full rounded-md object-cover"
                                        />
                                    </div>
                                    <h2 className="text-xl font-semibold text-center 2xl:text-3xl">Farmacia</h2>
                                    <p className="text-gray-600 mt-2 text-center 2xl:text-xl">Gestiona los fármacos en stock</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}