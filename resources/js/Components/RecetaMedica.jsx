import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const RecetaMedica = ({ 
  consultaId, 
  pacienteId, 
  medicoId, 
  recetaData, // Add this prop
  onRecetaChange 
}) => {

  const [cie10Codes, setCie10Codes] = useState(recetaData?.cie10_codes || []);
  const [medicamentos, setMedicamentos] = useState(recetaData?.medicamentos || []);
  const [indicacionesGenerales, setIndicacionesGenerales] = useState(recetaData?.indicaciones_generales || '');
  // Estados para CIE-10
  const [cie10SearchTerm, setCie10SearchTerm] = useState('');
  const [cie10Results, setCie10Results] = useState([]);
  const [isSearchingCie10, setIsSearchingCie10] = useState(false);
  const [cie10Error, setCie10Error] = useState(null);
  const [showManualCie10Form, setShowManualCie10Form] = useState(false);
  const [codigoCie10, setCodigoCie10] = useState('');
  const [descripcionCie10, setDescripcionCie10] = useState('');

  // Estados para fármacos
  const [farmacoSearchTerm, setFarmacoSearchTerm] = useState('');
  const [farmacoResults, setFarmacoResults] = useState([]);
  const [isSearchingFarmaco, setIsSearchingFarmaco] = useState(false);
  const [farmacoError, setFarmacoError] = useState(null);

  // Configuración de axios para manejar CSRF token en Laravel
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  const token = document.head.querySelector('meta[name="csrf-token"]');
  if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
  }

  const [showManualFarmacoForm, setShowManualFarmacoForm] = useState(false);
