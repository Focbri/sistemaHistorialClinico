import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TerminoBiomicroscopiaSearch = ({ initialValue = '', onSelectTerm }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedTerms, setSelectedTerms] = useState(
        initialValue ? initialValue.split(',').map(t => t.trim()).filter(t => t) : []
    );

    // Función para realizar la búsqueda
    const handleSearch = useCallback(async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        try {
            const response = await axios.get('/terminos-biomicroscopia/search', {
                params: { query: searchQuery }
            });
            setResults(response.data);
        } catch (error) {
            console.error('Error en búsqueda:', error);
            setResults([]);
        }
    }, []);

    // Debouncing: Realizar la búsqueda después de que el usuario deje de escribir
    useEffect(() => {
        const timer = setTimeout(() => handleSearch(query), 300);
        return () => clearTimeout(timer);
    }, [query, handleSearch]);

    // Manejar la selección de un término
    const updateTerms = useCallback((newTerms) => {
        setSelectedTerms(newTerms);
        onSelectTerm(newTerms); // Siempre envía un array
    }, [onSelectTerm]);

    const handleSelectTerm = useCallback((term) => {
        if (selectedTerms.length >= 20) return alert('Límite alcanzado: 20 términos máx.');
        if (!selectedTerms.includes(term)) {
            updateTerms([...selectedTerms, term]);
        }
    }, [selectedTerms, updateTerms]);

    const handleRemoveTerm = useCallback((term) => {
        updateTerms(selectedTerms.filter(t => t !== term));
    }, [selectedTerms, updateTerms]);

    const handleAddManually = useCallback(() => {
        if (!query.trim()) return alert('Ingresa un término válido');
        handleSelectTerm(query.trim());
        setQuery('');
    }, [query, handleSelectTerm]);

    return (
        <div className='border-[#8FDBF1] border py-1 px-2 relative'>
            {/* Campo de búsqueda */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar término..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
                <button
                    type="button"
                    onClick={handleAddManually}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Agregar
                </button>
            </div>

            {/* Mostrar resultados de la búsqueda */}
            {results.length > 0 && (
                <ul className="max-h-40 overflow-y-auto border rounded bg-white z-50 absolute w-[calc(100%-20px)]">
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

            {/* Mostrar términos seleccionados en un cuadro */}
            <div className="mt-2 flex flex-wrap gap-1">
                {selectedTerms.map((term, i) => (
                    <div key={i} className="bg-gray-200 rounded-full px-3 py-1 flex items-center">
                        <span className="mr-1 text-sm truncate max-w-xs">{term}</span>
                        <button
                            onClick={() => handleRemoveTerm(term)}
                            className="text-red-500 hover:text-red-700 ml-1"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TerminoBiomicroscopiaSearch;