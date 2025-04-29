import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FarmacoSearch = ({ onSelectMedicamento, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarMedicamentos = async (term) => {
    if (term.trim().length < 2) {
      setResultados([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/farmacos/buscar', {
        params: { search: term },
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        }
      });

      if (response.data.success) {
        setResultados(response.data.data);
      } else {
        throw new Error(response.data.message || 'Error en la respuesta del servidor');
      }
      
    } catch (err) {
      console.error('Error en la búsqueda:', err);
      setError(err.response?.data?.message || 
               err.message || 
               'Error al conectar con el servidor');
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      buscarMedicamentos(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Buscar Medicamento</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar medicamento..."
            className="w-full p-2 border border-gray-300 rounded"
            autoFocus
          />
        </div>
        
        {loading && <p className="text-center py-4">Buscando...</p>}
        {error && <p className="text-red-500 text-center py-4">{error}</p>}
        
        <div className="space-y-2">
          {resultados.map((farmaco) => (
            <div 
              key={farmaco.id} 
              onClick={() => {
                onSelectMedicamento({
                  ...farmaco,
                  stock: farmaco.stock_total,
                  almacen: farmaco.almacen_principal
                });
                onClose();
              }}
              className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                farmaco.stock_total <= 0 ? 'bg-red-50 border-red-200' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between">
                <h4 className="font-medium">{farmaco.nombre}</h4>
                <span className={`px-2 py-1 text-xs rounded ${
                  farmaco.stock_total <= 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  Stock: {farmaco.stock_total}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {farmaco.presentacion} | {farmaco.componente_activo} ({farmaco.concentracion})
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Almacén: {farmaco.almacen_principal} | 
                Visual: {farmaco.stock_visual} | 
                Insamed: {farmaco.stock_insamed} | 
                S/P: {farmaco.stock_s_p}
              </p>
            </div>
          ))}
        </div>
        
        {!loading && resultados.length === 0 && searchTerm.length >= 2 && (
          <p className="text-center py-4 text-gray-500">No se encontraron medicamentos</p>
        )}
      </div>
    </div>
  );
};

export default FarmacoSearch;