const [manualFarmaco, setManualFarmaco] = useState({
  nombre: '',
  componente: '',
  presentacion: '',
  concentracion: ''
});

   useEffect(() => {
    if (recetaData) {
      setCie10Codes(recetaData.cie10_codes || []);
      setMedicamentos(recetaData.medicamentos || []);
      setIndicacionesGenerales(recetaData.indicaciones_generales || '');
    }
  }, [recetaData]);

  // Formatear término CIE-10
  const formatCie10Term = (code, description) => {
    return code ? `${code}|${description}` : description;
  };

  // Búsqueda de términos CIE-10
  const searchCie10Terms = useCallback(async (term) => {
      if (!term.trim()) {
        setCie10Results([]);
        return;
      }

      setIsSearchingCie10(true);
      setCie10Error(null);

      try {
        const response = await axios.get('/cie10/search', {
          params: { query: term }
        });
        setCie10Results(response.data);
      } catch (err) {
        console.error('Error en búsqueda CIE-10:', err);
        setCie10Error('Error al buscar términos CIE-10. Intente nuevamente.');
        setCie10Results([]);
      } finally {
        setIsSearchingCie10(false);
      }
    }, []);

    const handleAddManualFarmaco = () => {
    if (!manualFarmaco.nombre || !manualFarmaco.presentacion) {
      setFarmacoError('Nombre comercial y presentación son obligatorios');
      return;
    }

    const nuevoMedicamento = {
      id: `manual-${Date.now()}`,
      farmaco_id: null, // Importante: null indica que es manual
      nombre_comercial: manualFarmaco.nombre,
      componente_activo: manualFarmaco.componente || '',
      presentacion: manualFarmaco.presentacion,
      concentracion: manualFarmaco.concentracion || '',
      cantidad: 1,
      dosis: '',
      frecuencia: '',
      duracion: '',
      es_manual: true
    };

    const nuevosMedicamentos = [...medicamentos, nuevoMedicamento];
    setMedicamentos(nuevosMedicamentos);
    updateReceta({ medicamentos: nuevosMedicamentos });
    
    setManualFarmaco({
      nombre: '',
      componente: '',
      presentacion: '',
      concentracion: ''
    });
    setShowManualFarmacoForm(false);
    setFarmacoError(null);
  };

  // Búsqueda de fármacos **********
  const searchFarmacos = useCallback(async (term) => {
  if (!term?.trim()) {
    setFarmacoResults([]);
    return;
  }

  setIsSearchingFarmaco(true);
  setFarmacoError(null);

  try {
    const response = await axios.get('/farmacos/buscar', {
      params: { 
        search: term || '',
        with_stock: 1
      },
      paramsSerializer: params => {
        return Object.entries(params)
          .map(([key, value]) => {
            if (typeof value === 'boolean') {
              return `${key}=${value ? 'true' : 'false'}`;
            }
            return `${key}=${encodeURIComponent(value)}`;
          })
          .join('&');
      }
    });

    console.log('Respuesta del servidor:', response.data);

    if (!response.data || !Array.isArray(response.data.data)) {
      throw new Error('Formato de respuesta inesperado');
    }

    const farmacosData = response.data.data;
    
    const farmacosConStock = farmacosData.map((farmaco) => {
      const stockTotal = farmaco.stock?.total || 
                       (farmaco.stock?.visual || 0) + 
                       (farmaco.stock?.insamed || 0) + 
                       (farmaco.stock?.s_p || 0);

      return {
        id: farmaco.id,
        farmaco_id: farmaco.id,
        nombre_comercial: farmaco.nombre_comercial,
        componente_activo: farmaco.componente_activo,
        presentacion: farmaco.presentacion,
        concentracion: farmaco.concentracion,
        stock_total: stockTotal,
        stock_disponible: stockTotal, // Mostrar el stock total sin restar
        stock_detalle: farmaco.stock || {
          visual: 0,
          insamed: 0,
          s_p: 0
        }
      };
    });

    setFarmacoResults(farmacosConStock);
  } catch (err) {
    console.error('Error en búsqueda de fármacos:', {
      error: err,
      response: err.response?.data
    });
    setFarmacoError(err.response?.data?.message || 'Error al buscar fármacos');
  } finally {
    setIsSearchingFarmaco(false);
  }
}, []);

  // Manejar selección de término CIE-10
  const handleSelectCie10Term = (term) => {
    if (cie10Codes.includes(term)) return;

    const newCodes = [...cie10Codes, term];
    setCie10Codes(newCodes);
    setCie10SearchTerm('');
    setCie10Results([]);
    updateReceta({ cie10_codes: newCodes });
  };

  // Agregar término CIE-10 manualmente
  const handleAddManualCie10Term = async () => {
    if (!descripcionCie10.trim()) {
      setCie10Error('La descripción es obligatoria');
      return;
    }

    const term = formatCie10Term(codigoCie10.trim(), descripcionCie10.trim());

    if (cie10Codes.includes(term)) {
      setCie10Error('Este término ya fue agregado');
      return;
    }

    try {
      await axios.post('/cie10', { 
        termino: term,
        list_01: term
      });

      const newCodes = [...cie10Codes, term];
      setCie10Codes(newCodes);
      setCodigoCie10('');
      setDescripcionCie10('');
      setShowManualCie10Form(false);
      setCie10Error(null);
      updateReceta({ cie10_codes: newCodes });
    } catch (err) {
      console.error('Error al guardar término CIE-10:', err);
      const newCodes = [...cie10Codes, term];
      setCie10Codes(newCodes);
      setCie10Error('El término se agregó pero no se pudo guardar en el catálogo');
      updateReceta({ cie10_codes: newCodes });
    }
  };

  // Eliminar término CIE-10
  const handleRemoveCie10Term = (index) => {
    const newCodes = cie10Codes.filter((_, i) => i !== index);
    setCie10Codes(newCodes);
    updateReceta({ cie10_codes: newCodes });
  };

  // Corregir handleUpdateCantidad  *********
