import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import React, { useState, useEffect, useCallback, useRef } from 'react';

import PacienteForm from '@/Components/PacienteForm';
import Cie10Search from '@/Components/Cie10Search';
import AntecedentesPersonales from '@/Components/AntecedentesPersonales';
import ExamenOcular from '@/Components/ExamenOcular';
import Refraccion from '@/Components/Refraccion';
import FondoOjo from '@/Components/FondoOjo';
import TerminoBiomicroscopiaSearch from '@/Components/TerminoBiomicroscopiaSearch';
import TerminoMotivoConsultaSearch from '@/Components/TerminoMotivoConsultaSearch';

export default function ConsultasEdit({ auth, consulta }) {
    // Parse initial file data
    const parseFileData = (fileData) => {
        if (!fileData) return [];
        try {
            if (Array.isArray(fileData)) return fileData;
            if (typeof fileData === 'string') return JSON.parse(fileData);
            return [fileData];
        } catch (e) {
            console.error('Error parsing file data:', e);
            return [];
        }
    };
    // Initial form data setup
    const { data, setData, put, processing, errors } = useForm({
        paciente_id: consulta?.paciente_id || '',
        dni: consulta?.paciente?.dni || '',
        identificacion: consulta?.paciente?.identificacion || '',
        nombres: consulta?.paciente?.nombres || '',
        apellido_paterno: consulta?.paciente?.apellido_paterno || '',
        apellido_materno: consulta?.paciente?.apellido_materno || '',
        telefono: consulta?.paciente?.telefono || '',
        email: consulta?.paciente?.email || '',
        fecha_nacimiento: consulta?.paciente?.fecha_nacimiento || '',
        edad: consulta?.paciente?.edad || '',
        sexo: consulta?.paciente?.sexo || '',
        peso: consulta?.paciente?.peso || '',
        estado_civil: consulta?.paciente?.estado_civil || '',
        ocupacion: consulta?.paciente?.ocupacion || '',
        direccion: consulta?.paciente?.direccion || '',
        procedencia: consulta?.paciente?.procedencia || '',
        acompañante: consulta?.paciente?.acompañante || '',
        referido: consulta?.paciente?.referido || '',
        foto_perfil: consulta?.paciente?.foto_perfil || '',
        
        // Consulta fields
        antecedentes_personales_hta: consulta?.antecedentes_personales_hta || '',
        antecedentes_personales_alergias: consulta?.antecedentes_personales_alergias || '',
        antecedentes_personales_dm: consulta?.antecedentes_personales_dm || '',
        antecedentes_personales_otros: consulta?.antecedentes_personales_otros || '',
        antecedentes_patologicos_familiares: consulta?.antecedentes_patologicos_familiares || '',
        cirugias_previas: consulta?.cirugias_previas || '',
        motivo_consulta: consulta?.motivo_consulta || '',
        impresion_diagnostica: consulta?.impresion_diagnostica || '',
        tratamiento: Array.isArray(consulta?.tratamiento) ? 
        consulta.tratamiento.filter(item => typeof item === 'string') : 
        [typeof consulta?.tratamiento === 'string' ? consulta.tratamiento : ''],
        plan: Array.isArray(consulta?.plan) ? 
        consulta.plan.filter(item => typeof item === 'string') : 
        [typeof consulta?.plan === 'string' ? consulta.plan : ''],
        examenes_indicados_img: [], // New images to upload
        examenes_indicados_archivos: [], // New files to upload
        examenes_indicados_img_existentes: parseFileData(consulta?.examenes_indicados_img),
        examenes_indicados_archivos_existentes: parseFileData(consulta?.examenes_indicados_archivos),
        evoluciones: Array.isArray(consulta?.evoluciones) ? 
        consulta.evoluciones.filter(item => typeof item === 'string') : 
        [typeof consulta?.evoluciones === 'string' ? consulta.evoluciones : ''],
        tipo_consulta: consulta?.tipo_consulta || 'inicio',
        
        // Examen ocular fields
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
        
        // Biomicroscopia fields
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
        
        // Fondo de ojo fields
        fondo_ojo_posiciones: consulta?.fondo_ojo_posiciones || '',
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
        f_o_dilat_pup_od: consulta?.f_o_dilat_pup_od || '',
        f_o_dilat_pup_oi: consulta?.f_o_dilat_pup_oi || '',
        f_o_locs_tres_od: consulta?.f_o_locs_tres_od || '',
        f_o_locs_tres_oi: consulta?.f_o_locs_tres_oi || '',
        f_o_fundoscopia_od: consulta?.f_o_fundoscopia_od || '',
        f_o_fundoscopia_oi: consulta?.f_o_fundoscopia_oi || '',
        f_o_conclusion: consulta?.f_o_conclusion || '',
        f_o_plan: consulta?.f_o_plan || '',
        
        // Refracción fields
        exam_new_distancia_esfera_od: consulta?.examen?.exam_new_distancia_esfera_od || '',
        exam_new_distancia_esfera_oi: consulta?.examen?.exam_new_distancia_esfera_oi || '',
        exam_new_distancia_cilindro_od: consulta?.examen?.exam_new_distancia_cilindro_od || '',
        exam_new_distancia_cilindro_oi: consulta?.examen?.exam_new_distancia_cilindro_oi || '',
        exam_new_distancia_eje_od: consulta?.examen?.exam_new_distancia_eje_od || '',
        exam_new_distancia_eje_oi: consulta?.examen?.exam_new_distancia_eje_oi || '',
        exam_new_distancia_dip: consulta?.examen?.exam_new_distancia_dip || '',
        exam_old_distancia_esfera_od: consulta?.examen?.exam_old_distancia_esfera_od || '',
        exam_old_distancia_esfera_oi: consulta?.examen?.exam_old_distancia_esfera_oi || '',
        exam_old_distancia_cilindro_od: consulta?.examen?.exam_old_distancia_cilindro_od || '',
        exam_old_distancia_cilindro_oi: consulta?.examen?.exam_old_distancia_cilindro_oi || '',
        exam_old_distancia_eje_od: consulta?.examen?.exam_old_distancia_eje_od || '',
        exam_old_distancia_eje_oi: consulta?.examen?.exam_old_distancia_eje_oi || '',
        exam_old_distancia_dip: consulta?.examen?.exam_old_distancia_dip || '',
        
        exam_new_cerca_esfera_od: consulta?.examen?.exam_new_cerca_esfera_od || '',
        exam_new_cerca_esfera_oi: consulta?.examen?.exam_new_cerca_esfera_oi || '',
        exam_new_cerca_cilindro_od: consulta?.examen?.exam_new_cerca_cilindro_od || '',
        exam_new_cerca_cilindro_oi: consulta?.examen?.exam_new_cerca_cilindro_oi || '',
        exam_new_cerca_eje_od: consulta?.examen?.exam_new_cerca_eje_od || '',
        exam_new_cerca_eje_oi: consulta?.examen?.exam_new_cerca_eje_oi || '',
        exam_new_cerca_dip: consulta?.examen?.exam_new_cerca_dip || '',
        exam_old_cerca_esfera_od: consulta?.examen?.exam_old_cerca_esfera_od || '',
        exam_old_cerca_esfera_oi: consulta?.examen?.exam_old_cerca_esfera_oi || '',
        exam_old_cerca_cilindro_od: consulta?.examen?.exam_old_cerca_cilindro_od || '',
        exam_old_cerca_cilindro_oi: consulta?.examen?.exam_old_cerca_cilindro_oi || '',
        exam_old_cerca_eje_od: consulta?.examen?.exam_old_cerca_eje_od || '',
        exam_old_cerca_eje_oi: consulta?.examen?.exam_old_cerca_eje_oi || '',
        exam_old_cerca_dip: consulta?.examen?.exam_old_cerca_dip || '',
        instrucciones: consulta?.refraccion?.instrucciones || '',
        adiciones: consulta?.refraccion?.adiciones || '',
        comentario: Array.isArray(consulta?.comentario) ? consulta.comentario : [consulta?.comentario || ''],
    });
    // State for expanded sections
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
        refraccion: false,
        plan: false,
        examenesIndicados: false,
        evoluciones: false,
        ciitArchivos: false,
    }); 

    // UI state
    const [showHTAText, setShowHTAText] = useState(false);
    const [showDMText, setShowDMText] = useState(false);
    const [showAlergiasText, setShowAlergiasText] = useState(false);
    const [showOtrosText, setShowOtrosText] = useState(false);
    const [historialDiagnosticos, setHistorialDiagnosticos] = useState([]);
    const [pacienteEncontrado, setPacienteEncontrado] = useState(true);
    const [previewCiitFiles, setPreviewCiitFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [previewArchivos, setPreviewArchivos] = useState([]);
    const [filesToDelete, setFilesToDelete] = useState([]);
    // Marker states
    const [marcadorActivo, setMarcadorActivo] = useState(null);
    const [marcadorActivoOI, setMarcadorActivoOI] = useState(null);

    // Selected CIE10 results
    const [selectedResults, setSelectedResults] = useState(
        consulta?.impresion_diagnostica ? consulta.impresion_diagnostica.split('; ').filter(Boolean) : []
    );

    // Markers configuration (same as create.jsx)
    const marcadores = [
        {
            id: 1,
            campo: 'fondo_ojo_vitreo_od',
            color: 'blue',
            subtitulo: 'Vítreo',
        },
        {
            id: 2,
            campo: 'fondo_ojo_macula_od',
            color: 'red',
            subtitulo: 'Mácula',
        },
        {
            id: 3,
            campo: 'fondo_ojo_retina_p_od',
            color: 'green',
            subtitulo: 'Retina Periférica',
        },
        {
            id: 4,
            campo: 'fondo_ojo_disco_o_od',
            color: 'purple',
            subtitulo: 'Disco Óptico',
        },
        {
            id: 5,
            campo: 'fondo_ojo_vasos_od',
            color: 'orange',
            subtitulo: 'Vasos Sanguíneos',
        },
    ];

    const marcadoresOI = [
        {
            id: 1,
            campo: 'fondo_ojo_vitreo_oi',
            color: 'blue',
            subtitulo: 'Vítreo OI',
        },
        {
            id: 2,
            campo: 'fondo_ojo_macula_oi',
            color: 'red',
            subtitulo: 'Mácula',
        },
        {
            id: 3,
            campo: 'fondo_ojo_retina_p_oi',
            color: 'green',
            subtitulo: 'Retina Periférica',
        },
        {
            id: 4,
            campo: 'fondo_ojo_disco_o_oi',
            color: 'purple',
            subtitulo: 'Disco Óptico',
        },
        {
            id: 5,
            campo: 'fondo_ojo_vasos_oi',
            color: 'orange',
            subtitulo: 'Vasos Sanguíneos',
        },
    ];

    // Toggle section function (same as create.jsx)
    const toggleSection = (section) => {
        setExpandedSections(prev => {
            const newSections = Object.keys(prev).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {});
            newSections[section] = !prev[section];
            return newSections;
        });
    };

    // Handle CIE10 selection
    const handleSelectResult = useCallback((results) => {
        if (typeof results === 'string') {
            results = results.split(';').map(item => item.trim());
        }
        setSelectedResults(results);
        setData('impresion_diagnostica', results.join('; '));
    }, [setData]);

