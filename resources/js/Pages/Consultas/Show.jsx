import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { useEffect, useState, useCallback } from 'react';

// Componentes
import ExamenOcular from '@/Components/ExamenOcular';
import AntecedentesPersonales from '@/Components/AntecedentesPersonales';
import FondoOjo from '@/Components/FondoOjo';
import PlanSelector from '@/Components/PlanSelector';
import TerminoBiomicroscopiaSearch from '@/Components/TerminoBiomicroscopiaSearch';

export default function ConsultasShow({ auth }) {
    const { consulta } = usePage().props;
    // Verificar si hay datos de examen ocular
    const { data, setData, put, processing, reset } = useForm({
            paciente_id: consulta?.paciente_id || '',
            antecedentes_personales_hta: consulta?.antecedentes_personales_hta || '',
            antecedentes_personales_alergias: consulta?.antecedentes_personales_alergias || '',
            antecedentes_personales_dm: consulta?.antecedentes_personales_dm || '',
            antecedentes_personales_otros: consulta?.antecedentes_personales_otros || '',
            antecedentes_patologicos_familiares: consulta?.antecedentes_patologicos_familiares || '',
            //
            cirugias_previas: consulta?.cirugias_previas || '',
            motivo_consulta: consulta?.motivo_consulta || '',
            impresion_diagnostica: consulta?.impresion_diagnostica || '',
            tratamiento: consulta?.tratamiento || '',
            plan: consulta?.plan || '',
            evoluciones: consulta?.evoluciones || '',
            tipo_consulta: consulta?.tipo_consulta || 'inicio',
            //
            examen_av_sc_od: consulta?.examen?.examen_av_sc_od || '',
            examen_av_cae_od: consulta?.examen?.examen_av_cae_od || '',
            examen_av_cc_od: consulta?.examen?.examen_av_cc_od || '',
            examen_av_sc_oi: consulta?.examen?.examen_av_sc_oi || '',
            examen_av_cae_oi: consulta?.examen?.examen_av_cae_oi || '',
            examen_av_cc_oi: consulta?.examen?.examen_av_cc_oi || '',
            examen_pi_tipo: consulta?.examen?.examen_pi_tipo || '',
            examen_pi_od: consulta?.examen?.examen_pi_od || '',
            examen_pi_oi: consulta?.examen?.examen_pi_oi || '',
            examen_ar_sph_od: consulta?.examen?.examen_ar_sph_od || '',
            examen_ar_cyl_od: consulta?.examen?.examen_ar_cyl_od || '',
            examen_ar_ax_od: consulta?.examen?.examen_ar_ax_od || '',
            examen_ar_sph_oi: consulta?.examen?.examen_ar_sph_oi || '',
            examen_ar_cyl_oi: consulta?.examen?.examen_ar_cyl_oi || '',
            examen_ar_ax_oi: consulta?.examen?.examen_ar_ax_oi || '',
            examen_keratometria_qd1_od: consulta?.examen?.examen_keratometria_qd1_od || '',
            examen_keratometria_qd2_od: consulta?.examen?.examen_keratometria_qd2_od || '',
            examen_keratometria_eje_od: consulta?.examen?.examen_keratometria_eje_od || '',
            examen_keratometria_qd1_oi: consulta?.examen?.examen_keratometria_qd1_oi || '',
            examen_keratometria_qd2_oi: consulta?.examen?.examen_keratometria_qd2_oi || '',
            examen_keratometria_eje_oi: consulta?.examen?.examen_keratometria_eje_oi || '',
            //
            biomicroscopia_movoculares_od: consulta?.biomicroscopia_movoculares_od || '',
            biomicroscopia_parpados_od: consulta?.biomicroscopia_parpados_od || '',
            biomicroscopia_cornea_od: consulta?.biomicroscopia_cornea_od || '',
            biomicroscopia_corneaconj_od: consulta?.biomicroscopia_corneaconj_od || '',
            biomicroscopia_ca_od: consulta?.biomicroscopia_ca_od || '',
            biomicroscopia_iris_od: consulta?.biomicroscopia_iris_od || '',
            biomicroscopia_cristalino_od: consulta?.biomicroscopia_cristalino_od || '',
            biomicroscopia_movoculares_oi: consulta?.biomicroscopia_movoculares_oi || '',
            biomicroscopia_parpados_oi: consulta?.biomicroscopia_parpados_oi || '',
            biomicroscopia_cornea_oi: consulta?.biomicroscopia_cornea_oi || '',
            biomicroscopia_corneaconj_oi: consulta?.biomicroscopia_corneaconj_oi || '',
            biomicroscopia_ca_oi: consulta?.biomicroscopia_ca_oi || '',
            biomicroscopia_iris_oi: consulta?.biomicroscopia_iris_oi || '',
            biomicroscopia_cristalino_oi: consulta?.biomicroscopia_cristalino_oi || '',
            //
            fondo_ojo_posiciones: consulta.fondo_ojo_posiciones ? JSON.stringify(consulta.fondo_ojo_posiciones) : '{}',
            fondo_ojo_retina_p_od: consulta?.fondo_ojo_retina_p_od || '',
            fondo_ojo_macula_od: consulta?.fondo_ojo_macula_od || '',
            fondo_ojo_vitreo_od: consulta?.fondo_ojo_vitreo_od || '',
            fondo_ojo_disco_o_od: consulta?.fondo_ojo_disco_o_od || '',
            fondo_ojo_vasos_od: consulta?.fondo_ojo_vasos_od || '',
            fondo_ojo_macula_oi: consulta?.fondo_ojo_macula_oi || '',
            fondo_ojo_vitreo_oi: consulta?.fondo_ojo_vitreo_oi || '',
            fondo_ojo_disco_o_oi: consulta?.fondo_ojo_disco_o_oi || '',
            fondo_ojo_vasos_oi: consulta?.fondo_ojo_vasos_oi || '',
            fondo_ojo_retina_p_oi: consulta?.fondo_ojo_retina_p_oi || '',
            //
            exam_new_distancia_esfera_od  : consulta?.examen?.exam_new_distancia_esfera_od,
            exam_new_distancia_esfera_oi  : consulta?.examen?.exam_new_distancia_esfera_oi,
            exam_new_distancia_cilindro_od: consulta?.examen?.exam_new_distancia_cilindro_od,
            exam_new_distancia_cilindro_oi: consulta?.examen?.exam_new_distancia_cilindro_oi,
            exam_new_distancia_eje_od     : consulta?.examen?.exam_new_distancia_eje_od,
            exam_new_distancia_eje_oi     : consulta?.examen?.exam_new_distancia_eje_oi,
            exam_new_distancia_dip        : consulta?.examen?.exam_new_distancia_dip,
            exam_old_distancia_esfera_od  : consulta?.examen?.exam_old_distancia_esfera_od,
            exam_old_distancia_esfera_oi  : consulta?.examen?.exam_old_distancia_esfera_oi,
            exam_old_distancia_cilindro_od: consulta?.examen?.exam_old_distancia_cilindro_od,
            exam_old_distancia_cilindro_oi: consulta?.examen?.exam_old_distancia_cilindro_oi,
            exam_old_distancia_eje_od     : consulta?.examen?.exam_old_distancia_eje_od,
            exam_old_distancia_eje_oi     : consulta?.examen?.exam_old_distancia_eje_oi,
            exam_old_distancia_dip        : consulta?.examen?.exam_old_distancia_dip,
            exam_new_cerca_esfera_od      : consulta?.examen?.exam_new_cerca_esfera_od,
            exam_new_cerca_esfera_oi      : consulta?.examen?.exam_new_cerca_esfera_oi,
            exam_new_cerca_cilindro_od    : consulta?.examen?.exam_new_cerca_cilindro_od,
            exam_new_cerca_cilindro_oi    : consulta?.examen?.exam_new_cerca_cilindro_oi,
            exam_new_cerca_eje_od         : consulta?.examen?.exam_new_cerca_eje_od,
            exam_new_cerca_eje_oi         : consulta?.examen?.exam_new_cerca_eje_oi,
            exam_new_cerca_dip            : consulta?.examen?.exam_new_cerca_dip,
            exam_old_cerca_esfera_od      : consulta?.examen?.exam_old_cerca_esfera_od,
            exam_old_cerca_esfera_oi      : consulta?.examen?.exam_old_cerca_esfera_oi,
            exam_old_cerca_cilindro_od    : consulta?.examen?.exam_old_cerca_cilindro_od,
            exam_old_cerca_cilindro_oi    : consulta?.examen?.exam_old_cerca_cilindro_oi,
            exam_old_cerca_eje_od         : consulta?.examen?.exam_old_cerca_eje_od,
            exam_old_cerca_eje_oi         : consulta?.examen?.exam_old_cerca_eje_oi,
            exam_old_cerca_dip            : consulta?.examen?.exam_old_cerca_dip,
        });
    
    // Estados para UI
    const [selectedResults] = useState(
        consulta.impresion_diagnostica ? consulta.impresion_diagnostica.split(';').map(item => item.trim()) : []
    );

    const [opcionesPlan] = useState([
        { id: 1, nombre: 'Plan A', seleccionado: consulta.plan === 'Plan A' },
        { id: 2, nombre: 'Plan B', seleccionado: consulta.plan === 'Plan B' },
        { id: 3, nombre: 'Plan C', seleccionado: consulta.plan === 'Plan C' },
    ]);

    const [marcadoresOD] = useState([
        {
            id: 1,
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
        campo: 'fondo_ojo_vasos_od',
        color: 'orange', // Color del marcador
        subtitulo: 'Vasos Sanguíneos',
        opciones: [
            { id: 1, nombre: 'VASOS X' },
            { id: 2, nombre: 'VASOS Y' },
        ],
    }
    ]);
    const [marcadoresOI] = useState([
        {
            id: 1,
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
            campo: 'fondo_ojo_macula_oi',
            color: 'red', // Color del marcador
            subtitulo: 'Mácula',
            opciones: [
                { id: 1, nombre: 'OI MACULA A' },
                { id: 2, nombre: 'OI MACULA B' },
            ],
        },
        {
            id: 3,
            campo: 'fondo_ojo_retina_p_oi',
            color: 'green', // Color del marcador
            subtitulo: 'Retina Periférica',
            opciones: [
                { id: 1, nombre: 'OI RETINA P. 1' },
                { id: 2, nombre: 'OI RETINA P. 2' },
            ],
        },
        {
        id: 4,
        campo: 'fondo_ojo_disco_o_oi',
        color: 'purple', // Color del marcador
        subtitulo: 'Disco Óptico',
        opciones: [
            { id: 1, nombre: 'OI DISCO OPT. P' },
            { id: 2, nombre: 'OI DISCO OPT. G' },
        ],
    },
    {
        id: 5,
        campo: 'fondo_ojo_vasos_oi',
        color: 'orange', // Color del marcador
        subtitulo: 'Vasos Sanguíneos',
        opciones: [
            { id: 1, nombre: 'OI VASOS X' },
            { id: 2, nombre: 'OI VASOS Y' },
        ],
    },
    ]);

    if (!consulta) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <Head title="Detalles de Consulta" />
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <p className="text-red-500">No se encontró la consulta.</p>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Define estas variables con valores iniciales apropiados o elimínalas si no son necesarias
    // Reemplaza estas líneas en tu componente
    const [showHTAText, setShowHTAText] = useState(false);
    const [showDMText, setShowDMText] = useState(false);
    const [showAlergiasText, setShowAlergiasText] = useState(false);
    const [showPlanText, setShowPlanText] = useState(false);
    const [showOtrosText, setShowOtrosText] = useState(false);
    
    const [marcadorActivo, setMarcadorActivo] = useState(null);
    const [marcadorActivoOI, setMarcadorActivoOI] = useState(null);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Detalles de Consulta</h2>}
        >
            <Head title="Detalles de Consulta" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Información del paciente */}
                            <div className="mb-8 py-4 px-8 border border-gray-200 rounded-md">
                                    <div className='mb-4'>
                                        <label className="inline-block text-xl font-medium text-black border-b-2 border-black uppercase">Datos Personales</label>
                                    </div>                                       
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='flex flex-col'>
                                            <div className="mb-1 flex gap-2">
                                                <label className="text-sm text-gray-700"><strong>Apellido Paterno:</strong></label>
                                                <p className="text-sm text-gray-700">{consulta.paciente.apellido_paterno}</p>
                                            </div>
                                            <div className="mb-1 flex gap-2">
                                                <label className="text-sm text-gray-700"><strong>Apellido Materno:</strong></label>
                                                <p className="text-sm text-gray-700">{consulta.paciente.apellido_materno}</p>
                                            </div>
                                            <div className="mb-1 flex gap-2">
                                                <label className="text-sm text-gray-700"><strong>Nombres:</strong></label>
                                                <p className="text-sm text-gray-700">{consulta.paciente.nombres}</p>
                                            </div>
                                        </div>

                                        <div className='flex flex-col'>
                                            <div className="mb-1 flex gap-2">
                                                <label className="text-sm text-gray-700"><strong>Fecha de Nacimiento:</strong></label>
                                                <p className="text-sm text-gray-700">{consulta.paciente.fecha_nacimiento}</p>
                                            </div>
                                            <div className='grid grid-cols-2 '>
                                                <div className="mb-1 flex gap-2">
                                                    <label className="text-sm text-gray-700"><strong>Edad:</strong></label>
                                                    <p className="text-sm text-gray-700">{consulta.paciente.edad}</p>
                                                </div>
                                                <div className="mb-1 flex gap-2">
                                                    <label className="text-sm text-gray-700"><strong>Peso:</strong></label>
                                                    <p className="text-sm text-gray-700">{consulta.paciente.peso}</p>
                                                </div>
                                                <div className="mb-1 flex gap-2">
                                                    <label className="text-sm text-gray-700"><strong>Sexo:</strong></label>
                                                    <p className="text-sm text-gray-700">{consulta.paciente.sexo}</p>
                                                </div>
                                                <div className="mb-1 flex gap-2">
                                                    <label className="text-sm text-gray-700"><strong>DNI:</strong></label>
                                                    <p className="text-sm text-gray-700">{consulta.paciente.dni}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className='my-6'/>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='flex flex-col'>
                                            <div className="mb-1 flex gap-2">
                                                <label className="text-sm text-gray-700"><strong>Estado Civil:</strong></label>
                                                <p className="text-sm text-gray-700">{consulta.paciente.estado_civil}</p>
                                            </div>
                                            <div className="mb-1 flex gap-2">
                                                <label className="text-sm text-gray-700"><strong>Ocupación:</strong></label>
                                                <p className="text-sm text-gray-700">{consulta.paciente.ocupacion}</p>
                                            </div>
                                            <div className="mb-1 flex gap-2">
                                                <label className="text-sm text-gray-700"><strong>Procedencia:</strong></label>
                                                <p className="text-sm text-gray-700">{consulta.paciente.procedencia}</p>
                                            </div>
                                            <div className="mb-1 flex gap-2">
                                                <label className="text-sm text-gray-700"><strong>Domicilio:</strong></label>
                                                <p className="text-sm text-gray-700">{consulta.paciente.direccion}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col'>
                                            <div className="mb-1 flex gap-2">
                                                <label className="text-sm text-gray-700"><strong>Acompañante:</strong></label>
                                                <p className="text-sm text-gray-700">{consulta.paciente.acompañante}</p>
                                            </div>
                                            <div className="mb-1 flex gap-2">
                                                <label className="text-sm text-gray-700"><strong>Referido:</strong></label>
                                                <p className="text-sm text-gray-700">{consulta.paciente.referido}</p>
                                            </div>
                                            <div className="mb-1 flex gap-2">
                                                <label className="text-sm text-gray-700"><strong>Teléfono:</strong></label>
                                                <p className="text-sm text-gray-700">{consulta.paciente.telefono}</p>
                                            </div>
                                            <div className="mb-1 flex gap-2">
                                                <label className="text-sm text-gray-700"><strong>Email:</strong></label>
                                                <p className="text-sm text-gray-700">{consulta.paciente.email}</p>
                                            </div>
                                        </div>
                                    </div>                                        
                            </div>

                            {/* Campos según tipo de consulta */}
                            {consulta.tipo_consulta === 'inicio' && (
                                <>
                                    <div className='flex flex-col justify-center items-center w-full gap-4 border-b border-gray-200 pb-2 mb-4 text-4xl'>
                                        <h2>Consulta de Inicio</h2>
                                    </div>
                                    
                                    <div className="block text-sm font-medium text-gray-700">
                                        <h2>Antecedentes Personales</h2>
                                    </div>
                                    
                                    <AntecedentesPersonales
                                        data={consulta}
                                        setData={setData}
                                        showHTAText={showHTAText}
                                        setShowHTAText={setShowHTAText}
                                        showDMText={showDMText}
                                        setShowDMText={setShowDMText}
                                        showAlergiasText={showAlergiasText}
                                        setShowAlergiasText={setShowAlergiasText}
                                        showOtrosText={showOtrosText}
                                        setShowOtrosText={setShowOtrosText}
                                        readOnly={true}
                                    />
                                    
                                    {/* Resto de campos en modo lectura */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Antecedentes Patológicos Familiares</label>
                                        <div className="mt-1 p-2 bg-gray-100 rounded-md">
                                            {consulta.antecedentes_patologicos_familiares || 'No especificado'}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Cirugías Previas</label>
                                        <div className="mt-1 p-2 bg-gray-100 rounded-md">
                                            {consulta.cirugias_previas || 'No especificado'}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Motivo de Consulta</label>
                                        <div className="mt-1 p-2 bg-gray-100 rounded-md">
                                            {consulta.motivo_consulta || 'No especificado'}
                                        </div>
                                    </div>

                                    <hr className='my-8'/>
                                    
                                    {/* Examen Ocular - Elimina la condición temporalmente para pruebas */}
                                    <div className="mb-4 border border-gray-200 rounded-md p-4">
                                        <h3 className="font-medium text-gray-700 mb-2">Examen Ocular</h3>
                                        <ExamenOcular 
                                            data={data} 
                                            setData={setData} 
                                            edadPaciente={consulta.paciente.edad} 
                                            readOnly={true} 
                                        />
                                    </div>
                                    
                                    <hr className='my-8'/>

                                    <div className='mb-4'>
                                        <label className="text-xl font-medium text-gray-700 uppercase flex justify-center items-center w-full mb-4">Biomicroscopia</label>
                                        <div className='grid grid-cols-3 mx-8 border border-gray-200 rounded-md'>
                                        <label className='flex justify-center items-center py-2 border border-[#8FDBF1] shadow-sm'>Examen Fisico</label>
                                                <label className='flex justify-center items-center py-2 border border-[#8FDBF1] shadow-sm'>OD</label>
                                                <label className='flex justify-center items-center py-2 border border-[#8FDBF1] shadow-sm'>OI</label>
                                                
                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Movimientos Oculares</label>
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={consulta.biomicroscopia_movoculares_od || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_movoculares_od', termsArray.join(', '))}
                                                    readOnly={true}
                                                />
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={consulta.biomicroscopia_movoculares_oi || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_movoculares_oi', termsArray.join(', '))} readOnly={true}
                                                />
                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Párpados</label>
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={consulta.biomicroscopia_parpados_od || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_parpados_od', termsArray.join(', '))} readOnly={true}
                                                />
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={consulta.biomicroscopia_parpados_oi || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_parpados_oi', termsArray.join(', '))} readOnly={true}
                                                />
                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Córnea</label>
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={consulta.biomicroscopia_cornea_od || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_cornea_od', termsArray.join(', '))} readOnly={true}
                                                />
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={consulta.biomicroscopia_cornea_oi || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_cornea_oi', termsArray.join(', '))} readOnly={true}
                                                />
                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Conjuntiva</label>
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={consulta.biomicroscopia_corneaconj_od || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_corneaconj_od', termsArray.join(', '))} readOnly={true}
                                                />
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={consulta.biomicroscopia_corneaconj_oi || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_corneaconj_oi', termsArray.join(', '))} readOnly={true}
                                                />
                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Cámara Anterior</label>
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={consulta.biomicroscopia_ca_od || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_ca_od', termsArray.join(', '))} readOnly={true}
                                                />
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={consulta.biomicroscopia_ca_oi || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_ca_oi', termsArray.join(', '))} readOnly={true}
                                                /> 
                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Iris</label>
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={consulta.biomicroscopia_iris_od || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_iris_od', termsArray.join(', '))} readOnly={true}
                                                />
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={consulta.biomicroscopia_iris_oi || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_iris_oi', termsArray.join(', '))} readOnly={true}
                                                />
                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Cristalino</label>
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={consulta.biomicroscopia_cristalino_od || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_cristalino_od', termsArray.join(', '))} readOnly={true}
                                                />
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={consulta.biomicroscopia_cristalino_oi || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_cristalino_oi', termsArray.join(', '))} readOnly={true}
                                                />
                                        </div>
                                    </div>

                                    <FondoOjo 
                                        marcadoresOD={marcadoresOD}
                                        marcadoresOI={marcadoresOI}
                                        marcadorActivoOD={null}
                                        marcadorActivoOI={null}
                                        handleMarkerClickOD={() => {}}
                                        handleMarkerClickOI={() => {}}
                                        handleSeleccionOpcionOD={() => {}}
                                        handleSeleccionOpcionOI={() => {}}
                                        data={data}
                                        setData={() => {}}
                                        modoVisualizacion={true}
                                    />

                                    {/* Campo CIE10 */}
                                    <div className="mb-4 mt-8">
                                        <label className="block text-sm font-medium text-gray-700">Impresión Diagnóstica (CIE10)</label>
                                        <div className="mt-2 p-2 bg-gray-100 rounded-md">
                                            {selectedResults.map((result, index) => (
                                                <div key={index} className="inline-flex items-center bg-gray-200 rounded-md p-2 m-1">
                                                    <span>{result}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Tratamiento</label>
                                        <div className="mt-1 p-2 bg-gray-100 rounded-md">
                                            {consulta.tratamiento || 'No especificado'}
                                        </div>
                                    </div>

                                    <PlanSelector
                                        opcionesPlan={opcionesPlan}
                                        handleSeleccionPlan={() => {}}
                                        showPlanText={showPlanText}
                                        setShowPlanText={setShowPlanText}
                                        readOnly={true}
                                    />

                                    
                                </>
                            )}

                            {consulta.tipo_consulta === 'evolucion' && (
                                <>
                                <div className='flex flex-col justify-center items-center w-full gap-4 border-b border-gray-200 pb-2 mb-4 text-4xl'>
                                    <h2>Consulta de Inicio</h2>
                                </div>
                                <div className="p-4">
                                <label className="block text-sm font-medium text-gray-700">Evoluciones</label>
                                    <div className="mt-1 p-2 bg-gray-100 rounded-md">
                                        {consulta.evoluciones || 'No especificado'}
                                    </div>
                                </div>    
                                {/* Examen Ocular - Elimina la condición temporalmente para pruebas */}
                                <div className="mb-4 border border-gray-200 rounded-md p-4">
                                    <h3 className="font-medium text-gray-700 mb-2">Examen Ocular</h3>
                                    <ExamenOcular 
                                        data={data} 
                                        setData={setData} 
                                        edadPaciente={consulta.paciente.edad} 
                                        readOnly={true} 
                                    />
                                </div>

                                <div className='mb-4'>
                                    <label className="text-xl font-medium text-gray-700 uppercase flex justify-center items-center w-full mb-4">Biomicroscopia</label>
                                    <div className='grid grid-cols-3 mx-8 border border-gray-200 rounded-md'>
                                    <label className='flex justify-center items-center py-2 border border-[#8FDBF1] shadow-sm'>Examen Fisico</label>
                                            <label className='flex justify-center items-center py-2 border border-[#8FDBF1] shadow-sm'>OD</label>
                                            <label className='flex justify-center items-center py-2 border border-[#8FDBF1] shadow-sm'>OI</label>
                                            
                                            <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Movimientos Oculares</label>
                                            <TerminoBiomicroscopiaSearch
                                                initialValue={consulta.biomicroscopia_movoculares_od || ''}
                                                onSelectTerm={(termsArray) => setData('biomicroscopia_movoculares_od', termsArray.join(', '))}
                                                readOnly={true}
                                            />
                                            <TerminoBiomicroscopiaSearch
                                                initialValue={consulta.biomicroscopia_movoculares_oi || ''}
                                                onSelectTerm={(termsArray) => setData('biomicroscopia_movoculares_oi', termsArray.join(', '))} readOnly={true}
                                            />
                                            <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Párpados</label>
                                            <TerminoBiomicroscopiaSearch
                                                initialValue={consulta.biomicroscopia_parpados_od || ''}
                                                onSelectTerm={(termsArray) => setData('biomicroscopia_parpados_od', termsArray.join(', '))} readOnly={true}
                                            />
                                            <TerminoBiomicroscopiaSearch
                                                initialValue={consulta.biomicroscopia_parpados_oi || ''}
                                                onSelectTerm={(termsArray) => setData('biomicroscopia_parpados_oi', termsArray.join(', '))} readOnly={true}
                                            />
                                            <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Córnea</label>
                                            <TerminoBiomicroscopiaSearch
                                                initialValue={consulta.biomicroscopia_cornea_od || ''}
                                                onSelectTerm={(termsArray) => setData('biomicroscopia_cornea_od', termsArray.join(', '))} readOnly={true}
                                            />
                                            <TerminoBiomicroscopiaSearch
                                                initialValue={consulta.biomicroscopia_cornea_oi || ''}
                                                onSelectTerm={(termsArray) => setData('biomicroscopia_cornea_oi', termsArray.join(', '))} readOnly={true}
                                            />
                                            <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Conjuntiva</label>
                                            <TerminoBiomicroscopiaSearch
                                                initialValue={consulta.biomicroscopia_corneaconj_od || ''}
                                                onSelectTerm={(termsArray) => setData('biomicroscopia_corneaconj_od', termsArray.join(', '))} readOnly={true}
                                            />
                                            <TerminoBiomicroscopiaSearch
                                                initialValue={consulta.biomicroscopia_corneaconj_oi || ''}
                                                onSelectTerm={(termsArray) => setData('biomicroscopia_corneaconj_oi', termsArray.join(', '))} readOnly={true}
                                            />
                                            <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Cámara Anterior</label>
                                            <TerminoBiomicroscopiaSearch
                                                initialValue={consulta.biomicroscopia_ca_od || ''}
                                                onSelectTerm={(termsArray) => setData('biomicroscopia_ca_od', termsArray.join(', '))} readOnly={true}
                                            />
                                            <TerminoBiomicroscopiaSearch
                                                initialValue={consulta.biomicroscopia_ca_oi || ''}
                                                onSelectTerm={(termsArray) => setData('biomicroscopia_ca_oi', termsArray.join(', '))} readOnly={true}
                                            /> 
                                            <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Iris</label>
                                            <TerminoBiomicroscopiaSearch
                                                initialValue={consulta.biomicroscopia_iris_od || ''}
                                                onSelectTerm={(termsArray) => setData('biomicroscopia_iris_od', termsArray.join(', '))} readOnly={true}
                                            />
                                            <TerminoBiomicroscopiaSearch
                                                initialValue={consulta.biomicroscopia_iris_oi || ''}
                                                onSelectTerm={(termsArray) => setData('biomicroscopia_iris_oi', termsArray.join(', '))} readOnly={true}
                                            />
                                            <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Cristalino</label>
                                            <TerminoBiomicroscopiaSearch
                                                initialValue={consulta.biomicroscopia_cristalino_od || ''}
                                                onSelectTerm={(termsArray) => setData('biomicroscopia_cristalino_od', termsArray.join(', '))} readOnly={true}
                                            />
                                            <TerminoBiomicroscopiaSearch
                                                initialValue={consulta.biomicroscopia_cristalino_oi || ''}
                                                onSelectTerm={(termsArray) => setData('biomicroscopia_cristalino_oi', termsArray.join(', '))} readOnly={true}
                                            />
                                    </div>
                                </div>

                                <FondoOjo 
                                    marcadoresOD={marcadoresOD}
                                    marcadoresOI={marcadoresOI}
                                    marcadorActivoOD={null}
                                    marcadorActivoOI={null}
                                    handleMarkerClickOD={() => {}}
                                    handleMarkerClickOI={() => {}}
                                    handleSeleccionOpcionOD={() => {}}
                                    handleSeleccionOpcionOI={() => {}}
                                    data={data}
                                    setData={() => {}}
                                    modoVisualizacion={true}
                                />

                                {/* Campo CIE10 */}
                                <div className="mb-4 mt-8">
                                    <label className="block text-sm font-medium text-gray-700">Impresión Diagnóstica (CIE10)</label>
                                    <div className="mt-2 p-2 bg-gray-100 rounded-md">
                                        {selectedResults.map((result, index) => (
                                            <div key={index} className="inline-flex items-center bg-gray-200 rounded-md p-2 m-1">
                                                <span>{result}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Tratamiento</label>
                                    <div className="mt-1 p-2 bg-gray-100 rounded-md">
                                        {consulta.tratamiento || 'No especificado'}
                                    </div>
                                </div>

                                <PlanSelector
                                    opcionesPlan={opcionesPlan}
                                    handleSeleccionPlan={() => {}}
                                    showPlanText={showPlanText}
                                    setShowPlanText={setShowPlanText}
                                    readOnly={true}
                                />

                                
                            </>
                            )}

                            <div className="flex items-center justify-end mt-6">
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