const handleUpdateCantidad = (index, e) => {
  const value = e.target.value;
  const cantidad = parseInt(value) || 0;
  
  if (cantidad < 1) {
    setFarmacoError('La cantidad debe ser al menos 1');
    return;
  }

  const nuevosMedicamentos = [...medicamentos];
  const medicamento = nuevosMedicamentos[index];
  
  if (medicamento.es_manual) {
    nuevosMedicamentos[index] = {
      ...medicamento,
      cantidad: cantidad
    };
  } 
  else {
    // Validación de stock contra el total (sin considerar otras recetas)
    if (cantidad > medicamento.stock_total) {
      setFarmacoError(`Stock insuficiente para ${medicamento.nombre_comercial}`);
      return;
    }

    nuevosMedicamentos[index] = {
      ...medicamento,
      cantidad: cantidad,
      stock_disponible: medicamento.stock_total // Seguir mostrando el total
    };
  }
    
  setMedicamentos(nuevosMedicamentos);
  setFarmacoError(null);
  updateReceta({ medicamentos: nuevosMedicamentos });
  
  if (farmacoSearchTerm) {
    searchFarmacos(farmacoSearchTerm);
  }
};


  // Corregir handleAddMedicamento ************
 const handleAddMedicamento = (farmaco) => {
  try {
    // Validación de stock sin restar lo ya en receta
    if (farmaco.stock_total < 1) {
      setFarmacoError(`Stock insuficiente para ${farmaco.nombre_comercial}`);
      return;
    }

    const nuevoMedicamento = {
      id: farmaco.id,
      farmaco_id: farmaco.id,
      nombre_comercial: farmaco.nombre_comercial,
      componente_activo: farmaco.componente_activo,
      presentacion: farmaco.presentacion,
      concentracion: farmaco.concentracion,
      cantidad: 1,
      dosis: '',
      frecuencia: '',
      duracion: '',
      stock_total: farmaco.stock_total,
      stock_disponible: farmaco.stock_total, // Mantener el stock total
      stock_detalle: farmaco.stock_detalle
    };

    const nuevosMedicamentos = [...medicamentos, nuevoMedicamento];
    setMedicamentos(nuevosMedicamentos);
    updateReceta({ medicamentos: nuevosMedicamentos });
    
    setFarmacoSearchTerm('');
    setFarmacoResults([]);
    setFarmacoError(null);
  } catch (err) {
    console.error('Error al agregar medicamento:', err);
    setFarmacoError('Error al agregar medicamento. Intente nuevamente.');
  }
};

  // Actualizar detalles de medicamento
const handleUpdateMedicamento = (index, field, value) => {
    const newMedicamentos = [...medicamentos];
    newMedicamentos[index][field] = value;
    setMedicamentos(newMedicamentos);
    updateReceta({ medicamentos: newMedicamentos });
  };

  // Eliminar medicamento
   const handleRemoveMedicamento = (index) => {
    const newMedicamentos = medicamentos.filter((_, i) => i !== index);
    setMedicamentos(newMedicamentos);
    updateReceta({ medicamentos: newMedicamentos });
  };

  // Manejar cambios en indicaciones generales
  const handleIndicacionesChange = (e) => {
    const value = e.target.value;
    setIndicacionesGenerales(value);
    updateReceta({ indicaciones_generales: value });
  };

  const verificarDisponibilidadStock = useCallback(async (farmacoId, cantidadRequerida) => {
    try {
      const response = await axios.get(`/farmacos/${farmacoId}/stock`);
      const stockTotal = response.data.visual + response.data.insamed + response.data.s_p;
      return stockTotal >= cantidadRequerida;
    } catch (error) {
      console.error('Error al verificar stock:', error);
      return false;
    }
  }, []);

  // Función para actualizar stock en el backend
  const actualizarStock = async () => {
    try {
      if (medicamentos.length === 0) return true;
  
      const response = await axios.post('/farmacos/stock/actualizar-por-receta', {
        medicamentos: medicamentos.map(m => ({
          farmaco_id: m.farmaco_id,
          cantidad: m.cantidad
        }))
      });
  
      if (!response.data.success) {
        throw new Error(response.data.message || 'Error al actualizar stock');
      }
  
      return true;
    } catch (err) {
      console.error('Error al actualizar stock:', err);
      setFarmacoError(err.response?.data?.message || 'Error al actualizar stock. Intente nuevamente.');
      return false;
    }
  };

  // En RecetaMedica.jsx *******
 const updateReceta = useCallback((partialData = {}) => {
    const newRecetaData = {
      paciente_id: pacienteId,
      medico_id: medicoId,
      consulta_id: consultaId,
      cie10_codes: partialData.cie10_codes || cie10Codes,
      medicamentos: partialData.medicamentos || medicamentos,
      indicaciones_generales: partialData.indicaciones_generales || indicacionesGenerales,
      fecha: new Date().toISOString().split('T')[0]
    };

    onRecetaChange(newRecetaData);
  }, [pacienteId, medicoId, consultaId, cie10Codes, medicamentos, indicacionesGenerales, onRecetaChange]);

  // Efectos para búsquedas con debounce
