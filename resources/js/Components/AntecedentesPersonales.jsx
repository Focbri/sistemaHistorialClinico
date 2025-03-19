const AntecedentesPersonales = ({ 
    data, 
    setData, 
    showHTAText, 
    setShowHTAText, 
    showDMText, 
    setShowDMText, 
    showAlergiasText, 
    setShowAlergiasText, 
    showOtrosText, 
    setShowOtrosText 
}) => { // Aquí se abre el cuerpo de la función
    return (
        <div className="grid grid-cols-2 gap-4 border border-gray-200 p-4 rounded-md mb-8">
            {/* Campo HTA */}
            <div className="mb-4">
                <div className="flex items-center justify-between bg-[#DDE47E] p-2 rounded-md">
                    <label className="block text-sm font-medium text-gray-700">HTA</label>
                    <button
                        type="button"
                        onClick={() => setShowHTAText(!showHTAText)}
                        className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                        {showHTAText ? '▲' : '▼'}
                    </button>
                </div>
                {showHTAText && (
                    <input
                        type="text"
                        value={data.antecedentes_personales_hta || ''}
                        onChange={(e) => setData('antecedentes_personales_hta', e.target.value)}
                        className="mt-1 block w-full rounded-md border-[#8FDBF1] shadow-sm"
                        placeholder="Detalles de HTA"
                    />
                )}
            </div>

            {/* Campo DM */}
            <div className="mb-4">
                <div className="flex items-center justify-between bg-[#DDE47E] p-2 rounded-md">
                    <label className="block text-sm font-medium text-gray-700">DM</label>
                    <button
                        type="button"
                        onClick={() => setShowDMText(!showDMText)}
                        className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                        {showDMText ? '▲' : '▼'}
                    </button>
                </div>
                {showDMText && (
                    <input
                        type="text"
                        value={data.antecedentes_personales_dm || ''}
                        onChange={(e) => setData('antecedentes_personales_dm', e.target.value)}
                        className="mt-1 block w-full rounded-md border-[#8FDBF1] shadow-sm"
                        placeholder="Detalles de DM"
                    />
                )}
            </div>

            {/* Campo Alergias */}
            <div className="mb-4">
                <div className="flex items-center justify-between bg-[#DDE47E] p-2 rounded-md">
                    <label className="block text-sm font-medium text-gray-700">Alergias</label>
                    <button
                        type="button"
                        onClick={() => setShowAlergiasText(!showAlergiasText)}
                        className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                        {showAlergiasText ? '▲' : '▼'}
                    </button>
                </div>
                {showAlergiasText && (
                    <input
                        type="text"
                        value={data.antecedentes_personales_alergias || ''}
                        onChange={(e) => setData('antecedentes_personales_alergias', e.target.value)}
                        className="mt-1 block w-full rounded-md border-[#8FDBF1] shadow-sm"
                        placeholder="Detalles de Alergias"
                    />
                )}
            </div>

            {/* Campo Otros */}
            <div className="mb-4">
                <div className="flex items-center justify-between bg-[#DDE47E] p-2 rounded-md">
                    <label className="block text-sm font-medium text-gray-700">Otros</label>
                    <button
                        type="button"
                        onClick={() => setShowOtrosText(!showOtrosText)}
                        className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                        {showOtrosText ? '▲' : '▼'}
                    </button>
                </div>
                {showOtrosText && (
                    <input
                        type="text"
                        value={data.antecedentes_personales_otros || ''}
                        onChange={(e) => setData('antecedentes_personales_otros', e.target.value)}
                        className="mt-1 block w-full rounded-md border-[#8FDBF1] shadow-sm"
                        placeholder="Detalles de Otros"
                    />
                )}
            </div>
        </div>
    );
}; // Aquí se cierra el cuerpo de la función

export default AntecedentesPersonales; // Exporta el componente