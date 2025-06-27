import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import StatCard from '@/Components/Charts/StatCard';
import DoughnutChart from '@/Components/Charts/DoughnutChart';
import PieChart from '@/Components/Charts/PieChart';
import BarChart from '@/Components/Charts/BarChart';
import Cie10TableWithPagination from '@/Components/Cie10TableWithPagination';
import { 
  UserIcon, 
  CalendarIcon, 
  ExclamationTriangleIcon, 
  CubeIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon
} from "@heroicons/react/24/outline";
import AdvancedFilters from '@/Components/AdvancedFilters';
import { utils, writeFile } from 'xlsx';
import axios from 'axios';

// Estilos constantes para reutilización
const SECTION_STYLES = {
  primary: 'bg-blue-50 border border-blue-100 rounded-xl shadow-sm',
  secondary: 'bg-gray-50 border border-gray-100 rounded-xl shadow-sm',
  accent: 'bg-indigo-50 border border-indigo-100 rounded-xl shadow-sm',
  white: 'bg-white rounded-xl shadow-md'
};

const CHART_COLORS = {
  blue: '#3B82F6',
  pink: '#EC4899',
  green: '#10B981',
  amber: '#F59E0B',
  indigo: '#6366F1',
  purple: '#8B5CF6',
  red: '#EF4444',
  teal: '#14B8A6',
  orange: '#F97316',
  slate: '#64748B'
};