useEffect(() => {
  const cie10Timer = setTimeout(() => searchCie10Terms(cie10SearchTerm), 300);
  const farmacoTimer = setTimeout(() => searchFarmacos(farmacoSearchTerm), 300);
  
  return () => {
    clearTimeout(cie10Timer);
    clearTimeout(farmacoTimer);
  };
}, [cie10SearchTerm, farmacoSearchTerm, searchCie10Terms, searchFarmacos, medicamentos]); 

  useEffect(() => {
    if (recetaData) {
      setCie10Codes(recetaData.cie10_codes || []);
      setMedicamentos(recetaData.medicamentos || []);
      setIndicacionesGenerales(recetaData.indicaciones_generales || '');
    }
  }, [recetaData]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Receta Médica</h2>
      
      {/* Sección de CIE-10 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Diagnósticos CIE-10</label>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={cie10SearchTerm}
                onChange={(e) => setCie10SearchTerm(e.target.value)}
                placeholder="Buscar CIE-10..."
                className="w-full rounded-md border-gray-300 shadow-sm p-2"
              />
              {isSearchingCie10 && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => setShowManualCie10Form(!showManualCie10Form)}
              className={`px-3 py-1 rounded ${
                showManualCie10Form ? 'bg-gray-500 text-white' : 'bg-blue-500 text-white'
              } hover:opacity-90`}
            >
              {showManualCie10Form ? 'Cancelar' : '+ Manual'}
            </button>
          </div>

          {/* Formulario manual CIE-10 */}
          {showManualCie10Form && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código (opcional)
                </label>
                <input
                  type="text"
                  value={codigoCie10}
                  onChange={(e) => setCodigoCie10(e.target.value)}
                  placeholder="Ej: E11.9"
                  className="w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={descripcionCie10}
                    onChange={(e) => setDescripcionCie10(e.target.value)}
                    placeholder="Descripción del diagnóstico"
                    className="flex-1 rounded-md border-gray-300 shadow-sm p-2"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddManualCie10Term()}
                  />
                  <button
                    type="button"
                    onClick={handleAddManualCie10Term}
                    disabled={!descripcionCie10.trim()}
                    className={`px-3 py-1 rounded ${
                      descripcionCie10.trim()
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

          {/* Resultados de búsqueda CIE-10 */}
          {cie10Results.length > 0 && (
            <ul className="border border-gray-200 rounded-md max-h-60 overflow-y-auto">
              {cie10Results.map((result, index) => (
                <li
                  key={`cie10-result-${index}`}
                  onClick={() => handleSelectCie10Term(result)}
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

          {/* Términos CIE-10 seleccionados */}
          <div className="mt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Códigos CIE-10 ({cie10Codes.length})
              </span>
            </div>
            
            {cie10Codes.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {cie10Codes.map((term, index) => {
                  const [code, ...descriptionParts] = term.split('|');
                  const description = descriptionParts.join('|');
                  
                  return (
                    <li
                      key={`selected-cie10-${index}`}
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
                        onClick={() => handleRemoveCie10Term(index)}
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

          {/* Formulario para fármaco manual */}
          {showManualFarmacoForm && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-md mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Comercial *
                </label>
                <input
                  type="text"
                  value={manualFarmaco.nombre}
                  onChange={(e) => setManualFarmaco({...manualFarmaco, nombre: e.target.value})}
                  placeholder="Ej: Paracetamol Genérico"
                  className="w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Componente Activo
                </label>
                <input
                  type="text"
                  value={manualFarmaco.componente}
                  onChange={(e) => setManualFarmaco({...manualFarmaco, componente: e.target.value})}
                  placeholder="Ej: Paracetamol"
                  className="w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Presentación *
                </label>
                <input
                  type="text"
                  value={manualFarmaco.presentacion}
                  onChange={(e) => setManualFarmaco({...manualFarmaco, presentacion: e.target.value})}
                  placeholder="Ej: Tabletas 500mg"
                  className="w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddManualFarmaco}
                  disabled={!manualFarmaco.nombre || !manualFarmaco.presentacion}
                  className={`px-3 py-2 rounded ${
                    manualFarmaco.nombre && manualFarmaco.presentacion
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Agregar Fármaco
                </button>
              </div>
            </div>
          )}

          {/* Mensajes de error CIE-10 */}
          {cie10Error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
              {cie10Error}
            </div>
          )}
        </div>
      </div>

      {/* Sección de Fármacos */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Medicamentos</label>
        
        <div className="space-y-3">
          {/* Buscador de fármacos */}
          <div className="relative farmaco-search-container">
            <input
              type="text"
              value={farmacoSearchTerm}
              onChange={(e) => setFarmacoSearchTerm(e.target.value)}
              placeholder="Buscar fármaco por nombre comercial o componente activo"
              className="w-full rounded-md border-gray-300 shadow-sm p-2"
            />
            {isSearchingFarmaco && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          <button
          type="button"
          onClick={() => setShowManualFarmacoForm(!showManualFarmacoForm)}
          className={`px-3 py-1 rounded ${
            showManualFarmacoForm ? 'bg-gray-500 text-white' : 'bg-blue-500 text-white'
          } hover:opacity-90`}
        >
          {showManualFarmacoForm ? 'Cancelar' : '+ Manual'}
        </button>
          {/* Resultados de búsqueda de fármacos */}
          {farmacoResults.length > 0 && (
            <ul className="border border-gray-200 rounded-md max-h-60 overflow-y-auto">
              {farmacoResults.map((farmaco) => (
                <li
                  key={`farmaco-${farmaco.id}`}
                  onClick={() => handleAddMedicamento(farmaco)}
                  className="p-2 hover:bg-blue-50 cursor-pointer"
                >
                  <div className="font-medium">{farmaco.nombre_comercial}</div>
                  <div className="text-sm">
                    {farmaco.componente_activo} - {farmaco.presentacion} {farmaco.concentracion}
                  </div>
                  <div className="text-xs mt-1">
                    <span className="font-semibold">Stock total: {farmaco.stock_total}</span>
                    <div className="text-xs text-gray-600 mt-1">
                      Visual: {farmaco.stock_detalle?.visual || 0} | 
                      Insamed: {farmaco.stock_detalle?.insamed || 0} | 
                      S&P: {farmaco.stock_detalle?.s_p || 0}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Lista de medicamentos en receta */}
          <div className="mt-3">
            {medicamentos.length > 0 ? (
              <div className="space-y-4">
                {medicamentos.map((med, index) => (
                  <div key={`med-${index}`} className="border p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{med.nombre_comercial}</h4>
                        <p className="text-sm text-gray-600">
                          {med.componente_activo} - {med.presentacion} {med.concentracion}
                          {med.es_manual && <span className="ml-2 text-blue-500">(Manual)</span>}
                        </p>
                        {/* Solo mostrar stock si NO es manual */}
                        {!med.es_manual && (
                          <p className="text-xs mt-1">
                            <span className="text-green-600">
                              Stock total disponible: {med.stock_disponible}
                            </span>
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveMedicamento(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Cantidad</label>
                        <input
                          type="number"
                          min="1"
                          value={med.cantidad}
                          onChange={(e) => {
                            const value = Math.max(1, parseInt(e.target.value) || 1);
                            e.target.value = value;
                            handleUpdateCantidad(index, e);
                          }}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Dosis</label>
                        <input
                          type="text"
                          value={med.dosis}
                          onChange={(e) => handleUpdateMedicamento(index, 'dosis', e.target.value)}
                          placeholder="Ej: 1 tableta"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Frecuencia</label>
                        <input
                          type="text"
                          value={med.frecuencia}
                          onChange={(e) => handleUpdateMedicamento(index, 'frecuencia', e.target.value)}
                          placeholder="Ej: Cada 8 horas"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Duración</label>
                        <input
                          type="text"
                          value={med.duracion}
                          onChange={(e) => handleUpdateMedicamento(index, 'duracion', e.target.value)}
                          placeholder="Ej: 7 días"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic">
                No hay medicamentos agregados a la receta
              </p>
            )}
          </div>

          {/* Mensajes de error fármacos */}
          {farmacoError && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
              {farmacoError}
            </div>
          )}
        </div>
      </div>

      {/* Indicaciones generales */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Indicaciones Generales</label>
        <textarea
          value={indicacionesGenerales}
          onChange={handleIndicacionesChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Indicaciones adicionales para el paciente"
        />
      </div>
    </div>
  );
};

export default React.memo(RecetaMedica);