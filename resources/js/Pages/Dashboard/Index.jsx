import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdvancedFilters from '@/Components/AdvancedFilters';
import { Head } from '@inertiajs/react';
import { utils, writeFile } from 'xlsx';

export default function Dashboard({ auth, topCie10: initialTopCie10 }) {
    const [topCie10, setTopCie10] = useState(initialTopCie10 || {});
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState('');
    const [error, setError] = useState(null);

    const fetchTopCie10 = async (filters) => {
        try {
            setLoading(true);
            setError(null);
            
            const queryParams = new URLSearchParams();
            
            if (filters.activeFilters.sex && filters.sex) {
                queryParams.append('sex', filters.sex);
            }
            
            if (filters.activeFilters.age) {
                if (filters.minAge) queryParams.append('min_age', filters.minAge);
                if (filters.maxAge) queryParams.append('max_age', filters.maxAge);
            }
            
            if (filters.activeFilters.dateRange) {
                if (filters.startDate) queryParams.append('start_date', filters.startDate);
                if (filters.endDate) queryParams.append('end_date', filters.endDate);
            }
            
            if (filters.activeFilters.procedencia && filters.procedencia) {
                queryParams.append('procedencia', filters.procedencia);
            }
            
            if (filters.activeFilters.terms && filters.selectedTerms.length > 0) {
                filters.selectedTerms.forEach(term => {
                    queryParams.append('terms[]', term);
                });
            }
            
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
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = (currentFilters) => {
    const fechaActual = new Date().toISOString().split('T')[0];
    let title = "CIE10_mas_usados";
    
    const activeFilters = [];
    
    if (currentFilters?.activeFilters?.sex && currentFilters?.sex) {
        activeFilters.push(`Sexo_${currentFilters.sex === 'M' ? 'Masculino' : 'Femenino'}`);
    }
    
    if (currentFilters?.activeFilters?.age) {
        const min = currentFilters?.minAge || '0';
        const max = currentFilters?.maxAge || '∞';
        activeFilters.push(`Edad_${min}_a_${max}`);
    }
    
    if (currentFilters?.activeFilters?.dateRange) {
        activeFilters.push(`Desde_${currentFilters?.startDate}_Hasta_${currentFilters?.endDate}`);
    }
    
    if (currentFilters?.activeFilters?.procedencia && currentFilters?.procedencia) {
        activeFilters.push(`Procedencia_${currentFilters.procedencia}`);
    }
    
    if (currentFilters?.activeFilters?.terms && currentFilters?.selectedTerms?.length > 0) {
        activeFilters.push(`${currentFilters.selectedTerms.length}_terminos`);
    }
    
    if (activeFilters.length > 0) { 
        title = `CIE10_mas_usados_${activeFilters.join('_')}`;
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

    const handleApplyFilters = async (filters) => {
        try {
            // Validación de edad
            if (filters.activeFilters.age) {
                if (!filters.minAge || !filters.maxAge) {
                    setError('Por favor complete ambos campos de edad');
                    return;
                }
                
                if (parseInt(filters.maxAge) < parseInt(filters.minAge)) {
                    setError('La edad máxima no puede ser menor que la edad mínima');
                    return;
                }
            }
            
            // Validación de rango de fechas
            if (filters.activeFilters.dateRange) {
                if (!filters.startDate || !filters.endDate) {
                    setError('Por favor complete ambas fechas');
                    return;
                }
                
                if (new Date(filters.endDate) < new Date(filters.startDate)) {
                    setError('La fecha final no puede ser anterior a la fecha inicial');
                    return;
                }
            }
            
            // Validación de sexo
            if (filters.activeFilters.sex && !filters.sex) {
                setError('Por favor seleccione un sexo');
                return;
            }
            
            // Validación de términos
            if (filters.activeFilters.terms && filters.selectedTerms.length === 0) {
                setError('Por favor seleccione al menos un término CIE10');
                return;
            }
            
            setError(null);
            await fetchTopCie10(filters);
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    };

    const handleResetFilters = async () => {
        const defaultFilters = {
            sex: '',
            minAge: '',
            maxAge: '',
            startDate: '',
            endDate: '',
            procedencia: '',
            searchTerm: '',
            selectedTerms: [],
            activeFilters: {
                sex: false,
                age: false,
                dateRange: false,
                procedencia: false,
                terms: false
            }
        };
        
        setError(null);
        await fetchTopCie10(defaultFilters);
    };

    useEffect(() => {
        // Carga inicial con filtros por defecto
        handleResetFilters();
        
        // Actualización periódica cada 5 minutos
        const interval = setInterval(() => {
            handleResetFilters();
        }, 300000);
        
        return () => clearInterval(interval);
    }, []);

return (
    <AuthenticatedLayout
        header={
            <h2 className="text-lg sm:text-xl font-semibold leading-tight text-gray-800 px-4 sm:px-0">
                Panel de Estadísticas CIE10
            </h2>
        }
    >
        <Head title="Dashboard" />

        <div className="py-4 sm:py-8">
            <div className="mx-auto sm:max-w-7xl sm:px-6 lg:px-8">
                {/* Componente de filtros reutilizable - Ajustado para móvil */}
                <div className="bg-white shadow rounded-lg overflow-hidden sm:overflow-visible">
                    <AdvancedFilters 
                        onApplyFilters={handleApplyFilters}
                        onResetFilters={handleResetFilters}
                        onExport={(filters) => exportToExcel(filters)}
                        disabledSections={{
                            // Puedes deshabilitar secciones específicas si no las necesitas
                            // dateRange: true,
                            // procedencia: true
                        }}
                        initialFilters={{
                            // Puedes establecer valores iniciales si es necesario
                        }}
                        mobileView={true} // Asegúrate que tu componente AdvancedFilters soporte esta prop
                    />
                </div>

                {/* Tarjeta de Resultados - Optimizada para móvil */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-base sm:text-lg font-medium text-gray-900">Términos CIE10 más utilizados</h3>
                            {lastUpdated && (
                                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                                    Última actualización: {lastUpdated}
                                </p>
                            )}
                        </div>
                        {Object.keys(topCie10).length > 0 && (
                            <button 
                                onClick={exportToExcel}
                                className="inline-flex items-center justify-center px-3 py-1 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <svg className="-ml-0.5 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Exportar
                            </button>
                        )}
                    </div>
                    
                    <div className="px-2 sm:px-6 py-3 sm:py-4">
                        {loading ? (
                            <div className="flex justify-center items-center py-8 sm:py-12">
                                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : Object.keys(topCie10).length === 0 ? (
                            <div className="text-center py-8 sm:py-12">
                                <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay datos disponibles</h3>
                                <p className="mt-1 text-xs sm:text-sm text-gray-500">Ajuste los filtros o actualice la página.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                {/* Tabla optimizada para móvil */}
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Código
                                            </th>
                                            <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Frecuencia
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {Object.entries(topCie10).map(([code, count]) => (
                                            <tr key={code} className="hover:bg-gray-50">
                                                <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap sm:whitespace-normal text-xs sm:text-sm font-medium text-gray-900">
                                                    {code}
                                                </td>
                                                <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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