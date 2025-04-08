import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TerminoMotivoConsultaSearch = ({ initialValue = '', onSelectTerm }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedTerms, setSelectedTerms] = useState(
        initialValue ? initialValue.split(',').map(t => t.trim()).filter(t => t) : []
    );
    const [showResults, setShowResults] = useState(false); // Nuevo estado para controlar visibilidad

    // Búsqueda con debounce
    const handleSearch = useCallback(async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setShowResults(false); // Ocultar resultados cuando no hay query
            return;
        }

        try {
            const response = await axios.get('/terminos-motivo-consulta/search', {
                params: { query: searchQuery }
            });
            setResults(response.data);
            setShowResults(true); // Mostrar resultados cuando hay datos
        } catch (error) {
            console.error('Error en búsqueda:', error);
            setResults([]);
            setShowResults(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => handleSearch(query), 300);
        return () => clearTimeout(timer);
    }, [query, handleSearch]);

    // Manejo de términos
    const updateTerms = useCallback((newTerms) => {
        setSelectedTerms(newTerms);
        onSelectTerm(newTerms);
    }, [onSelectTerm]);

    const handleSelectTerm = useCallback((term) => {
        if (selectedTerms.length >= 20) return alert('Límite alcanzado');
        if (!selectedTerms.includes(term)) {
            updateTerms([...selectedTerms, term]);
            setShowResults(false); // Ocultar resultados al seleccionar
            setQuery(''); // Limpiar la búsqueda
        }
    }, [selectedTerms, updateTerms]);

    const handleRemoveTerm = useCallback((term) => {
        updateTerms(selectedTerms.filter(t => t !== term));
    }, [selectedTerms, updateTerms]);

    const handleAddManually = useCallback(() => {
        if (!query.trim()) return alert('Término inválido');
        handleSelectTerm(query.trim());
    }, [query, handleSelectTerm]);

    // Cerrar resultados al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.search-container')) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="border-[#8FDBF1] border rounded p-2 search-container">
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (e.target.value.trim()) {
                            setShowResults(true);
                        }
                    }}
                    placeholder="Buscar término..."
                    className="flex-1 rounded border p-2"
                    onFocus={() => query.trim() && setShowResults(true)}
                />
                <button
                    onClick={handleAddManually}
                    type='button'
                    className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
                >
                    Agregar
                </button>
            </div>

            {showResults && results.length > 0 && (
                <ul className="max-h-40 overflow-y-auto border rounded">
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
                        <span className="mr-1">{term}</span>
                        <button
                            onClick={() => handleRemoveTerm(term)}
                            className="text-red-500 hover:text-red-700"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TerminoMotivoConsultaSearch;