const handleFileChangeCiitFiles = (e) => {
  const files = Array.from(e.target.files);
  if (files.length + previewCiitFiles.length > 4) {
    alert('Solo puedes subir un máximo de 4 archivos CIIT.');
    return;
  }

  const newFiles = files.map((file) => ({
    file,
    name: file.name,
    type: file.type.startsWith('image/') ? 'image' : 
          file.type === 'application/zip' || file.type === 'application/x-rar-compressed' ? 'compressed' : 'file',
    isNew: true // Marcar como nuevo archivo
  }));

  setData('ciit_archivos', [...(data.ciit_archivos || []), ...files]);
  setPreviewCiitFiles([...previewCiitFiles, ...newFiles]);
};

const handleFileChangeImages = (e) => {
  const files = Array.from(e.target.files);
  if (files.length + data.examenes_indicados_img_existentes.length > 4) {
    alert('Solo puedes subir un máximo de 4 imágenes en total.');
    return;
  }

  const newImages = files.map((file) => ({
    file,
    preview: URL.createObjectURL(file),
    name: file.name,
    isNew: true
  }));

  setData('examenes_indicados_img', [...data.examenes_indicados_img, ...files]);
  setPreviewImages([...previewImages, ...newImages]);
};

const handleFileChangeArchivos = (e) => {
  const files = Array.from(e.target.files);
  if (files.length + data.examenes_indicados_archivos_existentes.length > 4) {
    alert('Solo puedes subir un máximo de 4 archivos en total.');
    return;
  }

  const newFiles = files.map((file) => ({
    file,
    name: file.name,
    isNew: true
  }));

  setData('examenes_indicados_archivos', [...data.examenes_indicados_archivos, ...files]);
  setPreviewArchivos([...previewArchivos, ...newFiles]);
};
    // Marker click handlers
    const handleMarkerClick = (marcador) => {
        setMarcadorActivo(marcador.id === marcadorActivo ? null : marcador.id);
    };

    const handleMarkerClickOI = (marcadorOI) => {
        setMarcadorActivoOI(marcadorOI.id === marcadorActivoOI ? null : marcadorOI.id);
    };

        // Manejador para eliminar archivos CIIT
