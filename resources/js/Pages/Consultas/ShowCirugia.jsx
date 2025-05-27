import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ShowCirugia({ auth, cirugia }) {
    // Procesar personal_enfermeria para mostrar correctamente
    const personalEnfermeria = Array.isArray(cirugia.personal_enfermeria) ? 
                              cirugia.personal_enfermeria : 
                              JSON.parse(cirugia.personal_enfermeria || '[]');

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
                            <div className="space-y-6">
                                {/* Información del Paciente */}
                                <div className="border-b pb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Paciente</h3>
                                    <p className="mt-1 text-gray-600">
                                        {cirugia.paciente.nombres} {cirugia.paciente.apellido_paterno} - {cirugia.paciente.dni}
                                    </p>
                                </div>

                                {/* Diagnósticos */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Diagnóstico Preoperatorio</h3>
                                        <p className="mt-1 text-gray-600 whitespace-pre-line">{cirugia.diagnostico_preoperatorio}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Diagnóstico Postoperatorio</h3>
                                        <p className="mt-1 text-gray-600 whitespace-pre-line">{cirugia.diagnostico_postoperatorio || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Información de la Cirugía */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Cirugía</h3>
                                        <p className="mt-1 text-gray-600">{cirugia.cirugia}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Fecha de Cirugía</h3>
                                        <p className="mt-1 text-gray-600">
                                            {new Date(cirugia.fecha_cirugia).toLocaleDateString()} - 
                                            {cirugia.hora_inicio} a {cirugia.hora_fin || '--:--'}
                                        </p>
                                    </div>
                                </div>

                                {/* Personal Médico */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Cirujano Principal</h3>
                                        <p className="mt-1 text-gray-600">{cirugia.cirujano_principal}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Cirujano Ayudante</h3>
                                        <p className="mt-1 text-gray-600">{cirugia.cirujano_ayudante || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Anestesiólogo</h3>
                                        <p className="mt-1 text-gray-600">{cirugia.anestesiologo}</p>
                                    </div>
                                </div>

                                {/* Anestesia */}
                                <div className="border-b pb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Tipo de Anestesia</h3>
                                    <p className="mt-1 text-gray-600">{cirugia.tipo_anestesia}</p>
                                </div>

                                {/* Personal de Enfermería */}
                                {personalEnfermeria.length > 0 && (
                                    <div className="border-b pb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Personal de Enfermería</h3>
                                        <ul className="mt-1 list-disc list-inside text-gray-600">
                                            {personalEnfermeria.map((persona, index) => (
                                                <li key={index}>{persona}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Procedimiento */}
                                <div className="border-b pb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Procedimiento</h3>
                                    <p className="mt-1 text-gray-600 whitespace-pre-line">{cirugia.procedimiento}</p>
                                </div>

                                {/* Hallazgos */}
                                {cirugia.hallazgos && (
                                    <div className="border-b pb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Hallazgos</h3>
                                        <p className="mt-1 text-gray-600 whitespace-pre-line">{cirugia.hallazgos}</p>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}