import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cie10Search = ({ onSelectResult }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    // Función para realizar la búsqueda
    const handleSearch = async (searchQuery) => {
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
    };

    // Debouncing: Realizar la búsqueda después de que el usuario deje de escribir
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch(query);
        }, 300); // Esperar 300 ms después de que el usuario deje de escribir

        return () => clearTimeout(delayDebounceFn); // Limpiar el timeout si el usuario sigue escribiendo
    }, [query]);

    const handleSelectResult = (result) => {
        setQuery(result); // Actualizar el campo de búsqueda con el valor seleccionado
        setResults([]); // Limpiar los resultados de la búsqueda
        onSelectResult(result); // Notificar al formulario que se seleccionó un resultado
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar en CIE10..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />

            {/* Mostrar todos los resultados en una sola lista con scroll */}
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
        </div>
    );
};

export default Cie10Search;