const handleRemoveCiitFile = (index) => {
  const fileToRemove = previewCiitFiles[index];
  
  // Si es un archivo existente (no tiene isNew), agregar a filesToDelete
  if (!fileToRemove.isNew && fileToRemove.path) {
    setFilesToDelete(prev => [...prev, { path: fileToRemove.path }]);
  }
  
  // Eliminar de las previews
  const updatedPreviews = [...previewCiitFiles];
  updatedPreviews.splice(index, 1);
  setPreviewCiitFiles(updatedPreviews);

  // Si es un archivo nuevo, eliminarlo de data.ciit_archivos
  if (fileToRemove.isNew) {
    const updatedFiles = [...data.ciit_archivos];
    const fileIndex = updatedFiles.findIndex(f => f.name === fileToRemove.name);
    if (fileIndex !== -1) {
      updatedFiles.splice(fileIndex, 1);
      setData('ciit_archivos', updatedFiles);
    }
  }
};
    const handleRemoveImage = (index, type) => {
    if (type === 'img') {
        const imageToRemove = previewImages[index];
        
        // Si es una imagen existente
        if (!imageToRemove.isNew && imageToRemove.path) {
        setFilesToDelete(prev => [...prev, { path: imageToRemove.path }]);
        
        // Actualizar examenes_indicados_img_existentes
        const updatedExisting = [...data.examenes_indicados_img_existentes];
        const existingIndex = updatedExisting.findIndex(img => img.path === imageToRemove.path);
        if (existingIndex !== -1) {
            updatedExisting.splice(existingIndex, 1);
            setData('examenes_indicados_img_existentes', updatedExisting);
        }
        }
        
        // Eliminar de previewImages y data.examenes_indicados_img si es nuevo
        if (imageToRemove.isNew) {
        const updatedImages = [...data.examenes_indicados_img];
        const fileIndex = updatedImages.findIndex(f => f.name === imageToRemove.name);
        if (fileIndex !== -1) {
            updatedImages.splice(fileIndex, 1);
            setData('examenes_indicados_img', updatedImages);
        }
        }
        
        const updatedPreviews = [...previewImages];
        URL.revokeObjectURL(updatedPreviews[index].preview);
        updatedPreviews.splice(index, 1);
        setPreviewImages(updatedPreviews);
    } 
    };

const handleRemoveExistingFile = (index, type) => {
  if (type === 'img') {
    const fileToRemove = data.examenes_indicados_img_existentes[index];
    if (fileToRemove.path) {
      setFilesToDelete(prev => [...prev, { path: fileToRemove.path }]);
    }
    const updatedFiles = [...data.examenes_indicados_img_existentes];
    updatedFiles.splice(index, 1);
    setData('examenes_indicados_img_existentes', updatedFiles);
  } else {
    const fileToRemove = data.examenes_indicados_archivos_existentes[index];
    if (fileToRemove.path) {
      setFilesToDelete(prev => [...prev, { path: fileToRemove.path }]);
    }
    const updatedFiles = [...data.examenes_indicados_archivos_existentes];
    updatedFiles.splice(index, 1);
    setData('examenes_indicados_archivos_existentes', updatedFiles);
  }
};

    // Efecto para inicializar marcadores basados en datos existentes
