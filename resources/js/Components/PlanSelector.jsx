import React from "react";

// components/PlanSelector.jsx
const PlanSelector = React.memo(({ opcionesPlan, handleSeleccionPlan, showPlanText, setShowPlanText, readOnly = false }) => {
    // Función dummy para cuando esté en modo lectura
    const handleChange = (field, value) => {
        if (!readOnly && setData) {
            setData(field, value);
        }
    };
    return (
        <div className="mb-4">
            <div className="flex items-center justify-between bg-[#DDE47E] p-2 rounded-md">
                <label className="block text-sm font-medium text-gray-700">Plan</label>
                <button
                    type="button"
                    onClick={() => setShowPlanText(!showPlanText)}
                    className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                    {showPlanText ? '▲' : '▼'}
                </button>
            </div>
            {showPlanText && (
                <div className="mt-2 space-y-2">
                    {opcionesPlan.map((opcion) => (
                        <div key={opcion.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`plan-${opcion.id}`}
                                checked={opcion.seleccionado}
                                onChange={() => handleSeleccionPlan(opcion.id)}
                                className={`rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50${
                                    readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}   
                            />
                            <label
                                htmlFor={`plan-${opcion.id}`}
                                className="ml-2 text-sm text-gray-700"
                            >
                                {opcion.nombre}
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

export default PlanSelector;