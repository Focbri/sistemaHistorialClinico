import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Cie10Search = React.memo(({ 
    onSelectResult, 
    initialSelected = [], 
    maxSelections = 20,
    readOnly = false 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTerms, setSelectedTerms] = useState(initialSelected);
    const [showManualForm, setShowManualForm] = useState(false);
    const [codigo, setCodigo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState(null);

    // Formatear término para almacenamiento
    const formatTerm = (code, description) => {
        return code ? `${code}|${description}` : description;
    };

    // Parsear término almacenado
    const parseTerm = (term) => {
        const [code, ...descriptionParts] = term.split('|');
        return {
            code: code || '',
            description: descriptionParts.join('|') || term
        };
    };

    // Búsqueda de términos
    const searchTerms = useCallback(async (term) => {
        if (!term.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        setError(null);

        try {
            const response = await axios.get('/cie10/search', {
                params: { query: term },
                timeout: 5000
            });
            setSearchResults(response.data);
        } catch (err) {
            console.error('Error en búsqueda:', err);
            setError('Error al buscar términos. Intente nuevamente.');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    // Debounce para búsqueda
    useEffect(() => {
        const timer = setTimeout(() => searchTerms(searchTerm), 300);
        return () => clearTimeout(timer);
    }, [searchTerm, searchTerms]);

    // Manejar selección de término
    const handleSelectTerm = useCallback((term) => {
        if (readOnly || selectedTerms.includes(term)) return;

        if (selectedTerms.length >= maxSelections) {
            setError(`Límite: ${maxSelections} términos máximo`);
            return;
        }

        const newTerms = [...selectedTerms, term];
        setSelectedTerms(newTerms);
        onSelectResult(newTerms);
        setSearchTerm('');
        setSearchResults([]);
    }, [onSelectResult, selectedTerms, maxSelections, readOnly]);

    // Agregar término manualmente
    const handleAddManualTerm = useCallback(async () => {
        if (readOnly || !descripcion.trim()) {
            setError('La descripción es obligatoria');
            return;
        }

        const term = formatTerm(codigo.trim(), descripcion.trim());

        if (selectedTerms.includes(term)) {
            setError('Este término ya fue agregado');
            return;
        }

        if (selectedTerms.length >= maxSelections) {
            setError(`Límite: ${maxSelections} términos máximo`);
            return;
        }

        try {
            // Guardar en backend si es necesario
            await axios.post('/cie10', { 
                termino: term,
                list_01: term // Enviar el formato unificado
            });

            handleSelectTerm(term);
            setCodigo('');
            setDescripcion('');
            setShowManualForm(false);
            setError(null);
        } catch (err) {
            console.error('Error al guardar:', err);
            // Agregar igualmente el término localmente
            handleSelectTerm(term);
            setError('El término se agregó pero no se pudo guardar en el catálogo');
        }
    }, [codigo, descripcion, handleSelectTerm, maxSelections, readOnly, selectedTerms]);

    // Eliminar término
    const handleRemoveTerm = useCallback((index) => {
        if (readOnly) return;
        
        const newTerms = selectedTerms.filter((_, i) => i !== index);
        setSelectedTerms(newTerms);
        onSelectResult(newTerms);
    }, [onSelectResult, selectedTerms, readOnly]);

    return (
    <div className="space-y-2 md:space-y-3">
        {/* Barra de búsqueda */}
        <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={readOnly ? "Búsqueda no disponible" : "Buscar CIE-10..."}
                    className={`w-full rounded-md border-gray-300 shadow-sm text-sm md:text-base ${
                        readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    disabled={readOnly}
                />
                {isSearching && (
                    <div className="absolute right-2 top-2">
                        <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </div>
            
            {!readOnly && (
                <button
                    type="button"
                    onClick={() => setShowManualForm(!showManualForm)}
                    className={`px-2 py-1 md:px-3 rounded text-sm md:text-base ${
                        showManualForm ? 'bg-gray-500 text-white' : 'bg-blue-500 text-white'
                    } hover:opacity-90 whitespace-nowrap`}
                >
                    {showManualForm ? 'Cancelar' : '+ Manual'}
                </button>
            )}
        </div>

        {/* Formulario manual */}
        {showManualForm && !readOnly && (
            <div className="grid grid-cols-1 gap-2 p-2 md:p-3 bg-gray-50 rounded-md">
                <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                        Código (opcional)
                    </label>
                    <input
                        type="text"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        placeholder="Ej: E11.9"
                        className="w-full rounded-md border-gray-300 shadow-sm text-sm md:text-base"
                    />
                </div>
                
                <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                        Descripción *
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Descripción del diagnóstico"
                            className="flex-1 rounded-md border-gray-300 shadow-sm text-sm md:text-base"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddManualTerm()}
                        />
                        <button
                            type="button"
                            onClick={handleAddManualTerm}
                            disabled={!descripcion.trim()}
                            className={`px-2 py-1 rounded text-sm md:text-base ${
                                descripcion.trim()
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Agregar
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Resultados de búsqueda */}
        {searchResults.length > 0 && (
            <ul className="border border-gray-200 rounded-md max-h-40 md:max-h-60 overflow-y-auto text-sm md:text-base">
                {searchResults.map((result, index) => (
                    <li
                        key={`result-${index}`}
                        onClick={() => handleSelectTerm(result)}
                        className="p-1.5 md:p-2 hover:bg-blue-50 cursor-pointer"
                    >
                        {result.includes('|') ? (
                            <div className="flex flex-col md:flex-row">
                                <span className="font-mono text-blue-700 text-xs md:text-sm">
                                    {result.split('|')[0]}
                                </span>
                                <span className="md:ml-2 text-xs md:text-sm truncate">
                                    {result.split('|').slice(1).join('|')}
                                </span>
                            </div>
                        ) : (
                            <span className="text-xs md:text-sm">{result}</span>
                        )}
                    </li>
                ))}
            </ul>
        )}

        {/* Términos seleccionados */}
        <div className="mt-2 md:mt-3">
            <div className="flex justify-between items-center mb-1 md:mb-2">
                <span className="text-xs md:text-sm font-medium text-gray-700">
                    Seleccionados ({selectedTerms.length}/{maxSelections})
                </span>
            </div>
            
            {selectedTerms.length > 0 ? (
                <ul className="flex flex-wrap gap-1 md:gap-2">
                    {selectedTerms.map((term, index) => {
                        const { code, description } = parseTerm(term);
                        return (
                            <li
                                key={`selected-${index}`}
                                className="bg-gray-100 rounded-md px-2 py-0.5 md:px-3 md:py-1 flex items-center group text-xs md:text-sm"
                            >
                                {code && (
                                    <span className="font-mono bg-blue-100 text-blue-800 px-1 py-0.5 rounded mr-1 md:mr-2 text-xxs md:text-xs">
                                        {code}
                                    </span>
                                )}
                                <span className="max-w-[120px] md:max-w-xs truncate" title={description}>
                                    {description}
                                </span>
                                {!readOnly && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTerm(index)}
                                        className="ml-1 md:ml-2 text-gray-400 hover:text-red-500 text-xs md:text-sm"
                                    >
                                        ×
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-gray-400 text-xs md:text-sm italic">
                    No hay términos seleccionados
                </p>
            )}
        </div>

        {/* Mensajes de error */}
        {error && (
            <div className="text-red-500 text-xs md:text-sm p-1.5 md:p-2 bg-red-50 rounded-md">
                {error}
            </div>
        )}
    </div>
);
});

export default Cie10Search;