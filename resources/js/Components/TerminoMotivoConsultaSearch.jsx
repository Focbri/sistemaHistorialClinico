import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TerminoMotivoConsultaSearch = ({ initialValue = '', onSelectTerm }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedTerms, setSelectedTerms] = useState(
        initialValue ? initialValue.split(',').map(t => t.trim()).filter(t => t) : []
    );

    // Búsqueda con debounce
    const handleSearch = useCallback(async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        try {
            const response = await axios.get('/terminos-motivo-consulta/search', {
                params: { query: searchQuery }
            });
            setResults(response.data);
        } catch (error) {
            console.error('Error en búsqueda:', error);
            setResults([]);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => handleSearch(query), 300);
        return () => clearTimeout(timer);
    }, [query, handleSearch]);

    // Manejo de términos
    const updateTerms = useCallback((newTerms) => {
        setSelectedTerms(newTerms);
        onSelectTerm(newTerms); // Siempre envía un array
    }, [onSelectTerm]);

    const handleSelectTerm = useCallback((term) => {
        if (selectedTerms.length >= 20) return alert('Límite alcanzado');
        if (!selectedTerms.includes(term)) {
            updateTerms([...selectedTerms, term]);
        }
    }, [selectedTerms, updateTerms]);

    const handleRemoveTerm = useCallback((term) => {
        updateTerms(selectedTerms.filter(t => t !== term));
    }, [selectedTerms, updateTerms]);

    const handleAddManually = useCallback(() => {
        if (!query.trim()) return alert('Término inválido');
        handleSelectTerm(query.trim());
        setQuery('');
    }, [query, handleSelectTerm]);

    return (
        <div className="border-[#8FDBF1] border rounded p-2">
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar término..."
                    className="flex-1 rounded border p-2"
                />
                <button
                    onClick={handleAddManually}
                    type='button'
                    className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
                >
                    Agregar
                </button>
            </div>

            {results.length > 0 && (
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