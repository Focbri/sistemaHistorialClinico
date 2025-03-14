import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import fondoOjo from '../../../assets/fondo_ojo.png';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';


export default function ConsultasShow({ auth, consulta }) {
    // Obtener el tipo de consulta
    const tipoConsulta = consulta.tipo_consulta;

    // Definir los marcadores
    const marcadores = [
        {
            id: 1,
            top: 'bottom-3', // Posición vertical
            left: 'left-24', // Posición horizontal
            campo: 'fondo_ojo_vitreo_od', // Campo asociado en el estado `data` VITREO
            color: 'blue', // Color del marcador
            subtitulo: 'Vítreo',
            opciones: [
                { id: 1, nombre: 'VITREO 1' },
                { id: 2, nombre: 'VITREO 2' },
                { id: 3, nombre: 'VITREO 3' },
            ],
        },
        {
            id: 2,
            top: 'bottom-20',
            left: 'left-24',
            campo: 'fondo_ojo_macula_od',
            color: 'red', // Color del marcador
            subtitulo: 'Mácula',
            opciones: [
                { id: 1, nombre: 'MACULA A' },
                { id: 2, nombre: 'MACULA B' },
            ],
        },
        {
            id: 3,
            top: 'top-16',
            left: 'left-6',
            campo: 'fondo_ojo_retina_p_od',
            color: 'green', // Color del marcador
            subtitulo: 'Retina Periférica',
            opciones: [
                { id: 1, nombre: 'RETINA P. 1' },
                { id: 2, nombre: 'RETINA P. 2' },
            ],
        },
        {
        id: 4,
        top: 'top-20',
        left: 'left-36',
        campo: 'fondo_ojo_disco_o_od',
        color: 'purple', // Color del marcador
        subtitulo: 'Disco Óptico',
        opciones: [
            { id: 1, nombre: 'DISCO OPT. P' },
            { id: 2, nombre: 'DISCO OPT. G' },
        ],
    },
    {
        id: 5,
        top: 'top-14',
        left: 'left-32',
        campo: 'fondo_ojo_vasos_od',
        color: 'orange', // Color del marcador
        subtitulo: 'Vasos Sanguíneos',
        opciones: [
            { id: 1, nombre: 'VASOS X' },
            { id: 2, nombre: 'VASOS Y' },
        ],
    }
        // Agrega más marcadores según sea necesario
    ];

    // Definir los marcadores OJO IZQUIERDO
    const marcadoresOI = [
        {
            id: 1,
            top: 'bottom-3', // Posición vertical
            right: 'right-24', // Posición horizontal
            campo: 'fondo_ojo_vitreo_oi', // Campo asociado en el estado `data` VITREO
            color: 'blue', // Color del marcador
            subtitulo: 'Vítreo OI',
            opciones: [
                { id: 1, nombre: 'OI VITREO 1' },
                { id: 2, nombre: 'OI VITREO 2' },
                { id: 3, nombre: 'OI VITREO 3' },
            ],
        },
        {
            id: 2,
            top: 'bottom-20',
            right: 'right-24',
            campo: 'fondo_ojo_macula_oi',
            color: 'red', // Color del marcador
            subtitulo: 'Mácula OI',
            opciones: [
                { id: 1, nombre: 'OI MACULA A' },
                { id: 2, nombre: 'OI MACULA B' },
            ],
        },
        {
            id: 3,
            top: 'top-16',
            right: 'right-6',
            campo: 'fondo_ojo_retina_p_oi',
            color: 'green', // Color del marcador
            subtitulo: 'Retina Periférica OI',
            opciones: [
                { id: 1, nombre: 'OI RETINA P. 1' },
                { id: 2, nombre: 'OI RETINA P. 2' },
            ],
        },
        {
        id: 4,
        top: 'top-20',
        right: 'right-36',
        campo: 'fondo_ojo_disco_o_oi',
        color: 'purple', // Color del marcador
        subtitulo: 'Disco Óptico OI',
        opciones: [
            { id: 1, nombre: 'OI DISCO OPT. P' },
            { id: 2, nombre: 'OI DISCO OPT. G' },
        ],
    },
    {
        id: 5,
        top: 'top-14',
        right: 'right-32',
        campo: 'fondo_ojo_vasos_oi',
        color: 'orange', // Color del marcador
        subtitulo: 'Vasos Sanguíneos OI',
        opciones: [
            { id: 1, nombre: 'OI VASOS X' },
            { id: 2, nombre: 'OI VASOS Y' },
        ],
    },
    ];

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
                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                    {new Date(consulta.created_at).toLocaleDateString()}
                                </p>
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

                            {tipoConsulta === 'inicio' && (
                                <>
                                <div className='flex flex-col justify-center items-center w-full gap-4 border-b border-gray-200 pb-2 mb-4 text-4xl'>
                                    <h2>Consulta de Inicio</h2>
                                </div>
                                {/* Antecedentes Personales */}
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

                                {/* Antecedentes Patológicos Familiares */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Antecedentes Patológicos Familiares</label>
                                    <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                        {consulta.antecedentes_patologicos_familiares || 'N/A'}
                                    </p>
                                </div>

                                {/* Cirugías Previas */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Cirugías Previas</label>
                                    <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                        {consulta.cirugias_previas || 'N/A'}
                                    </p>
                                </div>

                                {/* Motivo de Consulta */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Motivo de Consulta</label>
                                    <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                        {consulta.motivo_consulta || 'N/A'}
                                    </p>
                                </div>

                                {/* Examen */}
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

                                        {/* Examen de Presión Intraocular */}
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

                                        {/* Examen de Autorefractometría */}
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

                                        {/* Examen de Keratometría */}
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
                                                    {consulta.examen_keratometria_qd2_od || 'N/A'}
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

                                {/* Biomicroscopía */}
                                <div className='mb-4'>
                                    <label className="text-xl font-medium text-gray-700 uppercase flex justify-center items-center w-full">Biomicroscopia</label>
                                    <div className='grid grid-cols-3 mx-8 border border-gray-200 rounded-md'>
                                        <label className='flex justify-center items-center py-2 border border-gray-300 shadow-sm'>Examen Fisico</label>
                                        <label className='flex justify-center items-center py-2 border border-gray-300 shadow-sm'>OD</label>
                                        <label className='flex justify-center items-center py-2 border border-gray-300 shadow-sm'>OI</label>
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Movimientos Oculares</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_movoculares_od || 'N/A'}
                                        </p>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_movoculares_oi || 'N/A'}
                                        </p>
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Párpados</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_parpados_od || 'N/A'}
                                        </p>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_parpados_oi || 'N/A'}
                                        </p>
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Córnea</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_cornea_od || 'N/A'}
                                        </p>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_cornea_oi || 'N/A'}
                                        </p>
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Córnea Conjuntiva</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_corneaconj_od || 'N/A'}
                                        </p>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_corneaconj_oi || 'N/A'}
                                        </p>
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Cámara Anterior</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_ca_od || 'N/A'}
                                        </p>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_ca_oi || 'N/A'}
                                        </p>
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Iris</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_iris_od || 'N/A'}
                                        </p>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_iris_oi || 'N/A'}
                                        </p>
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Cristalino</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_cristalino_od || 'N/A'}
                                        </p>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_cristalino_oi || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Fondo de Ojo */}
                                <div className='flex flex-col justify-center items-center w-full gap-4 p-8'>
                                    <label className="block text-xl font-medium text-gray-700">Fondo de Ojo</label>
                                    <div className='flex gap-4'>
                                        <div className='relative inline-block'>
                                            <img src={fondoOjo} alt="Fondo de Ojo" className="w-full h-auto" />
                                            {marcadores.map((marcador) => (
                                                <span
                                                    key={marcador.id}
                                                    className={`text-2xl absolute cursor-pointer ${marcador.top} ${marcador.left}`}                                                
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faMapMarkerAlt}
                                                        style={{ color: marcador.color, fontSize: '24px' }} // Aplica el color dinámico
                                                    />
                                                </span>
                                            ))}

                                            {/* Contenedor de opciones OI */}                
                                            {marcadoresOI.map((marcadorOI) => (
                                                <span
                                                    key={marcadorOI.id}
                                                    className={`text-2xl absolute cursor-pointer ${marcadorOI.top} ${marcadorOI.right}`}
                                                    onClick={() => handleMarkerClickOI(marcadorOI)}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faMapMarkerAlt}
                                                        style={{ color: marcadorOI.color, fontSize: '24px' }} // Aplica el color dinámico
                                                    />
                                                </span>
                                            ))}

                                            {/* Mostrar la información de los marcadores OJO DERECJO */}
                                            <div className="max-w-2xl absolute"
                                            style={{
                                                top: '-15%', // Posiciona el contenedor debajo del marcador
                                                left: '-80%', // Centra horizontalmente
                                                transform: 'translateX(-10%)', // Ajusta el centrado
                                            }}>
                                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Información de los Marcadores</h3>
                                                <div className="space-y-2">
                                                    {marcadores.map((marcador) => (
                                                        <div key={marcador.id} className="bg-gray-50 p-1 rounded-md border" style={{ borderColor: marcador.color }}>
                                                            <span className="font-medium text-gray-700">{marcador.subtitulo}: </span>
                                                            <span>{consulta[marcador.campo] || 'N/A'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Mostrar la información de los marcadores OJO IZQUIERDO */}
                                            <div className="max-w-2xl absolute"
                                            style={{
                                                top: '-15%', // Posiciona el contenedor debajo del marcador
                                                right: '-80%', // Centra horizontalmente
                                                transform: 'translateX(10%)', // Ajusta el centrado
                                            }}>
                                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Información de los Marcadores</h3>
                                                <div className="space-y-2">
                                                    {marcadoresOI.map((marcadorOI) => (
                                                        <div key={marcadorOI.id} className="bg-gray-50 p-1 rounded-md border" style={{ borderColor: marcadorOI.color }}>
                                                            <span className="font-medium text-gray-700">{marcadorOI.subtitulo}: </span>
                                                            <span>{consulta[marcadorOI.campo] || 'N/A'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>                                    
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Impresión Diagnóstica</label>
                                    <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                        {consulta.impresion_diagnostica || 'N/A'}
                                    </p>
                                </div>
                                
                                {/* Tratamiento */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Tratamiento</label>
                                    <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                        {consulta.tratamiento || 'N/A'}
                                    </p>
                                </div>
                                {/* Plan */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Plan</label>
                                    <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                        {consulta.plan || 'N/A'}
                                    </p>
                                </div>
                                {/* Examenes Indicados */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Examenes Indicados</label>
                                    <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                        {consulta.examenes_indicados || 'N/A'}
                                    </p>
                                </div>
                                </>
                            )}

                            {tipoConsulta === 'evolucion' && (
                                <>
                                <div className='flex flex-col justify-center items-center w-full gap-4 border-b border-gray-200 pb-2 mb-4 text-4xl'>
                                    <h2>Consulta de Evolución</h2>
                                </div>
                                {/* Evoluciones */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Evoluciones</label>
                                    <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                        {consulta.evoluciones || 'N/A'}
                                    </p>
                                </div>

                                {/* Examen */}
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

                                        {/* Examen de Presión Intraocular */}
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

                                        {/* Examen de Autorefractometría */}
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

                                        {/* Examen de Keratometría */}
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
                                                    {consulta.examen_keratometria_qd2_od || 'N/A'}
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

                                {/* Biomicroscopía */}
                                <div className='mb-4'>
                                    <label className="text-xl font-medium text-gray-700 uppercase flex justify-center items-center w-full">Biomicroscopia</label>
                                    <div className='grid grid-cols-3 mx-8 border border-gray-200 rounded-md'>
                                        <label className='flex justify-center items-center py-2 border border-gray-300 shadow-sm'>Examen Fisico</label>
                                        <label className='flex justify-center items-center py-2 border border-gray-300 shadow-sm'>OD</label>
                                        <label className='flex justify-center items-center py-2 border border-gray-300 shadow-sm'>OI</label>
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Movimientos Oculares</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_movoculares_od || 'N/A'}
                                        </p>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_movoculares_oi || 'N/A'}
                                        </p>
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Párpados</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_parpados_od || 'N/A'}
                                        </p>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_parpados_oi || 'N/A'}
                                        </p>
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Córnea</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_cornea_od || 'N/A'}
                                        </p>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_cornea_oi || 'N/A'}
                                        </p>
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Córnea Conjuntiva</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_corneaconj_od || 'N/A'}
                                        </p>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_corneaconj_oi || 'N/A'}
                                        </p>
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Cámara Anterior</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_ca_od || 'N/A'}
                                        </p>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_ca_oi || 'N/A'}
                                        </p>
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Iris</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_iris_od || 'N/A'}
                                        </p>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_iris_oi || 'N/A'}
                                        </p>
                                        <label className='border-gray-300 shadow-sm border flex items-center px-4'>Cristalino</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_cristalino_od || 'N/A'}
                                        </p>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.biomicroscopia_cristalino_oi || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Fondo de Ojo */}
                                <div className='flex flex-col justify-center items-center w-full gap-4 p-8'>
                                    <label className="block text-xl font-medium text-gray-700">Fondo de Ojo</label>
                                    <div className='flex gap-4'>
                                        <div className='relative inline-block'>
                                            <img src={fondoOjo} alt="Fondo de Ojo" className="w-full h-auto" />
                                            {marcadores.map((marcador) => (
                                                <span
                                                    key={marcador.id}
                                                    className={`text-2xl absolute cursor-pointer ${marcador.top} ${marcador.left}`}                                                
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faMapMarkerAlt}
                                                        style={{ color: marcador.color, fontSize: '24px' }} // Aplica el color dinámico
                                                    />
                                                </span>
                                            ))}

                                            {/* Contenedor de opciones OI */}                
                                            {marcadoresOI.map((marcadorOI) => (
                                                <span
                                                    key={marcadorOI.id}
                                                    className={`text-2xl absolute cursor-pointer ${marcadorOI.top} ${marcadorOI.right}`}
                                                    onClick={() => handleMarkerClickOI(marcadorOI)}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faMapMarkerAlt}
                                                        style={{ color: marcadorOI.color, fontSize: '24px' }} // Aplica el color dinámico
                                                    />
                                                </span>
                                            ))}

                                            {/* Mostrar la información de los marcadores */}
                                            <div className="max-w-2xl absolute"
                                            style={{
                                                top: '-15%', // Posiciona el contenedor debajo del marcador
                                                left: '-80%', // Centra horizontalmente
                                                transform: 'translateX(-10%)', // Ajusta el centrado
                                            }}>
                                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Información de los Marcadores</h3>
                                                <div className="space-y-2">
                                                    {marcadores.map((marcador) => (
                                                        <div key={marcador.id} className="bg-gray-50 p-1 rounded-md border" style={{ borderColor: marcador.color }}>
                                                            <span className="font-medium text-gray-700">{marcador.subtitulo}: </span>
                                                            <span>{consulta[marcador.campo] || 'N/A'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Mostrar la información de los marcadores OJO IZQUIERDO */}
                                            <div className="max-w-2xl absolute"
                                            style={{
                                                top: '-15%', // Posiciona el contenedor debajo del marcador
                                                right: '-80%', // Centra horizontalmente
                                                transform: 'translateX(10%)', // Ajusta el centrado
                                            }}>
                                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Información de los Marcadores</h3>
                                                <div className="space-y-2">
                                                    {marcadoresOI.map((marcadorOI) => (
                                                        <div key={marcadorOI.id} className="bg-gray-50 p-1 rounded-md border" style={{ borderColor: marcadorOI.color }}>
                                                            <span className="font-medium text-gray-700">{marcadorOI.subtitulo}: </span>
                                                            <span>{consulta[marcadorOI.campo] || 'N/A'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>                                    
                                </div>

                                {/* Impresión Diagnóstica */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Impresión Diagnóstica</label>
                                    <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                        {consulta.impresion_diagnostica || 'N/A'}
                                    </p>
                                </div>
                                
                                {/* Tratamiento */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Tratamiento</label>
                                    <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                        {consulta.tratamiento || 'N/A'}
                                    </p>
                                </div>
                                {/* Plan */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Plan</label>
                                    <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                        {consulta.plan || 'N/A'}
                                    </p>
                                </div>
                                {/* Examenes Indicados */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Examenes Indicados</label>
                                    <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                        {consulta.examenes_indicados || 'N/A'}
                                    </p>
                                </div>                                             
                                </>
                            )}
                            {/* Botón para volver */}
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