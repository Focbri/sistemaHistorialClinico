import { useState, useEffect, useCallback } from 'react';
import { utils, writeFile } from 'xlsx';

const AdvancedFilters = ({
  initialFilters = {},
  disabledSections = {},
  onApplyFilters,
  onResetFilters,
  onExport,
  searchEndpoint = '/cie10/search',
  exportEnabled = true,
  showActiveFilters = true
}) => {
  const [filters, setFilters] = useState({
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
    },
    ...initialFilters
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const toggleFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      activeFilters: {
        ...prev.activeFilters,
        [filterName]: !prev.activeFilters[filterName]
      },
      // Reset values when filter is disabled
      ...(filterName === 'sex' && !prev.activeFilters[filterName] ? { sex: '' } : {}),
      ...(filterName === 'age' && !prev.activeFilters[filterName] ? { minAge: '', maxAge: '' } : {}),
      ...(filterName === 'dateRange' && !prev.activeFilters[filterName] ? { startDate: '', endDate: '' } : {}),
      ...(filterName === 'procedencia' && !prev.activeFilters[filterName] ? { procedencia: '' } : {}),
      ...(filterName === 'terms' && !prev.activeFilters[filterName] ? { selectedTerms: [] } : {})
    }));
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
      const response = await fetch(`${searchEndpoint}?query=${encodeURIComponent(filters.searchTerm)}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching:', error);
      setError('Error al buscar términos');
    } finally {
      setSearchLoading(false);
    }
  }, [filters.searchTerm, searchEndpoint]);

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
    });
    setError(null);
    onResetFilters && onResetFilters();
  };

  const applyFilters = () => {
    // Age validation
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
    
    // Date range validation
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
    
    // Sex validation
    if (filters.activeFilters.sex && !filters.sex) {
        setError('Por favor seleccione un sexo');
        return;
    }
    
    // Terms validation
    if (filters.activeFilters.terms && filters.selectedTerms.length === 0) {
        setError('Por favor seleccione al menos un término');
        return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      onApplyFilters(filters);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = !filters.activeFilters.age || 
                    (filters.minAge && filters.maxAge && parseInt(filters.maxAge) >= parseInt(filters.minAge));

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 2xl:text-2xl">Seleccione un Filtro</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Filter activation checkboxes */}
          {!disabledSections.all && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                {!disabledSections.sex && (
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.activeFilters.sex}
                      onChange={() => toggleFilter('sex')}
                      className="h-4 w-4 2xl:h-5 2xl:w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 2xl:text-lg">Sexo</span>
                  </label>
                )}
                
                {!disabledSections.age && (
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.activeFilters.age}
                      onChange={() => toggleFilter('age')}
                      className="h-4 w-4 2xl:h-5 2xl:w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 2xl:text-lg">Edad</span>
                  </label>
                )}
                
                {!disabledSections.dateRange && (
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.activeFilters.dateRange}
                      onChange={() => toggleFilter('dateRange')}
                      className="h-4 w-4 2xl:h-5 2xl:w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 2xl:text-lg">Rango Fechas</span>
                  </label>
                )}
                
               {!disabledSections.procedencia && (
                <label className="inline-flex items-center">
                    <input
                    type="checkbox"
                    checked={filters.activeFilters.procedencia}
                    onChange={() => toggleFilter('procedencia')}
                    className="h-4 w-4 2xl:h-5 2xl:w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 2xl:text-lg">Procedencia</span>
                </label>
                )}
                
                {!disabledSections.terms && (
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.activeFilters.terms}
                      onChange={() => toggleFilter('terms')}
                      className="h-4 w-4 2xl:h-5 2xl:w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 2xl:text-lg">Términos</span>
                  </label>
                )}
              </div>
            </div>
          )}
          
          {/* Sex filter */}
          {!disabledSections.sex && filters.activeFilters.sex && (
            <div className="space-y-2 pl-4">
              <label className="block text-sm font-medium text-gray-700 2xl:text-lg">Sexo</label>
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
          
          {/* Age filter */}
          {!disabledSections.age && filters.activeFilters.age && (
            <>
              <div className="space-y-2 pl-4">
                <label className="block text-sm font-medium text-gray-700 2xl:text-lg">Edad mínima</label>
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
              <div className="space-y-2 px-4">
                <label className="block text-sm font-medium text-gray-700 2xl:text-lg">Edad máxima</label>
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
          
          {/* Date range filter */}
          {!disabledSections.dateRange && filters.activeFilters.dateRange && (
            <>
              <div className="space-y-2 pl-4">
                <label className="block text-sm font-medium text-gray-700 2xl:text-lg">Fecha inicial</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 2xl:text-lg">Fecha final</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </>
          )}
          
        {!disabledSections.procedencia && filters.activeFilters.procedencia && (
        <div className="space-y-2 pl-4">
            <label className="block text-sm font-medium text-gray-700 2xl:text-lg">Procedencia</label>
            <select
            name="procedencia"
            value={filters.procedencia}
            onChange={handleFilterChange}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
            <option value="">Seleccionar distrito</option>
            <option value="Ancon">Ancon</option>
                <option value="Ate">Ate</option>
                <option value="Barranco">Barranco</option>
                <option value="Breña">Breña</option>
                <option value="Carabayllo">Carabayllo</option>
                <option value="Chaclacayo">Chaclacayo</option>
                <option value="Chorrillos">Chorrillos</option>
                <option value="Cienegilla">Cienegilla</option>
                <option value="Comas">Comas</option>
                <option value="El Agustino">El Agustino</option>
                <option value="Independencia">Independencia</option>
                <option value="Jesús María">Jesús María</option>
                <option value="La Molina">La Molina</option>
                <option value="La Victoria">La Victoria</option>
                <option value="Lima">Lima</option>
                <option value="Lince">Lince</option>
                <option value="Los Olivos">Los Olivos</option>
                <option value="Lurigancho">Lurigancho</option>
                <option value="Lurín">Lurín</option>
                <option value="Magdalena del Mar">Magdalena del Mar</option>
                <option value="Miraflores">Miraflores</option>
                <option value="Pachacamac">Pachacamac</option>
                <option value="Pucusana">Pucusana</option>
                <option value="Pueblo Libre">Pueblo Libre</option>
                <option value="Puente Piedra">Puente Piedra</option>
                <option value="Punta Hermosa">Punta Hermosa</option>
                <option value="Punta Negra">Punta Negra</option>
                <option value="Rimac">Rimac</option>
                <option value="San Bartolo">San Bartolo</option>
                <option value="San Borja">San Borja</option>
                <option value="San Isidro">San Isidro</option>
                <option value="San Juan de Lurigancho">San Juan de Lurigancho</option>
                <option value="San Juan de Miraflores">San Juan de Miraflores</option>
                <option value="San Luis">San Luis</option>
                <option value="San Martín de Porres">San Martín de Porres</option>
                <option value="San Miguel">San Miguel</option>
                <option value="Santa Anita">Santa Anita</option>
                <option value="Santa María del Mar">Santa María del Mar</option>
                <option value="Santa Rosa">Santa Rosa</option>
                <option value="Santiago de Surco">Santiago de Surco</option>
                <option value="Surquillo">Surquillo</option>
                <option value="Villa El Salvador">Villa El Salvador</option>
                <option value="Villa María del Triunfo">Villa María del Triunfo</option>
            </select>
        </div>
        )}
          
          {/* Terms filter */}
          {!disabledSections.terms && filters.activeFilters.terms && (
            <div className="col-span-2 space-y-2 pl-4">
              <label className="block text-sm font-medium text-gray-700 2xl:text-lg">Buscar términos</label>
              <div className="relative">
                <input
                  type="text"
                  name="searchTerm"
                  value={filters.searchTerm}
                  onChange={handleSearchTermChange}
                  placeholder="Buscar código o descripción..."
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

              {/* Search results */}
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

              {/* Selected terms */}
              {filters.selectedTerms.length > 0 && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 2xl:text-lg mb-1">Términos seleccionados</label>
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
        
        {/* Error messages and actions */}
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
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 2xl:text-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Limpiar
            </button>
            <button
              onClick={applyFilters}
              disabled={loading || !isFormValid}
              className="inline-flex 2xl:text-lg items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 2xl:h-5 2xl:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
  );
};

export default AdvancedFilters;