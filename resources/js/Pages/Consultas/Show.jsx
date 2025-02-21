import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import fondoOjo from '../../../assets/fondo_ojo.png'; // Importar la imagen de fondo de ojo
import { Head, Link } from '@inertiajs/react';

export default function ConsultasShow({ auth, consulta }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Información de la Consulta</h2>}
        >
            <Head title={`Consulta: ${consulta.id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                                <div className="mb-4">
                                    <label className="block text-xl font-medium text-gray-700">Antecedentes Personales</label>
                                </div>
                            <div className='grid grid-cols-2 gap-4 border border-gray-200 p-4 rounded-md mb-8'>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Antecedentes Personales (HTA)</label>
                                    <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{consulta.antecedentes_personales_hta}</p>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Antecedentes Personales (Alergias)</label>
                                    <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{consulta.antecedentes_personales_alergias}</p>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Antecedentes Personales (DM)</label>
                                    <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{consulta.antecedentes_personales_dm}</p>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Antecedentes Personales (Otros)</label>
                                    <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{consulta.antecedentes_personales_otros}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Antecedentes Patológicos Familiares</label>
                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{consulta.antecedentes_patologicos_familiares}</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Cirugías Previas</label>
                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{consulta.cirugias_previas}</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Motivo de Consulta</label>
                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{consulta.motivo_consulta}</p>
                            </div>

                            <div className='flex flex-col justify-center items-center w-full gap-4'>
                                    <label className="block text-xl font-medium text-gray-700">Fondo de Ojo</label>
                                    <div className='flex gap-4'>
                                        <div>
                                            <img src={fondoOjo} alt="Fondo de Ojo" className="w-full h-auto" />
                                        </div>
                                        <div className="mb-4">
                                            <p className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                style={{
                                                    width: '20rem', // Ajusta el ancho según tus necesidades
                                                    height: '12rem', // Ajusta la altura para que coincida con la imagen
                                                    resize: 'none'  // Deshabilita la redimensión manual
                                                }}
                                            >{consulta.fondo_ojo}</p>
                                        </div>
                                    </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Impresión Diagnóstica</label>
                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{consulta.impresion_diagnostica}</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">RP</label>
                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{consulta.rp}</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Plan</label>
                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{consulta.plan}</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Exámenes Indicados</label>
                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{consulta.examenes_indicados}</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Evoluciones</label>
                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{consulta.evoluciones}</p>
                            </div>

                            <div className="flex items-center justify-end">
                                <Link
                                    href={route('consultas.index')}
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