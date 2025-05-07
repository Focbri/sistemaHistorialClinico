import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, cirugia }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Detalles de Cirugía</h2>}
        >
            <Head title={`Cirugía ${cirugia.id}`} />
            
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Información del paciente */}
                                <div className="md:col-span-2">
                                    <h3 className="text-lg font-medium text-gray-900">Paciente</h3>
                                    <p className="mt-1">{cirugia.paciente.nombres} {cirugia.paciente.apellido_paterno}</p>
                                    <p className="text-sm text-gray-500">DNI: {cirugia.paciente.dni}</p>
                                </div>
                                
                                {/* Detalles de la cirugía */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Tipo de Cirugía</h3>
                                    <p className="mt-1">{cirugia.cirugia}</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Fecha</h3>
                                    <p className="mt-1">{new Date(cirugia.fecha_cirugia).toLocaleDateString()}</p>
                                </div>
                                
                                {/* Más detalles... */}
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                                <Link
                                    href={route('consultas.index')}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
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