import { useEffect, useState, useCallback } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { utils, writeFile } from 'xlsx';

export default function Dashboard({ auth, topCie10: initialTopCie10 }) {
    const [topCie10, setTopCie10] = useState(initialTopCie10 || {});
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState('');
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        sex: '',
        minAge: '',
        maxAge: '',
        filterType: 'general',
        searchTerm: '',
        selectedTerms: []
    });
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    const fetchTopCie10 = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const queryParams = new URLSearchParams();
            
            if (filters.filterType === 'sex' && filters.sex) {
                queryParams.append('sex', filters.sex);
            }
            
            if (filters.filterType === 'age') {
                if (filters.minAge) queryParams.append('min_age', filters.minAge);
                if (filters.maxAge) queryParams.append('max_age', filters.maxAge);
            }
            
            // Agregar términos seleccionados al filtro
            if (filters.selectedTerms.length > 0) {
                filters.selectedTerms.forEach(term => {
                    queryParams.append('terms[]', term);
                });
            }
            
            queryParams.append('filter_type', filters.filterType);
            
            const url = `/dashboard/top-cie10?${queryParams.toString()}`;
            
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                cache: 'no-store'
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            setTopCie10(data || {});
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (error) {
            console.error('Error fetching CIE10 data:', error);
            setError('Error al cargar los datos. Por favor intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchTermChange = (e) => {
        setFilters(prev => ({
            ...prev,
            searchTerm: e.target.value
        }));
    };

    const handleSearch = useCallback(async () => {
        if (!filters.searchTerm) {
            setSearchResults([]);
            return;
        }

        try {
            setSearchLoading(true);
            const response = await fetch(`/cie10/search?query=${encodeURIComponent(filters.searchTerm)}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching CIE10:', error);
            setError('Error al buscar términos CIE10');
        } finally {
            setSearchLoading(false);
        }
    }, [filters.searchTerm]);

    const handleSelectTerm = (term) => {
        if (!filters.selectedTerms.includes(term)) {
            setFilters(prev => ({
                ...prev,
                selectedTerms: [...prev.selectedTerms, term],
                searchTerm: '',
                searchResults: []
            }));
        }
    };

    const handleRemoveTerm = (termToRemove) => {
        setFilters(prev => ({
            ...prev,
            selectedTerms: prev.selectedTerms.filter(term => term !== termToRemove)
        }));
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (filters.searchTerm) {
                handleSearch();
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [filters.searchTerm, handleSearch]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetFilters = () => {
        setFilters({
            sex: '',
            minAge: '',
            maxAge: '',
            filterType: 'general',
            searchTerm: '',
            selectedTerms: []
        });
        setTimeout(fetchTopCie10, 100);
    };

    const exportToExcel = () => {
        const fechaActual = new Date().toISOString().split('T')[0];
        
        let title = "CIE10_mas_usados";
        
        if (filters.filterType === 'sex' && filters.sex) {
            title = `CIE10_mas_usados_${filters.sex === 'M' ? 'Masculino' : 'Femenino'}`;
        } else if (filters.filterType === 'age') {
            const min = filters.minAge || '0';
            const max = filters.maxAge || '∞';
            title = `CIE10_mas_usados_Edad_${min}_a_${max}`;
        } else if (filters.selectedTerms.length > 0) {
            title = `CIE10_mas_usados_Seleccionados`;
        }
        
        title = `${title}_${fechaActual}`;
        
        const data = Object.entries(topCie10).map(([code, count]) => ({
            'Código CIE10': code,
            'Veces usado': count
        }));
    
        const ws = utils.json_to_sheet(data);
        ws['!cols'] = [{ wch: 60 }, { wch: 10 }];
        
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "CIE10 Más Usados");
        writeFile(wb, `${title}.xlsx`);
    };

    const applyFilters = () => {
        if (filters.filterType === 'age') {
            if (!filters.minAge || !filters.maxAge) {
                setError('Por favor complete ambos campos de edad');
                return;
            }
            
            if (parseInt(filters.maxAge) < parseInt(filters.minAge)) {
                setError('La edad máxima no puede ser menor que la edad mínima');
                return;
            }
        }
        
        setError(null);
        fetchTopCie10();
    };

    const isFormValid = filters.filterType !== 'age' || 
                   (filters.minAge && filters.maxAge && parseInt(filters.maxAge) >= parseInt(filters.minAge));

    useEffect(() => {
        fetchTopCie10();
        const interval = setInterval(fetchTopCie10, 300000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Panel de Estadísticas CIE10
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Tarjeta de Filtros */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Filtros Avanzados</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Tipo de filtro */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Tipo de filtro</label>
                                    <select
                                        name="filterType"
                                        value={filters.filterType}
                                        onChange={handleFilterChange}
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    >
                                        <option value="general">General (todos)</option>
                                        <option value="sex">Por sexo</option>
                                        <option value="age">Por edad</option>
                                        <option value="terms">Por términos específicos</option>
                                    </select>
                                </div>
                                
                                {/* Filtro por sexo */}
                                {filters.filterType === 'sex' && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Sexo</label>
                                        <select
                                            name="sex"
                                            value={filters.sex}
                                            onChange={handleFilterChange}
                                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        >
                                            <option value="">Seleccionar</option>
                                            <option value="M">Masculino</option>
                                            <option value="F">Femenino</option>
                                        </select>
                                    </div>
                                )}
                                
                                {/* Filtro por edad */}
                                {filters.filterType === 'age' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Edad mínima</label>
                                            <input
                                                type="number"
                                                name="minAge"
                                                value={filters.minAge}
                                                onChange={handleFilterChange}
                                                placeholder="Mínimo"
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                min="0"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Edad máxima</label>
                                            <input
                                                type="number"
                                                name="maxAge"
                                                value={filters.maxAge}
                                                onChange={handleFilterChange}
                                                placeholder="Máximo"
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                min="0"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Filtro por términos CIE10 */}
                                {filters.filterType === 'terms' && (
                                    <div className="col-span-2 space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Buscar términos CIE10</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="searchTerm"
                                                value={filters.searchTerm}
                                                onChange={handleSearchTermChange}
                                                placeholder="Buscar código o descripción CIE10..."
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                            {searchLoading && (
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Resultados de búsqueda */}
                                        {searchResults.length > 0 && (
                                            <div className="mt-1 border border-gray-200 rounded-md max-h-40 overflow-y-auto">
                                                <ul className="divide-y divide-gray-200">
                                                    {searchResults.map((result, index) => (
                                                        <li 
                                                            key={index} 
                                                            className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                                            onClick={() => handleSelectTerm(result)}
                                                        >
                                                            <div className="text-sm text-gray-800">{result}</div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Términos seleccionados */}
                                        {filters.selectedTerms.length > 0 && (
                                            <div className="mt-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Términos seleccionados</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {filters.selectedTerms.map((term, index) => (
                                                        <span 
                                                            key={index}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                                        >
                                                            {term}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveTerm(term)}
                                                                className="ml-1.5 inline-flex text-indigo-600 hover:text-indigo-900 focus:outline-none"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            {/* Mensajes de error y acciones */}
                            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                {error && (
                                    <div className="text-sm text-red-600 flex items-center">
                                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        {error}
                                    </div>
                                )}
                                
                                <div className="flex space-x-3">
                                    <button
                                        onClick={resetFilters}
                                        disabled={loading}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Limpiar
                                    </button>
                                    <button
                                        onClick={applyFilters}
                                        disabled={loading || !isFormValid}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Aplicando...
                                            </>
                                        ) : 'Aplicar Filtros'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta de Resultados */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Términos CIE10 más utilizados</h3>
                                {lastUpdated && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        Última actualización: {lastUpdated}
                                    </p>
                                )}
                            </div>
                            {Object.keys(topCie10).length > 0 && (
                                <button 
                                    onClick={exportToExcel}
                                    className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Exportar a Excel
                                </button>
                            )}
                        </div>
                        
                        <div className="px-6 py-4">
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                </div>
                            ) : Object.keys(topCie10).length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay datos disponibles</h3>
                                    <p className="mt-1 text-sm text-gray-500">Intente ajustar los filtros o actualizar la página.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Código CIE10
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Frecuencia
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {Object.entries(topCie10).map(([code, count]) => (
                                                <tr key={code} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {code}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {count}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}