import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function PacientesShow({ auth, paciente }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Detalles del Paciente</h2>}
        >
            <Head title="Detalles del Paciente" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='flex flex-col'>
                                    {/* Sección de Foto de Perfil */}
                                    <div className="mb-8 border border-gray-200 rounded-md p-4">
                                        <h3 className="text-lg font-medium text-gray-700 mb-4">Foto de Perfil</h3>
                                        
                                        <div className="flex items-center space-x-6">
                                            <div className="relative">
                                                {paciente.foto_perfil_url ? (
                                                    <img
                                                        src={paciente.foto_perfil_url}
                                                        alt="Foto de perfil"
                                                        className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                                                    />
                                                ) : (
                                                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                                                        <span className="text-gray-500">Sin foto</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Apellido Paterno</label>
                                        <p className="mt-1">{paciente.apellido_paterno}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Apellido Materno</label>
                                        <p className="mt-1">{paciente.apellido_materno}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Nombres</label>
                                        <p className="mt-1">{paciente.nombres}</p>
                                    </div>
                                </div>

                                <div className='flex flex-col'>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Fecha Nacimiento</label>
                                        <p className="mt-1">{paciente.fecha_nacimiento}</p>
                                    </div>

                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='flex flex-col'>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">Edad</label>
                                                <p className="mt-1">{paciente.edad}</p>
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">Sexo</label>
                                                <p className="mt-1">{paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}</p>
                                            </div>
                                        </div>

                                        <div className='flex flex-col'>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">Peso Kg</label>
                                                <p className="mt-1">{paciente.peso}</p>
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">DNI</label>
                                                <p className="mt-1">{paciente.dni}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className='my-8'/>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='flex flex-col'>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Estado Civil</label>
                                        <p className="mt-1">{paciente.estado_civil}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Ocupación</label>
                                        <p className="mt-1">{paciente.ocupacion}</p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Procedencia</label>
                                        <p className="mt-1">{paciente.procedencia}</p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Domicilio</label>
                                        <p className="mt-1">{paciente.direccion}</p>
                                    </div>
                                </div>

                                <div className='flex flex-col'>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                        <p className="mt-1">{paciente.telefono}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Acompañante</label>
                                        <p className="mt-1">{paciente.acompañante}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Referido</label>
                                        <p className="mt-1">{paciente.referido}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <p className="mt-1">{paciente.email}</p>
                                    </div>
                                </div>          
                            </div>                    

                            <div className="flex items-center justify-end">
                                <Link
                                    href={route('pacientes.index')}
                                    className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                                >
                                    Volver
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}