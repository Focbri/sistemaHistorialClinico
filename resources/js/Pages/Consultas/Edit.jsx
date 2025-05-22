import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import React, { useState, useEffect, useCallback, useRef } from 'react';

import PacienteForm from '@/Components/PacienteForm';
import Cie10Search from '@/Components/Cie10Search';
import AntecedentesPersonales from '@/Components/AntecedentesPersonales';
import ExamenOcular from '@/Components/ExamenOcular';
import Refraccion from '@/Components/Refraccion';
import FondoOjo from '@/Components/FondoOjo';
import RecetaMedica from '@/Components/RecetaMedica';
import TerminoBiomicroscopiaSearch from '@/Components/TerminoBiomicroscopiaSearch';
import TerminoMotivoConsultaSearch from '@/Components/TerminoMotivoConsultaSearch';

export default function ConsultasEdit({ auth, consulta }) {
    console.log('Receta recibida:', consulta.receta);
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
        motivo_consulta_inicio: consulta?.motivo_consulta_inicio || '',
        motivo_consulta_signos: consulta?.motivo_consulta_signos || '',
        motivo_consulta_enfermedad: consulta?.motivo_consulta_enfermedad || '',
        motivo_consulta_otros: consulta?.motivo_consulta_otros || '',
        impresion_diagnostica: consulta?.impresion_diagnostica || '',
        tratamiento: consulta?.tratamiento || '',
        plan: consulta?.plan || '',
        examenes_indicados_img: [], // New images to upload
        examenes_indicados_archivos: [], // New files to upload
        examenes_indicados_img_existentes: parseFileData(consulta?.examenes_indicados_img),
        examenes_indicados_archivos_existentes: parseFileData(consulta?.examenes_indicados_archivos),
        evoluciones: consulta?.evoluciones || '',
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
        
        // Receta fields
        receta: consulta?.receta || null,
        comentario: consulta?.comentario || '',
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
        recetas: false,
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
    const [pacienteEncontrado, setPacienteEncontrado] = useState(true); // Starts as true since we're editing

    const [previewCiitFiles, setPreviewCiitFiles] = useState([]);

    const handleFileChangeCiitFiles = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + (data.ciit_archivos ? data.ciit_archivos.length : 0) > 4) {
            alert('Solo puedes subir un máximo de 4 archivos CIIT.');
            return;
        }

        const newFiles = files.map((file) => ({
            file,
            name: file.name,
            type: file.type.startsWith('image/') ? 'image' : 
                file.type === 'application/zip' || file.type === 'application/x-rar-compressed' ? 'compressed' : 'file'
        }));

        setData('ciit_archivos', [...(data.ciit_archivos || []), ...files]);
        setPreviewCiitFiles([...previewCiitFiles, ...newFiles]);
    };

    // Manejador para eliminar archivos CIIT
    const handleRemoveCiitFile = (index) => {
    // Si es un archivo existente (tiene id)
    if (previewCiitFiles[index]?.id) {
        const fileToDelete = previewCiitFiles[index];
        setFilesToDelete(prev => [...prev, fileToDelete]);
    }
    
    // Actualiza los estados
    const updatedPreviews = [...previewCiitFiles];
    updatedPreviews.splice(index, 1);
    setPreviewCiitFiles(updatedPreviews);

    // Si es un archivo nuevo en data.ciit_archivos
    if (data.ciit_archivos && data.ciit_archivos[index]) {
        const updatedFiles = [...data.ciit_archivos];
        updatedFiles.splice(index, 1);
        setData('ciit_archivos', updatedFiles);
    }
    };
    // File handling
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

    // Marker click handlers
    const handleMarkerClick = (marcador) => {
        setMarcadorActivo(marcador.id === marcadorActivo ? null : marcador.id);
    };

    const handleMarkerClickOI = (marcadorOI) => {
        setMarcadorActivoOI(marcadorOI.id === marcadorActivoOI ? null : marcadorOI.id);
    };

    // File handling functions
    const handleFileChangeImages = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + data.examenes_indicados_img.length + data.examenes_indicados_img_existentes.length > 4) {
            alert('Solo puedes subir un máximo de 4 imágenes en total.');
            return;
    }

    const newImages = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
    }));

    setData('examenes_indicados_img', [...data.examenes_indicados_img, ...files]);
    setPreviewImages([...previewImages, ...newImages]);
};

