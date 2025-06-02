import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

import PacienteForm from '@/Components/PacienteForm';
import Cie10Search from '@/Components/Cie10Search';
import AntecedentesPersonales from '@/Components/AntecedentesPersonales';
import ExamenOcular from '@/Components/ExamenOcular';
import Refraccion from '@/Components/Refraccion';
import FondoOjo from '@/Components/FondoOjo';
import TerminoBiomicroscopiaSearch from '@/Components/TerminoBiomicroscopiaSearch';
import TerminoMotivoConsultaSearch from '@/Components/TerminoMotivoConsultaSearch';

export default function ConsultasShow({ auth, consulta }) {
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
        comentarios: false,
    });

    // UI state
    const [historialDiagnosticos, setHistorialDiagnosticos] = useState([]);
    // Marker states (solo para visualización)
    const [marcadorActivo, setMarcadorActivo] = useState(null);
    const [marcadorActivoOI, setMarcadorActivoOI] = useState(null);

    // Selected CIE10 results (solo visualización)
    const [selectedResults] = useState(
        consulta?.impresion_diagnostica ? consulta.impresion_diagnostica.split('; ').filter(Boolean) : []
    );

    // Markers configuration
    const marcadores = [
        { id: 1, campo: 'fondo_ojo_vitreo_od', color: 'blue', subtitulo: 'Vítreo' },
        { id: 2, campo: 'fondo_ojo_macula_od', color: 'red', subtitulo: 'Mácula' },
        { id: 3, campo: 'fondo_ojo_retina_p_od', color: 'green', subtitulo: 'Retina Periférica' },
        { id: 4, campo: 'fondo_ojo_disco_o_od', color: 'purple', subtitulo: 'Disco Óptico' },
        { id: 5, campo: 'fondo_ojo_vasos_od', color: 'orange', subtitulo: 'Vasos Sanguíneos' },
    ];

    const marcadoresOI = [
        { id: 1, campo: 'fondo_ojo_vitreo_oi', color: 'blue', subtitulo: 'Vítreo OI' },
        { id: 2, campo: 'fondo_ojo_macula_oi', color: 'red', subtitulo: 'Mácula' },
        { id: 3, campo: 'fondo_ojo_retina_p_oi', color: 'green', subtitulo: 'Retina Periférica' },
        { id: 4, campo: 'fondo_ojo_disco_o_oi', color: 'purple', subtitulo: 'Disco Óptico' },
        { id: 5, campo: 'fondo_ojo_vasos_oi', color: 'orange', subtitulo: 'Vasos Sanguíneos' },
    ];

    // Toggle section function
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Load diagnostic history
    useEffect(() => {
        if (consulta?.paciente_id) {
            cargarHistorialDiagnosticos();
        }
    }, [consulta?.paciente_id]);

    const cargarHistorialDiagnosticos = async () => {
        try {
            const response = await fetch(`/consultas/historial-diagnosticos/${consulta.paciente_id}`);
            if (response.ok) {
                const result = await response.json();
                setHistorialDiagnosticos(result.diagnosticos || []);
            }
        } catch (error) {
            console.error('Error cargando historial:', error);
        }
    };

    // Función para parsear datos de archivos
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

    // Obtener archivos para mostrar
    const examenesImagenes = parseFileData(consulta?.examenes_indicados_img);
    const examenesArchivos = parseFileData(consulta?.examenes_indicados_archivos);
    const ciitArchivos = parseFileData(consulta?.ciit_archivos);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Detalles de Consulta</h2>}
        >
            <Head title="Detalles de Consulta" />

            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm">
                    <div className="bg-[#FFFFFF]">
                        {/* Patient information section */}
                        <div className="py-4 px-4 bg-[#FFFFFF]">                                                                        
                            <div className='grid grid-cols-4 gap-4'>
                                {/* Column 1: Patient photo */}
                                <div className='flex flex-col items-center justify-center col-span-1'>
                                    <div className='w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-2 overflow-hidden'>
                                        {consulta?.paciente?.foto_perfil ? (
                                            <img 
                                                src={`/storage/${consulta.paciente.foto_perfil}`}
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
                                            {`${consulta?.paciente?.nombres || ''} ${consulta?.paciente?.apellido_paterno || ''} ${consulta?.paciente?.apellido_materno || ''}`.trim() || '-'}
                                        </p>
                                    </div>
                                    <div className='grid grid-cols-2'>
                                        <div className="mb-2">
                                            <p className="text-sm text-[#333333]">
                                                {`${consulta?.paciente?.fecha_nacimiento || ''} (${consulta?.paciente?.edad || ''} años)`.trim() || '-'}
                                            </p>
                                        </div>
                                        
                                        <div className="mb-2 flex gap-4">
                                            <p className="text-sm text-[#333333]">{`DNI: ${consulta?.paciente?.dni || ''}`.trim() || '-'}</p>
                                            <p className="text-sm text-[#333333]">{`Sexo: ${consulta?.paciente?.sexo || ''}`.trim() || '-'}</p>
                                        </div>
                                        
                                        <div className="mb-2">
                                            <p className="text-sm text-[#333333]">{`TELF: ${consulta?.paciente?.telefono || ''} / ${consulta?.paciente?.peso || ''} kg`.trim() || '-'}</p>
                                        </div>
                                        
                                        <div className="mb-2">
                                            <p className="text-sm text-[#333333]">{`EMAIL: ${consulta?.paciente?.email || ''}`.trim() || '-'}</p>
                                        </div>

                                        <div className="mb-2">
                                            <p className="text-sm text-[#333333]">{`ESTADO CIVIL: ${consulta?.paciente?.estado_civil || ''}`.trim() || '-'}</p>
                                        </div>

                                        <div className="mb-2">
                                            <p className="text-sm text-[#333333]">{`OCUPACION: ${consulta?.paciente?.ocupacion || ''}`.trim() || '-'}</p>
                                        </div>
                                        <div className="mb-2">
                                            <p className="text-sm text-[#333333]">{`PROCEDENCIA: ${consulta?.paciente?.procedencia || ''}`.trim() || '-'}</p>
                                        </div>

                                        <div className="mb-2">
                                            <p className="text-sm text-[#333333]">{`DOMICILIO: ${consulta?.paciente?.direccion || ''}`.trim() || '-'}</p>
                                        </div>
                                        <div className="mb-2">
                                            <p className="text-sm text-[#333333]">{`ACOMPAÑANTE: ${consulta?.paciente?.acompañante || ''}`.trim() || '-'}</p>
                                        </div>

                                        <div className="mb-2">
                                            <p className="text-sm text-[#333333]">{`REFERIDO: ${consulta?.paciente?.referido || ''}`.trim() || '-'}</p>
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
                                <div className="sticky top-4 space-y-2">
                                    <h3 className="text-2xl text-center mb-2 text-white">
                                        {consulta?.tipo_consulta === 'inicio' 
                                            ? 'Consulta Inicial' 
                                            : 'Consulta Evolución'}
                                    </h3>
                                    
                                    {consulta?.tipo_consulta === 'inicio' ? (
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
                                                onClick={() => toggleSection('comentarios')}
                                                className={`w-full text-left px-4 py-2 rounded ${expandedSections.comentarios ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                            >
                                                Comentarios
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
                                                onClick={() => toggleSection('comentarios')}
                                                className={`w-full text-left px-4 py-2 rounded ${expandedSections.comentarios ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}
                                            >
                                                Comentarios
                                            </button>
                                        </>
                                    )}
                                    <div className="flex items-center justify-center">
                                        <Link
                                            href={route('consultas.index')}
                                            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                                        >
                                            Volver
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Main content */}
                            <div className="flex-1 border-t-2 border-gray-200 p-4">
                                {consulta?.tipo_consulta === 'inicio' && (
                                    <>
                                        {/* 1. Antecedentes Personales */} 
                                        {expandedSections.antecedentesPersonales && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <div className="p-4">
                                                    <h4 className="text-lg font-semibold mb-4">Antecedentes Personales</h4>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">HTA:</label>
                                                            <p className="mt-1 p-2 bg-gray-50 rounded">{consulta.antecedentes_personales_hta || 'No especificado'}</p>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">DM:</label>
                                                            <p className="mt-1 p-2 bg-gray-50 rounded">{consulta.antecedentes_personales_dm || 'No especificado'}</p>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Alergias:</label>
                                                            <p className="mt-1 p-2 bg-gray-50 rounded">{consulta.antecedentes_personales_alergias || 'No especificado'}</p>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Otros:</label>
                                                            <p className="mt-1 p-2 bg-gray-50 rounded">{consulta.antecedentes_personales_otros || 'No especificado'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}                                                
                                        {/* 2. Antecedentes Patológicos Familiares */}
                                        {expandedSections.antecedentesFamiliares && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Antecedentes Familiares</h4>
                                                <div className="p-4 bg-gray-50 rounded">
                                                    {consulta.antecedentes_patologicos_familiares ? (
                                                        Array.isArray(consulta.antecedentes_patologicos_familiares) ? (
                                                            <ul className="list-disc pl-5 space-y-1">
                                                                {consulta.antecedentes_patologicos_familiares.map((item, i) => (
                                                                    <li key={i}>{item}</li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p>{consulta.antecedentes_patologicos_familiares}</p>
                                                        )
                                                    ) : (
                                                        <p className="text-gray-500">No especificado</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {/* 3. Cirugías Previas */}
                                        {expandedSections.cirugiasPrevias && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Cirugías Previas</h4>
                                                <div className="p-4 bg-gray-50 rounded">
                                                    <p className="whitespace-pre-wrap">{consulta.cirugias_previas || 'No especificado'}</p>
                                                </div>
                                            </div>
                                        )}
                                        {/* 4. Motivo de Consulta */}
                                        {expandedSections.motivoConsulta && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Motivo de Consulta</h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Inicio:</label>
                                                        <p className="mt-1 p-2 bg-gray-50 rounded">{consulta.motivo_consulta_inicio || 'No especificado'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Signos:</label>
                                                        <p className="mt-1 p-2 bg-gray-50 rounded">{consulta.motivo_consulta_signos || 'No especificado'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Enfermedad:</label>
                                                        <p className="mt-1 p-2 bg-gray-50 rounded">{consulta.motivo_consulta_enfermedad || 'No especificado'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Otros:</label>
                                                        <p className="mt-1 p-2 bg-gray-50 rounded">{consulta.motivo_consulta_otros || 'No especificado'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {/* 5. Examen Ocular */}
                                        {expandedSections.examenOcular && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Examen Ocular</h4>
                                                <ExamenOcular 
                                                    data={consulta.examen || {}} 
                                                    edadPaciente={consulta?.paciente?.edad} 
                                                    readOnly={true}
                                                />
                                            </div>
                                        )}
                                        {/* 6. Refracción */}
                                        {expandedSections.refraccion && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Refracción</h4>
                                                <Refraccion 
                                                    data={consulta.refraccion || {}}
                                                    edadPaciente={consulta?.paciente?.edad}
                                                    readOnly={true}
                                                />
                                            </div>
                                        )}
                                        {/* 7. Biomicroscopia */}
                                        {expandedSections.biomicroscopia && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Biomicroscopia</h4>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="font-medium">Examen Físico</div>
                                                    <div className="font-medium">OD</div>
                                                    <div className="font-medium">OI</div>
                                                    
                                                    <div>Movimientos Oculares</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_movoculares_od || '-'}</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_movoculares_oi || '-'}</div>
                                                    
                                                    <div>Párpados</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_parpados_od || '-'}</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_parpados_oi || '-'}</div>
                                                    
                                                    <div>Córnea</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_cornea_od || '-'}</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_cornea_oi || '-'}</div>
                                                    
                                                    <div>Conjuntiva</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_corneaconj_od || '-'}</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_corneaconj_oi || '-'}</div>
                                                    
                                                    <div>Cámara Anterior</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_ca_od || '-'}</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_ca_oi || '-'}</div>
                                                    
                                                    <div>Iris</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_iris_od || '-'}</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_iris_oi || '-'}</div>
                                                    
                                                    <div>Cristalino</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_cristalino_od || '-'}</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_cristalino_oi || '-'}</div>
                                                </div>
                                            </div>
                                        )}
                                        {/* 8. Fondo de Ojo */}
                                        {expandedSections.fondoOjo && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Fondo de Ojo</h4>
                                                <FondoOjo
                                                    marcadoresOD={marcadores}
                                                    marcadoresOI={marcadoresOI}
                                                    marcadorActivoOD={marcadorActivo}
                                                    marcadorActivoOI={marcadorActivoOI}
                                                    handleMarkerClickOD={setMarcadorActivo}
                                                    handleMarkerClickOI={setMarcadorActivoOI}
                                                    data={consulta}
                                                    setData={() => {}}
                                                    readOnly={true}
                                                />
                                            </div>
                                        )}
                                        {/* 9. Diagnóstico */}
                                        {expandedSections.diagnostico && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Diagnóstico</h4>
                                                <div className="p-4 bg-gray-50 rounded">
                                                    {selectedResults.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedResults.map((result, index) => (
                                                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                                    {result}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500">No se ha registrado diagnóstico</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {/* 10. Tratamiento */}
                                        {expandedSections.tratamiento && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Tratamiento</h4>
                                                <div className="p-4 bg-gray-50 rounded">
                                                    <p className="whitespace-pre-wrap">{consulta.tratamiento || 'No se ha registrado tratamiento'}</p>
                                                </div>
                                            </div>
                                        )}                                        
                                        {/* 12. Plan */}
                                        {expandedSections.plan && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Plan</h4>
                                                <div className="p-4 bg-gray-50 rounded">
                                                    <p className="whitespace-pre-wrap">{consulta.plan || 'No se ha registrado plan'}</p>
                                                </div>
                                            </div>
                                        )}
                                        {/* 13. Archivos CIIT */}
{expandedSections.ciitArchivos && (
  <div className="mb-6 p-4 border border-gray-200 rounded-md">
    <h4 className="text-lg font-semibold mb-4">Archivos CIIT</h4>
    <div className="p-4">
      {ciitArchivos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ciitArchivos.map((file, index) => (
            <div key={index} className="border rounded-md p-3 relative group hover:shadow-md transition-shadow">
              {file.type === 'image' ? (
                <img
                  src={`/storage/${file.path}`}
                  alt={`Archivo CIIT ${index + 1}`}
                  className="w-full h-32 object-contain rounded-md mb-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '';
                    e.target.parentElement.classList.add('bg-gray-200');
                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500">Imagen no disponible</div>';
                  }}
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
                <a
                  href={`/storage/${file.path}`}
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
              </div>
              
              <div className="text-sm truncate mt-1">{file.original_name || file.name}</div>
              <div className="text-xs text-gray-500">
                {file.type === 'image' ? 'Imagen' : 
                file.type === 'compressed' ? 'Archivo comprimido' : 'Documento'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p className="mt-1 text-sm text-gray-600">No hay archivos CIIT adjuntos</p>
        </div>
      )}
    </div>
  </div>
)}
                                        {/* 14. Exámenes Indicados */}
                                        {expandedSections.examenesIndicados && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Exámenes Indicados</h4>
                                                <div className="space-y-6">
                                                    {/* Imágenes */}
                                                    <div>
                                                        <h5 className="font-medium mb-2">Imágenes</h5>
                                                        {examenesImagenes.length > 0 ? (
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                {examenesImagenes.map((img, index) => (
                                                                    <div key={index} className="relative group">
                                                                        <img
                                                                            src={`/storage/${img.path}`}
                                                                            alt={`Examen imagen ${index + 1}`}
                                                                            className="w-full h-32 object-contain border rounded-md"
                                                                        />
                                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                                                            <a 
                                                                                href={`/storage/${img.path}`} 
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
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-gray-500">No hay imágenes adjuntas</p>
                                                        )}
                                                    </div>

                                                    {/* Documentos */}
                                                    <div>
                                                        <h5 className="font-medium mb-2">Documentos</h5>
                                                        {examenesArchivos.length > 0 ? (
                                                            <div className="space-y-2">
                                                                {examenesArchivos.map((file, index) => (
                                                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                                                        <div>
                                                                            <p className="text-sm font-medium">{file.original_name}</p>
                                                                            <p className="text-xs text-gray-500">{file.mime_type || 'Documento'}</p>
                                                                        </div>
                                                                        <a 
                                                                            href={`/storage/${file.path}`} 
                                                                            download={file.original_name}
                                                                            className="text-blue-500 hover:text-blue-700"
                                                                            title="Descargar"
                                                                        >
                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                            </svg>
                                                                        </a>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-gray-500">No hay documentos adjuntos</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {/* 12. Comentarios */}
                                        {expandedSections.comentarios && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Comentario</h4>
                                                <div className="p-4 bg-gray-50 rounded">
                                                    <p className="whitespace-pre-wrap">{consulta.comentario || 'No se ha registrado un comentario'}</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Similar structure for 'evolucion' type */}
                                {consulta?.tipo_consulta === 'evolucion' && (
                                    <>
                                        {/* Secciones para consultas de evolución */}
                                        {/* 1. Evoluciones */}
                                        {expandedSections.evoluciones && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Evoluciones</h4>
                                                <div className="p-4 bg-gray-50 rounded">
                                                    <p className="whitespace-pre-wrap">{consulta.evoluciones || 'No se han registrado evoluciones'}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* 2. Examen Ocular */}
                                        {expandedSections.examenOcular && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Examen Ocular</h4>
                                                <ExamenOcular 
                                                    data={consulta.examen || {}} 
                                                    edadPaciente={consulta?.paciente?.edad} 
                                                    readOnly={true}
                                                />
                                            </div>
                                        )}
                                        {/* 6. Refracción */}
                                        {expandedSections.refraccion && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Refracción</h4>
                                                <Refraccion 
                                                    data={consulta.refraccion || {}}
                                                    edadPaciente={consulta?.paciente?.edad}
                                                    readOnly={true}
                                                />
                                            </div>
                                        )}
                                        {/* 7. Biomicroscopia */}
                                        {expandedSections.biomicroscopia && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Biomicroscopia</h4>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="font-medium">Examen Físico</div>
                                                    <div className="font-medium">OD</div>
                                                    <div className="font-medium">OI</div>
                                                    
                                                    <div>Movimientos Oculares</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_movoculares_od || '-'}</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_movoculares_oi || '-'}</div>
                                                    
                                                    <div>Párpados</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_parpados_od || '-'}</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_parpados_oi || '-'}</div>
                                                    
                                                    <div>Córnea</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_cornea_od || '-'}</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_cornea_oi || '-'}</div>
                                                    
                                                    <div>Conjuntiva</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_corneaconj_od || '-'}</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_corneaconj_oi || '-'}</div>
                                                    
                                                    <div>Cámara Anterior</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_ca_od || '-'}</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_ca_oi || '-'}</div>
                                                    
                                                    <div>Iris</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_iris_od || '-'}</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_iris_oi || '-'}</div>
                                                    
                                                    <div>Cristalino</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_cristalino_od || '-'}</div>
                                                    <div className="p-2 bg-gray-50 rounded">{consulta.biomicroscopia_cristalino_oi || '-'}</div>
                                                </div>
                                            </div>
                                        )}
                                        {/* 8. Fondo de Ojo */}
                                        {expandedSections.fondoOjo && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Fondo de Ojo</h4>
                                                <FondoOjo
                                                    marcadoresOD={marcadores}
                                                    marcadoresOI={marcadoresOI}
                                                    marcadorActivoOD={marcadorActivo}
                                                    marcadorActivoOI={marcadorActivoOI}
                                                    handleMarkerClickOD={setMarcadorActivo}
                                                    handleMarkerClickOI={setMarcadorActivoOI}
                                                    data={consulta}
                                                    setData={() => {}}
                                                    readOnly={true}
                                                />
                                            </div>
                                        )}
                                        {/* 9. Diagnóstico */}
                                        {expandedSections.diagnostico && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Diagnóstico</h4>
                                                <div className="p-4 bg-gray-50 rounded">
                                                    {selectedResults.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedResults.map((result, index) => (
                                                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                                    {result}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500">No se ha registrado diagnóstico</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {/* 10. Tratamiento */}
                                        {expandedSections.tratamiento && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Tratamiento</h4>
                                                <div className="p-4 bg-gray-50 rounded">
                                                    <p className="whitespace-pre-wrap">{consulta.tratamiento || 'No se ha registrado tratamiento'}</p>
                                                </div>
                                            </div>
                                        )}
                                        {/* 12. Plan */}
                                        {expandedSections.plan && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Plan</h4>
                                                <div className="p-4 bg-gray-50 rounded">
                                                    <p className="whitespace-pre-wrap">{consulta.plan || 'No se ha registrado plan'}</p>
                                                </div>
                                            </div>
                                        )}
                                        {/* 13. Archivos CIIT */}
{expandedSections.ciitArchivos && (
  <div className="mb-6 p-4 border border-gray-200 rounded-md">
    <h4 className="text-lg font-semibold mb-4">Archivos CIIT</h4>
    <div className="p-4">
      {ciitArchivos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ciitArchivos.map((file, index) => (
            <div key={index} className="border rounded-md p-3 relative group hover:shadow-md transition-shadow">
              {file.type === 'image' ? (
                <img
                  src={`/storage/${file.path}`}
                  alt={`Archivo CIIT ${index + 1}`}
                  className="w-full h-32 object-contain rounded-md mb-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '';
                    e.target.parentElement.classList.add('bg-gray-200');
                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500">Imagen no disponible</div>';
                  }}
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
                <a
                  href={`/storage/${file.path}`}
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
              </div>
              
              <div className="text-sm truncate mt-1">{file.original_name || file.name}</div>
              <div className="text-xs text-gray-500">
                {file.type === 'image' ? 'Imagen' : 
                file.type === 'compressed' ? 'Archivo comprimido' : 'Documento'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p className="mt-1 text-sm text-gray-600">No hay archivos CIIT adjuntos</p>
        </div>
      )}
    </div>
  </div>
)}
                                        {/* 14. Exámenes Indicados */}
                                        {expandedSections.examenesIndicados && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Exámenes Indicados</h4>
                                                <div className="space-y-6">
                                                    {/* Imágenes */}
                                                    <div>
                                                        <h5 className="font-medium mb-2">Imágenes</h5>
                                                        {examenesImagenes.length > 0 ? (
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                {examenesImagenes.map((img, index) => (
                                                                    <div key={index} className="relative group">
                                                                        <img
                                                                            src={`/storage/${img.path}`}
                                                                            alt={`Examen imagen ${index + 1}`}
                                                                            className="w-full h-32 object-contain border rounded-md"
                                                                        />
                                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                                                            <a 
                                                                                href={`/storage/${img.path}`} 
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
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-gray-500">No hay imágenes adjuntas</p>
                                                        )}
                                                    </div>

                                                    {/* Documentos */}
                                                    <div>
                                                        <h5 className="font-medium mb-2">Documentos</h5>
                                                        {examenesArchivos.length > 0 ? (
                                                            <div className="space-y-2">
                                                                {examenesArchivos.map((file, index) => (
                                                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                                                        <div>
                                                                            <p className="text-sm font-medium">{file.original_name}</p>
                                                                            <p className="text-xs text-gray-500">{file.mime_type || 'Documento'}</p>
                                                                        </div>
                                                                        <a 
                                                                            href={`/storage/${file.path}`} 
                                                                            download={file.original_name}
                                                                            className="text-blue-500 hover:text-blue-700"
                                                                            title="Descargar"
                                                                        >
                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                            </svg>
                                                                        </a>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-gray-500">No hay documentos adjuntos</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {/* 12. Comentarios */}
                                        {expandedSections.comentarios && (
                                            <div className="mb-6 p-4 border border-gray-200 rounded-md">
                                                <h4 className="text-lg font-semibold mb-4">Comentario</h4>
                                                <div className="p-4 bg-gray-50 rounded">
                                                    <p className="whitespace-pre-wrap">{consulta.comentario || 'No se ha registrado un comentario'}</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}