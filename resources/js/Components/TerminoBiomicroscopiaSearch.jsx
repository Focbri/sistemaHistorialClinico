import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TerminoBiomicroscopiaSearch = ({ 
    initialValue = '', 
    onSelectTerm,
    readOnly = false
}) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedTerms, setSelectedTerms] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Sincronizar con el valor inicial del padre
    useEffect(() => {
        const termsArray = initialValue ? 
            initialValue.split('.').map(t => t.trim()).filter(t => t) : [];
        setSelectedTerms(termsArray);
    }, [initialValue]);

    const handleSearch = useCallback(async (searchQuery) => {
        if (!searchQuery.trim() || readOnly) {
            setResults([]);
            setIsDropdownOpen(false);
            return;
        }

        try {
            const response = await axios.get('/terminos/biomicroscopia/search', {
                params: { query: searchQuery }
            });
            setResults(response.data);
            setIsDropdownOpen(response.data.length > 0);
        } catch (error) {
            console.error('Error en búsqueda:', error);
            setResults([]);
            setIsDropdownOpen(false);
        }
    }, [readOnly]);

    const debouncedSearch = useCallback(() => {
        const timer = setTimeout(() => handleSearch(query), 300);
        return () => clearTimeout(timer);
    }, [query, handleSearch]);

    useEffect(() => {
        debouncedSearch();
    }, [query, debouncedSearch]);

    const handleSelectTerm = useCallback(async (term) => {
        if (readOnly) return;
        
        if (selectedTerms.length >= 20) {
            alert('Límite alcanzado: 20 términos máx.');
            return;
        }
    
        const trimmedTerm = term.trim();
        if (!trimmedTerm || selectedTerms.includes(trimmedTerm)) return;
    
        try {
            const newTerms = [...selectedTerms, trimmedTerm];
            setSelectedTerms(newTerms);
            onSelectTerm(newTerms.join('; '));
            setQuery('');
            setIsDropdownOpen(false);
    
            // Solo guarda en el catálogo general si no existe
            if (!results.some(r => r === trimmedTerm)) {
                try {
                    await axios.post('/terminos-biomicroscopia', { 
                        termino: trimmedTerm,
                        // No enviamos consulta_id para términos del catálogo general
                    });
                } catch (error) {
                    console.warn('El término no se pudo agregar al catálogo:', error);
                }
            }
        } catch (error) {
            console.error('Error al seleccionar término:', error);
        }
    }, [selectedTerms, onSelectTerm, results, readOnly]);

    const handleRemoveTerm = useCallback((term) => {
        if (readOnly) return;
        const newTerms = selectedTerms.filter(t => t !== term);
        setSelectedTerms(newTerms);
        onSelectTerm(newTerms.join('. '));
    }, [selectedTerms, onSelectTerm, readOnly]);

    const handleAddManually = useCallback(() => {
        if (readOnly) return;
        if (!query.trim()) return;
        handleSelectTerm(query);
    }, [query, handleSelectTerm, readOnly]);

    return (
        <div className={`border-[#8FDBF1] border py-1 px-2 relative ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        if (readOnly) return;
                        setQuery(e.target.value);
                        setIsDropdownOpen(e.target.value.trim() !== '');
                    }}
                    placeholder={readOnly ? "" : "Buscar término..."}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
                        readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                    onFocus={() => query.trim() && !readOnly && setIsDropdownOpen(true)}
                    disabled={readOnly}
                />
                {!readOnly && (
                    <button
                        type="button"
                        onClick={handleAddManually}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        disabled={!query.trim()}
                    >
                        Agregar
                    </button>
                )}
            </div>

            {!readOnly && isDropdownOpen && results.length > 0 && (
                <ul className="max-h-40 overflow-y-auto border rounded bg-white z-50 absolute w-[calc(100%-20px)] mt-1">
                    {results.map((result, i) => (
                        <li
                            key={i}
                            onClick={() => handleSelectTerm(result)}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {result}
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-2 flex flex-wrap gap-1">
                {selectedTerms.map((term, i) => (
                    <div key={i} className="bg-gray-200 rounded-full px-3 py-1 flex items-center">
                        <span className="mr-1 text-sm truncate max-w-xs">{term}</span>
                        {!readOnly && (
                            <button
                                type="button"
                                onClick={() => handleRemoveTerm(term)}
                                className="text-red-500 hover:text-red-700 ml-1"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TerminoBiomicroscopiaSearch;