const handleFileChangeArchivos = (e) => {
    const files = Array.from(e.target.files);
    setData('examenes_indicados_archivos', [...data.examenes_indicados_archivos, ...files]);
    setPreviewArchivos([...previewArchivos, ...files]);
};

    const handleRemoveImage = (index, type) => {
    if (type === 'img') {
        const updatedImages = [...data.examenes_indicados_img];
        updatedImages.splice(index, 1);

        const updatedPreviews = [...previewImages];
        URL.revokeObjectURL(updatedPreviews[index].preview);
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

const handleRemoveExistingFile = (index, type) => {
    if (type === 'img') {
        const updatedFiles = [...data.examenes_indicados_img_existentes];
        setFilesToDelete([...filesToDelete, updatedFiles[index]]);
        updatedFiles.splice(index, 1);
        setData('examenes_indicados_img_existentes', updatedFiles);
    } else {
        const updatedFiles = [...data.examenes_indicados_archivos_existentes];
        setFilesToDelete([...filesToDelete, updatedFiles[index]]);
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate receta if exists
        if (data.receta?.medicamentos?.length > 0) {
            const errorReceta = validarReceta(data.receta);
            if (errorReceta) {
                setErrorReceta(errorReceta);
                toggleSection('recetas');
                return;
            }
        }

        const formData = new FormData();
        formData.append('_method', 'PUT');

        // Add all form data except files
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

        // Add files to delete
        if (filesToDelete.length > 0) {
            formData.append('files_to_delete', JSON.stringify(filesToDelete));
        }

        // Add new images
        data.examenes_indicados_img.forEach((file, index) => {
            formData.append(`examenes_indicados_img[${index}]`, file);
        });

        // Add new files
        data.examenes_indicados_archivos.forEach((file, index) => {
            formData.append(`examenes_indicados_archivos[${index}]`, file);
        });

        // Agregar nuevos archivos CIIT
        if (data.ciit_archivos) {
            data.ciit_archivos.forEach((file, index) => {
            if (file.file) { // Solo si es un archivo nuevo (tiene la propiedad file)
                formData.append(`ciit_archivos[${index}]`, file.file);
            }
            });
        }

        // Submit the form
        router.post(route('consultas.update', consulta.id), formData, {
            preserveScroll: true,
            onSuccess: () => {
                // Clear states after success
                setPreviewImages([]);
                setPreviewArchivos([]);
                setFilesToDelete([]);
            },
            onError: (errors) => {
                console.error('Errores al enviar:', errors);
            }
        });
    };
useEffect(() => {
  if (consulta.ciit_archivos) {
    // Verifica si ciit_archivos es un string (podría estar serializado)
    let archivos = consulta.ciit_archivos;
    if (typeof archivos === 'string') {
      try {
        archivos = JSON.parse(archivos);
      } catch (e) {
        console.error('Error parsing ciit_archivos:', e);
        archivos = [];
      }
    }
    
    // Asegúrate de que es un array
    if (!Array.isArray(archivos)) {
      archivos = [];
    }

    // Mapea los archivos al formato esperado
    const existingFiles = archivos.map(file => ({
      ...file,
      type: file.mime_type ? 
        (file.mime_type.startsWith('image/') ? 'image' : 
         file.mime_type === 'application/zip' || file.mime_type === 'application/x-rar-compressed' ? 'compressed' : 'file') :
        'file'
    }));
    
    setPreviewCiitFiles(existingFiles);
  }
}, [consulta]);

const normalizedReceta = consulta.receta ? {
  ...consulta.receta,
  cie10_codes: Array.isArray(consulta.receta.cie10_codes) ? 
    consulta.receta.cie10_codes : 
    (consulta.receta.cie10_codes ? [consulta.receta.cie10_codes] : []),
  medicamentos: Array.isArray(consulta.receta.medicamentos) ?
    consulta.receta.medicamentos :
    []
} : null;

    // Validate receta function (same as create.jsx)
    const validarReceta = (receta) => {
        if (!receta || !receta.medicamentos || receta.medicamentos.length === 0) {
            return null;
        }
        
        for (const med of receta.medicamentos) {
            if (!med.cantidad || med.cantidad <= 0) {
                return `La cantidad para ${med.nombre_comercial} debe ser mayor a cero`;
            }
            if (!med.dosis || med.dosis.trim() === '') {
                return `La dosis para ${med.nombre_comercial} es requerida`;
            }
            if (!med.frecuencia || med.frecuencia.trim() === '') {
                return `La frecuencia para ${med.nombre_comercial} es requerida`;
            }
            if (!med.duracion || med.duracion.trim() === '') {
                return `La duración para ${med.nombre_comercial} es requerida`;
            }
        }
        
        return null;
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
                                                            e.target.src = 'https://via.placeholder.com/150';
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
                                                        onClick={() => toggleSection('recetas')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.recetas ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Recetas
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
                                                        onClick={() => toggleSection('recetas')}
                                                        className={`w-full text-left px-4 py-2 rounded ${expandedSections.recetas ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    >
                                                        Recetas
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
                                                {/* 10. Receta Médica */}
                                                {expandedSections.recetas && (
<RecetaMedica
  consultaId={consulta.id}
  pacienteId={consulta.paciente_id}
  medicoId={consulta.user_id}
  recetaData={consulta.receta ? {
    ...consulta.receta,
    medicamentos: consulta.receta.all_medicamentos || [], // Usar all_medicamentos aquí
    cie10_codes: consulta.receta.cie10_codes || []
  } : null}
/>
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
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                            {/* Combinar archivos existentes y nuevos para mostrar */}
                                                            {[...previewCiitFiles, ...(data.ciit_archivos || [])].map((file, index) => (
                                                            <div key={`file-${index}`} className="border rounded-md p-3 relative group hover:shadow-md transition-shadow">
                                                                {/* Contenido del archivo */}
                                                                {file.type === 'image' ? (
                                                                <>
                                                                    <img
                                                                    src={file.url || `/storage/${file.path}` || URL.createObjectURL(file.file)}
                                                                    alt={`Archivo CIIT ${index + 1}`}
                                                                    className="w-full h-32 object-contain rounded-md mb-2"
                                                                    />
                                                                </>
                                                                ) : (
                                                                <div className="flex flex-col h-full">
                                                                    <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-md mb-2">
                                                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                    </svg>
                                                                    </div>
                                                                </div>
                                                                )}
                                                                
                                                                {/* Botones de acción - siempre visibles */}
                                                                <div className="absolute top-2 right-2 flex space-x-1">
                                                                {/* Botón de descarga/visualización */}
                                                                {file.url || file.path ? (
                                                                    <a
                                                                    href={file.url || `/storage/${file.path}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    download={!file.type?.startsWith('image/')}
                                                                    className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition-colors"
                                                                    title={file.type?.startsWith('image/') ? "Ver" : "Descargar"}
                                                                    >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        {file.type?.startsWith('image/') ? (
                                                                        <>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                        </>
                                                                        ) : (
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                        )}
                                                                    </svg>
                                                                    </a>
                                                                ) : null}
                                                                
                                                                {/* Botón de eliminación */}
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
                                                                
                                                                {/* Información del archivo */}
                                                                <div className="text-sm truncate mt-1">{file.original_name || file.name}</div>
                                                                <div className="text-xs text-gray-500">
                                                                {file.type === 'image' ? 'Imagen' : 
                                                                file.type === 'compressed' ? 'Archivo comprimido' : 'Documento'}
                                                                </div>
                                                            </div>
                                                            ))}
                                                        </div>
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
                                                {/* 10. Receta Médica */}
                                                {expandedSections.recetas && (
<RecetaMedica
  consultaId={consulta.id}
  pacienteId={consulta.paciente_id}
  medicoId={consulta.user_id}
  recetaData={consulta.receta ? {
    ...consulta.receta,
    medicamentos: consulta.receta.all_medicamentos || [], // Usar all_medicamentos aquí
    cie10_codes: consulta.receta.cie10_codes || []
  } : null}
/>
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
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                            {/* Combinar archivos existentes y nuevos para mostrar */}
                                                            {[...previewCiitFiles, ...(data.ciit_archivos || [])].map((file, index) => (
                                                            <div key={`file-${index}`} className="border rounded-md p-3 relative group hover:shadow-md transition-shadow">
                                                                {/* Contenido del archivo */}
                                                                {file.type === 'image' ? (
                                                                <>
                                                                    <img
                                                                    src={file.url || `/storage/${file.path}` || URL.createObjectURL(file.file)}
                                                                    alt={`Archivo CIIT ${index + 1}`}
                                                                    className="w-full h-32 object-contain rounded-md mb-2"
                                                                    />
                                                                </>
                                                                ) : (
                                                                <div className="flex flex-col h-full">
                                                                    <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-md mb-2">
                                                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                    </svg>
                                                                    </div>
                                                                </div>
                                                                )}
                                                                
                                                                {/* Botones de acción - siempre visibles */}
                                                                <div className="absolute top-2 right-2 flex space-x-1">
                                                                {/* Botón de descarga/visualización */}
                                                                {file.url || file.path ? (
                                                                    <a
                                                                    href={file.url || `/storage/${file.path}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    download={!file.type?.startsWith('image/')}
                                                                    className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition-colors"
                                                                    title={file.type?.startsWith('image/') ? "Ver" : "Descargar"}
                                                                    >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        {file.type?.startsWith('image/') ? (
                                                                        <>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                        </>
                                                                        ) : (
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                        )}
                                                                    </svg>
                                                                    </a>
                                                                ) : null}
                                                                
                                                                {/* Botón de eliminación */}
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
                                                                
                                                                {/* Información del archivo */}
                                                                <div className="text-sm truncate mt-1">{file.original_name || file.name}</div>
                                                                <div className="text-xs text-gray-500">
                                                                {file.type === 'image' ? 'Imagen' : 
                                                                file.type === 'compressed' ? 'Archivo comprimido' : 'Documento'}
                                                                </div>
                                                            </div>
                                                            ))}
                                                        </div>
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
                                                    
                                                    {/* Imágenes existentes */}
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700">Imágenes existentes</label>
                                                        <div className="mt-4 flex flex-wrap gap-2">
                                                        {data.examenes_indicados_img_existentes.map((file, index) => (
                                                            <div key={`exist-img-${index}`} className="relative group">
                                                            {file.type === 'image' ? (
                                                                <>
                                                                <img
                                                                    src={file.url || `/storage/${file.path}`}
                                                                    alt={`Imagen ${file.original_name}`}
                                                                    className="w-24 h-24 object-cover rounded-md border border-gray-200"
                                                                />
                                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                                                    <a 
                                                                    href={file.url || `/storage/${file.path}`} 
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-white bg-blue-500 p-1 rounded mr-1"
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
                                                                    className="text-white bg-red-500 p-1 rounded"
                                                                    title="Eliminar imagen"
                                                                    >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                    </button>
                                                                </div>
                                                                </>
                                                            ) : (
                                                                <div className="bg-gray-100 p-2 rounded-md flex items-center">
                                                                <span className="text-sm truncate max-w-xs">{file.original_name}</span>
                                                                </div>
                                                            )}
                                                            </div>
                                                        ))}
                                                        </div>
                                                    </div>

                                                    {/* Nuevas imágenes */}
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700">Agregar nuevas imágenes</label>
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

                                                    {/* Documentos existentes */}
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700">Documentos existentes</label>
                                                        <div className="mt-4 flex flex-wrap gap-2">
                                                        {data.examenes_indicados_archivos_existentes.map((file, index) => (
                                                            <div key={`exist-file-${index}`} className="relative bg-gray-100 p-2 rounded-md flex items-center">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-700 truncate">{file.original_name}</p>
                                                                <p className="text-xs text-gray-500">{file.type === 'image' ? 'Imagen' : 'Documento'}</p>
                                                            </div>
                                                            <div className="flex space-x-1 ml-2">
                                                                <a 
                                                                href={file.url || `/storage/${file.path}`} 
                                                                download={file.original_name}
                                                                className="text-blue-500 hover:text-blue-700 p-1"
                                                                title="Descargar"
                                                                >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                </svg>
                                                                </a>
                                                                <button
                                                                type="button"
                                                                onClick={() => handleRemoveExistingFile(index, 'archivos')}
                                                                className="text-red-500 hover:text-red-700 p-1"
                                                                title="Eliminar"
                                                                >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                                </button>
                                                            </div>
                                                            </div>
                                                        ))}
                                                        </div>
                                                    </div>

                                                    {/* Nuevos documentos */}
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700">Agregar nuevos documentos</label>
                                                        <input
                                                        type="file"
                                                        onChange={handleFileChangeArchivos}
                                                        multiple
                                                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                        />
                                                        <div className="mt-4 flex flex-wrap gap-2">
                                                        {previewArchivos.map((archivo, index) => (
                                                            <div key={index} className="relative bg-gray-100 p-2 rounded-md">
                                                            <span className="text-sm">{archivo.name}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveImage(index, 'archivos')}
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