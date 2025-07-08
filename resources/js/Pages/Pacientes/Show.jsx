import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function PacientesShow({ auth, paciente }) {
return (
    <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Detalles del Paciente</h2>}
    >
        <Head title="Detalles del Paciente" />

        <div className="py-4 sm:py-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 px-4">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="p-4 sm:p-6 bg-white border-b border-gray-200">
                        {/* Sección de Foto de Perfil - Ahora arriba en móviles */}
                        <div className="mb-6 border border-gray-200 rounded-md p-4 sm:mb-8">
                            <h3 className="text-lg font-medium text-gray-700 mb-4">Foto de Perfil</h3>
                            <div className="flex justify-center sm:justify-start">
                                {paciente.foto_perfil_url ? (
                                    <img
                                        src={paciente.foto_perfil_url}
                                        alt="Foto de perfil"
                                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-gray-300"
                                    />
                                ) : (
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                                        <span className="text-gray-500">Sin foto</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Grid principal - Cambia a una columna en móviles */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                            {/* Columna izquierda */}
                            <div className='space-y-3 sm:space-y-4'>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombres</label>
                                    <p className="mt-1 text-gray-900">{paciente.nombres}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Apellido Paterno</label>
                                    <p className="mt-1 text-gray-900">{paciente.apellido_paterno}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Apellido Materno</label>
                                    <p className="mt-1 text-gray-900">{paciente.apellido_materno}</p>
                                </div>
                            </div>

                            {/* Columna derecha */}
                            <div className='space-y-3 sm:space-y-4'>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Edad</label>
                                        <p className="mt-1 text-gray-900">{paciente.edad}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Género</label>
                                        <p className="mt-1 text-gray-900">{paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Peso Kg</label>
                                        <p className="mt-1 text-gray-900">{paciente.peso}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">DNI</label>
                                        <p className="mt-1 text-gray-900">{paciente.dni}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha Nacimiento</label>
                                    <p className="mt-1 text-gray-900">{paciente.fecha_nacimiento}</p>
                                </div>
                            </div>
                        </div>

                        <hr className='my-6 sm:my-8'/>

                        {/* Segunda sección - también cambia a una columna en móviles */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                            <div className='space-y-3 sm:space-y-4'>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Estado Civil</label>
                                    <p className="mt-1 text-gray-900">{paciente.estado_civil}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ocupación</label>
                                    <p className="mt-1 text-gray-900">{paciente.ocupacion}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Procedencia</label>
                                    <p className="mt-1 text-gray-900">{paciente.procedencia}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Domicilio</label>
                                    <p className="mt-1 text-gray-900">{paciente.direccion}</p>
                                </div>
                            </div>

                            <div className='space-y-3 sm:space-y-4'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                        <p className="mt-1 text-gray-900">{paciente.telefono}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Teléfono de Emergencia</label>
                                        <p className="mt-1 text-gray-900">{paciente.telefonoE}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Acompañante</label>
                                    <p className="mt-1 text-gray-900">{paciente.acompañante}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Referido</label>
                                    <p className="mt-1 text-gray-900">{paciente.referido}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <p className="mt-1 text-gray-900">{paciente.email}</p>
                                </div>
                            </div>          
                        </div>                    

                        <div className="flex items-center justify-center sm:justify-end mt-6">
                            <Link
                                href={route('pacientes.index')}
                                className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600 w-full sm:w-auto text-center"
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