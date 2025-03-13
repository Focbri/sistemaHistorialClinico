import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import fondoOjo from '../../../assets/fondo_ojo.png';
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
                                <label className="block text-sm font-medium text-gray-700">Fecha de Consulta</label>
                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{new Date(consulta.created_at).toLocaleDateString()}</p>
                            </div>

                            {/* Datos del Paciente */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Paciente</label>
                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                    {consulta.paciente.nombres} {consulta.paciente.apellido_paterno} {consulta.paciente.apellido_materno}
                                </p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">DNI del Paciente</label>
                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{consulta.paciente.dni}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Teléfono del Paciente</label>
                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{consulta.paciente.telefono}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Email del Paciente</label>
                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{consulta.paciente.email}</p>
                            </div>

                            {/* Resto del formulario */}
                            <div className='flex flex-col border border-gray-200 p-4 rounded-md mb-8'>
                                <div className="mb-4">
                                    <label className="block text-xl font-medium text-gray-700">Antecedentes Personales</label>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">HTA</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.antecedentes_personales_hta || 'N/A'}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Alergias</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.antecedentes_personales_alergias || 'N/A'}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">DM</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.antecedentes_personales_dm || 'N/A'}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Otros</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.antecedentes_personales_otros || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Resto de los campos de la consulta */}
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

                            <div className='mb-4'>
                                    <label className="block text-xl font-medium text-gray-700">Examen</label>
                                    <div className='grid grid-cols-2 gap-4 p-4 border border-gray-200 rounded-md'>
                                        <div className='flex flex-col justify-center items-center w-full p-4 gap-2 border border-gray-200 rounded-md'>
                                            <div className='flex justify-center items-center w-full gap-4'>
                                                <h4 className='text-xl'>Agudeza Visual</h4>
                                            </div>
                                            <div className='grid grid-cols-4 gap-1'>
                                                <label></label>
                                                <label className='text-center text-lg'>SC</label>
                                                <label className='text-center'>CAE</label>
                                                <label className='text-center'>CC</label>
                                                <label className='flex justify-end items-center px-2'>OD</label>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_av_sc_od || 'N/A'}
                                                </p>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_av_cae_od || 'N/A'}
                                                </p>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_av_cc_od || 'N/A'}
                                                </p>
                                                <label className='flex justify-end items-center px-2'>OI</label>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_av_sc_oi || 'N/A'}
                                                </p>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_av_cae_oi || 'N/A'}
                                                </p>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_av_cc_oi || 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className='flex flex-col justify-center items-center w-full p-4 gap-2 border border-gray-200 rounded-md'>
                                            <div className='flex justify-center items-center w-full gap-4'>
                                                <h4 className='text-xl'>Presión Intraocular</h4>
                                            </div>
                                            <div className='grid grid-cols-4 gap-1'>
                                                <label></label>
                                                <label className='text-center text-lg'>OD</label>
                                                <label className='text-center'>OI</label>
                                                <label></label>
                                                <label></label>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_pi_od || 'N/A'}
                                                </p>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_pi_oi || 'N/A'}
                                                </p>
                                                <label></label>
                                            </div>
                                        </div>

                                        <div className='flex flex-col justify-center items-center w-full p-4 gap-2 border border-gray-200 rounded-md'>
                                            <div className='flex justify-center items-center w-full gap-4'>
                                                <h4 className='text-xl uppercase'>Autorefractometria</h4>
                                            </div>
                                            <div className='grid grid-cols-4 gap-1'>
                                                <label></label>
                                                <label className='text-center text-lg'>Sph</label>
                                                <label className='text-center'>Cyl</label>
                                                <label className='text-center'>ax</label>
                                                <label className='flex justify-end items-center px-2'>OD</label>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_ar_sph_od || 'N/A'}
                                                </p>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_ar_cyl_od || 'N/A'}
                                                </p>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_ar_ax_od || 'N/A'}
                                                </p>
                                                <label className='flex justify-end items-center px-2'>OI</label>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_ar_sph_oi || 'N/A'}
                                                </p>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_ar_cyl_oi || 'N/A'}
                                                </p>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_ar_ax_oi || 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className='flex flex-col justify-center items-center w-full p-4 gap-2 border border-gray-200 rounded-md'>
                                            <div className='flex justify-center items-center w-full gap-4'>
                                                <h4 className='text-xl uppercase'>Keratometria</h4>
                                            </div>
                                            <div className='grid grid-cols-4 gap-1'>
                                                <label></label>
                                                <label className='text-center text-lg'>QD1</label>
                                                <label className='text-center'>QD2</label>
                                                <label className='text-center'>EJE</label>
                                                <label className='flex justify-end items-center px-2'>OD</label>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_keratometria_qd1_od || 'N/A'}
                                                </p>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_keratometria_qd2_od  || 'N/A'}
                                                </p>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_keratometria_eje_od || 'N/A'}
                                                </p>
                                                <label className='flex justify-end items-center px-2'>OI</label>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_keratometria_qd1_oi || 'N/A'}
                                                </p>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_keratometria_qd2_oi || 'N/A'}
                                                </p>
                                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                                    {consulta.examen_keratometria_eje_oi || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
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
                                                width: '20rem',
                                                height: '12rem',
                                                resize: 'none'
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
                                <label className="block text-sm font-medium text-gray-700">Tratamiento</label>
                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{consulta.tratamiento}</p>
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