useEffect(() => {
  // Buscar marcadores con valores existentes
  const marcadoresConValor = marcadores.filter(m => data[m.campo]);
  if (marcadoresConValor.length > 0) {
    setMarcadorActivo(marcadoresConValor[0].id);
  }

  const marcadoresOIConValor = marcadoresOI.filter(m => data[m.campo]);
  if (marcadoresOIConValor.length > 0) {
    setMarcadorActivoOI(marcadoresOIConValor[0].id);
  }
}, []);
// Efecto para manejar previsualización de archivos existentes
useEffect(() => {
    // Inicializar archivos existentes
    if (consulta.examenes_indicados_img) {
        const parsedImages = parseFileData(consulta.examenes_indicados_img);
        setData('examenes_indicados_img_existentes', parsedImages);
    }

    if (consulta.examenes_indicados_archivos) {
        const parsedArchivos = parseFileData(consulta.examenes_indicados_archivos);
        setData('examenes_indicados_archivos_existentes', parsedArchivos);
    }
}, [consulta]);

    // Load diagnostic history
    useEffect(() => {
        if (data.paciente_id) {
            cargarHistorialDiagnosticos();
        }
    }, [data.paciente_id]);

    const cargarHistorialDiagnosticos = async () => {
        try {
            const response = await fetch(`/consultas/historial-diagnosticos/${data.paciente_id}`);
            if (response.ok) {
                const result = await response.json();
                setHistorialDiagnosticos(result.diagnosticos || []);
            }
        } catch (error) {
            console.error('Error cargando historial:', error);
        }
    };

    // MultiInputField component (same as create.jsx)
    const MultiInputField = React.memo(({ label, values, fieldName, setData, className = "" }) => {
        const [localValues, setLocalValues] = useState(Array.isArray(values) ? values : [values || '']);
        const inputRefs = useRef([]);

        useEffect(() => {
            setLocalValues(Array.isArray(values) ? values : [values || '']);
        }, [values]);

        const addInput = () => {
            setLocalValues(prev => [...prev, '']);
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

    console.log('paciente_id:', data.paciente_id);

    // Handle form submission
    const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('_method', 'PUT');
    
    // Agregar campos normales
    Object.keys(data).forEach(key => {
        if (['examenes_indicados_img', 'examenes_indicados_archivos', 'ciit_archivos'].includes(key)) {
        return; // Estos se manejan aparte
        }
        
        if (['tratamiento', 'plan', 'evoluciones', 'comentario'].includes(key)) {
        if (Array.isArray(data[key])) {
            data[key].forEach((item, index) => {
            if (item !== '') {
                formData.append(`${key}[${index}]`, item);
            }
            });
        }
        } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
        }
    });

    const refraccionFields = [
        'exam_old_distancia_esfera_od',
        'exam_old_distancia_cilindro_od',
        'exam_old_distancia_eje_od',
        'exam_old_distancia_esfera_oi',
        'exam_old_distancia_cilindro_oi',
        'exam_old_distancia_eje_oi',
        'exam_old_distancia_dip',
        // Campos de examen previo - Cerca
        'exam_old_cerca_esfera_od',
        'exam_old_cerca_cilindro_od',
        'exam_old_cerca_eje_od',
        'exam_old_cerca_esfera_oi',
        'exam_old_cerca_cilindro_oi',
        'exam_old_cerca_eje_oi',
        'exam_old_cerca_dip',
        // Campos de examen actual - Distancia
        'exam_new_distancia_esfera_od',
        'exam_new_distancia_cilindro_od',
        'exam_new_distancia_eje_od',
        'exam_new_distancia_esfera_oi',
        'exam_new_distancia_cilindro_oi',
        'exam_new_distancia_eje_oi',
        'exam_new_distancia_dip',
        // Campos de examen actual - Cerca
        'exam_new_cerca_esfera_od',
        'exam_new_cerca_cilindro_od',
        'exam_new_cerca_eje_od',
        'exam_new_cerca_esfera_oi',
        'exam_new_cerca_cilindro_oi',
        'exam_new_cerca_eje_oi',
        'exam_new_cerca_dip',
        // Campos adicionales
        'instrucciones',
        'adiciones',
    ];
    
    refraccionFields.forEach(field => {
        if (data[field] !== undefined) {
        formData.append(field, data[field] || ''); // Incluir incluso si está vacío
        }
    });

    // Archivos existentes (como JSON)
    if (data.examenes_indicados_img_existentes?.length > 0) {
        formData.append('examenes_indicados_img_existentes', JSON.stringify(data.examenes_indicados_img_existentes));
    }
    
    if (data.examenes_indicados_archivos_existentes?.length > 0) {
        formData.append('examenes_indicados_archivos_existentes', JSON.stringify(data.examenes_indicados_archivos_existentes));
    }

    // Nuevos archivos
    data.examenes_indicados_img?.forEach((file) => {
        formData.append('examenes_indicados_img[]', file);
    });
    
    data.examenes_indicados_archivos?.forEach((file) => {
        formData.append('examenes_indicados_archivos[]', file);
    });

    // Archivos CIIT
    previewCiitFiles.forEach((file) => {
        if (file.isNew && file.file) {
        formData.append('ciit_archivos[]', file.file);
        }
    });

    // Archivos existentes CIIT (solo los no eliminados)
    const existingCiitFiles = previewCiitFiles.filter(file => !file.isNew);
    if (existingCiitFiles.length > 0) {
        formData.append('ciit_archivos_existentes', JSON.stringify(existingCiitFiles));
    }

    // Archivos a eliminar
    if (filesToDelete.length > 0) {
        formData.append('files_to_delete', JSON.stringify(filesToDelete));
    }

    try {
        const response = await axios.post(route('consultas.update', consulta.id), formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        }
        });
        
        router.visit(route('consultas.index'));
    } catch (error) {
        console.error('Error al enviar:', error.response?.data);
    }
    };

    // Reemplazar el useEffect que carga los archivos existentes
    useEffect(() => {
    // Procesar archivos CIIT existentes
    if (consulta.ciit_archivos && consulta.ciit_archivos.length > 0) {
        let archivos = consulta.ciit_archivos;
        if (typeof archivos === 'string') {
        try {
            archivos = JSON.parse(archivos);
        } catch (e) {
            console.error('Error parsing ciit_archivos:', e);
            archivos = [];
        }
        }
        
        const existingFiles = archivos.map(file => ({
        ...file,
        id: file.path || file.ruta, // Usar la ruta como ID único
        name: file.original_name || file.nombre_original || basename(file.path || file.ruta),
        type: file.type || (file.path?.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' : 'file'),
        url: file.url || (file.path ? `/storage/${file.path}` : null)
        }));
        
        setPreviewCiitFiles(existingFiles);
    }else {
    setPreviewCiitFiles([]);
    }

    // Procesar imágenes existentes de exámenes
    if (consulta.examenes_indicados_img && consulta.examenes_indicados_img.length > 0) {
        let imagenes = consulta.examenes_indicados_img;
        if (typeof imagenes === 'string') {
        try {
            imagenes = JSON.parse(imagenes);
        } catch (e) {
            console.error('Error parsing examenes_indicados_img:', e);
            imagenes = [];
        }
        }
        
        const existingImages = imagenes.map(img => ({
        ...img,
        id: img.path || img.ruta,
        preview: img.url || (img.path ? `/storage/${img.path}` : null),
        name: img.original_name || img.nombre_original || basename(img.path || img.ruta)
        }));
        
        setData('examenes_indicados_img_existentes', existingImages);
    }else {
        setData('examenes_indicados_img_existentes', []);
    }

    // Procesar archivos existentes de exámenes
     if (consulta.examenes_indicados_archivos && consulta.examenes_indicados_archivos.length > 0) {
        let archivos = consulta.examenes_indicados_archivos;
        if (typeof archivos === 'string') {
        try {
            archivos = JSON.parse(archivos);
        } catch (e) {
            console.error('Error parsing examenes_indicados_archivos:', e);
            archivos = [];
        }
        }
        
        const existingFiles = archivos.map(file => ({
        ...file,
        id: file.path || file.ruta,
        name: file.original_name || file.nombre_original || basename(file.path || file.ruta),
        url: file.url || (file.path ? `/storage/${file.path}` : null)
        }));
        
        setData('examenes_indicados_archivos_existentes', existingFiles);
    }else {
        setData('examenes_indicados_archivos_existentes', []);
    }
    }, [consulta]);

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

            <div>
                <div className="mx-auto">
                    <div className="overflow-hidden bg-white shadow-sm">
                        <div className="bg-[#FFFFFF]">
                            <form onSubmit={handleSubmit}>
                                {/* Patient information section */}
                                <div className="py-4 px-4 bg-[#FFFFFF]">                                                                        
                                    <div className='grid grid-cols-4 gap-4'>
                                        {/* Column 1: Patient photo */}
                                        <div className='flex flex-col items-center justify-center col-span-1'>
                                            <div className='w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-2 overflow-hidden'>
                                                {data.foto_perfil ? (
                                                    <img 
                                                        src={`/storage/${data.foto_perfil}`}
                                                        alt="Foto del paciente" 
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null; 
                                                            e.target.src = '';
                                                            e.target.parentElement.classList.add('bg-gray-200');
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-gray-500">Sin foto</span>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-500">Foto del paciente</span>
                                        </div>
                                        
                                        {/* Column 2: Patient details */}
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

                                        {/* Column 3: Diagnostic history */}
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

                                {/* Main content with sidebar */}
                                <div className="flex flex-col md:flex-row">
                                    {/* Sidebar */}
                                    <div className="w-full md:w-64 bg-[#005b96] p-4 flex-shrink-0">
                                        <div className='flex items-center justify-end'>                                        
                                            <PacienteForm
                                                data={data}
                                                setData={setData}
                                                pacienteEncontrado={pacienteEncontrado}
                                                setPacienteEncontrado={setPacienteEncontrado}
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
                                                        onClick={() => toggleSection('refraccion')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.refraccion ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Refracción
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
                                                        onClick={() => toggleSection('ciitArchivos')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.ciitArchivos ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Archivos CIIT
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
                                                        onClick={() => toggleSection('refraccion')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.refraccion ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Refracción
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
                                                        onClick={() => toggleSection('ciitArchivos')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.ciitArchivos ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Archivos CIIT
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
                                                    Actualizar
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main content */}
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
                                                        <label>Motivo de la Consulta</label>
                                                        <TerminoMotivoConsultaSearch 
                                                            initialValue={data.motivo_consulta}
                                                            onSelectTerm={(terms) => setData('motivo_consulta', terms)}
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
                                                {/*REFRACCION */}
                                                {expandedSections.refraccion && (
                                                <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                    <div className="p-4">
                                                    <p className="text-sm text-gray-500 mb-4">
                                                        Complete los resultados del examen de refracción.
                                                    </p>
                                                    <Refraccion 
                                                        data={data} 
                                                        setData={setData}
                                                        edadPaciente={parseInt(data.edad) || 0}
                                                        readOnly={false}
                                                        initialData={consulta.refraccion || {}}
                                                    />
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
                                                        Hallazgos del examen de fondo de ojo.
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
                                                        initialValues={{
                                                        // Pasa los valores existentes del fondo de ojo
                                                        fondo_ojo_retina_p_od: consulta.fondo_ojo_retina_p_od,
                                                        fondo_ojo_macula_od: consulta.fondo_ojo_macula_od,
                                                        fondo_ojo_vitreo_od: consulta.fondo_ojo_vitreo_od,
                                                        fondo_ojo_disco_o_od: consulta.fondo_ojo_disco_o_od,
                                                        fondo_ojo_vasos_od: consulta.fondo_ojo_vasos_od,
                                                        fondo_ojo_retina_p_oi: consulta.fondo_ojo_retina_p_oi,
                                                        fondo_ojo_macula_oi: consulta.fondo_ojo_macula_oi,
                                                        fondo_ojo_vitreo_oi: consulta.fondo_ojo_vitreo_oi,
                                                        fondo_ojo_disco_o_oi: consulta.fondo_ojo_disco_o_oi,
                                                        fondo_ojo_vasos_oi: consulta.fondo_ojo_vasos_oi,
                                                        }}
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
                                                            <Cie10Search 
                                                            onSelectResult={handleSelectResult}
                                                            initialSelected={data.impresion_diagnostica ? data.impresion_diagnostica.split('; ') : []}
                                                            />
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
                                                {/* 11. Archivos CIIT */}
                                                {expandedSections.ciitArchivos && (
                                                <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                    <div className="p-4">
                                                    <p className="text-sm text-gray-500 mb-4">
                                                        Adjunte archivos CIIT (imágenes, documentos o archivos comprimidos - máximo 4 archivos).
                                                    </p>
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700">Archivos CIIT</label>
                                                        <input
                                                        type="file"
                                                        onChange={handleFileChangeCiitFiles}
                                                        multiple
                                                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                        />
                                                        
                                                        {/* Archivos existentes y nuevos en una sola lista */}
                                                        <div className="mt-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Archivos</label>
{previewCiitFiles.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {previewCiitFiles.map((file, index) => (
    <div key={file.id || `new-${index}`} className="border rounded-md p-3 relative group hover:shadow-md transition-shadow">
      {file.type === 'image' ? (
        <img
          src={file.url || file.preview}
          alt={`Archivo CIIT ${index + 1}`}
          className="w-full h-32 object-contain rounded-md mb-2"
        />
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-md mb-2">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      )}
      
      <div className="absolute top-2 right-2 flex space-x-1">
        {file.url && (
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            download={file.type !== 'image'}
            className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition-colors"
            title={file.type === 'image' ? "Ver" : "Descargar"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {file.type === 'image' ? (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              )}
            </svg>
          </a>
        )}
        
        <button
          type="button"
          onClick={() => handleRemoveCiitFile(index)}
          className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
          title="Eliminar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      <div className="text-sm truncate mt-1">{file.name}</div>
      <div className="text-xs text-gray-500">
        {file.type === 'image' ? 'Imagen' : 
         file.type === 'compressed' ? 'Archivo comprimido' : 'Documento'}
        {file.isNew && ' (Nuevo)'}
      </div>
    </div>
  ))}
</div>
) : (
  <p className="text-gray-500 text-sm mt-2">No hay archivos CIIT adjuntos</p>
)}
                                                        </div>
                                                    </div>
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

      {/* Sección de Imágenes */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Exámenes Indicados (Imágenes)
            <span className="text-xs text-gray-500 ml-2">
              {data.examenes_indicados_img_existentes.length + previewImages.length}/4 archivos
            </span>
          </label>
          {data.examenes_indicados_img_existentes.length + previewImages.length < 4 && (
            <label className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-md cursor-pointer hover:bg-blue-100">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar
              <input
                type="file"
                onChange={handleFileChangeImages}
                multiple
                accept="image/*"
                className="hidden"
                disabled={data.examenes_indicados_img_existentes.length + previewImages.length >= 4}
              />
            </label>
          )}
        </div>

        {/* Mensaje cuando no hay imágenes */}
        {data.examenes_indicados_img_existentes.length === 0 && previewImages.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-1 text-sm text-gray-600">No hay imágenes adjuntas</p>
          </div>
        )}

        {/* Grid de imágenes existentes y nuevas */}
        {(data.examenes_indicados_img_existentes.length > 0 || previewImages.length > 0) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {/* Imágenes existentes */}
            {data.examenes_indicados_img_existentes.map((file, index) => (
              <div key={`existing-img-${index}`} className="relative group">
                <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={file.url || `/storage/${file.path}`}
                    alt={`Imagen ${file.original_name || file.name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                        e.target.parentElement.classList.add('bg-gray-200');
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500">Imagen no disponible</div>';
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                  <div className="flex space-x-2">
                    <a
                      href={file.url || `/storage/${file.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white bg-blue-500 p-2 rounded-full hover:bg-blue-600"
                      title="Ver imagen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingFile(index, 'img')}
                      className="text-white bg-red-500 p-2 rounded-full hover:bg-red-600"
                      title="Eliminar imagen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-600 truncate">{file.original_name || file.name}</div>
              </div>
            ))}

            {/* Nuevas imágenes (previews) */}
            {previewImages.map((image, index) => (
              <div key={`new-img-${index}`} className="relative group">
                <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={image.preview}
                    alt={`Previsualización ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index, 'img')}
                    className="text-white bg-red-500 p-2 rounded-full hover:bg-red-600"
                    title="Eliminar imagen"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="mt-1 text-xs text-gray-600 truncate">{image.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección de Documentos */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Exámenes Indicados (Documentos)
            <span className="text-xs text-gray-500 ml-2">
              {data.examenes_indicados_archivos_existentes.length + previewArchivos.length}/4 archivos
            </span>
          </label>
          {data.examenes_indicados_archivos_existentes.length + previewArchivos.length < 4 && (
            <label className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-md cursor-pointer hover:bg-blue-100">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar
              <input
                type="file"
                onChange={handleFileChangeArchivos}
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                className="hidden"
                disabled={data.examenes_indicados_archivos_existentes.length + previewArchivos.length >= 4}
              />
            </label>
          )}
        </div>

        {/* Mensaje cuando no hay documentos */}
        {data.examenes_indicados_archivos_existentes.length === 0 && previewArchivos.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-1 text-sm text-gray-600">No hay documentos adjuntos</p>
          </div>
        )}

        {/* Lista de documentos existentes y nuevos */}
        {(data.examenes_indicados_archivos_existentes.length > 0 || previewArchivos.length > 0) && (
          <div className="space-y-2 mt-4">
            {/* Documentos existentes */}
            {data.examenes_indicados_archivos_existentes.map((file, index) => (
              <div key={`existing-file-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-md group hover:bg-gray-100">
                <div className="flex items-center min-w-0">
                  <div className="flex-shrink-0 bg-blue-100 p-2 rounded-md">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-3 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{file.original_name || file.name}</p>
                    <p className="text-xs text-gray-500">{file.size ? formatFileSize(file.size) : 'Tamaño no disponible'}</p>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={file.url || `/storage/${file.path}`}
                    download={file.original_name || file.name}
                    className="text-gray-500 hover:text-blue-600 p-1"
                    title="Descargar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingFile(index, 'archivos')}
                    className="text-gray-500 hover:text-red-600 p-1"
                    title="Eliminar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* Nuevos documentos */}
            {previewArchivos.map((file, index) => (
              <div key={`new-file-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-md group hover:bg-gray-100">
                <div className="flex items-center min-w-0">
                  <div className="flex-shrink-0 bg-blue-100 p-2 rounded-md">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-3 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.size ? formatFileSize(file.size) : 'Tamaño no disponible'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveArchivo(index, 'archivos')}
                  className="text-gray-500 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
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
                                                {/*REFRACCION */}
                                                {expandedSections.refraccion && (
                                                <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                    <div className="p-4">
                                                    <p className="text-sm text-gray-500 mb-4">
                                                        Complete los resultados del examen de refracción.
                                                    </p>
                                                    <Refraccion 
                                                        data={data} 
                                                        setData={setData}
                                                        edadPaciente={parseInt(data.edad) || 0}
                                                        readOnly={false}
                                                        initialData={consulta.refraccion || {}}
                                                    />
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
                                                        Hallazgos del examen de fondo de ojo.
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
                                                        initialValues={{
                                                        // Pasa los valores existentes del fondo de ojo
                                                        fondo_ojo_retina_p_od: consulta.fondo_ojo_retina_p_od,
                                                        fondo_ojo_macula_od: consulta.fondo_ojo_macula_od,
                                                        fondo_ojo_vitreo_od: consulta.fondo_ojo_vitreo_od,
                                                        fondo_ojo_disco_o_od: consulta.fondo_ojo_disco_o_od,
                                                        fondo_ojo_vasos_od: consulta.fondo_ojo_vasos_od,
                                                        fondo_ojo_retina_p_oi: consulta.fondo_ojo_retina_p_oi,
                                                        fondo_ojo_macula_oi: consulta.fondo_ojo_macula_oi,
                                                        fondo_ojo_vitreo_oi: consulta.fondo_ojo_vitreo_oi,
                                                        fondo_ojo_disco_o_oi: consulta.fondo_ojo_disco_o_oi,
                                                        fondo_ojo_vasos_oi: consulta.fondo_ojo_vasos_oi,
                                                        }}
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
                                                            <Cie10Search 
                                                            onSelectResult={handleSelectResult}
                                                            initialSelected={data.impresion_diagnostica ? data.impresion_diagnostica.split('; ') : []}
                                                            />
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
                                                {/* 11. Archivos CIIT */}
                                                {expandedSections.ciitArchivos && (
                                                <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                    <div className="p-4">
                                                    <p className="text-sm text-gray-500 mb-4">
                                                        Adjunte archivos CIIT (imágenes, documentos o archivos comprimidos - máximo 4 archivos).
                                                    </p>
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700">Archivos CIIT</label>
                                                        <input
                                                        type="file"
                                                        onChange={handleFileChangeCiitFiles}
                                                        multiple
                                                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                        />
                                                        
                                                        {/* Archivos existentes y nuevos en una sola lista */}
                                                        <div className="mt-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Archivos</label>
{previewCiitFiles.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {previewCiitFiles.map((file, index) => (
    <div key={file.id || `new-${index}`} className="border rounded-md p-3 relative group hover:shadow-md transition-shadow">
      {file.type === 'image' ? (
        <img
          src={file.url || file.preview}
          alt={`Archivo CIIT ${index + 1}`}
          className="w-full h-32 object-contain rounded-md mb-2"
        />
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-md mb-2">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      )}
      
      <div className="absolute top-2 right-2 flex space-x-1">
        {file.url && (
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            download={file.type !== 'image'}
            className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition-colors"
            title={file.type === 'image' ? "Ver" : "Descargar"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {file.type === 'image' ? (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              )}
            </svg>
          </a>
        )}
        
        <button
          type="button"
          onClick={() => handleRemoveCiitFile(index)}
          className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
          title="Eliminar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      <div className="text-sm truncate mt-1">{file.name}</div>
      <div className="text-xs text-gray-500">
        {file.type === 'image' ? 'Imagen' : 
         file.type === 'compressed' ? 'Archivo comprimido' : 'Documento'}
        {file.isNew && ' (Nuevo)'}
      </div>
    </div>
  ))}
</div>
) : (
  <p className="text-gray-500 text-sm mt-2">No hay archivos CIIT adjuntos</p>
)}
                                                        </div>
                                                    </div>
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

      {/* Sección de Imágenes */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Exámenes Indicados (Imágenes)
            <span className="text-xs text-gray-500 ml-2">
              {data.examenes_indicados_img_existentes.length + previewImages.length}/4 archivos
            </span>
          </label>
          {data.examenes_indicados_img_existentes.length + previewImages.length < 4 && (
            <label className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-md cursor-pointer hover:bg-blue-100">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar
              <input
                type="file"
                onChange={handleFileChangeImages}
                multiple
                accept="image/*"
                className="hidden"
                disabled={data.examenes_indicados_img_existentes.length + previewImages.length >= 4}
              />
            </label>
          )}
        </div>

        {/* Mensaje cuando no hay imágenes */}
        {data.examenes_indicados_img_existentes.length === 0 && previewImages.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-1 text-sm text-gray-600">No hay imágenes adjuntas</p>
          </div>
        )}

        {/* Grid de imágenes existentes y nuevas */}
        {(data.examenes_indicados_img_existentes.length > 0 || previewImages.length > 0) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {/* Imágenes existentes */}
            {data.examenes_indicados_img_existentes.map((file, index) => (
              <div key={`existing-img-${index}`} className="relative group">
                <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={file.url || `/storage/${file.path}`}
                    alt={`Imagen ${file.original_name || file.name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=Imagen+no+disponible';
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                  <div className="flex space-x-2">
                    <a
                      href={file.url || `/storage/${file.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white bg-blue-500 p-2 rounded-full hover:bg-blue-600"
                      title="Ver imagen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingFile(index, 'img')}
                      className="text-white bg-red-500 p-2 rounded-full hover:bg-red-600"
                      title="Eliminar imagen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-600 truncate">{file.original_name || file.name}</div>
              </div>
            ))}

            {/* Nuevas imágenes (previews) */}
            {previewImages.map((image, index) => (
              <div key={`new-img-${index}`} className="relative group">
                <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={image.preview}
                    alt={`Previsualización ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index, 'img')}
                    className="text-white bg-red-500 p-2 rounded-full hover:bg-red-600"
                    title="Eliminar imagen"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="mt-1 text-xs text-gray-600 truncate">{image.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección de Documentos */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Exámenes Indicados (Documentos)
            <span className="text-xs text-gray-500 ml-2">
              {data.examenes_indicados_archivos_existentes.length + previewArchivos.length}/4 archivos
            </span>
          </label>
          {data.examenes_indicados_archivos_existentes.length + previewArchivos.length < 4 && (
            <label className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-md cursor-pointer hover:bg-blue-100">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar
              <input
                type="file"
                onChange={handleFileChangeArchivos}
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                className="hidden"
                disabled={data.examenes_indicados_archivos_existentes.length + previewArchivos.length >= 4}
              />
            </label>
          )}
        </div>

        {/* Mensaje cuando no hay documentos */}
        {data.examenes_indicados_archivos_existentes.length === 0 && previewArchivos.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-1 text-sm text-gray-600">No hay documentos adjuntos</p>
          </div>
        )}

        {/* Lista de documentos existentes y nuevos */}
        {(data.examenes_indicados_archivos_existentes.length > 0 || previewArchivos.length > 0) && (
          <div className="space-y-2 mt-4">
            {/* Documentos existentes */}
            {data.examenes_indicados_archivos_existentes.map((file, index) => (
              <div key={`existing-file-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-md group hover:bg-gray-100">
                <div className="flex items-center min-w-0">
                  <div className="flex-shrink-0 bg-blue-100 p-2 rounded-md">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-3 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{file.original_name || file.name}</p>
                    <p className="text-xs text-gray-500">{file.size ? formatFileSize(file.size) : 'Tamaño no disponible'}</p>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={file.url || `/storage/${file.path}`}
                    download={file.original_name || file.name}
                    className="text-gray-500 hover:text-blue-600 p-1"
                    title="Descargar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingFile(index, 'archivos')}
                    className="text-gray-500 hover:text-red-600 p-1"
                    title="Eliminar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* Nuevos documentos */}
            {previewArchivos.map((file, index) => (
              <div key={`new-file-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-md group hover:bg-gray-100">
                <div className="flex items-center min-w-0">
                  <div className="flex-shrink-0 bg-blue-100 p-2 rounded-md">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-3 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.size ? formatFileSize(file.size) : 'Tamaño no disponible'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveArchivo(index, 'archivos')}
                  className="text-gray-500 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
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