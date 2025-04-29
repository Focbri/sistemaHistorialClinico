import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const RecetaMedica = ({ 
  consultaId, 
  pacienteId, 
  medicoId, 
  cie10Codes: initialCodes = [], 
  onRecetaChange 
}) => {
  const [medicamentos, setMedicamentos] = useState([{ 
    nombre: '', 
    dosis: '', 
    frecuencia: '', 
    duracion: '' 
  }]);

  const [recetaData, setRecetaData] = useState({
    consulta_id: consultaId,
    paciente_id: pacienteId,
    medico_id: medicoId,
    cie10_codes: initialCodes,
    medicamentos: [],
    indicaciones_generales: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  // Estados para el buscador CIE-10
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Formatear término para almacenamiento
  const formatTerm = (code, description) => {
    return code ? `${code}|${description}` : description;
  };

  // Actualizar datos de la receta
  const updateRecetaData = useCallback((newData) => {
    setRecetaData(newData);
    if (onRecetaChange) onRecetaChange(newData);
  }, [onRecetaChange]);

  // Búsqueda de términos CIE-10
  const searchTerms = useCallback(async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await axios.get('/cie10/search', {
        params: { query: term },
        timeout: 5000
      });
      setSearchResults(response.data);
    } catch (err) {
      console.error('Error en búsqueda:', err);
      setError('Error al buscar términos. Intente nuevamente.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => searchTerms(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, searchTerms]);

  // Manejar selección de término CIE-10
  const handleSelectTerm = useCallback((term) => {
    if (recetaData.cie10_codes.includes(term)) return;

    const newCodes = [...recetaData.cie10_codes, term];
    const newData = {
      ...recetaData,
      cie10_codes: newCodes
    };
    updateRecetaData(newData);
    setSearchTerm('');
    setSearchResults([]);
  }, [recetaData, updateRecetaData]);

  // Agregar término manualmente
  const handleAddManualTerm = useCallback(async () => {
    if (!descripcion.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    const term = formatTerm(codigo.trim(), descripcion.trim());

    if (recetaData.cie10_codes.includes(term)) {
      setError('Este término ya fue agregado');
      return;
    }

    try {
      await axios.post('/cie10', { 
        termino: term,
        list_01: term
      });

      const newCodes = [...recetaData.cie10_codes, term];
      const newData = {
        ...recetaData,
        cie10_codes: newCodes
      };
      updateRecetaData(newData);
      setCodigo('');
      setDescripcion('');
      setShowManualForm(false);
      setError(null);
    } catch (err) {
      console.error('Error al guardar:', err);
      const newCodes = [...recetaData.cie10_codes, term];
      const newData = {
        ...recetaData,
        cie10_codes: newCodes
      };
      updateRecetaData(newData);
      setError('El término se agregó pero no se pudo guardar en el catálogo');
    }
  }, [codigo, descripcion, recetaData, updateRecetaData]);

  // Eliminar término CIE-10
  const handleRemoveTerm = useCallback((index) => {
    const newCodes = recetaData.cie10_codes.filter((_, i) => i !== index);
    const newData = {
      ...recetaData,
      cie10_codes: newCodes
    };
    updateRecetaData(newData);
  }, [recetaData, updateRecetaData]);

  const handleAddMedicamento = () => {
    const newMedicamentos = [...medicamentos, { 
      nombre: '', 
      dosis: '', 
      frecuencia: '', 
      duracion: '' 
    }];
    setMedicamentos(newMedicamentos);
    updateParentReceta(newMedicamentos);
  };

  const handleMedicamentoChange = (index, field, value) => {
    const newMedicamentos = [...medicamentos];
    newMedicamentos[index][field] = value;
    setMedicamentos(newMedicamentos);
    updateParentReceta(newMedicamentos);
  };

  const updateParentReceta = (meds) => {
    const filteredMeds = meds.filter(m => m.nombre.trim() !== '');
    const newData = {
      ...recetaData,
      medicamentos: filteredMeds
    };
    updateRecetaData(newData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = {
      ...recetaData,
      [name]: value
    };
    updateRecetaData(newData);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Receta Médica</h2>
      <div>
        {/* Sección de CIE-10 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Diagnósticos CIE-10</label>
          
          {/* Buscador CIE-10 */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar CIE-10..."
                  className="w-full rounded-md border-gray-300 shadow-sm"
                />
                {isSearching && (
                  <div className="absolute right-3 top-2.5">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => setShowManualForm(!showManualForm)}
                className={`px-3 py-1 rounded ${
                  showManualForm ? 'bg-gray-500 text-white' : 'bg-blue-500 text-white'
                } hover:opacity-90`}
              >
                {showManualForm ? 'Cancelar' : '+ Manual'}
              </button>
            </div>

            {/* Formulario manual */}
            {showManualForm && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código (opcional)
                  </label>
                  <input
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="Ej: E11.9"
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      placeholder="Descripción del diagnóstico"
                      className="flex-1 rounded-md border-gray-300 shadow-sm"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddManualTerm()}
                    />
                    <button
                      type="button"
                      onClick={handleAddManualTerm}
                      disabled={!descripcion.trim()}
                      className={`px-3 py-1 rounded ${
                        descripcion.trim()
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Resultados de búsqueda */}
            {searchResults.length > 0 && (
              <ul className="border border-gray-200 rounded-md max-h-60 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <li
                    key={`result-${index}`}
                    onClick={() => handleSelectTerm(result)}
                    className="p-2 hover:bg-blue-50 cursor-pointer"
                  >
                    {result.includes('|') ? (
                      <>
                        <span className="font-mono text-blue-700">
                          {result.split('|')[0]}
                        </span>
                        <span className="ml-2">{result.split('|').slice(1).join('|')}</span>
                      </>
                    ) : (
                      <span>{result}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* Términos seleccionados */}
            <div className="mt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Códigos CIE-10 ({recetaData.cie10_codes.length})
                </span>
              </div>
              
              {recetaData.cie10_codes.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {recetaData.cie10_codes.map((term, index) => {
                    const [code, ...descriptionParts] = term.split('|');
                    const description = descriptionParts.join('|');
                    
                    return (
                      <li
                        key={`selected-${index}`}
                        className="bg-gray-100 rounded-md px-3 py-1 flex items-center group"
                      >
                        {code && (
                          <span className="font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded mr-2 text-sm">
                            {code}
                          </span>
                        )}
                        <span className="max-w-xs truncate" title={description}>
                          {description}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTerm(index)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm italic">
                  No hay códigos CIE-10 seleccionados
                </p>
              )}
            </div>

            {/* Mensajes de error */}
            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Sección de Medicamentos */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Medicamentos</label>
          {medicamentos.map((med, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 mb-2">
              <input
                type="text"
                placeholder="Nombre"
                className="border-gray-300 rounded-md shadow-sm p-2"
                value={med.nombre}
                onChange={(e) => handleMedicamentoChange(index, 'nombre', e.target.value)}
              />
              <input
                type="text"
                placeholder="Dosis"
                className="border-gray-300 rounded-md shadow-sm p-2"
                value={med.dosis}
                onChange={(e) => handleMedicamentoChange(index, 'dosis', e.target.value)}
              />
              <input
                type="text"
                placeholder="Frecuencia"
                className="border-gray-300 rounded-md shadow-sm p-2"
                value={med.frecuencia}
                onChange={(e) => handleMedicamentoChange(index, 'frecuencia', e.target.value)}
              />
              <input
                type="text"
                placeholder="Duración"
                className="border-gray-300 rounded-md shadow-sm p-2"
                value={med.duracion}
                onChange={(e) => handleMedicamentoChange(index, 'duracion', e.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddMedicamento}
            className="text-sm text-blue-500 hover:text-blue-700 mb-4"
          >
            + Añadir otro medicamento
          </button>
        </div>

        {/* Indicaciones generales */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Indicaciones Generales</label>
          <textarea
            name="indicaciones_generales"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={recetaData.indicaciones_generales}
            onChange={handleChange}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default RecetaMedica;