import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';

import PacienteForm from '@/Components/PacienteForm';
import Cie10Search from '@/Components/Cie10Search';
import AntecedentesPersonales from '@/Components/AntecedentesPersonales';
import ExamenOcular from '@/Components/ExamenOcular';
import FondoOjo from '@/Components/FondoOjo';
import PlanSelector from '@/Components/PlanSelector';
import TerminoBiomicroscopiaSearch from '@/Components/TerminoBiomicroscopiaSearch';
import TerminoMotivoConsultaSearch from '@/Components/TerminoMotivoConsultaSearch';

export default function ConsultasCreate({ auth }) {
    const { data, setData, post, errors, processing } = useForm({
        paciente_id: '',
        dni: '',    
        nombres: '',
        apellido_paterno: '',
        apellido_materno: '',
        telefono: '',
        email: '',
        fecha_nacimiento: '',
        edad: '',
        //
        antecedentes_personales_hta: '',
        antecedentes_personales_alergias: '',
        antecedentes_personales_dm: '',
        antecedentes_personales_otros: '',
        antecedentes_patologicos_familiares: '',
        cirugias_previas: '',
        motivo_consulta: '',
        impresion_diagnostica: '',
        tratamiento: '',
        plan: '',
        examenes_indicados_img: [], // Array para almacenar las imágenes
        examenes_indicados_archivos: [], // Array para almacenar las imágenes
        evoluciones: '',
        tipo_consulta: 'inicio', // Asegúrate de incluir este campo
        //
        examen_av_sc_od: '',
        examen_av_cae_od: '',
        examen_av_cc_od: '',
        examen_av_sc_oi: '',
        examen_av_cae_oi: '',
        examen_av_cc_oi: '',
        examen_pi_tipo:'',
        examen_pi_od: '',
        examen_pi_oi: '',
        examen_ar_sph_od: '',
        examen_ar_cyl_od: '',
        examen_ar_ax_od: '',
        examen_ar_sph_oi: '',
        examen_ar_cyl_oi: '',
        examen_ar_ax_oi: '',
        examen_keratometria_qd1_od: '',
        examen_keratometria_qd2_od: '',
        examen_keratometria_eje_od: '',
        examen_keratometria_qd1_oi: '',
        examen_keratometria_qd2_oi: '',
        examen_keratometria_eje_oi: '',
        //
        biomicroscopia_movoculares_od: '',
        biomicroscopia_parpados_od: '',
        biomicroscopia_cornea_od: '',
        biomicroscopia_corneaconj_od: '',
        biomicroscopia_ca_od: '',
        biomicroscopia_iris_od: '',
        biomicroscopia_cristalino_od: '',
        biomicroscopia_movoculares_oi: '',
        biomicroscopia_parpados_oi: '',
        biomicroscopia_cornea_oi: '',
        biomicroscopia_corneaconj_oi: '',
        biomicroscopia_ca_oi: '',
        biomicroscopia_iris_oi: '',
        biomicroscopia_cristalino_oi: '',
        //
        fondo_ojo_retina_p_od:'',
        fondo_ojo_macula_od:'',
        fondo_ojo_vitreo_od:'',
        fondo_ojo_disco_o_od:'',
        fondo_ojo_vasos_od:'',
        fondo_ojo_macula_oi:'',
        fondo_ojo_vitreo_oi:'',
        fondo_ojo_disco_o_oi:'',
        fondo_ojo_vasos_oi:'',
        fondo_ojo_retina_p_oi:'',
        //
        exam_new_distancia_esfera_od: '',
        exam_new_distancia_esfera_oi: '',
        exam_new_distancia_cilindro_od: '',
        exam_new_distancia_cilindro_oi: '',
        exam_new_distancia_eje_od: '',
        exam_new_distancia_eje_oi: '',
        exam_new_distancia_dip: '',
        exam_old_distancia_esfera_od: '',
        exam_old_distancia_esfera_oi: '',
        exam_old_distancia_cilindro_od: '',
        exam_old_distancia_cilindro_oi: '',
        exam_old_distancia_eje_od: '',
        exam_old_distancia_eje_oi: '',
        exam_old_distancia_dip: '',
        //
        exam_new_cerca_esfera_od: '',
        exam_new_cerca_esfera_oi: '',
        exam_new_cerca_cilindro_od: '',
        exam_new_cerca_cilindro_oi: '',
        exam_new_cerca_eje_od: '',
        exam_new_cerca_eje_oi: '',
        exam_new_cerca_dip: '',
        exam_old_cerca_esfera_od: '',
        exam_old_cerca_esfera_oi: '',
        exam_old_cerca_cilindro_od: '',
        exam_old_cerca_cilindro_oi: '',
        exam_old_cerca_eje_od: '',
        exam_old_cerca_eje_oi: '',
        exam_old_cerca_dip: '',
    });

    const [showHTAText, setShowHTAText] = useState(false);
    const [showDMText, setShowDMText] = useState(false);
    const [showAlergiasText, setShowAlergiasText] = useState(false);
    const [showPlanText, setShowPlanText] = useState(false);
    const [showOtrosText, setShowOtrosText] = useState(false);

    const [pacienteEncontrado, setPacienteEncontrado] = useState(false);
    const [tipoConsulta, setTipoConsulta] = useState('inicio'); // Estado para el tipo de consulta

    const [opcionesPlan, setOpcionesPlan] = useState([
        { id: 1, nombre: 'Plan A', seleccionado: false },
        { id: 2, nombre: 'Plan B', seleccionado: false },
        { id: 3, nombre: 'Plan C', seleccionado: false },
    ]);

    const [selectedResults, setSelectedResults] = useState([]); // Inicializado como array vacío
    // Manejar la selección de resultados
    const handleSelectResult = useCallback((results) => {
        if (typeof results === 'string') {
            results = results.split(';').map(item => item.trim()); // Convertir a array si es una cadena
        }
        setSelectedResults(results); // Actualizar el estado de resultados seleccionados
        setData('impresion_diagnostica', results.join('; ')); // Combinar las opciones en una cadena
    }, [setData]);

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

     // Estado para controlar el marcador activo
     const [marcadorActivo, setMarcadorActivo] = useState(null);
     // Estado para controlar el marcador activo OJO IZQUIERDO
     const [marcadorActivoOI, setMarcadorActivoOI] = useState(null);

     // Definir los marcadores OJO DERECHO
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
    },
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
            subtitulo: 'Mácula',
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
            subtitulo: 'Retina Periférica',
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
        subtitulo: 'Disco Óptico',
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
        subtitulo: 'Vasos Sanguíneos',
        opciones: [
            { id: 1, nombre: 'OI VASOS X' },
            { id: 2, nombre: 'OI VASOS Y' },
        ],
    },
    ];

     // Manejar clic en el marcador
    const handleMarkerClick = (marcador) => {
        setMarcadorActivo(marcador.id === marcadorActivo ? null : marcador.id);
    };

     // Manejar clic en el marcador OJO IZQUIERDO
     const handleMarkerClickOI = (marcadorOI) => {
        setMarcadorActivoOI(marcadorOI.id === marcadorActivoOI ? null : marcadorOI.id);
    };

    // Manejar selección de una opción
    const handleSeleccionOpcion = (opcion) => {
        if (marcadorActivo) {
            const marcador = marcadores.find(m => m.id === marcadorActivo);
            setData(marcador.campo, opcion.nombre); // Actualiza el campo correspondiente en el estado `data`
            setMarcadorActivo(null); // Cierra el contenedor de opciones
        }
    };

    // Manejar selección de una opción OJO IZQUIERDO
    const handleSeleccionOpcionOI = (opcionOI) => {
        if (marcadorActivoOI) {
            const marcadorOI = marcadoresOI.find(mOI => mOI.id === marcadorActivoOI);
            setData(marcadorOI.campo, opcionOI.nombre); // Actualiza el campo correspondiente en el estado `data`
            setMarcadorActivoOI(null); // Cierra el contenedor de opciones
        }
    };

    // Cerrar el contenedor de opciones al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (marcadorActivo && !e.target.closest('.opciones-container')) {
                setMarcadorActivo(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [marcadorActivo]);

    // Cerrar el contenedor de opciones al hacer clic fuera OJO IZQUIERDO
    useEffect(() => {
        const handleClickOutsideOI = (e) => {
            if (marcadorActivoOI && !e.target.closest('.opciones-container')) {
                setMarcadorActivoOI(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutsideOI);
        return () => document.removeEventListener('mousedown', handleClickOutsideOI);
    }, [marcadorActivoOI]);

    // Función para buscar paciente
    const buscarPaciente = async () => {
        if (!data.dni) return;
    
        try {
            const response = await fetch('/consultas/buscar-paciente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ dni: data.dni.trim() }),
            });
    
            if (!response.ok) {
                throw new Error('Paciente no encontrado');
            }
    
            const result = await response.json();
    
            if (result.success) {
                setData({
                    ...data,
                    paciente_id: result.paciente.id,
                    nombres: result.paciente.nombres,
                    apellido_paterno: result.paciente.apellido_paterno,
                    apellido_materno: result.paciente.apellido_materno,
                    telefono: result.paciente.telefono,
                    email: result.paciente.email,
                    fecha_nacimiento: result.paciente.fecha_nacimiento,
                    edad: result.paciente.edad,
                    sexo: result.paciente.sexo,
                    peso: result.paciente.peso,
                    dni: result.paciente.dni,
                    estado_civil: result.paciente.estado_civil,
                    ocupacion: result.paciente.ocupacion,
                    procedencia: result.paciente.procedencia,
                    direccion: result.paciente.direccion,
                    acompañante: result.paciente.acompañante,
                    referido: result.paciente.referido,
                });
    
                setPacienteEncontrado(true);
    
                // Verificar si ya existe una consulta de inicio para este paciente
                const existeConsultaInicio = await verificarConsultaInicio(result.paciente.id);
                if (existeConsultaInicio) {
                    setTipoConsulta('evolucion'); // Cambiar a tipo EVOLUCION
                    setData('tipo_consulta', 'evolucion'); // Actualizar el campo en el estado de data
                } else {
                    setTipoConsulta('inicio'); // Mantener tipo INICIO
                    setData('tipo_consulta', 'inicio'); // Actualizar el campo en el estado de data
                }
            } else {
                throw new Error(result.message || 'Paciente no encontrado');
            }
        } catch (error) {
            alert(error.message);
            setPacienteEncontrado(false);
        }
    };

    // Función para verificar si ya existe una consulta de inicio
    const verificarConsultaInicio = async (pacienteId) => {
        try {
            const response = await fetch(`/consultas/verificar-inicio/${pacienteId}`);
            if (!response.ok) {
                throw new Error('Error al verificar consulta de inicio');
            }
            const result = await response.json();
            return result.existe;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const [previewImages, setPreviewImages] = useState([]); // Para previsualizar imágenes
    const [previewArchivos, setPreviewArchivos] = useState([]); // Para mostrar nombres de archivos

    // Manejar subida de imágenes
    const handleFileChangeImages = (e) => {
        const files = Array.from(e.target.files); // Convertir FileList a Array
        if (files.length + (data.examenes_indicados_img ? data.examenes_indicados_img.length : 0) > 4) {
            alert('Solo puedes subir un máximo de 4 imágenes.');
            return;
        }

        // Guardar las imágenes en el estado
        const newImages = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file), // Previsualización
        }));

        setData('examenes_indicados_img', [...(data.examenes_indicados_img || []), ...files]);
        setPreviewImages([...previewImages, ...newImages]);
    };

    // Manejar subida de archivos
    const handleFileChangeArchivos = (e) => {
        const files = Array.from(e.target.files); // Convertir FileList a Array
        if (files.length + data.examenes_indicados_archivos.length > 4) {
            alert('Solo puedes subir un máximo de 4 archivos.');
            return;
        }

        // Guardar los archivos en el estado
        setData('examenes_indicados_archivos', [...data.examenes_indicados_archivos, ...files]);
        setPreviewArchivos([...previewArchivos, ...files]);
    };

    // Eliminar imagen o archivo
    const handleRemoveImage = (index, type) => {
        if (type === 'img') {
            const updatedImages = [...data.examenes_indicados_img];
            updatedImages.splice(index, 1);

            const updatedPreviews = [...previewImages];
            updatedPreviews.splice(index, 1);

            setData('examenes_indicados_img', updatedImages);
            setPreviewImages(updatedPreviews);
        } else if (type === 'archivos') {
            const updatedArchivos = [...data.examenes_indicados_archivos];
            updatedArchivos.splice(index, 1);

            const updatedPreviews = [...previewArchivos];
            updatedPreviews.splice(index, 1);

            setData('examenes_indicados_archivos', updatedArchivos);
            setPreviewArchivos(updatedPreviews);
        }
    };
    const handleRemoveArchivo = (index, type) => {
        if (type === 'archivos') {
            // Crear una copia del array de archivos
            const updatedArchivos = [...data.examenes_indicados_archivos];
            // Eliminar el archivo en la posición `index`
            updatedArchivos.splice(index, 1);
    
            // Crear una copia del array de previsualizaciones de archivos
            const updatedPreviews = [...previewArchivos];
            // Eliminar la previsualización en la posición `index`
            updatedPreviews.splice(index, 1);
    
            // Actualizar el estado de `data` y `previewArchivos`
            setData('examenes_indicados_archivos', updatedArchivos);
            setPreviewArchivos(updatedPreviews);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        // Crear un FormData para enviar las imágenes
        const formData = new FormData();
        
        formData.append('paciente_id', data.paciente_id);
        formData.append('tipo_consulta', data.tipo_consulta);

        // Agregar campos de texto y otros datos
        Object.keys(data).forEach((key) => {
            if (key !== 'examenes_indicados_img' && key !== 'examenes_indicados_archivos') {
                formData.append(key, data[key]);
            }
        });

        // Agregar las imágenes seleccionadas
        if (data.examenes_indicados_img && data.examenes_indicados_img.length > 0) {
            data.examenes_indicados_img.forEach((file, index) => {
                formData.append(`examenes_indicados_img[${index}]`, file);
            });
        }

        // Agregar los archivos seleccionados
        if (data.examenes_indicados_archivos && data.examenes_indicados_archivos.length > 0) {
            data.examenes_indicados_archivos.forEach((file, index) => {
                formData.append(`examenes_indicados_archivos[${index}]`, file);
            });
        }

        // Enviar el formulario
        post(route('consultas.store'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Crear Nueva Consulta</h2>}
        >
            <Head title="Crear Nueva Consulta" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                {/* Campo para ingresar el DNI y buscar paciente */}
                                <PacienteForm
                                    data={data}
                                    setData={setData}
                                    pacienteEncontrado={pacienteEncontrado}
                                    buscarPaciente={buscarPaciente}
                                    errors={errors}
                                />

                                {/* Mostrar datos del paciente encontrado */}
                                {pacienteEncontrado && (
                                    <div className="mb-8 py-4 px-8 border border-gray-200 rounded-md">
                                        <div className='mb-4'>
                                            <label className="inline-block text-xl font-medium text-black border-b-2 border-black uppercase">Datos Personales</label>
                                        </div>                                       
                                        <div className='grid grid-cols-2 gap-4'>
                                            <div className='flex flex-col'>
                                                <div className="mb-1 flex gap-2">
                                                    <label className="text-sm text-gray-700"><strong>Apellido Paterno:</strong></label>
                                                    <p className="text-sm text-gray-700">{data.apellido_paterno}</p>
                                                </div>
                                                <div className="mb-1 flex gap-2">
                                                    <label className="text-sm text-gray-700"><strong>Apellido Materno:</strong></label>
                                                    <p className="text-sm text-gray-700">{data.apellido_materno}</p>
                                                </div>
                                                <div className="mb-1 flex gap-2">
                                                    <label className="text-sm text-gray-700"><strong>Nombres:</strong></label>
                                                    <p className="text-sm text-gray-700">{data.nombres}</p>
                                                </div>
                                            </div>

                                            <div className='flex flex-col'>
                                                <div className="mb-1 flex gap-2">
                                                    <label className="text-sm text-gray-700"><strong>Fecha de Nacimiento:</strong></label>
                                                    <p className="text-sm text-gray-700">{data.fecha_nacimiento}</p>
                                                </div>
                                                <div className='grid grid-cols-2 '>
                                                    <div className="mb-1 flex gap-2">
                                                        <label className="text-sm text-gray-700"><strong>Edad:</strong></label>
                                                        <p className="text-sm text-gray-700">{data.edad}</p>
                                                    </div>
                                                    <div className="mb-1 flex gap-2">
                                                        <label className="text-sm text-gray-700"><strong>Peso:</strong></label>
                                                        <p className="text-sm text-gray-700">{data.peso}</p>
                                                    </div>
                                                    <div className="mb-1 flex gap-2">
                                                        <label className="text-sm text-gray-700"><strong>Sexo:</strong></label>
                                                        <p className="text-sm text-gray-700">{data.sexo}</p>
                                                    </div>
                                                    <div className="mb-1 flex gap-2">
                                                        <label className="text-sm text-gray-700"><strong>DNI:</strong></label>
                                                        <p className="text-sm text-gray-700">{data.dni}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <hr className='my-6'/>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <div className='flex flex-col'>
                                                <div className="mb-1 flex gap-2">
                                                    <label className="text-sm text-gray-700"><strong>Estado Civil:</strong></label>
                                                    <p className="text-sm text-gray-700">{data.estado_civil}</p>
                                                </div>
                                                <div className="mb-1 flex gap-2">
                                                    <label className="text-sm text-gray-700"><strong>Ocupación:</strong></label>
                                                    <p className="text-sm text-gray-700">{data.ocupacion}</p>
                                                </div>
                                                <div className="mb-1 flex gap-2">
                                                    <label className="text-sm text-gray-700"><strong>Procedencia:</strong></label>
                                                    <p className="text-sm text-gray-700">{data.procedencia}</p>
                                                </div>
                                                <div className="mb-1 flex gap-2">
                                                    <label className="text-sm text-gray-700"><strong>Domicilio:</strong></label>
                                                    <p className="text-sm text-gray-700">{data.direccion}</p>
                                                </div>
                                            </div>
                                            <div className='flex flex-col'>
                                                <div className="mb-1 flex gap-2">
                                                <label className="text-sm text-gray-700"><strong>Acompañante:</strong></label>
                                                <p className="text-sm text-gray-700">{data.acompañante}</p>
                                                </div>
                                                <div className="mb-1 flex gap-2">
                                                    <label className="text-sm text-gray-700"><strong>Referido:</strong></label>
                                                    <p className="text-sm text-gray-700">{data.referido}</p>
                                                </div>
                                                <div className="mb-1 flex gap-2">
                                                    <label className="text-sm text-gray-700"><strong>Teléfono:</strong></label>
                                                    <p className="text-sm text-gray-700">{data.telefono}</p>
                                                </div>
                                                <div className="mb-1 flex gap-2">
                                                    <label className="text-sm text-gray-700"><strong>Email:</strong></label>
                                                    <p className="text-sm text-gray-700">{data.email}</p>
                                                </div>
                                            </div>
                                        </div>                                        
                                        
                                    </div>
                                )}

{/*--------------------------- Campos Consulta INICIO ------------------------------------------------------*/}

                                {tipoConsulta === 'inicio' && ( // Mostrar solo si es tipo INICIO
                                <>
                                    <div className='flex flex-col justify-center items-center w-full gap-4 border-b border-gray-200 pb-2 mb-4 text-4xl'>
                                        <h2>Consulta de Inicio</h2>
                                    </div>
                                    <AntecedentesPersonales
                                        data={data}
                                        setData={setData}
                                        showHTAText={showHTAText}
                                        setShowHTAText={setShowHTAText}
                                        showDMText={showDMText}
                                        setShowDMText={setShowDMText}
                                        showAlergiasText={showAlergiasText}
                                        setShowAlergiasText={setShowAlergiasText}
                                        showOtrosText={showOtrosText}
                                        setShowOtrosText={setShowOtrosText}
                                    />
                                    
                                    <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Antecedentes Patológicos Familiares</label>
                                    <input
                                        type="text"
                                        value={data.antecedentes_patologicos_familiares}
                                        onChange={(e) => setData('antecedentes_patologicos_familiares', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-[#8FDBF1] shadow-sm"
                                    />
                                    {errors.antecedentes_patologicos_familiares && <p className="text-sm text-red-500">{errors.antecedentes_patologicos_familiares}</p>}
                                    </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Cirugías Previas</label>
                                    <input
                                        type="text"
                                        value={data.cirugias_previas}
                                        onChange={(e) => setData('cirugias_previas', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-[#8FDBF1] shadow-sm"
                                    />
                                    {errors.cirugias_previas && <p className="text-sm text-red-500">{errors.cirugias_previas}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Motivo de Consulta</label>
                                    <TerminoMotivoConsultaSearch
                                        onSelectTerm={(terms) => setData({ ...data, motivo_consulta: terms.join(', ') })}/>
                                </div>
                                <hr className='my-8'/>
                                <ExamenOcular data={data} setData={setData} edadPaciente={data.edad} />
                                <hr className='my-8'/>

                                <div className='mb-4'>
                                    <label className="text-xl font-medium text-gray-700 uppercase flex justify-center items-center w-full mb-4">Biomicroscopia</label>
                                    <div className='grid grid-cols-3 mx-8 border border-gray-200 rounded-md'>
                                        <label className='flex justify-center items-center py-2 border border-[#8FDBF1] shadow-sm'>Examen Fisico</label>
                                        <label className='flex justify-center items-center py-2 border border-[#8FDBF1] shadow-sm'>OD</label>
                                        <label className='flex justify-center items-center py-2 border border-[#8FDBF1] shadow-sm'>OI</label>
                                        <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Movimientos Oculares</label>
                                        <TerminoBiomicroscopiaSearch
                                        onSelectTerm={(terms) => setData({ ...data, biomicroscopia_movoculares_od: terms.join(', ') })}/>
                                        <TerminoBiomicroscopiaSearch
                                        onSelectTerm={(terms) => setData({ ...data, biomicroscopia_movoculares_oi: terms.join(', ') })}/>
                                        <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Párpados</label>
                                        <TerminoBiomicroscopiaSearch
                                        onSelectTerm={(terms) => setData({ ...data, biomicroscopia_parpados_od: terms.join(', ') })}/>
                                        <TerminoBiomicroscopiaSearch
                                        onSelectTerm={(terms) => setData({ ...data, biomicroscopia_parpados_oi: terms.join(', ') })}/>
                                        <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Córnea</label>
                                        <TerminoBiomicroscopiaSearch
                                        onSelectTerm={(terms) => setData({ ...data, biomicroscopia_cornea_od: terms.join(', ') })}/>
                                        <TerminoBiomicroscopiaSearch
                                        onSelectTerm={(terms) => setData({ ...data, biomicroscopia_cornea_oi: terms.join(', ') })}/>
                                        <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Córnea Conjuntiva</label>
                                        <TerminoBiomicroscopiaSearch
                                        onSelectTerm={(terms) => setData({ ...data, biomicroscopia_corneaconj_od: terms.join(', ') })}/>
                                        <TerminoBiomicroscopiaSearch
                                        onSelectTerm={(terms) => setData({ ...data, biomicroscopia_corneaconj_oi: terms.join(', ') })}/>
                                        <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Cámara Anterior</label>
                                        <TerminoBiomicroscopiaSearch
                                        onSelectTerm={(terms) => setData({ ...data, biomicroscopia_ca_od: terms.join(', ') })}/>
                                        <TerminoBiomicroscopiaSearch
                                        onSelectTerm={(terms) => setData({ ...data, biomicroscopia_ca_oi: terms.join(', ') })}/>
                                        <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Iris</label>
                                        <TerminoBiomicroscopiaSearch
                                        onSelectTerm={(terms) => setData({ ...data, biomicroscopia_iris_od: terms.join(', ') })}/>
                                        <TerminoBiomicroscopiaSearch
                                        onSelectTerm={(terms) => setData({ ...data, biomicroscopia_iris_oi: terms.join(', ') })}/>
                                        <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Cristalino</label>
                                        <TerminoBiomicroscopiaSearch
                                        onSelectTerm={(terms) => setData({ ...data, biomicroscopia_cristalino_od: terms.join(', ') })}/>
                                        <TerminoBiomicroscopiaSearch
                                        onSelectTerm={(terms) => setData({ ...data, biomicroscopia_cristalino_oi: terms.join(', ') })}/>
                                    </div>
                                </div>

                                <FondoOjo
                                    marcadoresOD={marcadores}
                                    marcadoresOI={marcadoresOI}
                                    marcadorActivoOD={marcadorActivo}
                                    marcadorActivoOI={marcadorActivoOI}
                                    handleMarkerClickOD={handleMarkerClick}
                                    handleMarkerClickOI={handleMarkerClickOI}
                                    handleSeleccionOpcionOD={handleSeleccionOpcion}
                                    handleSeleccionOpcionOI={handleSeleccionOpcionOI}
                                    data={data}
                                />                                

                                {/* Campo de búsqueda CIE10 */}
                                <div className="mb-4 mt-8">
                                    <label className="block text-sm font-medium text-gray-700">Impresión Diagnóstica (CIE10)</label>
                                    <Cie10Search onSelectResult={handleSelectResult} />
                                    {errors.impresion_diagnostica && <p className="text-sm text-red-500">{errors.impresion_diagnostica}</p>}
                                </div>

                                {/* Mostrar las opciones seleccionadas */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Opciones Seleccionadas</label>
                                    <div className="mt-2 p-2 border border-gray-200 rounded-md">
                                        {selectedResults.map((result, index) => (
                                            <div key={index} className="inline-flex items-center bg-gray-200 rounded-md p-2 m-1">
                                                <span>{result}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Tratamiento</label>
                                    <input
                                        type="text"
                                        value={data.tratamiento}
                                        onChange={(e) => setData('tratamiento', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-[#8FDBF1] shadow-sm"
                                    />
                                    {errors.tratamiento && <p className="text-sm text-red-500">{errors.tratamiento}</p>}
                                </div>

                                <PlanSelector
                                    opcionesPlan={opcionesPlan}
                                    handleSeleccionPlan={handleSeleccionPlan}
                                    showPlanText={showPlanText}
                                    setShowPlanText={setShowPlanText}
                                />
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Exámenes Indicados (Imágenes)</label>
                                    <input
                                        type="file"
                                        onChange={handleFileChangeImages} // Nueva función para manejar imágenes
                                        multiple // Permitir múltiples archivos
                                        accept="image/*" // Solo permitir imágenes
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.examenes_indicados_img && (
                                        <p className="text-sm text-red-500">{errors.examenes_indicados_img}</p>
                                    )}

                                    {/* Mostrar previsualizaciones de imágenes */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {previewImages.map((image, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={image.preview}
                                                    alt={`Previsualización ${index + 1}`}
                                                    className="w-24 h-24 object-cover rounded-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index, 'img')} // Eliminar imagen
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Exámenes Indicados (Archivos)</label>
                                    <input
                                        type="file"
                                        onChange={handleFileChangeArchivos} // Nueva función para manejar archivos
                                        multiple // Permitir múltiples archivos
                                        accept=".pdf,.doc,.docx,.xls,.xlsx" // Solo permitir archivos específicos
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.examenes_indicados_archivos && (
                                        <p className="text-sm text-red-500">{errors.examenes_indicados_archivos}</p>
                                    )}

                                    {/* Mostrar nombres de archivos subidos */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {previewArchivos.map((archivo, index) => (
                                            <div key={index} className="relative">
                                                <span className="bg-gray-200 p-2 rounded-md">{archivo.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveArchivo(index, 'archivos')} // Eliminar archivo
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                    </>
                                )}

{/*--------------------------------Campos Consulta EVOLUCION ---------------------------------------------------*/}
                                 
                                {tipoConsulta === 'evolucion' && ( // Mostrar solo si es tipo EVOLUCION
                                    <> 
                                    <div className='flex flex-col justify-center items-center w-full gap-4 border-b border-gray-200 pb-2 mb-4 text-4xl'>
                                        <h2>Consulta de Evolución</h2>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 uppercase">Evoluciones</label>
                                        <input
                                            type="text"
                                            value={data.evoluciones}
                                            onChange={(e) => setData('evoluciones', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                        {errors.evoluciones && <p className="text-sm text-red-500">{errors.evoluciones}</p>}
                                    </div>
                                    <hr className='my-8'/>
                                    <ExamenOcular data={data} setData={setData} edadPaciente={data.edad} />
                                    <hr className='my-8'/>

                                    <div className='mb-4'>
                                        <label className="text-xl font-medium text-gray-700 uppercase flex justify-center items-center w-full mb-4">Biomicroscopia</label>
                                        <div className='grid grid-cols-3 mx-8 border border-gray-200 rounded-md'>
                                            <label className='flex justify-center items-center py-2 border border-gray-300 shadow-sm'>Examen Fisico</label>
                                            <label className='flex justify-center items-center py-2 border border-gray-300 shadow-sm'>OD</label>
                                            <label className='flex justify-center items-center py-2 border border-gray-300 shadow-sm'>OI</label>
                                            <label className='border-gray-300 shadow-sm border flex items-center px-4'>Movimientos Oculares</label>
                                            <TerminoBiomicroscopiaSearch
                                            onSelectTerm={(terms) => setData({ ...data, biomicroscopia_movoculares_od: terms.join(', ') })}/>
                                            <TerminoBiomicroscopiaSearch
                                            onSelectTerm={(terms) => setData({ ...data, biomicroscopia_movoculares_oi: terms.join(', ') })}/>
                                            <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Párpados</label>
                                            <TerminoBiomicroscopiaSearch
                                            onSelectTerm={(terms) => setData({ ...data, biomicroscopia_parpados_od: terms.join(', ') })}/>
                                            <TerminoBiomicroscopiaSearch
                                            onSelectTerm={(terms) => setData({ ...data, biomicroscopia_parpados_oi: terms.join(', ') })}/>
                                            <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Córnea</label>
                                            <TerminoBiomicroscopiaSearch
                                            onSelectTerm={(terms) => setData({ ...data, biomicroscopia_cornea_od: terms.join(', ') })}/>
                                            <TerminoBiomicroscopiaSearch
                                            onSelectTerm={(terms) => setData({ ...data, biomicroscopia_cornea_oi: terms.join(', ') })}/>
                                            <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Córnea Conjuntiva</label>
                                            <TerminoBiomicroscopiaSearch
                                            onSelectTerm={(terms) => setData({ ...data, biomicroscopia_corneaconj_od: terms.join(', ') })}/>
                                            <TerminoBiomicroscopiaSearch
                                            onSelectTerm={(terms) => setData({ ...data, biomicroscopia_corneaconj_oi: terms.join(', ') })}/>
                                            <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Cámara Anterior</label>
                                            <TerminoBiomicroscopiaSearch
                                            onSelectTerm={(terms) => setData({ ...data, biomicroscopia_ca_od: terms.join(', ') })}/>
                                            <TerminoBiomicroscopiaSearch
                                            onSelectTerm={(terms) => setData({ ...data, biomicroscopia_ca_oi: terms.join(', ') })}/>
                                            <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Iris</label>
                                            <TerminoBiomicroscopiaSearch
                                            onSelectTerm={(terms) => setData({ ...data, biomicroscopia_iris_od: terms.join(', ') })}/>
                                            <TerminoBiomicroscopiaSearch
                                            onSelectTerm={(terms) => setData({ ...data, biomicroscopia_iris_oi: terms.join(', ') })}/>
                                            <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Cristalino</label>
                                            <TerminoBiomicroscopiaSearch
                                            onSelectTerm={(terms) => setData({ ...data, biomicroscopia_cristalino_od: terms.join(', ') })}/>
                                            <TerminoBiomicroscopiaSearch
                                            onSelectTerm={(terms) => setData({ ...data, biomicroscopia_cristalino_oi: terms.join(', ') })}/>
                                        </div>
                                    </div>
                                    {/* Fondo de Ojo */}
                                    <FondoOjo
                                        marcadoresOD={marcadores}
                                        marcadoresOI={marcadoresOI}
                                        marcadorActivoOD={marcadorActivo}
                                        marcadorActivoOI={marcadorActivoOI}
                                        handleMarkerClickOD={handleMarkerClick}
                                        handleMarkerClickOI={handleMarkerClickOI}
                                        handleSeleccionOpcionOD={handleSeleccionOpcion}
                                        handleSeleccionOpcionOI={handleSeleccionOpcionOI}
                                        data={data}
                                    />              

                                    {/* Campo de búsqueda CIE10 */}
                                    <div className="mb-4 mt-8">
                                        <label className="block text-sm font-medium text-gray-700">Impresión Diagnóstica (CIE10)</label>
                                        <Cie10Search onSelectResult={handleSelectResult} />
                                        {errors.impresion_diagnostica && <p className="text-sm text-red-500">{errors.impresion_diagnostica}</p>}
                                    </div>

                                    {/* Mostrar las opciones seleccionadas */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Opciones Seleccionadas</label>
                                        <div className="mt-2 p-2 border border-gray-200 rounded-md">
                                            {selectedResults.map((result, index) => (
                                                <div key={index} className="inline-flex items-center bg-gray-200 rounded-md p-2 m-1">
                                                    <span>{result}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Tratamiento</label>
                                        <input
                                            type="text"
                                            value={data.tratamiento}
                                            onChange={(e) => setData('tratamiento', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-[#8FDBF1] shadow-sm"
                                        />
                                        {errors.tratamiento && <p className="text-sm text-red-500">{errors.tratamiento}</p>}
                                    </div>

                                    <PlanSelector
                                        opcionesPlan={opcionesPlan}
                                        handleSeleccionPlan={handleSeleccionPlan}
                                        showPlanText={showPlanText}
                                        setShowPlanText={setShowPlanText}
                                    />

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Exámenes Indicados (Imágenes)</label>
                                        <input
                                            type="file"
                                            onChange={handleFileChangeImages} // Nueva función para manejar imágenes
                                            multiple // Permitir múltiples archivos
                                            accept="image/*" // Solo permitir imágenes
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                        {errors.examenes_indicados_img && (
                                            <p className="text-sm text-red-500">{errors.examenes_indicados_img}</p>
                                        )}

                                        {/* Mostrar previsualizaciones de imágenes */}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {previewImages.map((image, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={image.preview}
                                                        alt={`Previsualización ${index + 1}`}
                                                        className="w-24 h-24 object-cover rounded-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index, 'img')} // Eliminar imagen
                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Exámenes Indicados (Archivos)</label>
                                        <input
                                            type="file"
                                            onChange={handleFileChangeArchivos} // Nueva función para manejar archivos
                                            multiple // Permitir múltiples archivos
                                            accept=".pdf,.doc,.docx,.xls,.xlsx" // Solo permitir archivos específicos
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                        {errors.examenes_indicados_archivos && (
                                            <p className="text-sm text-red-500">{errors.examenes_indicados_archivos}</p>
                                        )}

                                        {/* Mostrar nombres de archivos subidos */}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {previewArchivos.map((archivo, index) => (
                                                <div key={index} className="relative">
                                                    <span className="bg-gray-200 p-2 rounded-md">{archivo.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveArchivo(index, 'archivos')} // Eliminar archivo
                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
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
                                        className="ml-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                        disabled={processing}
                                    >
                                        Guardar
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