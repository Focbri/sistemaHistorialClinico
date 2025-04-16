import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import fondoOjo from '../../../assets/fondo_ojo.png';
import React,{ useEffect, useState, useCallback, useRef } from 'react'; 

import Cie10Search from '@/Components/Cie10Search'; // Importa el componente de búsqueda
import FondoOjo from '@/Components/FondoOjo';
import PlanSelector from '@/Components/PlanSelector';
import PacienteForm from '@/Components/PacienteForm';
import TerminoBiomicroscopiaSearch from '@/Components/TerminoBiomicroscopiaSearch';
import TerminoMotivoConsultaSearch from '@/Components/TerminoMotivoConsultaSearch';
import ExamenOcular from '@/Components/ExamenOcular';
import AntecedentesPersonales from '@/Components/AntecedentesPersonales';

export default function ConsultasEdit({ auth }) {
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

    // Estado para controlar qué secciones están expandidas
    const [expandedSections, setExpandedSections] = useState({
        antecedentesPersonales: false,
        antecedentesFamiliares: false,
        cirugiasPrevias: false,
        motivoConsulta: false,
        examenOcular: false,
        biomicroscopia: false,
        fondoOjo: false,
        diagnostico: false,
        tratamiento: false,
        plan: false,
        examenesIndicados: false,
        evoluciones: false
    });

    // Función para alternar secciones
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

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

    const [historialDiagnosticos, setHistorialDiagnosticos] = useState([]);
    const [pacienteEncontrado, setPacienteEncontrado] = useState(false);

    useEffect(() => {
            if (data.paciente_id) {
                cargarHistorialDiagnosticos();
            }
        }, [data.paciente_id]);

    const cargarHistorialDiagnosticos = async () => {
        if (!data.paciente_id) return;
        
        try {
            const response = await fetch(`/consultas/historial-diagnosticos/${data.paciente_id}`);
            if (!response.ok) throw new Error('Error al cargar historial');
            
            const result = await response.json();
            setHistorialDiagnosticos(result.diagnosticos || []);
            
        } catch (error) {
            console.error('Error cargando historial:', error);
            setHistorialDiagnosticos([]);
        }
    };

    // Definir los marcadores
    const marcadores = [
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
    ];

    // Definir los marcadores OJO IZQUIERDO
    const marcadoresOI = [
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
  
    const MultiInputField = React.memo(({ label, values: propValues, fieldName, setData, className = "" }) => {
            const [localValues, setLocalValues] = useState(propValues || ['']);
            const inputRefs = useRef([]);
        
            // Sincronizar con los valores del padre cuando cambian externamente
            useEffect(() => {
                setLocalValues(propValues || ['']);
            }, [propValues]);
        
            const addInput = () => {
                setLocalValues(prev => [...prev, '']);
                // Enfocar el nuevo input después de que se renderice
                setTimeout(() => {
                    if (inputRefs.current[localValues.length]) {
                        inputRefs.current[localValues.length].focus();
                    }
                }, 0);
            };
        
            const updateValue = (index, value) => {
                setLocalValues(prev => {
                    const newValues = [...prev];
                    newValues[index] = value;
                    return newValues;
                });
            };
        
            const removeInput = (index) => {
                if (localValues.length > 1) {
                    setLocalValues(prev => prev.filter((_, i) => i !== index));
                }
            };
        
            // Actualizar el estado padre solo cuando sea necesario (al perder foco o al eliminar)
            const handleBlur = () => {
                setData(fieldName, localValues);
            };
        
            return (
                <div className={`mb-4 ${className}`}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    {localValues.map((value, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => updateValue(index, e.target.value)}
                                onBlur={handleBlur}
                                className={`flex-1 rounded-md border-[#8FDBF1] shadow-sm ${className}`}
                                ref={(el) => (inputRefs.current[index] = el)}
                            />
                            {index === localValues.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={addInput}
                                    className="ml-2 p-1 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    +
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        removeInput(index);
                                        // Actualizar el estado padre inmediatamente al eliminar
                                        setData(fieldName, localValues.filter((_, i) => i !== index));
                                    }}
                                    className="ml-2 p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    -
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            );
    });
  
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
    
            if (!response.ok) throw new Error('Paciente no encontrado');
    
            const result = await response.json();
            
            if (result.success && result.paciente) {
                setData(prev => ({
                    ...prev,
                    paciente_id: result.paciente.id,
                    nombres: result.paciente.nombres || '',
                    apellido_paterno: result.paciente.apellido_paterno || '',
                    apellido_materno: result.paciente.apellido_materno || '',
                    telefono: result.paciente.telefono || '',
                    email: result.paciente.email || '',
                    fecha_nacimiento: result.paciente.fecha_nacimiento || '',
                    edad: result.paciente.edad || '',
                    sexo: result.paciente.sexo || '',
                    peso: result.paciente.peso || '',
                    estado_civil: result.paciente.estado_civil || '',
                    ocupacion: result.paciente.ocupacion || '',
                    direccion: result.paciente.direccion || '',
                    procedencia: result.paciente.procedencia || '',
                    acompañante: result.paciente.acompañante || '',
                    referido: result.paciente.referido || '',
                    foto_perfil: result.paciente.foto_perfil || '',
                }));
                
                setPacienteEncontrado(true);
                
                // Determinar tipo de consulta basado en si tiene consulta inicial
                setData('tipo_consulta', result.tieneConsultaInicial ? 'evolucion' : 'inicio');
                
                // Si tiene consulta inicial, cargar historial
                if (result.tieneConsultaInicial) {
                    const histResponse = await fetch(`/consultas/historial-diagnosticos/${result.paciente.id}`);
                    if (histResponse.ok) {
                        const histData = await histResponse.json();
                        setHistorialDiagnosticos(histData.diagnosticos || []);
                    }
                }
            } else {
                throw new Error(result.message || 'Datos del paciente incompletos');
            }
        } catch (error) {
            console.error('Error al buscar paciente:', error);
            alert(error.message);
            setPacienteEncontrado(false);
        }
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
                                {/* SECCION PARA Mostrar datos del paciente (siempre visible, pero vacío inicialmente) */}
                                <div className="py-4 px-4 bg-[#FFFFFF]">                                                                        
                                    <div className='grid grid-cols-4 gap-4'>
                                    {/* Columna 1: Imagen del paciente - ocupa 1 parte */}
                                    <div className='flex flex-col items-center justify-center col-span-1'>
                                        <div className='w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-2 overflow-hidden'>
                                            {data.foto_perfil ? (
                                                <img 
                                                    src={`/storage/${data.foto_perfil}`}  // Asegúrate de que la ruta sea correcta
                                                    alt="Foto del paciente" 
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null; 
                                                        e.target.src = 'https://via.placeholder.com/150'; // Imagen de respaldo si falla
                                                    }}
                                                />
                                            ) : (
                                                <span className="text-gray-500">Sin foto</span>
                                            )}
                                        </div>
                                        {/* Elimina el botón de cambiar foto o mantenlo como visualización estática si lo prefieres */}
                                        <span className="text-sm text-gray-500">Foto del paciente</span>
                                    </div>
                                    {/* Columna 2: Datos concatenados del paciente - ocupa 2 partes */}
                                    <div className='flex flex-col col-span-2'>
                                        <div className="mb-2">
                                            <p className="text-lg text-[#333333]">
                                                {`${data.nombres || ''} ${data.apellido_paterno || ''} ${data.apellido_materno || ''}`.trim() || '-'}
                                            </p>
                                        </div>
                                        <div className='grid grid-cols-2'>
                                            <div className="mb-2">
                                            <p className="text-sm text-[#333333]">
                                                {`${data.fecha_nacimiento || ''} (${data.edad || ''} años)`.trim() || '-'}
                                            </p>
                                            </div>
                                            
                                            <div className="mb-2 flex gap-4">
                                                <p className="text-sm text-[#333333]">{`DNI: ${data.dni || ''}`.trim() || '-'}</p>
                                                <p className="text-sm text-[#333333]">{`Sexo: ${data.sexo || ''}`.trim() || '-'}</p>
                                            </div>
                                            
                                            <div className="mb-2">
                                                <p className="text-sm text-[#333333]">{`TELF: ${data.telefono || ''} / ${data.peso || ''} kg`.trim() || '-'}</p>
                                            </div>
                                            
                                            <div className="mb-2">
                                                <p className="text-sm text-[#333333]">{`EMAIL: ${data.email || ''}`.trim() || '-'}</p>
                                            </div>

                                            <div className="mb-2">
                                                <p className="text-sm text-[#333333]">{`Peso: ${data.peso || ''} kg`.trim() || '-'}</p>
                                            </div>

                                            <div className="mb-2">
                                                <p className="text-sm text-[#333333]">{`ESTADO CIVIL: ${data.estado_civil || ''}`.trim() || '-'}</p>
                                            </div>

                                            <div className="mb-2">
                                                <p className="text-sm text-[#333333]">{`OCUPACION: ${data.ocupacion || ''}`.trim() || '-'}</p>
                                            </div>
                                            <div className="mb-2">
                                                <p className="text-sm text-[#333333]">{`PROCEDENCIA: ${data.procedencia || ''}`.trim() || '-'}</p>
                                            </div>

                                            <div className="mb-2">
                                                <p className="text-sm text-[#333333]">{`DOMICILIO: ${data.direccion || ''}`.trim() || '-'}</p>
                                            </div>
                                            <div className="mb-2">
                                                <p className="text-sm text-[#333333]">{`ACOMPAÑANTE: ${data.acompañante || ''}`.trim() || '-'}</p>
                                            </div>

                                            <div className="mb-2">
                                                <p className="text-sm text-[#333333]">{`REFERIDO: ${data.referido || ''}`.trim() || '-'}</p>
                                            </div>                                    
                                        </div>
                                    </div>

                                    {/* Columna 3: Historial de diagnósticos - ocupa 1 parte */}
                                    <div className='flex flex-col col-span-1 p-2'>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-sm font-semibold text-[#333333]">Historial de Diagnósticos:</label>                                            
                                        </div>
                                        {historialDiagnosticos.length > 0 ? (
                                            <div className="bg-gray-50 p-4 rounded max-h-40 overflow-y-auto">
                                                <ul className="space-y-2">
                                                    {historialDiagnosticos.map((item, index) => (
                                                        <li key={index} className="border-b pb-2 last:border-b-0">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="font-medium">{item.fecha}</span>
                                                                <span className="text-blue-600">{item.tipo === 'inicio' ? 'Inicial' : 'Evolución'}</span>
                                                            </div>
                                                            <div className="mt-1 text-gray-700 whitespace-pre-wrap text-xs">{item.diagnostico}</div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">No hay historial de diagnósticos</p>
                                        )}
                                    </div>
                                </div>
                                </div>

{/*--------------------------- Campos Consulta INICIO ------------------------------------------------------*/}

                                {/* Contenedor principal con sidebar y contenido */}
                                <div className="flex flex-col md:flex-row">
                                    {/* Sidebar */}
                                    <div className="w-full md:w-64 bg-[#005b96] p-4 flex-shrink-0">
                                        <div className='flex items-center justify-end'>                                        
                                            <PacienteForm
                                                data={data}
                                                setData={setData}
                                                pacienteEncontrado={pacienteEncontrado}
                                                buscarPaciente={buscarPaciente}
                                                errors={errors}
                                            />
                                        </div>
                                        <div className="sticky top-4 space-y-2">
                                            <h3 className="text-2xl text-center mb-2">
                                                {data.tipo_consulta === 'inicio' 
                                                    ? 'Consulta Inicial' 
                                                    : 'Consulta Evolución'}
                                            </h3>
                                            
                                            {data.tipo_consulta === 'inicio' ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('antecedentesPersonales')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.antecedentesPersonales ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Antecedentes Personales
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('antecedentesFamiliares')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.antecedentesFamiliares ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Antecedentes Familiares
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('cirugiasPrevias')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.cirugiasPrevias ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Cirugías Previas
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('motivoConsulta')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.motivoConsulta ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Motivo de Consulta
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('examenOcular')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.examenOcular ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Examen Ocular
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('biomicroscopia')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.biomicroscopia ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Biomicroscopia
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('fondoOjo')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.fondoOjo ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Fondo de Ojo
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('diagnostico')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.diagnostico ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Diagnóstico
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('tratamiento')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.tratamiento ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Tratamiento
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('plan')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.plan ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Plan
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('examenesIndicados')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.examenesIndicados ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Exámenes Indicados
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('comentario')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.comentario ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Comentario
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('evoluciones')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.evoluciones ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Evoluciones
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('examenOcular')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.examenOcular ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Examen Ocular
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('biomicroscopia')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.biomicroscopia ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Biomicroscopia
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('fondoOjo')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.fondoOjo ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Fondo de Ojo
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('diagnostico')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.diagnostico ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Diagnóstico
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('tratamiento')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.tratamiento ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Tratamiento
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('plan')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.plan ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Plan
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('examenesIndicados')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.examenesIndicados ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Exámenes Indicados
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection('comentario')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.comentario ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Comentario
                                                    </button>
                                                </>
                                            )}
                                            <div className="flex items-center justify-center">
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
                                        </div>
                                    </div>

                                    {/* Contenido principal */}
                                    <div className="flex-1 border-t-2 border-gray-200 p-4">
                                        {data.tipo_consulta === 'inicio' && (
                                            <>
                                                {/* 1. Antecedentes Personales */}
                                                {expandedSections.antecedentesPersonales && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className="p-4">
                                                            <p className="text-sm text-gray-500 mb-4">
                                                                Registre los antecedentes médicos personales del paciente, incluyendo HTA, DM, alergias y otros.
                                                            </p>
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
                                                        </div>
                                                    </div>
                                                )}
                                                {/* 2. Antecedentes Patológicos Familiares */}
                                                {expandedSections.antecedentesFamiliares && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className="p-4">
                                                            <p className="text-sm text-gray-500 mb-4">
                                                                Registre los antecedentes médicos relevantes en la familia del paciente.
                                                            </p>
                                                            <div className="mb-4">
                                                                <MultiInputField
                                                                label="Antecedentes Patológicos Familiares"
                                                                values={data.antecedentes_patologicos_familiares}
                                                                fieldName="antecedentes_patologicos_familiares"
                                                                setData={setData}
                                                                className="tu-clase-personalizada" // Opcional
                                                            />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* 3. Cirugías Previas */}
                                                {expandedSections.cirugiasPrevias && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className="p-4">
                                                            <p className="text-sm text-gray-500 mb-4">
                                                                Registre cualquier procedimiento quirúrgico previo que haya tenido el paciente.
                                                            </p>
                                                            <div className="mb-4">
                                                            <MultiInputField
                                                                label="Cirugías Previas"
                                                                values={data.cirugias_previas}
                                                                fieldName="cirugias_previas"
                                                                setData={setData}
                                                                className="tu-clase-personalizada" // Opcional
                                                            />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* 4. Motivo de Consulta */}
                                                {expandedSections.motivoConsulta && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className="p-4">
                                                        <label>INICIO</label>
                                                        <TerminoMotivoConsultaSearch 
                                                            initialValue={data.motivo_consulta_inicio}
                                                            onSelectTerm={(terms) => setData('motivo_consulta_inicio', terms)}
                                                        />
                                                        <label>SIGNOS</label>
                                                        <TerminoMotivoConsultaSearch
                                                            initialValue={data.motivo_consulta_signos || ''}
                                                            onSelectTerm={(value) => setData('motivo_consulta_signos', value)}/>
                                                        <label>ENFERMEDAD</label>
                                                        <TerminoMotivoConsultaSearch
                                                            initialValue={data.motivo_consulta_enfermedad || ''}
                                                            onSelectTerm={(value) => setData('motivo_consulta_enfermedad', value)}/>
                                                        <label>OTROS</label>
                                                        <TerminoMotivoConsultaSearch
                                                            initialValue={data.motivo_consulta_otros || ''}
                                                            onSelectTerm={(value) => setData('motivo_consulta_otros', value)}/>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* 5. Examen Ocular */}
                                                {expandedSections.examenOcular && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className="p-4">
                                                            <p className="text-sm text-gray-500 mb-4">
                                                                Complete los resultados del examen ocular, incluyendo agudeza visual, refracción y otros parámetros.
                                                            </p>
                                                            <ExamenOcular data={data} setData={setData} edadPaciente={data.edad} />
                                                        </div>
                                                    </div>
                                                )}
                                                {/* 6. Biomicroscopia */}
                                                {expandedSections.biomicroscopia && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className='mb-4'>
                                                            <label className="text-xl font-medium text-gray-700 uppercase flex justify-center items-center w-full mb-4">Biomicroscopia</label>
                                                            <div className='grid grid-cols-3 mx-8 border border-gray-200 rounded-md'>
                                                                <label className='flex justify-center items-center py-2 border border-[#8FDBF1] shadow-sm'>Examen Fisico</label>
                                                                <label className='flex justify-center items-center py-2 border border-[#8FDBF1] shadow-sm'>OD</label>
                                                                <label className='flex justify-center items-center py-2 border border-[#8FDBF1] shadow-sm'>OI</label>
                                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Movimientos Oculares</label>
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_movoculares_od || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_movoculares_od', value)}/>
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_movoculares_oi || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_movoculares_oi', value)}
                                                                />
                                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Párpados</label>
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_parpados_od || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_parpados_od', value)}
                                                                />
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_parpados_oi || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_parpados_oi', value)}
                                                                />
                                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Córnea</label>
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_cornea_od || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_cornea_od', value)}
                                                                />
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_cornea_oi || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_cornea_oi', value)}
                                                                />
                                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Conjuntiva</label>
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_corneaconj_od || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_corneaconj_od', value)}
                                                                />
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_corneaconj_oi || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_corneaconj_oi', value)}
                                                                />
                                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Cámara Anterior</label>
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_ca_od || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_ca_od', value)}
                                                                />
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_ca_oi || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_ca_oi', value)}
                                                                />
                                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Iris</label>
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_iris_od || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_iris_od', value)}
                                                                />
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_iris_oi || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_iris_oi', value)}
                                                                />
                                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Cristalino</label>
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_cristalino_od || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_cristalino_od', value)}
                                                                />
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_cristalino_oi || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_cristalino_oi', value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* 7. Fondo de Ojo */}
                                                {expandedSections.fondoOjo && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className="p-4">
                                                            <p className="text-sm text-gray-500 mb-4">
                                                                Documente los hallazgos del examen de fondo de ojo para ambos ojos.
                                                            </p>
                                                            <FondoOjo
                                                                marcadoresOD={marcadores}
                                                                marcadoresOI={marcadoresOI}
                                                                marcadorActivoOD={marcadorActivo}
                                                                marcadorActivoOI={marcadorActivoOI}
                                                                handleMarkerClickOD={handleMarkerClick}
                                                                handleMarkerClickOI={handleMarkerClickOI}
                                                                data={data}
                                                                setData={setData}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {/* 8. Impresión Diagnóstica */}
                                                {expandedSections.diagnostico && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className="p-4">
                                                            <p className="text-sm text-gray-500 mb-4">
                                                                Seleccione los códigos CIE-10 correspondientes a los diagnósticos identificados.
                                                            </p>
                                                            <div className="mb-4">
                                                                <Cie10Search onSelectResult={handleSelectResult} />
                                                            </div>
                                                            <div className="mb-4">
                                                                <div className="mt-2 p-2 border border-gray-200 rounded-md">
                                                                    {selectedResults.map((result, index) => (
                                                                        <div key={index} className="inline-flex items-center bg-gray-200 rounded-md p-2 m-1">
                                                                            <span>{result}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* 9. Tratamiento */}
                                                {expandedSections.tratamiento && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className="p-4">
                                                            <p className="text-sm text-gray-500 mb-4">
                                                                Especifique el tratamiento indicado para el paciente.
                                                            </p>
                                                            <MultiInputField
                                                                label="tratamiento"
                                                                values={data.tratamiento}
                                                                fieldName="tratamiento"
                                                                setData={setData}
                                                                className="tu-clase-personalizada" // Opcional
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {/* 10. Plan */}
                                                {expandedSections.plan && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className="p-4">
                                                            <p className="text-sm text-gray-500 mb-4">
                                                                Seleccione el plan de manejo para el paciente.
                                                            </p>
                                                            <MultiInputField
                                                                label="plan"
                                                                values={data.plan}
                                                                fieldName="plan"
                                                                setData={setData}
                                                                className="tu-clase-personalizada" // Opcional
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {/* 11. Exámenes Indicados */}
                                                {expandedSections.examenesIndicados && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className="p-4">
                                                            <p className="text-sm text-gray-500 mb-4">
                                                                Adjunte imágenes o documentos de exámenes complementarios (máximo 4 archivos por tipo).
                                                            </p>
                                                            <div className="mb-4">
                                                                <label className="block text-sm font-medium text-gray-700">Exámenes Indicados (Imágenes)</label>
                                                                <input
                                                                    type="file"
                                                                    onChange={handleFileChangeImages}
                                                                    multiple
                                                                    accept="image/*"
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                />
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
                                                                                onClick={() => handleRemoveImage(index, 'img')}
                                                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                                            >
                                                                                &times;
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="mb-4">
                                                                <label className="block text-sm font-medium text-gray-700">Exámenes Indicados (Documentos)</label>
                                                                <input
                                                                    type="file"
                                                                    onChange={handleFileChangeArchivos}
                                                                    multiple
                                                                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                />
                                                                <div className="mt-4 flex flex-wrap gap-2">
                                                                    {previewArchivos.map((archivo, index) => (
                                                                        <div key={index} className="relative">
                                                                            <span className="bg-gray-200 p-2 rounded-md">{archivo.name}</span>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleRemoveArchivo(index, 'archivos')}
                                                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                                            >
                                                                                &times;
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* 12. Comentario */}
                                                {expandedSections.comentario && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className="p-4">
                                                            <p className="text-sm text-gray-500 mb-4">
                                                                Escriba un breve comentario.
                                                            </p>
                                                            <MultiInputField
                                                                label="comentario"
                                                                values={data.comentario}
                                                                fieldName="comentario"
                                                                setData={setData}
                                                                className="tu-clase-personalizada" // Opcional
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {data.tipo_consulta === 'evolucion' && (
                                            <>
                                                {/* 1. Evoluciones */}
                                                {expandedSections.evoluciones && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className="p-4">
                                                            <p className="text-sm text-gray-500 mb-4">
                                                                Registre las evoluciones del paciente, incluyendo cambios en síntomas y tratamientos.
                                                            </p>
                                                            <MultiInputField
                                                                label="evoluciones"
                                                                values={data.evoluciones}
                                                                fieldName="evoluciones"
                                                                setData={setData}
                                                                className="tu-clase-personalizada" // Opcional
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {/* 5. Examen Ocular */}
                                                {expandedSections.examenOcular && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className="p-4">
                                                            <p className="text-sm text-gray-500 mb-4">
                                                                Complete los resultados del examen ocular, incluyendo agudeza visual, refracción y otros parámetros.
                                                            </p>
                                                            <ExamenOcular data={data} setData={setData} edadPaciente={data.edad} />
                                                        </div>
                                                    </div>
                                                )}
                                                {/* 6. Biomicroscopia */}
                                                {expandedSections.biomicroscopia && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className='mb-4'>
                                                            <label className="text-xl font-medium text-gray-700 uppercase flex justify-center items-center w-full mb-4">Biomicroscopia</label>
                                                            <div className='grid grid-cols-3 mx-8 border border-gray-200 rounded-md'>
                                                                <label className='flex justify-center items-center py-2 border border-[#8FDBF1] shadow-sm'>Examen Fisico</label>
                                                                <label className='flex justify-center items-center py-2 border border-[#8FDBF1] shadow-sm'>OD</label>
                                                                <label className='flex justify-center items-center py-2 border border-[#8FDBF1] shadow-sm'>OI</label>
                                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Movimientos Oculares</label>
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_movoculares_od || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_movoculares_od', value)}/>
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_movoculares_oi || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_movoculares_oi', value)}
                                                                />
                                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Párpados</label>
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_parpados_od || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_parpados_od', value)}
                                                                />
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_parpados_oi || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_parpados_oi', value)}
                                                                />
                                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Córnea</label>
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_cornea_od || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_cornea_od', value)}
                                                                />
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_cornea_oi || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_cornea_oi', value)}
                                                                />
                                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Conjuntiva</label>
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_corneaconj_od || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_corneaconj_od', value)}
                                                                />
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_corneaconj_oi || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_corneaconj_oi', value)}
                                                                />
                                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Cámara Anterior</label>
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_ca_od || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_ca_od', value)}
                                                                />
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_ca_oi || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_ca_oi', value)}
                                                                />
                                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Iris</label>
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_iris_od || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_iris_od', value)}
                                                                />
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_iris_oi || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_iris_oi', value)}
                                                                />
                                                                <label className='border-[#8FDBF1] shadow-sm border flex items-center px-4'>Cristalino</label>
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_cristalino_od || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_cristalino_od', value)}
                                                                />
                                                                <TerminoBiomicroscopiaSearch
                                                                    initialValue={data.biomicroscopia_cristalino_oi || ''}
                                                                    onSelectTerm={(value) => setData('biomicroscopia_cristalino_oi', value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* 7. Fondo de Ojo */}
                                                {expandedSections.fondoOjo && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className="p-4">
                                                            <p className="text-sm text-gray-500 mb-4">
                                                                Documente los hallazgos del examen de fondo de ojo para ambos ojos.
                                                            </p>
                                                            <FondoOjo
                                                                marcadoresOD={marcadores}
                                                                marcadoresOI={marcadoresOI}
                                                                marcadorActivoOD={marcadorActivo}
                                                                marcadorActivoOI={marcadorActivoOI}
                                                                handleMarkerClickOD={handleMarkerClick}
                                                                handleMarkerClickOI={handleMarkerClickOI}
                                                                data={data}
                                                                setData={setData}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {/* 8. Impresión Diagnóstica */}
                                                {expandedSections.diagnostico && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className="p-4">
                                                            <p className="text-sm text-gray-500 mb-4">
                                                                Seleccione los códigos CIE-10 correspondientes a los diagnósticos identificados.
                                                            </p>
                                                            <div className="mb-4">
                                                                <Cie10Search onSelectResult={handleSelectResult} />
                                                            </div>
                                                            <div className="mb-4">
                                                                <div className="mt-2 p-2 border border-gray-200 rounded-md">
                                                                    {selectedResults.map((result, index) => (
                                                                        <div key={index} className="inline-flex items-center bg-gray-200 rounded-md p-2 m-1">
                                                                            <span>{result}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* 9. Tratamiento */}
                                                {expandedSections.tratamiento && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className="p-4">
                                                            <p className="text-sm text-gray-500 mb-4">
                                                                Especifique el tratamiento indicado para el paciente.
                                                            </p>
                                                            <MultiInputField
                                                                label="tratamiento"
                                                                values={data.tratamiento}
                                                                fieldName="tratamiento"
                                                                setData={setData}
                                                                className="tu-clase-personalizada" // Opcional
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {/* 10. Plan */}
                                                {expandedSections.plan && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className="p-4">
                                                            <p className="text-sm text-gray-500 mb-4">
                                                                Seleccione el plan de manejo para el paciente.
                                                            </p>
                                                            <MultiInputField
                                                                label="plan"
                                                                values={data.plan}
                                                                fieldName="plan"
                                                                setData={setData}
                                                                className="tu-clase-personalizada" // Opcional
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {/* 11. Exámenes Indicados */}
                                                {expandedSections.examenesIndicados && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className="p-4">
                                                            <p className="text-sm text-gray-500 mb-4">
                                                                Adjunte imágenes o documentos de exámenes complementarios (máximo 4 archivos por tipo).
                                                            </p>
                                                            <div className="mb-4">
                                                                <label className="block text-sm font-medium text-gray-700">Exámenes Indicados (Imágenes)</label>
                                                                <input
                                                                    type="file"
                                                                    onChange={handleFileChangeImages}
                                                                    multiple
                                                                    accept="image/*"
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                />
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
                                                                                onClick={() => handleRemoveImage(index, 'img')}
                                                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                                            >
                                                                                &times;
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="mb-4">
                                                                <label className="block text-sm font-medium text-gray-700">Exámenes Indicados (Documentos)</label>
                                                                <input
                                                                    type="file"
                                                                    onChange={handleFileChangeArchivos}
                                                                    multiple
                                                                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                />
                                                                <div className="mt-4 flex flex-wrap gap-2">
                                                                    {previewArchivos.map((archivo, index) => (
                                                                        <div key={index} className="relative">
                                                                            <span className="bg-gray-200 p-2 rounded-md">{archivo.name}</span>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleRemoveArchivo(index, 'archivos')}
                                                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                                            >
                                                                                &times;
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* 12. Comentario */}
                                                {expandedSections.comentario && (
                                                    <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                        <div className="p-4">
                                                            <p className="text-sm text-gray-500 mb-4">
                                                                Escriba un breve comentario.
                                                            </p>
                                                            <MultiInputField
                                                                label="comentario"
                                                                values={data.comentario}
                                                                fieldName="comentario"
                                                                setData={setData}
                                                                className="tu-clase-personalizada" // Opcional
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}