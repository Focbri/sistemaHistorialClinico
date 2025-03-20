import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Componente Cie10Search optimizado
const Cie10Search = React.memo(({ onSelectResult }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedResults, setSelectedResults] = useState([]);

    const handleSearch = useCallback(async (searchQuery) => {
        if (!searchQuery) {
            setResults([]);
            return;
        }
        try {
            const response = await axios.get('/cie10/search', { params: { query: searchQuery } });
            setResults(response.data);
        } catch (error) {
            console.error('Error searching:', error);
        }
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => handleSearch(query), 300);
        return () => clearTimeout(delayDebounceFn);
    }, [query, handleSearch]);

    const handleSelectResult = useCallback((result) => {
        if (selectedResults.length < 4) {
            const newSelectedResults = [...selectedResults, result];
            setSelectedResults(newSelectedResults);
            setQuery('');
            setResults([]);
            onSelectResult(newSelectedResults);
        }
    }, [onSelectResult, selectedResults]);

    const handleRemoveResult = useCallback((index, event) => {
        event.stopPropagation();
        const newResults = selectedResults.filter((_, i) => i !== index);
        setSelectedResults(newResults);
        onSelectResult(newResults);
    }, [onSelectResult, selectedResults]);

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar en CIE10..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            <ul className="mt-4 max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                {results.map((result, index) => (
                    <li
                        key={index}
                        onClick={() => handleSelectResult(result)}
                        className="cursor-pointer p-2 hover:bg-gray-100"
                    >
                        {result}
                    </li>
                ))}
            </ul>
            <div className="mt-4">
                {selectedResults.map((result, index) => (
                    <div key={index} className="inline-flex items-center bg-gray-200 rounded-md p-2 m-1">
                        <span>{result}</span>
                        <button
                            type='button'
                            onClick={(event) => handleRemoveResult(index, event)}
                            className="ml-2 text-red-500 hover:text-red-700 min-w-8 min-h-8"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default Cie10Search;