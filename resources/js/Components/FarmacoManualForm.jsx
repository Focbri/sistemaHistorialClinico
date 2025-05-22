import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const FarmacoManualForm = ({ onAddManualFarmaco, onCancel }) => {
  const [manualFarmaco, setManualFarmaco] = useState({
    nombre: '',
    componente: '',
    presentacion: '',
    concentracion: ''
  });
  const [error, setError] = useState(null);

  // En FarmacoManualForm.jsx
const handleAddManualFarmaco = () => {
    if (!manualFarmaco.nombre || !manualFarmaco.presentacion) {
      setError('Nombre comercial y presentación son obligatorios');
      return;
    }

    const nuevoMedicamento = {
      id: `manual-${Date.now()}`,
      farmaco_id: null, // Asegurar que es null para manuales
      nombre_comercial: manualFarmaco.nombre,
      componente_activo: manualFarmaco.componente || '',
      presentacion: manualFarmaco.presentacion,
      concentracion: manualFarmaco.concentracion || '',
      cantidad: 1,
      dosis: '',
      frecuencia: '',
      duracion: '',
      // Eliminar campos de stock para manuales
      es_manual: true
    };

    onAddManualFarmaco(nuevoMedicamento);
    
    // Reset form
    setManualFarmaco({
      nombre: '',
      componente: '',
      presentacion: '',
      concentracion: ''
    });
    setError(null);
  };

  return (
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
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Concentración
        </label>
        <input
          type="text"
          value={manualFarmaco.concentracion}
          onChange={(e) => setManualFarmaco({...manualFarmaco, concentracion: e.target.value})}
          placeholder="Ej: 500mg"
          className="w-full rounded-md border-gray-300 shadow-sm p-2"
        />
      </div>

      {error && (
        <div className="md:col-span-2 text-red-500 text-sm p-2 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="md:col-span-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
        >
          Cancelar
        </button>
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
  );
};

export default FarmacoManualForm;