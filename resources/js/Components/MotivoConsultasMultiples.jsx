import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const MotivoConsultaMultiples = ({ consultaId, initialValues, readOnly = false }) => {
    // Definir los tipos de términos
    const TIPOS = {
        INICIO: 'inicio',
        SIGNOS_SINTOMAS: 'signos_sintomas',
        TIPO_ENFERMEDAD: 'tipo_enfermedad',
        OTROS: 'otros'
    };

    // Estado para cada tipo de término
    const [state, setState] = useState({
        terminos: {
            [TIPOS.INICIO]: initialValues?.inicio || [],
            [TIPOS.SIGNOS_SINTOMAS]: initialValues?.signos_sintomas || [],
            [TIPOS.TIPO_ENFERMEDAD]: initialValues?.tipo_enfermedad || [],
            [TIPOS.OTROS]: initialValues?.otros || []
        },
        busquedas: {
            [TIPOS.INICIO]: '',
            [TIPOS.SIGNOS_SINTOMAS]: '',
            [TIPOS.TIPO_ENFERMEDAD]: '',
            [TIPOS.OTROS]: ''
        },
        resultados: {
            [TIPOS.INICIO]: [],
            [TIPOS.SIGNOS_SINTOMAS]: [],
            [TIPOS.TIPO_ENFERMEDAD]: [],
            [TIPOS.OTROS]: []
        },
        dropdowns: {
            [TIPOS.INICIO]: false,
            [TIPOS.SIGNOS_SINTOMAS]: false,
            [TIPOS.TIPO_ENFERMEDAD]: false,
            [TIPOS.OTROS]: false
        }
    });

    // Efecto para sincronizar valores iniciales
    useEffect(() => {
        if (initialValues) {
            setState(prev => ({
                ...prev,
                terminos: {
                    [TIPOS.INICIO]: initialValues.inicio || [],
                    [TIPOS.SIGNOS_SINTOMAS]: initialValues.signos_sintomas || [],
                    [TIPOS.TIPO_ENFERMEDAD]: initialValues.tipo_enfermedad || [],
                    [TIPOS.OTROS]: initialValues.otros || []
                }
            }));
        }
    }, [initialValues]);

    // Buscar términos en el servidor
    const buscarTerminos = useCallback(async (tipo, query) => {
        if (!query.trim() || readOnly) {
            setState(prev => ({
                ...prev,
                resultados: { ...prev.resultados, [tipo]: [] },
                dropdowns: { ...prev.dropdowns, [tipo]: false }
            }));
            return;
        }

        try {
            const response = await axios.get('/terminos-motivo-consulta/search', {
                params: { tipo, query }
            });
            
            setState(prev => ({
                ...prev,
                resultados: { ...prev.resultados, [tipo]: response.data },
                dropdowns: { ...prev.dropdowns, [tipo]: response.data.length > 0 }
            }));
        } catch (error) {
            console.error(`Error buscando ${tipo}:`, error);
            setState(prev => ({
                ...prev,
                resultados: { ...prev.resultados, [tipo]: [] },
                dropdowns: { ...prev.dropdowns, [tipo]: false }
            }));
        }
    }, [readOnly]);

    // Debounce para búsquedas
    const debouncedSearch = useCallback((tipo, query) => {
        const timer = setTimeout(() => buscarTerminos(tipo, query), 300);
        return () => clearTimeout(timer);
    }, [buscarTerminos]);

    // Manejar cambios en los inputs de búsqueda
    const handleSearch = async (tipo, query) => {
        if (!consultaId) {
          // Si no hay consultaId, no hacemos la búsqueda
          console.log("Modo creación: búsqueda deshabilitada");
          return [];
        }
        
        try {
          const response = await axios.get(`/terminos-motivo-consulta/search`, {
            params: { tipo, query, consulta_id: consultaId }
          });
          return response.data;
        } catch (error) {
          console.error(`Error buscando ${tipo}:`, error);
          return [];
        }
    };
      
      const handleAddTerm = (tipo, term) => {
        if (!consultaId) {
          // En modo creación, guardamos en el estado local
          setLocalTerms(prev => ({
            ...prev,
            [tipo]: [...prev[tipo], term]
          }));
          return;
        }
      };

    // Eliminar término existente
    const eliminarTermino = useCallback(async (tipo, index) => {
        if (readOnly) return;

        const termino = state.terminos[tipo][index];
        
        try {
            await axios.delete('/terminos-motivo-consulta', {
                data: {
                    consulta_id: consultaId,
                    termino_mc: termino,
                    tipo
                }
            });

            setState(prev => ({
                ...prev,
                terminos: {
                    ...prev.terminos,
                    [tipo]: prev.terminos[tipo].filter((_, i) => i !== index)
                }
            }));

        } catch (error) {
            console.error(`Error eliminando término ${tipo}:`, error);
        }
    }, [consultaId, readOnly, state.terminos]);

    // Renderizar un campo individual
    const renderCampoMotivo = (tipo, label) => (
        <div className={`mb-6 p-4 border border-gray-200 rounded-lg ${readOnly ? 'bg-gray-50' : 'bg-white'}`}>
            <h3 className="text-lg font-medium text-gray-800 mb-3">{label}</h3>
            
            <div className="flex gap-2 mb-3">
                <input
                    type="text"
                    value={state.busquedas[tipo]}
                    onChange={(e) => handleBusquedaChange(tipo, e.target.value)}
                    placeholder={readOnly ? "" : `Buscar ${label.toLowerCase()}...`}
                    className={`flex-1 p-2 border rounded-md ${
                        readOnly ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                    }`}
                    onFocus={() => !readOnly && state.busquedas[tipo] && setState(prev => ({
                        ...prev,
                        dropdowns: { ...prev.dropdowns, [tipo]: true }
                    }))}
                    onBlur={() => setTimeout(() => setState(prev => ({
                        ...prev,
                        dropdowns: { ...prev.dropdowns, [tipo]: false }
                    })), 200)}
                    disabled={readOnly}
                />
                
                {!readOnly && (
                    <button
                        type="button"
                        onClick={() => agregarTermino(tipo, state.busquedas[tipo])}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                        disabled={!state.busquedas[tipo].trim()}
                    >
                        Agregar
                    </button>
                )}
            </div>

            {!readOnly && state.dropdowns[tipo] && state.resultados[tipo].length > 0 && (
                <ul className="max-h-40 overflow-y-auto border rounded bg-white z-10 absolute w-[calc(100%-32px)] shadow-lg">
                    {state.resultados[tipo].map((result, i) => (
                        <li
                            key={i}
                            onClick={() => agregarTermino(tipo, result)}
                            className="p-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                            {result}
                        </li>
                    ))}
                </ul>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
                {state.terminos[tipo].length > 0 ? (
                    state.terminos[tipo].map((termino, i) => (
                        <div key={i} className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 flex items-center">
                            <span className="text-sm mr-1">{termino}</span>
                            {!readOnly && (
                                <button
                                    type="button"
                                    onClick={() => eliminarTermino(tipo, i)}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <span className="text-gray-400 text-sm">
                        {readOnly ? 'No hay términos' : 'No hay términos agregados'}
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-4 relative">
            {renderCampoMotivo(TIPOS.INICIO, 'Inicio')}
            {renderCampoMotivo(TIPOS.SIGNOS_SINTOMAS, 'Signos y Síntomas')}
            {renderCampoMotivo(TIPOS.TIPO_ENFERMEDAD, 'Tipo de Enfermedad')}
            {renderCampoMotivo(TIPOS.OTROS, 'Otros')}
        </div>
    );
};

export default MotivoConsultaMultiples;