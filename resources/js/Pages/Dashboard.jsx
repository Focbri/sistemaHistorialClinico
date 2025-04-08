import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { utils, writeFile } from 'xlsx';

export default function Dashboard({ auth, topCie10: initialTopCie10 }) {
    const [topCie10, setTopCie10] = useState(initialTopCie10 || {});
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        sex: '',
        minAge: '',
        maxAge: '',
        filterType: 'general' // 'general', 'sex', 'age'
    });

    const fetchTopCie10 = async () => {
        try {
            setLoading(true);
            
            const queryParams = new URLSearchParams();
            
            if (filters.filterType === 'sex' && filters.sex) {
                queryParams.append('sex', filters.sex);
            }
            
            if (filters.filterType === 'age') {
                if (filters.minAge) queryParams.append('min_age', filters.minAge);
                if (filters.maxAge) queryParams.append('max_age', filters.maxAge);
            }
            
            // Siempre enviamos el tipo de filtro
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
        } finally {
            setLoading(false);
        }
    };

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
            filterType: 'general'
        });
        setTimeout(fetchTopCie10, 100);
    };

    const exportToExcel = () => {
        const fechaActual = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
        
        let title = "CIE10_mas_usados";
        
        if (filters.filterType === 'sex' && filters.sex) {
            title = `CIE10_mas_usados_${filters.sex === 'M' ? 'Masculino' : 'Femenino'}`;
        } else if (filters.filterType === 'age') {
            const min = filters.minAge || '0';
            const max = filters.maxAge || '∞';
            title = `CIE10_mas_usados_Edad_${min}_a_${max}`;
        }
        
        // Agregar fecha al nombre del archivo
        title = `${title}_${fechaActual}`;
        
        const data = Object.entries(topCie10).map(([code, count]) => ({
            'Código CIE10': code,
            'Veces usado': count
        }));
    
        const ws = utils.json_to_sheet(data);
        
        ws['!cols'] = [
            { wch: 60 }, 
            { wch: 10 }
        ];
        
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "CIE10 Más Usados");
        writeFile(wb, `${title}.xlsx`);
    };

    const applyFilters = () => {
        // Validación mejorada
        if (filters.filterType === 'age') {
            if (!filters.minAge || !filters.maxAge) {
                // Mostrar mensaje de error más elegante que un alert
                setError('Por favor complete ambos campos de edad para aplicar este filtro');
                return;
            }
            
            if (parseInt(filters.maxAge) < parseInt(filters.minAge)) {
                setError('La edad máxima no puede ser menor que la edad mínima');
                return;
            }
        }
        
        setError(null); // Limpiar errores anteriores
        fetchTopCie10();
    };

    const isFormValid = filters.filterType !== 'age' || 
                   (filters.minAge && filters.maxAge && parseInt(filters.maxAge) >= parseInt(filters.minAge));
    
    // Agrega este estado al inicio del componente
    const [error, setError] = useState(null);
    
    // Modifica el JSX para mostrar el error (agrégalo cerca de los botones)
    {error && (
        <div className="mt-2 text-sm text-red-600">
            {error}
        </div>
    )}

    useEffect(() => {
        fetchTopCie10();
        const interval = setInterval(fetchTopCie10, 300000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg font-semibold leading-tight text-gray-800">
                    Bienvenido, {auth.user.name}
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-4 space-y-6">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-4">Filtrar por:</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Tipo de filtro */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de filtro</label>
                                    <select
                                        name="filterType"
                                        value={filters.filterType}
                                        onChange={handleFilterChange}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="general">General (todos)</option>
                                        <option value="sex">Por sexo</option>
                                        <option value="age">Por edad</option>
                                    </select>
                                </div>
                                
                                {/* Filtro por sexo (solo visible cuando filterType es 'sex') */}
                                {filters.filterType === 'sex' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                                        <select
                                            name="sex"
                                            value={filters.sex}
                                            onChange={handleFilterChange}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">Seleccionar</option>
                                            <option value="M">Masculino</option>
                                            <option value="F">Femenino</option>
                                        </select>
                                    </div>
                                )}
                                
                                {/* Filtro por edad (solo visible cuando filterType es 'age') */}
                                {filters.filterType === 'age' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Edad mínima</label>
                                            <input required
                                                type="number"
                                                name="minAge"
                                                value={filters.minAge}
                                                onChange={handleFilterChange}
                                                placeholder="Mínimo"
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                min="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Edad máxima</label>
                                            <input required
                                                type="number"
                                                name="maxAge"
                                                value={filters.maxAge}
                                                onChange={handleFilterChange}
                                                placeholder="Máximo"
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                min="0"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            <div className="flex space-x-4 mt-4">
                            <button
                                onClick={applyFilters}
                                disabled={loading || !isFormValid}
                                className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${
                                    loading || !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? 'Aplicando...' : 'Aplicar Filtros'}
                            </button>
                                <button
                                    onClick={resetFilters}
                                    disabled={loading}
                                    className={`px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Limpiar Filtros
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Términos CIE10 más utilizados</h2>
                            <div className="flex items-center space-x-4">
                                {Object.keys(topCie10).length > 0 && (
                                    <button 
                                        onClick={exportToExcel}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                    >
                                        Exportar a Excel
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {loading ? (
                            <p>Cargando datos...</p>
                        ) : Object.keys(topCie10).length === 0 ? (
                            <p>No hay datos disponibles</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Veces usado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {Object.entries(topCie10).map(([code, count]) => (
                                            <tr key={code}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{code}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}