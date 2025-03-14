import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Cie10Search = React.memo(({ onSelectResult }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedResults, setSelectedResults] = useState([]);

    // Función para realizar la búsqueda
    const handleSearch = useCallback(async (searchQuery) => {
        if (!searchQuery) {
            setResults([]); // Limpiar resultados si la consulta está vacía
            return;
        }

        try {
            const response = await axios.get('/cie10/search', {
                params: { query: searchQuery },
            });
            setResults(response.data); // Actualizar resultados
        } catch (error) {
            console.error('Error searching:', error);
        }
    }, []);

    // Debouncing: Realizar la búsqueda después de que el usuario deje de escribir
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch(query);
        }, 300); // Esperar 300 ms después de que el usuario deje de escribir

        return () => clearTimeout(delayDebounceFn); // Limpiar el timeout si el usuario sigue escribiendo
    }, [query, handleSearch]);

    // Manejar la selección de un resultado
    const handleSelectResult = useCallback((result) => {
        if (selectedResults.length < 4) {
            setSelectedResults((prev) => [...prev, result]); // Agregar el resultado seleccionado
            setQuery(''); // Limpiar el campo de búsqueda
            setResults([]); // Limpiar los resultados de la búsqueda
            onSelectResult([...selectedResults, result]); // Notificar al formulario que se seleccionó un resultado
        }
    }, [onSelectResult, selectedResults]);

    // Manejar la eliminación de un resultado
    const handleRemoveResult = useCallback((index) => {
        const newResults = selectedResults.filter((_, i) => i !== index); // Filtrar el resultado eliminado
        setSelectedResults(newResults); // Actualizar el estado de resultados seleccionados
        onSelectResult(newResults); // Notificar al formulario que se eliminó un resultado
    }, [onSelectResult, selectedResults]);

    return (
        <div>
            {/* Campo de búsqueda */}
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar en CIE10..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />

            {/* Mostrar resultados de la búsqueda */}
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

            {/* Mostrar opciones seleccionadas en un cuadro */}
            <div className="mt-4">
                {selectedResults.map((result, index) => (
                    <div key={index} className="inline-flex items-center bg-gray-200 rounded-md p-2 m-1">
                        <span>{result}</span>
                        <button
                            onClick={() => handleRemoveResult(index)}
                            className="ml-2 text-red-500 hover:text-red-700"
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