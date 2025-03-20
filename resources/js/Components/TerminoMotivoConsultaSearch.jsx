import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TerminoMotivoConsultaSearch = ({ onSelectTerm }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedTerms, setSelectedTerms] = useState([]);

    // Función para realizar la búsqueda
    const handleSearch = useCallback(async (searchQuery) => {
        if (!searchQuery) {
            setResults([]); // Limpiar resultados si la consulta está vacía
            return;
        }

        try {
            const response = await axios.get('/terminos-motivo-consulta/search', {
                params: { query: searchQuery },
            });
            setResults(response.data); // Actualizar resultados
        } catch (error) {
            console.error('Error buscando términos:', error);
        }
    }, []);

    // Debouncing: Realizar la búsqueda después de que el usuario deje de escribir
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch(query);
        }, 300); // Esperar 300 ms después de que el usuario deje de escribir

        return () => clearTimeout(delayDebounceFn); // Limpiar el timeout si el usuario sigue escribiendo
    }, [query, handleSearch]);

    // Manejar la selección de un término
    const handleSelectTerm = useCallback(
        (term) => {
            // Verificar si ya se han seleccionado 20 términos
            if (selectedTerms.length >= 20) {
                alert('Has alcanzado el límite de 20 términos seleccionados.');
                return;
            }

            // Verificar si el término ya está seleccionado
            if (!selectedTerms.includes(term)) {
                const newSelectedTerms = [...selectedTerms, term];
                setSelectedTerms(newSelectedTerms); // Actualizar el estado
                setQuery(''); // Limpiar el campo de búsqueda
                setResults([]); // Limpiar los resultados de la búsqueda
                onSelectTerm(newSelectedTerms); // Pasar el array de términos seleccionados
            }
        },
        [onSelectTerm, selectedTerms]
    );

    // Manejar la eliminación de un término
    const handleRemoveTerm = useCallback(
        (term) => {
            const newTerms = selectedTerms.filter((t) => t !== term); // Filtrar el término eliminado
            setSelectedTerms(newTerms); // Actualizar el estado de términos seleccionados
            onSelectTerm(newTerms); // Notificar al formulario con los términos actualizados
        },
        [onSelectTerm, selectedTerms]
    );

    // Manejar la entrada manual de un término
    const handleAddTermManually = () => {
        if (query.trim() === '') {
            alert('Por favor, ingresa un término válido.');
            return;
        }

        // Verificar si ya se han seleccionado 20 términos
        if (selectedTerms.length >= 20) {
            alert('Has alcanzado el límite de 20 términos seleccionados.');
            return;
        }

        // Verificar si el término ya está seleccionado
        if (!selectedTerms.includes(query)) {
            const newSelectedTerms = [...selectedTerms, query];
            setSelectedTerms(newSelectedTerms); // Actualizar el estado
            setQuery(''); // Limpiar el campo de búsqueda
            setResults([]); // Limpiar los resultados de la búsqueda
            onSelectTerm(newSelectedTerms); // Pasar el array de términos seleccionados
        }
    };

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
                    onClick={handleAddTermManually}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Agregar
                </button>
            </div>

            {/* Mostrar resultados de la búsqueda */}
            <ul className="mt-1 max-h-40 overflow-y-auto absolute bg-white z-50">
                {results.map((result, index) => (
                    <li
                        key={index}
                        onClick={() => handleSelectTerm(result)} // Llamar a handleSelectTerm
                        className="cursor-pointer p-2 hover:bg-gray-100"
                    >
                        {result}
                    </li>
                ))}
            </ul>

            {/* Mostrar términos seleccionados en un cuadro */}
            <div className="mt-2 grid grid-cols-3">
                {selectedTerms.map((term, index) => (
                    <div key={index} className="inline-flex items-center bg-gray-200 rounded-md p-1 m-1 justify-between">
                        <span>{term}</span>
                        <button
                            type="button" // Cambiar el tipo a "button"
                            onClick={() => handleRemoveTerm(term)}
                            className="mr-2 text-red-500 font-bold rounded-full hover:text-red-700"
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