export default function Dashboard({ auth, initialTopCie10 }) {
  // Estados para los datos del dashboard
  const [activeChart, setActiveChart] = useState('gender');
  const [chartFilters, setChartFilters] = useState({
    minAge: '',
    maxAge: '',
    procedencia: ''
  });
  
  const [stats, setStats] = useState({
    patients: null,
    appointments: null,
    farmacos: null,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topCie10, setTopCie10] = useState(initialTopCie10 || {});
  const [lastUpdated, setLastUpdated] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileSection, setActiveMobileSection] = useState('stats');

   // Limpiar filtros de gráficos
  const clearChartFilters = () => {
    setChartFilters({
      minAge: '',
      maxAge: '',
      procedencia: ''
    });
    loadStats();
  };

  // Aplicar filtros de gráficos con validación
  const applyChartFilters = () => {
    if (chartFilters.minAge && chartFilters.maxAge && 
        parseInt(chartFilters.minAge) > parseInt(chartFilters.maxAge)) {
      setError('La edad mínima no puede ser mayor que la edad máxima');
      return;
    }
    
    loadStats();
  };

// Cargar estadísticas
  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      
      if (chartFilters.minAge) queryParams.append('min_age', chartFilters.minAge);
      if (chartFilters.maxAge) queryParams.append('max_age', chartFilters.maxAge);
      if (chartFilters.procedencia) queryParams.append('procedencia', chartFilters.procedencia);
      
      const [patientData, appointmentData, farmacoData] = await Promise.all([
        axios.get(`/dashboard/patient-stats?${queryParams.toString()}`),
        axios.get('/dashboard/appointment-stats'),
        axios.get('/dashboard/farmaco-stats')
      ]);
      
      setStats({
        patients: patientData.data.data,
        appointments: appointmentData.data.data,
        farmacos: farmacoData.data.data
      });
      
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Error al cargar estadísticas. Intente recargar la página.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Opciones y datos para gráficos (optimizados para móvil)
  const chartOptions = {
    gender: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          position: window.innerWidth < 768 ? 'bottom' : 'right',
          labels: {
            boxWidth: 10,
            padding: window.innerWidth < 768 ? 5 : 10
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((context.raw / total) * 100);
              return `${context.label}: ${context.raw} (${percentage}%)`;
            }
          }
        }
      },
      cutout: window.innerWidth < 768 ? '60%' : '70%'
    },
    age: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            stepSize: 1,
            callback: value => Number.isInteger(value) ? value : ''
          }
        },
        x: {
          ticks: {
            autoSkip: true,
            maxRotation: window.innerWidth < 768 ? 45 : 0,
            minRotation: window.innerWidth < 768 ? 45 : 0
          }
        }
      }
    },
    procedencia: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { 
          position: window.innerWidth < 768 ? 'bottom' : 'right',
          labels: {
            boxWidth: 10,
            padding: window.innerWidth < 768 ? 5 : 10
          }
        } 
      }
    }
  };

  const chartData = {
    gender: {
      labels: stats.patients?.gender ? Object.keys(stats.patients.gender) : [],
      datasets: [{
        label: 'Pacientes por Género',
        data: stats.patients?.gender ? Object.values(stats.patients.gender) : [],
        backgroundColor: [CHART_COLORS.blue, CHART_COLORS.pink, CHART_COLORS.green],
        borderWidth: 1,
        hoverOffset: 15
      }]
    },
    procedencia: {
      labels: stats.patients?.procedencia ? Object.keys(stats.patients.procedencia) : [],
      datasets: [{
        label: 'Pacientes por Procedencia',
        data: stats.patients?.procedencia ? Object.values(stats.patients.procedencia) : [],
        backgroundColor: Object.values(CHART_COLORS),
        borderWidth: 1
      }]
    },
    age: {
      labels: stats.patients?.age_ranges ? Object.keys(stats.patients.age_ranges) : [],
      datasets: [{
        label: 'Pacientes por Edad',
        data: stats.patients?.age_ranges ? Object.values(stats.patients.age_ranges) : [],
        backgroundColor: CHART_COLORS.green
      }]
    }
  };

  // Cargar datos CIE10
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
      
      const response = await axios.get(`/dashboard/top-cie10?${queryParams.toString()}`);
      setTopCie10(response.data || {});
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching CIE10 data:', error);
      setError('Error al cargar los datos. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Exportar a Excel
  const exportToExcel = () => {
    const fechaActual = new Date().toISOString().split('T')[0];
    const title = `CIE10_mas_usados_${fechaActual}`;
    
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

  // Manejar filtros
  const handleApplyFilters = async (filters) => {
    try {
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
      
      setError(null);
      await fetchTopCie10(filters);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  // Resetear filtros
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

  // Refrescar datos
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadStats();
    handleResetFilters();
  };

  // Efectos iniciales
  useEffect(() => {
    loadStats();
    handleResetFilters();
    
    const interval = setInterval(() => {
      handleRefresh();
    }, 300000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthenticatedLayout auth={auth}>
      <Head title="Dashboard" />

       {/* Versión móvil */}
      <div className="lg:hidden">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Panel de Control</h1>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-full bg-gray-100 text-gray-700"
            >
              <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Menú móvil */}
          <div className="mt-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex justify-between items-center p-2 bg-gray-100 rounded-lg"
            >
              <span className="font-medium">
                {activeMobileSection === 'stats' && 'Estadísticas'}
                {activeMobileSection === 'farmacos' && 'Fármacos'}
                {activeMobileSection === 'cie10' && 'Diagnósticos'}
                {activeMobileSection === 'citas' && 'Citas'}
                {activeMobileSection === 'graficos' && 'Gráficos'}
              </span>
              {mobileMenuOpen ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>

            {mobileMenuOpen && (
              <div className="mt-2 space-y-1">
                <button
                  onClick={() => {
                    setActiveMobileSection('stats');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded ${activeMobileSection === 'stats' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                >
                  Estadísticas
                </button>
                {stats.farmacos?.count_criticos > 0 && (
                  <button
                    onClick={() => {
                      setActiveMobileSection('farmacos');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded ${activeMobileSection === 'farmacos' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                  >
                    Fármacos Críticos
                  </button>
                )}
                <button
                  onClick={() => {
                    setActiveMobileSection('cie10');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded ${activeMobileSection === 'cie10' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                >
                  Diagnósticos CIE10
                </button>
                <button
                  onClick={() => {
                    setActiveMobileSection('citas');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded ${activeMobileSection === 'citas' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                >
                  Citas por Médico
                </button>
                <button
                  onClick={() => {
                    setActiveMobileSection('graficos');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded ${activeMobileSection === 'graficos' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                >
                  Gráficos
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contenido móvil */}
        <div className="p-4 space-y-4">
          {/* Mensajes de error */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Sección activa */}
          {activeMobileSection === 'stats' && (
            <div className={`p-4 ${SECTION_STYLES.primary}`}>
              <h2 className="text-lg font-bold mb-4">Estadísticas Principales</h2>
              <div className="grid grid-cols-2 gap-3">
                <StatCard 
                  title="Pacientes" 
                  value={loading ? '...' : (stats.patients?.total || 0)} 
                  icon={<UserIcon className="h-5 w-5 text-blue-600" />}
                  compact
                />
                <StatCard 
                  title="Nuevos (Mes)" 
                  value={loading ? '...' : (stats.patients?.newThisMonth || 0)} 
                  icon={<UserIcon className="h-5 w-5 text-green-600" />}
                  compact
                />
                <StatCard 
                  title="Citas Hoy" 
                  value={loading ? '...' : (stats.appointments?.today || 0)} 
                  icon={<CalendarIcon className="h-5 w-5 text-indigo-600" />}
                  compact
                />
                <StatCard 
                  title="Fármacos" 
                  value={loading ? '...' : (stats.farmacos?.total_farmacos || 0)} 
                  icon={<CubeIcon className="h-5 w-5 text-amber-600" />}
                  compact
                />
                <StatCard 
                  title="Stock Crítico" 
                  value={loading ? '...' : (stats.farmacos?.count_criticos || 0)} 
                  icon={<ExclamationTriangleIcon className="h-5 w-5 text-red-600" />}
                  highlight={stats.farmacos?.count_criticos > 0 ? 'warning' : 'normal'}
                  compact
                />
              </div>
            </div>
          )}

          {activeMobileSection === 'farmacos' && stats.farmacos?.count_criticos > 0 && (
            <div className={`p-4 ${SECTION_STYLES.accent}`}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  Fármacos Críticos
                </h2>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {stats.farmacos.count_criticos}
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <div className="min-w-max bg-white rounded-lg shadow overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">Nombre</th>
                        <th className="px-3 py-2 text-center font-medium">Total</th>
                        <th className="px-3 py-2 text-center font-medium">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stats.farmacos.farmacos_criticos.map((farmaco, index) => (
                        <tr key={index} className="hover:bg-yellow-50">
                          <td className="px-3 py-2 max-w-[150px] truncate">
                            <div className="font-medium">{farmaco.nombre_comercial}</div>
                            <div className="text-xs text-gray-500 truncate">{farmaco.componente_activo}</div>
                          </td>
                          <td className="px-3 py-2 text-center font-bold text-red-600">
                            {farmaco.stock_total}
                          </td>
                          <td className='px-3 py-2 text-center'>
                            <Link 
                              href={route('farmacos.stock.manage', farmaco.id)}
                              className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              title="Editar stock"
                            >
                              <PencilIcon className="h-3 w-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMobileSection === 'cie10' && (
            <div className={`p-4 ${SECTION_STYLES.secondary}`}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">Diagnósticos CIE10</h2>
                <div className="flex items-center space-x-2">
                  {Object.keys(topCie10).length > 0 && (
                    <button 
                      onClick={exportToExcel}
                      className="p-1.5 bg-green-600 text-white rounded-full"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <AdvancedFilters 
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
                mobileMode
              />
              
              <div className="mt-4 bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : Object.keys(topCie10).length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay datos disponibles</h3>
                  </div>
                ) : (
                  <Cie10TableWithPagination 
                    topCie10={topCie10} 
                    mobileMode 
                  />
                )}
              </div>
            </div>
          )}

          {activeMobileSection === 'citas' && (
            <div className={`p-4 ${SECTION_STYLES.primary}`}>
              <h2 className="text-lg font-bold mb-3">Citas por Médico</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">Médico</th>
                          <th className="px-3 py-2 text-center font-medium">Hoy</th>
                          <th className="px-3 py-2 text-center font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {stats.appointments?.doctorAppointments?.length > 0 ? (
                          stats.appointments.doctorAppointments.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-3 py-2 max-w-[120px] truncate">{item.medico}</td>
                              <td className="px-3 py-2 text-center">{item.citas_hoy}</td>
                              <td className="px-3 py-2 text-center">{item.citas_totales}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="px-3 py-4 text-center text-sm text-gray-500">
                              No hay citas asignadas
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeMobileSection === 'graficos' && (
            <div className={`p-4 ${SECTION_STYLES.secondary}`}>
              <h2 className="text-lg font-bold mb-3">Gráficos de Pacientes</h2>
              
              <div className="mb-4 bg-white rounded-lg shadow p-3">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {['gender', 'age', 'procedencia'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveChart(type)}
                      className={`flex-shrink-0 px-3 py-1 text-xs rounded-full ${
                        activeChart === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {type === 'gender' ? 'Género' : 
                       type === 'age' ? 'Edad' : 'Procedencia'}
                    </button>
                  ))}
                </div>

                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Edad Mín</label>
                      <input
                        type="number"
                        value={chartFilters.minAge}
                        onChange={(e) => setChartFilters({...chartFilters, minAge: e.target.value})}
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg"
                        placeholder="Mín"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Edad Máx</label>
                      <input
                        type="number"
                        value={chartFilters.maxAge}
                        onChange={(e) => setChartFilters({...chartFilters, maxAge: e.target.value})}
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg"
                        placeholder="Máx"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Procedencia</label>
                    <select
                      value={chartFilters.procedencia}
                      onChange={(e) => setChartFilters({...chartFilters, procedencia: e.target.value})}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg"
                    >
                      <option value="">Todas</option>
                      {stats.patients?.procedencia && Object.keys(stats.patients.procedencia).map(proc => (
                        <option key={proc} value={proc}>{proc}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={clearChartFilters}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm"
                    >
                      Limpiar
                    </button>
                    <button
                      onClick={applyChartFilters}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 h-64">
                {activeChart === 'gender' && (
                  <DoughnutChart 
                    data={chartData.gender} 
                    options={chartOptions.gender} 
                  />
                )}
                {activeChart === 'age' && (
                  <>
                    <div className="mb-1 text-sm">
                      {stats.patients?.custom_range 
                        ? `${stats.patients.min_age || '0'} a ${stats.patients.max_age || '+'} años`
                        : 'Rangos predefinidos'}
                    </div>
                    <BarChart 
                      data={chartData.age}
                      options={chartOptions.age}
                    />
                  </>
                )}
                {activeChart === 'procedencia' && (
                  <PieChart 
                    data={chartData.procedencia} 
                    options={chartOptions.procedencia} 
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

       {/* Versión desktop (se mantiene igual que antes) */}
      <div className="hidden lg:block py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Sección de encabezado */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        {/* Mensajes de error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sección 1: Tarjetas de resumen */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-5 ${SECTION_STYLES.primary}`}>
          <StatCard 
            title="Pacientes Totales" 
            value={loading ? '...' : (stats.patients?.total || 0)} 
            icon={<UserIcon className="h-6 w-6 text-blue-600" />}
            trend={stats.patients?.monthlyGrowth}
          />
          <StatCard 
            title="Nuevos (Mes)" 
            value={loading ? '...' : (stats.patients?.newThisMonth || 0)} 
            icon={<UserIcon className="h-6 w-6 text-green-600" />}
            className="col-span-1"
          />
          <StatCard 
            title="Citas Hoy" 
            value={loading ? '...' : (stats.appointments?.today || 0)} 
            icon={<CalendarIcon className="h-6 w-6 text-indigo-600" />}
            className="col-span-1"
          />
          <StatCard 
            title="Total Fármacos" 
            value={loading ? '...' : (stats.farmacos?.total_farmacos || 0)} 
            icon={<CubeIcon className="h-6 w-6 text-amber-600" />}
            className="col-span-1"
          />
          <StatCard 
            title="Stock Crítico" 
            value={loading ? '...' : (stats.farmacos?.count_criticos || 0)} 
            icon={<ExclamationTriangleIcon className="h-6 w-6 text-red-600" />}
            highlight={stats.farmacos?.count_criticos > 0 ? 'warning' : 'normal'}
            className="col-span-1"
          />
        </div>

        {/* Sección 2: Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Columna izquierda (3/5) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Fármacos críticos */}
{stats.farmacos?.count_criticos > 0 && (
  <div className={`p-5 ${SECTION_STYLES.accent}`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-800 flex items-center">
        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
        Fármacos con Stock Crítico (≤1 unidad)
      </h3>
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        {stats.farmacos.count_criticos} críticos
      </span>
    </div>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Nombre', 'Componente', 'Visual', 'Insamed', 'S&P', 'Total', 'Acción'].map((header) => (
                <th 
                  key={header}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stats.farmacos.farmacos_criticos.map((farmaco, index) => (
              <tr key={index} className="hover:bg-yellow-50">
                <td className="px-3 py-3 text-xs font-medium text-gray-900 max-w-[150px] truncate" title={farmaco.nombre_comercial}>
                  {farmaco.nombre_comercial}
                </td>
                <td className="px-3 py-3 text-xs text-gray-500 max-w-[150px] truncate" title={farmaco.componente_activo}>
                  {farmaco.componente_activo}
                </td>
                <td className="px-3 py-3 text-xs text-gray-500 text-center">
                  {farmaco.stock_visual}
                </td>
                <td className="px-3 py-3 text-xs text-gray-500 text-center">
                  {farmaco.stock_insamed}
                </td>
                <td className="px-3 py-3 text-xs text-gray-500 text-center">
                  {farmaco.stock_s_p}
                </td>
                <td className="px-3 py-3 text-xs font-bold text-center text-red-600">
                  {farmaco.stock_total}
                </td>
                <td className="px-3 py-3 text-xs text-center whitespace-nowrap">
                  <Link 
                    href={route('farmacos.stock.manage', farmaco.id)}
                    className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    title="Editar stock"
                  >
                    <PencilIcon className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

            {/* Top CIE10 */}
            <div className={`p-5 ${SECTION_STYLES.secondary}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Diagnósticos CIE10 más frecuentes</h3>
                <div className="flex items-center space-x-2">
                  {Object.keys(topCie10).length > 0 && (
                    <button 
                      onClick={exportToExcel}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                    >
                      <DocumentArrowDownIcon className="h-3 w-3 mr-1" />
                      Exportar
                    </button>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <AdvancedFilters 
                  onApplyFilters={handleApplyFilters}
                  onResetFilters={handleResetFilters}
                  compactMode
                />
                
                <div className="p-4">
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : Object.keys(topCie10).length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No hay datos disponibles</h3>
                    </div>
                  ) : (
                    <Cie10TableWithPagination topCie10={topCie10} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha (2/5) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Citas por médico */}
            <div className={`p-5 ${SECTION_STYLES.primary}`}>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Distribución de Citas</h3>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médico</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hoy</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Totales</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.appointments?.doctorAppointments?.length > 0 ? (
                        stats.appointments.doctorAppointments.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-xs truncate">
                              {item.medico}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {item.citas_hoy}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {item.citas_totales}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="px-4 py-4 text-center text-sm text-gray-500">
                            No hay citas asignadas a médicos
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Gráficos de pacientes */}
            <div className={`p-5 ${SECTION_STYLES.secondary}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Distribución de Pacientes</h3>
                <div className="flex space-x-2">
                  {['gender', 'age', 'procedencia'].map((type) => (
                    <button 
                      key={type}
                      onClick={() => setActiveChart(type)}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${
                        activeChart === type 
                          ? 'bg-blue-600 text-white shadow' 
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {type === 'gender' ? 'Género' : 
                       type === 'age' ? 'Edad' : 'Procedencia'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtros para gráficos */}
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Edad Mínima</label>
                    <input
                      type="number"
                      value={chartFilters.minAge}
                      onChange={(e) => setChartFilters({...chartFilters, minAge: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Mínima"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Edad Máxima</label>
                    <input
                      type="number"
                      value={chartFilters.maxAge}
                      onChange={(e) => setChartFilters({...chartFilters, maxAge: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Máxima"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Procedencia</label>
                    <select
                      value={chartFilters.procedencia}
                      onChange={(e) => setChartFilters({...chartFilters, procedencia: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Todas</option>
                      {stats.patients?.procedencia && Object.keys(stats.patients.procedencia).map(proc => (
                        <option key={proc} value={proc}>{proc}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={clearChartFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Limpiar
                  </button>
                  <button
                    onClick={applyChartFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Aplicar
                  </button>
                </div>
              </div>

              {/* Gráfico */}
              <div className="bg-white rounded-lg shadow p-4 h-80">
                {activeChart === 'gender' && (
                  <DoughnutChart 
                    data={chartData.gender} 
                    options={chartOptions.gender} 
                  />
                )}
                {activeChart === 'age' && (
                  <>
                    <div className="mb-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        {stats.patients?.custom_range 
                          ? `Rango de edad: ${stats.patients.min_age || '0'} a ${stats.patients.max_age || '+'} años`
                          : 'Distribución por rangos de edad predefinidos'}
                      </h4>
                    </div>
                    <BarChart 
                      data={chartData.age}
                      options={chartOptions.age}
                    />
                  </>
                )}
                {activeChart === 'procedencia' && (
                  <PieChart 
                    data={chartData.procedencia} 
                    options={chartOptions.procedencia} 
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}