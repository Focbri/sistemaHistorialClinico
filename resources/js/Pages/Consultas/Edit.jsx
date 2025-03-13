import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import fondoOjo from '../../../assets/fondo_ojo.png';
import { useEffect, useState } from 'react';

export default function ConsultasEdit({ auth }) {
    // Obtener la consulta actual desde las props
    const { consulta } = usePage().props;
    console.log('Consulta recibida:', consulta); // Depuración

    // Inicializar el formulario con los datos de la consulta
    const { data, setData, put, errors, processing } = useForm({
        paciente_id: consulta.paciente_id || '',
        antecedentes_personales_hta: consulta.antecedentes_personales_hta || '',
        antecedentes_personales_alergias: consulta.antecedentes_personales_alergias || '',
        antecedentes_personales_dm: consulta.antecedentes_personales_dm || '',
        antecedentes_personales_otros: consulta.antecedentes_personales_otros || '',
        antecedentes_patologicos_familiares: consulta.antecedentes_patologicos_familiares || '',
        cirugias_previas: consulta.cirugias_previas || '',
        motivo_consulta: consulta.motivo_consulta || '',
        impresion_diagnostica: consulta.impresion_diagnostica || '',
        tratamiento: consulta.tratamiento || '',
        plan: consulta.plan || '',
        examenes_indicados: consulta.examenes_indicados || '',
        evoluciones: consulta.evoluciones || '',
        fondo_ojo: consulta.fondo_ojo || '',
        tipo_consulta: consulta.tipo_consulta || 'inicio', // Asegúrate de incluir este campo
        examen_av_sc_od: consulta.examen_av_sc_od || '',
        examen_av_cae_od: consulta.examen_av_cae_od || '',
        examen_av_cc_od: consulta.examen_av_cc_od || '',
        examen_av_sc_oi: consulta.examen_av_sc_oi || '',
        examen_av_cae_oi: consulta.examen_av_cae_oi || '',
        examen_av_cc_oi: consulta.examen_av_cc_oi || '',
        examen_pi_od: consulta.examen_pi_od || '',
        examen_pi_oi: consulta.examen_pi_oi || '',
        examen_ar_sph_od: consulta.examen_ar_sph_od || '',
        examen_ar_cyl_od: consulta.examen_ar_cyl_od || '',
        examen_ar_ax_od: consulta.examen_ar_ax_od || '',
        examen_ar_sph_oi: consulta.examen_ar_sph_oi || '',
        examen_ar_cyl_oi: consulta.examen_ar_cyl_oi || '',
        examen_ar_ax_oi: consulta.examen_ar_ax_oi || '',
        examen_keratometria_qd1_od: consulta.examen_keratometria_qd1_od || '',
        examen_keratometria_qd2_od: consulta.examen_keratometria_qd2_od || '',
        examen_keratometria_eje_od: consulta.examen_keratometria_eje_od || '',
        examen_keratometria_qd1_oi: consulta.examen_keratometria_qd1_oi || '',
        examen_keratometria_qd2_oi: consulta.examen_keratometria_qd2_oi || '',
        examen_keratometria_eje_oi: consulta.examen_keratometria_eje_oi || '',
        //
        biomicroscopia_movoculares_od: consulta.biomicroscopia_movoculares_od || '',
        biomicroscopia_parpados_od: consulta.biomicroscopia_parpados_od || '',
        biomicroscopia_cornea_od: consulta.biomicroscopia_cornea_od || '',
        biomicroscopia_corneaconj_od: consulta.biomicroscopia_corneaconj_od || '',
        biomicroscopia_ca_od: consulta.biomicroscopia_ca_od || '',
        biomicroscopia_iris_od: consulta.biomicroscopia_iris_od || '',
        biomicroscopia_cristalino_od: consulta.biomicroscopia_cristalino_od || '',
        biomicroscopia_movoculares_oi: consulta.biomicroscopia_movoculares_oi || '',
        biomicroscopia_parpados_oi: consulta.biomicroscopia_parpados_oi || '',
        biomicroscopia_cornea_oi: consulta.biomicroscopia_cornea_oi || '',
        biomicroscopia_corneaconj_oi: consulta.biomicroscopia_corneaconj_oi || '',
        biomicroscopia_ca_oi: consulta.biomicroscopia_ca_oi || '',
        biomicroscopia_iris_oi: consulta.biomicroscopia_iris_oi || '',
        biomicroscopia_cristalino_oi: consulta.biomicroscopia_cristalino_oi || '',
    });

    // Estados para mostrar/ocultar campos
    const [showHTAText, setShowHTAText] = useState(false);
    const [showDMText, setShowDMText] = useState(false);
    const [showAlergiasText, setShowAlergiasText] = useState(false);
    const [showPlanText, setShowPlanText] = useState(false);
    const [showOtrosText, setShowOtrosText] = useState(false);

    const [opcionesPlan, setOpcionesPlan] = useState([
        { id: 1, nombre: 'Plan A', seleccionado: false },
        { id: 2, nombre: 'Plan B', seleccionado: false },
        { id: 3, nombre: 'Plan C', seleccionado: false },
    ]);

    const handleSeleccionPlan = (id) => {
        const nuevasOpciones = opcionesPlan.map(opcion => ({
            ...opcion,
            seleccionado: opcion.id === id, // Solo la opción seleccionada será true
        }));
        setOpcionesPlan(nuevasOpciones);
    
        // Guardar el nombre del plan seleccionado en el estado `data.plan`
        const planSeleccionado = nuevasOpciones.find(opcion => opcion.seleccionado)?.nombre || '';
        setData('plan', planSeleccionado);
    };

    // Obtener el tipo de consulta
    const tipoConsulta = data.tipo_consulta;

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos enviados:', data); // Depuración
        put(route('consultas.update', consulta.id), data);
    };

    // Si no hay consulta, mostrar un mensaje
    if (!consulta) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <Head title="Editar Consulta" />
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <p className="text-red-500">No se encontró la consulta.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Editar Consulta</h2>}
        >
            <Head title="Editar Consulta" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Fecha de Consulta</label>
                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{new Date(consulta.created_at).toLocaleDateString()}</p>
                            </div>
                                {/* Mostrar información del paciente */}
                                <div className="mb-4">
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
                                </div>

                                {/* Resto del formulario */}
                                {/* Campos Consulta INICIO */}
                                {tipoConsulta === 'inicio' && ( // Mostrar solo si es tipo INICIO
                                    <>
                                        <div className='flex flex-col justify-center items-center w-full gap-4'>
                                            <h2>Consulta de Inicio</h2>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-xl font-medium text-gray-700">Antecedentes Personales</label>
                                            <p className="text-sm text-gray-500">Marque las opciones que correspondan</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 border border-gray-200 p-4 rounded-md mb-8">
                                            {/* Campo HTA */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between bg-[#DDE47E] p-2 rounded-md">
                                                    <label className="block text-sm font-medium text-gray-700">HTA</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowHTAText(!showHTAText)}
                                                        className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                                                    >
                                                        {showHTAText ? '▲' : '▼'} {/* Flecha hacia arriba/abajo */}
                                                    </button>
                                                </div>
                                                {showHTAText && (
                                                    <input
                                                        type="text"
                                                        value={data.antecedentes_personales_hta || ''}
                                                        onChange={(e) => setData('antecedentes_personales_hta', e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-[#8FDBF1] shadow-sm"
                                                        placeholder="Detalles de HTA"
                                                    />
                                                )}
                                            </div>

                                            {/* Campo DM */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between bg-[#DDE47E] p-2 rounded-md">
                                                    <label className="block text-sm font-medium text-gray-700">DM</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowDMText(!showDMText)}
                                                        className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                                                    >
                                                        {showDMText ? '▲' : '▼'} {/* Flecha hacia arriba/abajo */}
                                                    </button>
                                                </div>
                                                {showDMText && (
                                                    <input
                                                        type="text"
                                                        value={data.antecedentes_personales_dm || ''}
                                                        onChange={(e) => setData('antecedentes_personales_dm', e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-[#8FDBF1] shadow-sm"
                                                        placeholder="Detalles de DM"
                                                    />
                                                )}
                                            </div>

                                            {/* Campo Alergias */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between bg-[#DDE47E] p-2 rounded-md">
                                                    <label className="block text-sm font-medium text-gray-700">Alergias</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowAlergiasText(!showAlergiasText)}
                                                        className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                                                    >
                                                        {showAlergiasText ? '▲' : '▼'} {/* Flecha hacia arriba/abajo */}
                                                    </button>
                                                </div>
                                                {showAlergiasText && (
                                                    <input
                                                        type="text"
                                                        value={data.antecedentes_personales_alergias || ''}
                                                        onChange={(e) => setData('antecedentes_personales_alergias', e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-[#8FDBF1] shadow-sm"
                                                        placeholder="Detalles de Alergias"
                                                    />
                                                )}
                                            </div>

                                            {/* Campo Otros */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between bg-[#DDE47E] p-2 rounded-md">
                                                    <label className="block text-sm font-medium text-gray-700">Otros</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowOtrosText(!showOtrosText)}
                                                        className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                                                    >
                                                        {showOtrosText ? '▲' : '▼'} {/* Flecha hacia arriba/abajo */}
                                                    </button>
                                                </div>
                                                {showOtrosText && (
                                                    <input
                                                        type="text"
                                                        value={data.antecedentes_personales_otros || ''}
                                                        onChange={(e) => setData('antecedentes_personales_otros', e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-[#8FDBF1] shadow-sm"
                                                        placeholder="Detalles de Otros"
                                                    />
                                                    
                                                )}
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Antecedentes Patológicos Familiares</label>
                                    <input
                                        type="text"
                                        value={data.antecedentes_patologicos_familiares}
                                        onChange={(e) => setData('antecedentes_patologicos_familiares', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.antecedentes_patologicos_familiares && <p className="text-sm text-red-500">{errors.antecedentes_patologicos_familiares}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Cirugías Previas</label>
                                    <input
                                        type="text"
                                        value={data.cirugias_previas}
                                        onChange={(e) => setData('cirugias_previas', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.cirugias_previas && <p className="text-sm text-red-500">{errors.cirugias_previas}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Motivo de Consulta</label>
                                    <input
                                        type="text"
                                        value={data.motivo_consulta}
                                        onChange={(e) => setData('motivo_consulta', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.motivo_consulta && <p className="text-sm text-red-500">{errors.motivo_consulta}</p>}
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
                                                <input
                                                    type="text"
                                                    value={data.examen_av_sc_od}
                                                    onChange={(e) => setData('examen_av_sc_od', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.examen_av_cae_od}
                                                    onChange={(e) => setData('examen_av_cae_od', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.examen_av_cc_od}
                                                    onChange={(e) => setData('examen_av_cc_od', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                                <label className='flex justify-end items-center px-2'>OI</label>
                                                <input
                                                    type="text"
                                                    value={data.examen_av_sc_oi}
                                                    onChange={(e) => setData('examen_av_sc_oi', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.examen_av_cae_oi}
                                                    onChange={(e) => setData('examen_av_cae_oi', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.examen_av_cc_oi}
                                                    onChange={(e) => setData('examen_av_cc_oi', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
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
                                                <input
                                                    type="text"
                                                    value={data.examen_pi_od}
                                                    onChange={(e) => setData('examen_pi_od', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.examen_pi_oi}
                                                    onChange={(e) => setData('examen_pi_oi', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
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
                                                <input
                                                    type="text"
                                                    value={data.examen_ar_sph_od}
                                                    onChange={(e) => setData('examen_ar_sph_od', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.examen_ar_cyl_od}
                                                    onChange={(e) => setData('examen_ar_cyl_od', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.examen_ar_ax_od}
                                                    onChange={(e) => setData('examen_ar_ax_od', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                                <label className='flex justify-end items-center px-2'>OI</label>
                                                <input
                                                    type="text"
                                                    value={data.examen_ar_sph_oi}
                                                    onChange={(e) => setData('examen_ar_sph_oi', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.examen_ar_cyl_oi}
                                                    onChange={(e) => setData('examen_ar_cyl_oi', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.examen_ar_ax_oi}
                                                    onChange={(e) => setData('examen_ar_ax_oi', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
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
                                                <input
                                                    type="text"
                                                    value={data.examen_keratometria_qd1_od}
                                                    onChange={(e) => setData('examen_keratometria_qd1_od', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.examen_keratometria_qd2_od}
                                                    onChange={(e) => setData('examen_keratometria_qd2_od', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.examen_keratometria_eje_od}
                                                    onChange={(e) => setData('examen_keratometria_eje_od', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                                <label className='flex justify-end items-center px-2'>OI</label>
                                                <input
                                                    type="text"
                                                    value={data.examen_keratometria_qd1_oi}
                                                    onChange={(e) => setData('examen_keratometria_qd1_oi', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.examen_keratometria_qd2_oi}
                                                    onChange={(e) => setData('examen_keratometria_qd2_oi', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.examen_keratometria_eje_oi}
                                                    onChange={(e) => setData('examen_keratometria_eje_oi', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='mb-4'>
                                    <label className="text-xl font-medium text-gray-700 uppercase flex justify-center items-center w-full">Biomicroscopia</label>
                                    <div className='grid grid-cols-3 mx-8 border border-gray-200 rounded-md'>
                                        <label className='flex justify-center items-center py-2 border border-gray-300 shadow-sm'>Examen Fisico</label>
                                        <label className='flex justify-center items-center py-2 border border-gray-300 shadow-sm'>OD</label>
                                        <label className='flex justify-center items-center py-2 border border-gray-300 shadow-sm'>OI</label>
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Movimientos Oculares</label>
                                        <input
                                            type="text"
                                            value={data.biomicroscopia_movoculares_od}
                                            onChange={(e) => setData('biomicroscopia_movoculares_od', e.target.value)}
                                            className="block w-full  border-gray-300 shadow-sm"
                                        />
                                        <input
                                            type="text"
                                            value={data.biomicroscopia_movoculares_oi}
                                            onChange={(e) => setData('biomicroscopia_movoculares_oi', e.target.value)}
                                            className="block w-full  border-gray-300 shadow-sm"
                                        />
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Párpados</label>
                                        <input
                                            type="text"
                                            value={data.biomicroscopia_parpados_od}
                                            onChange={(e) => setData('biomicroscopia_parpados_od', e.target.value)}
                                            className="block w-full  border-gray-300 shadow-sm"
                                        />
                                        <input
                                            type="text"
                                            value={data.biomicroscopia_parpados_oi}
                                            onChange={(e) => setData('biomicroscopia_parpados_oi', e.target.value)}
                                            className="block w-full  border-gray-300 shadow-sm"
                                        />
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Córnea</label>
                                        <input
                                            type="text"
                                            value={data.biomicroscopia_cornea_od}
                                            onChange={(e) => setData('biomicroscopia_cornea_od', e.target.value)}
                                            className="block w-full  border-gray-300 shadow-sm"
                                        />
                                        <input
                                            type="text"
                                            value={data.biomicroscopia_cornea_oi}
                                            onChange={(e) => setData('biomicroscopia_cornea_oi', e.target.value)}
                                            className="block w-full  border-gray-300 shadow-sm"
                                        />
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Córnea Conjuntiva</label>
                                        <input
                                            type="text"
                                            value={data.biomicroscopia_corneaconj_od}
                                            onChange={(e) => setData('biomicroscopia_corneaconj_od', e.target.value)}
                                            className="block w-full  border-gray-300 shadow-sm"
                                        />
                                        <input
                                            type="text"
                                            value={data.biomicroscopia_corneaconj_oi}
                                            onChange={(e) => setData('biomicroscopia_corneaconj_oi', e.target.value)}
                                            className="block w-full  border-gray-300 shadow-sm"
                                        />
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Cámara Anterior</label>
                                        <input
                                            type="text"
                                            value={data.biomicroscopia_ca_od}
                                            onChange={(e) => setData('biomicroscopia_ca_od', e.target.value)}
                                            className="block w-full  border-gray-300 shadow-sm"
                                        />
                                        <input
                                            type="text"
                                            value={data.biomicroscopia_ca_oi}
                                            onChange={(e) => setData('biomicroscopia_ca_oi', e.target.value)}
                                            className="block w-full  border-gray-300 shadow-sm"
                                        />
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Iris</label>
                                        <input
                                            type="text"
                                            value={data.biomicroscopia_iris_od}
                                            onChange={(e) => setData('biomicroscopia_iris_od', e.target.value)}
                                            className="block w-full  border-gray-300 shadow-sm"
                                        />
                                        <input
                                            type="text"
                                            value={data.biomicroscopia_iris_oi}
                                            onChange={(e) => setData('biomicroscopia_iris_oi', e.target.value)}
                                            className="block w-full  border-gray-300 shadow-sm"
                                        />
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Cristalino</label>
                                        <input
                                            type="text"
                                            value={data.biomicroscopia_cristalino_od}
                                            onChange={(e) => setData('biomicroscopia_cristalino_od', e.target.value)}
                                            className="block w-full  border-gray-300 shadow-sm"
                                        />
                                        <input
                                            type="text"
                                            value={data.biomicroscopia_cristalino_oi}
                                            onChange={(e) => setData('biomicroscopia_cristalino_oi', e.target.value)}
                                            className="block w-full  border-gray-300 shadow-sm"
                                        />
                                    </div>
                                </div>
                                {/* Fondo de Ojo */}
                                <div className='flex flex-col justify-center items-center w-full gap-4'>
                                    <label className="block text-xl font-medium text-gray-700">Fondo de Ojo</label>
                                    <div className='flex gap-4'>
                                        <div className='relative inline-block'>
                                            <img src={fondoOjo} alt="Fondo de Ojo" className="w-full h-auto" />
                                            <span className='text-2xl absolute cursor-pointer bottom-3 left-24'>📍</span> {/* Ícono de marcador */}
                                        </div>                                        
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Impresión Diagnóstica</label>
                                    <input
                                        type="text"
                                        value={data.impresion_diagnostica}
                                        onChange={(e) => setData('impresion_diagnostica', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.impresion_diagnostica && <p className="text-sm text-red-500">{errors.impresion_diagnostica}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Tratamiento</label>
                                    <input
                                        type="text"
                                        value={data.tratamiento}
                                        onChange={(e) => setData('tratamiento', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.tratamiento && <p className="text-sm text-red-500">{errors.tratamiento}</p>}
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center justify-between bg-[#DDE47E] p-2 rounded-md">
                                        <label className="block text-sm font-medium text-gray-700">Plan</label>
                                        <button
                                            type="button"
                                            onClick={() => setShowPlanText(!showPlanText)}
                                            className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                                        >
                                            {showPlanText ? '▲' : '▼'} {/* Flecha hacia arriba/abajo */}
                                        </button>
                                    </div>
                                    {showPlanText && (
                                        <div className="mt-2 space-y-2">
                                        {opcionesPlan.map((opcion) => (
                                            <div key={opcion.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`plan-${opcion.id}`}
                                                    checked={data.plan === opcion.nombre}
                                                    onChange={() => handleSeleccionPlan(opcion.id)}
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                />
                                                <label
                                                    htmlFor={`plan-${opcion.id}`}
                                                    className="ml-2 text-sm text-gray-700"
                                                >
                                                    {opcion.nombre}
                                                </label>
                                            </div>
                                        ))}
                                    </div>                                                                            
                                    )}
                                </div>
                                

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Exámenes Indicados</label>
                                    <input
                                        type="text"
                                        value={data.examenes_indicados}
                                        onChange={(e) => setData('examenes_indicados', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.examenes_indicados && <p className="text-sm text-red-500">{errors.examenes_indicados}</p>}
                                </div>                
                                    </>
                                )}

                                {/* Campos Consulta EVOLUCION */}
                                {tipoConsulta === 'evolucion' && ( // Mostrar solo si es tipo EVOLUCION
                                    <> 
                                    <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Antecedentes Patológicos Familiares</label>
                                    <input
                                        type="text"
                                        value={data.antecedentes_patologicos_familiares}
                                        onChange={(e) => setData('antecedentes_patologicos_familiares', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.antecedentes_patologicos_familiares && <p className="text-sm text-red-500">{errors.antecedentes_patologicos_familiares}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Cirugías Previas</label>
                                    <input
                                        type="text"
                                        value={data.cirugias_previas}
                                        onChange={(e) => setData('cirugias_previas', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.cirugias_previas && <p className="text-sm text-red-500">{errors.cirugias_previas}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Motivo de Consulta</label>
                                    <input
                                        type="text"
                                        value={data.motivo_consulta}
                                        onChange={(e) => setData('motivo_consulta', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.motivo_consulta && <p className="text-sm text-red-500">{errors.motivo_consulta}</p>}
                                </div>

                                <div className='flex flex-col justify-center items-center w-full gap-4'>
                                    <label className="block text-xl font-medium text-gray-700">Fondo de Ojo</label>
                                    <div className='flex gap-4'>
                                        <div>
                                            <img src={fondoOjo} alt="Fondo de Ojo" className="w-full h-auto" />
                                        </div>                                        
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Impresión Diagnóstica</label>
                                    <input
                                        type="text"
                                        value={data.impresion_diagnostica}
                                        onChange={(e) => setData('impresion_diagnostica', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.impresion_diagnostica && <p className="text-sm text-red-500">{errors.impresion_diagnostica}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Tratamiento</label>
                                    <input
                                        type="text"
                                        value={data.tratamiento}
                                        onChange={(e) => setData('tratamiento', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.tratamiento && <p className="text-sm text-red-500">{errors.tratamiento}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Plan</label>
                                    <input
                                        type="text"
                                        value={data.plan}
                                        onChange={(e) => setData('plan', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.plan && <p className="text-sm text-red-500">{errors.plan}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Exámenes Indicados</label>
                                    <input
                                        type="text"
                                        value={data.examenes_indicados}
                                        onChange={(e) => setData('examenes_indicados', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.examenes_indicados && <p className="text-sm text-red-500">{errors.examenes_indicados}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Evoluciones</label>
                                    <input
                                        type="text"
                                        value={data.evoluciones}
                                        onChange={(e) => setData('evoluciones', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.evoluciones && <p className="text-sm text-red-500">{errors.evoluciones}</p>}
                                </div>
                                    </>
                                )}

                                <div className="flex items-center justify-end">
                                    <Link
                                        href={route('consultas.index')}
                                        className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="ml-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                    >
                                        {processing ? 'Guardando...' : 'Guardar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}