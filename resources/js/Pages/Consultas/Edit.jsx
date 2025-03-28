import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import fondoOjo from '../../../assets/fondo_ojo.png';
import { useEffect, useState, useCallback } from 'react';

import Cie10Search from '@/Components/Cie10Search'; // Importa el componente de búsqueda
import FondoOjo from '@/Components/FondoOjo';
import PlanSelector from '@/Components/PlanSelector';
import TerminoBiomicroscopiaSearch from '@/Components/TerminoBiomicroscopiaSearch';
import TerminoMotivoConsultaSearch from '@/Components/TerminoMotivoConsultaSearch';
import ExamenOcular from '@/Components/ExamenOcular';
import AntecedentesPersonales from '@/Components/AntecedentesPersonales';

export default function ConsultasEdit({ auth }) {
    console.log('SEPARACION DESDE AQUI')
    // Obtener la consulta actual desde las props
    const { consulta } = usePage().props;

    const parseFileData = (data) => {
        if (!data) return [];
        try {
            const parsed = typeof data === 'string' ? JSON.parse(data) : data;
            if (Array.isArray(parsed)) return parsed;
            if (parsed && typeof parsed === 'object') return [parsed];
            return [];
        } catch (e) {
            console.error('Error parsing file data:', e);
            return [];
        }
    };

    // Estado unificado para archivos
    const [files, setFiles] = useState({
        images: consulta?.examenes_indicados_img?.map(img => ({
        path: img.ruta || img,
        name: img.nombre_original || (typeof img === 'string' ? img.split('/').pop() : 'imagen'),
        type: 'image',
        isNew: false,
        file: null
        })) || [],
        documents: consulta?.examenes_indicados_archivos?.map(file => ({
        path: file.ruta || file,
        name: file.nombre_original || (typeof file === 'string' ? file.split('/').pop() : 'archivo'),
        type: 'file',
        isNew: false,
        file: null
        })) || []
    });

    const [existingFiles, setExistingFiles] = useState({
        images: consulta?.examenes_indicados_img || [],
        documents: consulta?.examenes_indicados_archivos || []
      });
      
      const [newFiles, setNewFiles] = useState({
        images: [],
        documents: []
      });
    

    // Reemplaza tus estados iniciales con esto:
    const [filesToDelete, setFilesToDelete] = useState([]);

    //************************ */ Inicializar el formulario con los datos de la consulta********************
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
        examenes_indicados_img: [], // Nuevas imágenes a subir
        examenes_indicados_archivos: [], // Nuevos archivos a subir
        examenes_indicados_img_existentes: files.images.filter(img => !img.isNew).map(img => img.path),
        examenes_indicados_archivos_existentes: files.documents.filter(doc => !doc.isNew).map(doc => doc.path),
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

    // Estados para controles UI
    const [showHTAText, setShowHTAText] = useState(false);
    const [showDMText, setShowDMText] = useState(false);
    const [showAlergiasText, setShowAlergiasText] = useState(false);
    const [showPlanText, setShowPlanText] = useState(false);
    const [showOtrosText, setShowOtrosText] = useState(false);
    const [marcadorActivo, setMarcadorActivo] = useState(null);
    const [marcadorActivoOI, setMarcadorActivoOI] = useState(null);
    const [selectedResults, setSelectedResults] = useState(
        consulta?.impresion_diagnostica ? consulta.impresion_diagnostica.split(';').map(item => item.trim()) : []
    );

    // Opciones de plan
    const [opcionesPlan, setOpcionesPlan] = useState([
        { id: 1, nombre: 'Plan A', seleccionado: data.plan === 'Plan A' },
        { id: 2, nombre: 'Plan B', seleccionado: data.plan === 'Plan B' },
        { id: 3, nombre: 'Plan C', seleccionado: data.plan === 'Plan C' },
    ]);

    // Definir los marcadores
    const marcadores = [
        {
            id: 1,
            top: 'top-3', // Posición vertical
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
            top: 'top-20',
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
            top: 'top-3', // Posición vertical
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
            top: 'top-20',
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

    // Handlers (igual que en create.jsx)
    const handleSelectResult = useCallback((results) => {
        if (typeof results === 'string') {
            results = results.split(';').map(item => item.trim());
        }
        setSelectedResults(results);
        setData('impresion_diagnostica', results.join('; '));
    }, [setData]);

    const handleSeleccionPlan = (id) => {
        const nuevasOpciones = opcionesPlan.map(opcion => ({
            ...opcion,
            seleccionado: opcion.id === id,
        }));
        setOpcionesPlan(nuevasOpciones);
        const planSeleccionado = nuevasOpciones.find(opcion => opcion.seleccionado)?.nombre || '';
        setData('plan', planSeleccionado);
    };

    const handleMarkerClick = (marcador) => {
        setMarcadorActivo(marcador.id === marcadorActivo ? null : marcador.id);
    };

    const handleMarkerClickOI = (marcadorOI) => {
        setMarcadorActivoOI(marcadorOI.id === marcadorActivoOI ? null : marcadorOI.id);
    };

    const handleSeleccionOpcion = (opcion) => {
        if (marcadorActivo) {
            const marcador = marcadores.find(m => m.id === marcadorActivo);
            setData(marcador.campo, opcion.nombre);
            setMarcadorActivo(null);
        }
    };

    const handleSeleccionOpcionOI = (opcionOI) => {
        if (marcadorActivoOI) {
            const marcadorOI = marcadoresOI.find(mOI => mOI.id === marcadorActivoOI);
            setData(marcadorOI.campo, opcionOI.nombre);
            setMarcadorActivoOI(null);
        }
    };
    // Cuando necesites trabajar con el valor
    const handleFondoOjoChange = (posiciones) => {
        setData('fondo_ojo_posiciones', JSON.stringify(posiciones));
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

    useEffect(() => {
        // Para ojo derecho (OD)
        marcadores.forEach(marcador => {
            if (data[marcador.campo]) {
                setMarcadorActivo(marcador.id);
            }
        });
    
        // Para ojo izquierdo (OI)
        marcadoresOI.forEach(marcador => {
            if (data[marcador.campo]) {
                setMarcadorActivoOI(marcador.id);
            }
        });
    }, [data]);

    useEffect(() => {
        console.log('Paciente ID en datos:', data.paciente_id);
        console.log('Consulta original:', consulta.paciente_id);
    }, [data.paciente_id]);

    // Obtener el tipo de consulta
    const tipoConsulta = data.tipo_consulta;

    console.log('Datos de imágenes existentes:', {
        original: consulta?.examenes_indicados_img,
        type: typeof consulta?.examenes_indicados_img,
        isArray: Array.isArray(consulta?.examenes_indicados_img)
    });     

    // Verificar form data inicial
    console.log('Initial form data:', {
        examenes_indicados_img_existentes: data.examenes_indicados_img_existentes,
        examenes_indicados_archivos_existentes: data.examenes_indicados_archivos_existentes
    });



    // Reemplaza todo el código relacionado con archivos con esto:
  
  
    const handleFileChange = (e, type) => {
        const newFiles = Array.from(e.target.files);
        
        // Validar archivos
        const validFiles = newFiles.filter(file => {
            if (type === 'images') {
                return ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type) && 
                       file.size <= 2 * 1024 * 1024; // 2MB
            } else {
                return ['application/pdf', 
                       'application/msword',
                       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                       'application/vnd.ms-excel',
                       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
                       .includes(file.type) && 
                       file.size <= 5 * 1024 * 1024; // 5MB
            }
        });
    
        // Verificar duplicados
        const currentFilenames = files[type].map(f => f.name.toLowerCase());
        const uniqueFiles = validFiles.filter(file => 
            !currentFilenames.includes(file.name.toLowerCase())
        );
    
        if (uniqueFiles.length !== validFiles.length) {
            alert('Algunos archivos ya fueron agregados y serán ignorados');
        }
    
        // Procesar archivos
        const processedFiles = uniqueFiles.map(file => ({
            path: type === 'images' ? URL.createObjectURL(file) : file.name,
            name: file.name,
            type,
            isNew: true,
            file // Guardamos el objeto File completo
        }));
    
        setFiles(prev => ({
            ...prev,
            [type]: [...prev[type], ...processedFiles]
        }));
    };    
    
    // Función para eliminar archivos
    const handleRemoveFile = (index, type) => {
        const fileToRemove = files[type][index];
        
        // Liberar memoria si es una imagen nueva
        if (fileToRemove.isNew && type === 'images') {
            URL.revokeObjectURL(fileToRemove.path);
        }
        
        // Agregar a lista de eliminación si no es nuevo
        if (!fileToRemove.isNew) {
            setFilesToDelete(prev => [...prev, fileToRemove.path]);
        }
        
        // Eliminar del estado
        setFiles(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };
    
    // Actualizar los campos de archivos existentes cuando cambia el estado de files
    useEffect(() => {
        setData('examenes_indicados_img_existentes', 
        files.images.filter(img => !img.isNew).map(img => img.path)
        );
        setData('examenes_indicados_archivos_existentes', 
        files.documents.filter(doc => !doc.isNew).map(doc => doc.path)
        );
    }, [files, setData]);

    const [errors, setErrors] = useState({});

    // En tu componente, actualiza el handleSubmit así:
    // En tu handleSubmit, cambia los nombres de los campos para nuevos archivos:
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('_method', 'PUT');
        
         {/*// Agregar datos estructurados
        formData.append('examenes_indicados_img_existentes', JSON.stringify(
            files.images.filter(img => !img.isNew).map(img => ({
                ruta: img.path,
                nombre_original: img.name,
                tipo: img.type
            }))
        ));
        
        formData.append('examenes_indicados_archivos_existentes', JSON.stringify(
            files.documents.filter(doc => !doc.isNew).map(doc => ({
                ruta: doc.path,
                nombre_original: doc.name,
                tipo: doc.type
            }))
        ));*/}
        
        // 1. Agregar campos normales
        Object.keys(data).forEach(key => {
            if (!['examenes_indicados_img', 'examenes_indicados_archivos'].includes(key)) {
                const value = data[key];
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else if (value !== null && typeof value === 'object') {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value !== null ? value : '');
                }
            }
        });
    
         // Agregar archivos a eliminar
        if (filesToDelete.length > 0) {
            formData.append('files_to_delete', JSON.stringify(filesToDelete));
        }

       // Agregar nuevas imágenes
        files.images
        .filter(img => img.isNew)
        .forEach((img, index) => {
            formData.append(`examenes_indicados_img[${index}]`, img.file);
        });

        // Agregar nuevos archivos
        files.documents
            .filter(doc => doc.isNew)
            .forEach((doc, index) => {
                formData.append(`examenes_indicados_archivos[${index}]`, doc.file);
            });
        
        // Depuración
        console.log('Datos a enviar:', {
            formData: Object.fromEntries(formData),
        });
    
        // Enviar al backend
        router.post(route('consultas.update', consulta.id), formData, {
            preserveScroll: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onSuccess: () => {
                setFilesToDelete([]);
                router.reload();
            },
            onError: (errors) => {
                console.error('Error al actualizar:', errors);
            }
        });
    };

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
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                                {data.tipo_consulta === 'inicio' && (
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
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Cirugías Previas</label>
                                            <input
                                                type="text"
                                                value={data.cirugias_previas}
                                                onChange={(e) => setData('cirugias_previas', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-[#8FDBF1] shadow-sm"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Motivo de Consulta</label>
                                            <TerminoMotivoConsultaSearch 
                                                initialValue={data.motivo_consulta || ''}
                                                onSelectTerm={(termsArray) => {
                                                    // termsArray es siempre un array aquí
                                                    setData('motivo_consulta', termsArray.join(', '));
                                                }}
                                            />

                                            {/* Para depuración */}
                                            {process.env.NODE_ENV === 'development' && (
                                                <div className="mt-2 text-xs text-gray-500">
                                                    Valor actual: {data.motivo_consulta || '(vacío)'}
                                                </div>
                                            )}
                                        </div>
                                        <hr className='my-8'/>
                                        
                                        <ExamenOcular 
                                            data={data} 
                                            setData={setData} 
                                            edadPaciente={consulta.paciente.edad} 
                                        />
                                        <hr className='my-8'/>

                                        <div className='mb-4'>
                                            <label className="text-xl font-medium text-gray-700 uppercase flex justify-center items-center w-full mb-4">Biomicroscopia</label>
                                            <div className='grid grid-cols-3 mx-8 border border-gray-200 rounded-md'>
                                                <label className='flex justify-center items-center py-2 border border-[#8FDBF1] shadow-sm'>Examen Fisico</label>
                                                <label className='flex justify-center items-center py-2 border border-[#8FDBF1] shadow-sm'>OD</label>
                                                <label className='flex justify-center items-center py-2 border border-[#8FDBF1] shadow-sm'>OI</label>
                                                
                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Movimientos Oculares</label>
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={data.biomicroscopia_movoculares_od || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_movoculares_od', termsArray.join(', '))}
                                                />
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={data.biomicroscopia_movoculares_oi || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_movoculares_oi', termsArray.join(', '))}
                                                />
                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Párpados</label>
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={data.biomicroscopia_parpados_od || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_parpados_od', termsArray.join(', '))}
                                                />
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={data.biomicroscopia_parpados_oi || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_parpados_oi', termsArray.join(', '))}
                                                />
                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Córnea</label>
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={data.biomicroscopia_cornea_od || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_cornea_od', termsArray.join(', '))}
                                                />
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={data.biomicroscopia_cornea_oi || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_cornea_oi', termsArray.join(', '))}
                                                />
                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Córnea Conjuntiva</label>
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={data.biomicroscopia_corneaconj_od || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_corneaconj_od', termsArray.join(', '))}
                                                />
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={data.biomicroscopia_corneaconj_oi || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_corneaconj_oi', termsArray.join(', '))}
                                                />
                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Cámara Anterior</label>
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={data.biomicroscopia_ca_od || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_ca_od', termsArray.join(', '))}
                                                />
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={data.biomicroscopia_ca_oi || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_ca_oi', termsArray.join(', '))}
                                                />
                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Iris</label>
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={data.biomicroscopia_iris_od || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_iris_od', termsArray.join(', '))}
                                                />
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={data.biomicroscopia_iris_oi || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_iris_oi', termsArray.join(', '))}
                                                />
                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Cristalino</label>
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={data.biomicroscopia_cristalino_od || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_cristalino_od', termsArray.join(', '))}
                                                />
                                                <TerminoBiomicroscopiaSearch
                                                    initialValue={data.biomicroscopia_cristalino_oi || ''}
                                                    onSelectTerm={(termsArray) => setData('biomicroscopia_cristalino_oi', termsArray.join(', '))}
                                                />
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
                                            setData={setData}
                                        />

                                        {/* Campo CIE10 */}
                                        <div className="mb-4 mt-8">
                                            <label className="block text-sm font-medium text-gray-700">Impresión Diagnóstica (CIE10)</label>
                                            <Cie10Search 
                                                initialValue={data.impresion_diagnostica}
                                                onSelectResult={handleSelectResult} 
                                            />
                                        </div>

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
                                        </div>

                                        <PlanSelector
                                            opcionesPlan={opcionesPlan}
                                            handleSeleccionPlan={handleSeleccionPlan}
                                            showPlanText={showPlanText}
                                            setShowPlanText={setShowPlanText}
                                        />

                                        {/* Sección para imágenes */}
                                            <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Imágenes</label>
                                            <div className="mt-2 flex flex-wrap gap-4">
                                                {files.images.map((img, index) => (
                                                <div key={`img-${index}`} className="relative group w-32">
                                                    <img
                                                    src={img.isNew ? img.path : `/storage/${img.path}`}
                                                    alt={img.name}
                                                    className="w-full h-24 object-cover rounded-md border border-gray-300"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFile(index, 'images')}
                                                        className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                    </div>
                                                    <div className="text-xs truncate mt-1" title={img.name}>
                                                    {img.name}
                                                    </div>
                                                </div>
                                                ))}
                                            </div>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/jpeg,image/png,image/jpg"
                                                onChange={(e) => handleFileChange(e, 'images')}
                                                className="mt-2 block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Formatos aceptados: JPG, PNG. Tamaño máximo: 2MB por imagen.
                                            </p>
                                            </div>

                                            {/* Sección para documentos */}
                                            <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Documentos</label>
                                            <div className="mt-2 flex flex-wrap gap-4">
                                                {files.documents.map((doc, index) => (
                                                <div key={`doc-${index}`} className="relative border p-2 rounded-lg w-48">
                                                    <div className="flex items-center">
                                                    <svg className="w-6 h-6 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-sm truncate" title={doc.name}>
                                                        {doc.name}
                                                    </span>
                                                    </div>
                                                    <button
                                                    type="button"
                                                    onClick={() => handleRemoveFile(index, 'documents')}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                                                    >
                                                    ×
                                                    </button>
                                                </div>
                                                ))}
                                            </div>
                                            <input
                                                type="file"
                                                multiple
                                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                                                onChange={(e) => handleFileChange(e, 'documents')}
                                                className="mt-2 block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Formatos aceptados: PDF, DOC, DOCX, XLS, XLSX. Tamaño máximo: 5MB por archivo.
                                            </p>
                                            </div>
                                    </>
                                )}

                                {data.tipo_consulta === 'evolucion' && (
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
                                                className="mt-1 block w-full rounded-md border-[#8FDBF1] shadow-sm"
                                            />
                                        </div>
                                        <hr className='my-8'/>
                                        
                                        <ExamenOcular 
                                            data={data} 
                                            setData={setData} 
                                            edadPaciente={consulta.paciente.edad} 
                                        />
                                        <hr className='my-8'/>

                                        {/* ... resto de campos de evolución (similar a inicio) ... */}
                                    </>
                                )}

                                

                                <div className="flex items-center justify-end mt-6">
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
                                        {processing ? 'Guardando...' : 'Guardar Cambios'}
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