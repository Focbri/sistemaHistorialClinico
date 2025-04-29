import React from 'react';

const RefraccionForm = ({ data, setData, readOnly = false }) => {
    const handleChange = (field, value) => {
        if (!readOnly && setData) {
            setData(field, value);
        }
    };

    return (
        <div className='mb-8'>
            <label className="block text-xl font-medium text-gray-700 uppercase">Refracción</label>
            
            {/* Sección de Distancia */}
            <div className="flex flex-col my-4">
                <div className="mb-4 w-full text-center uppercase text-lg">
                    <h2>Distancia</h2>
                </div>
                <div className="flex flex-col mb-8">
                    <div className="flex">
                        <div className="grid grid-cols-4">
                            <label></label>
                            <label className="text-center uppercase">Esfera</label>
                            <label className="text-center uppercase">Cilindro</label>
                            <label className="text-center uppercase">Eje</label>
                            
                            <label className="border border-[#8FDBF1] py-2 text-center">Ojo Derecho</label>
                            <input
                                type="text"
                                value={data.distancia_esfera_od ?? ''}
                                onChange={(e) => handleChange('distancia_esfera_od', e.target.value)}
                                disabled={readOnly}
                                className={`block w-full border-[#8FDBF1] shadow-sm ${
                                    readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                            />
                            <input
                                type="text"
                                value={data.distancia_cilindro_od ?? ''}
                                onChange={(e) => handleChange('distancia_cilindro_od', e.target.value)}
                                disabled={readOnly}
                                className={`block w-full border-[#8FDBF1] shadow-sm ${
                                    readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                            />
                            <input
                                type="text"
                                value={data.distancia_eje_od ?? ''}
                                onChange={(e) => handleChange('distancia_eje_od', e.target.value)}
                                disabled={readOnly}
                                className={`block w-full border-[#8FDBF1] shadow-sm ${
                                    readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                            />
                            
                            <label className="border border-[#8FDBF1] py-2 text-center">Ojo Izquierdo</label>
                            <input
                                type="text"
                                value={data.distancia_esfera_oi ?? ''}
                                onChange={(e) => handleChange('distancia_esfera_oi', e.target.value)}
                                disabled={readOnly}
                                className={`block w-full border-[#8FDBF1] shadow-sm ${
                                    readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                            />
                            <input
                                type="text"
                                value={data.distancia_cilindro_oi ?? ''}
                                onChange={(e) => handleChange('distancia_cilindro_oi', e.target.value)}
                                disabled={readOnly}
                                className={`block w-full border-[#8FDBF1] shadow-sm ${
                                    readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                            />
                            <input
                                type="text"
                                value={data.distancia_eje_oi ?? ''}
                                onChange={(e) => handleChange('distancia_eje_oi', e.target.value)}
                                disabled={readOnly}
                                className={`block w-full border-[#8FDBF1] shadow-sm ${
                                    readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="h-[22%] text-center uppercase">DIP</label>
                            <input
                                type="text"
                                value={data.distancia_dip ?? ''}
                                onChange={(e) => handleChange('distancia_dip', e.target.value)}
                                disabled={readOnly}
                                className={`block w-full border-[#8FDBF1] shadow-sm h-[78%] ${
                                    readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección de Cerca */}
            <div className="flex flex-col my-4">
                <div className="mb-4 w-full text-center uppercase text-lg">
                    <h2>Cerca</h2>
                </div>
                <div className="flex flex-col mb-8">
                    <div className="flex">
                        <div className="grid grid-cols-4">
                            <label></label>
                            <label className="text-center uppercase">Esfera</label>
                            <label className="text-center uppercase">Cilindro</label>
                            <label className="text-center uppercase">Eje</label>
                            
                            <label className="border border-[#8FDBF1] py-2 text-center">Ojo Derecho</label>
                            <input
                                type="text"
                                value={data.cerca_esfera_od ?? ''}
                                onChange={(e) => handleChange('cerca_esfera_od', e.target.value)}
                                disabled={readOnly}
                                className={`block w-full border-[#8FDBF1] shadow-sm ${
                                    readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                            />
                            <input
                                type="text"
                                value={data.cerca_cilindro_od ?? ''}
                                onChange={(e) => handleChange('cerca_cilindro_od', e.target.value)}
                                disabled={readOnly}
                                className={`block w-full border-[#8FDBF1] shadow-sm ${
                                    readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                            />
                            <input
                                type="text"
                                value={data.cerca_eje_od ?? ''}
                                onChange={(e) => handleChange('cerca_eje_od', e.target.value)}
                                disabled={readOnly}
                                className={`block w-full border-[#8FDBF1] shadow-sm ${
                                    readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                            />
                            
                            <label className="border border-[#8FDBF1] py-2 text-center">Ojo Izquierdo</label>
                            <input
                                type="text"
                                value={data.cerca_esfera_oi ?? ''}
                                onChange={(e) => handleChange('cerca_esfera_oi', e.target.value)}
                                disabled={readOnly}
                                className={`block w-full border-[#8FDBF1] shadow-sm ${
                                    readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                            />
                            <input
                                type="text"
                                value={data.cerca_cilindro_oi ?? ''}
                                onChange={(e) => handleChange('cerca_cilindro_oi', e.target.value)}
                                disabled={readOnly}
                                className={`block w-full border-[#8FDBF1] shadow-sm ${
                                    readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                            />
                            <input
                                type="text"
                                value={data.cerca_eje_oi ?? ''}
                                onChange={(e) => handleChange('cerca_eje_oi', e.target.value)}
                                disabled={readOnly}
                                className={`block w-full border-[#8FDBF1] shadow-sm ${
                                    readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="h-[22%] text-center uppercase">DIP</label>
                            <input
                                type="text"
                                value={data.cerca_dip ?? ''}
                                onChange={(e) => handleChange('cerca_dip', e.target.value)}
                                disabled={readOnly}
                                className={`block w-full border-[#8FDBF1] shadow-sm h-[78%] ${
                                    readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Adición para cerca */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Adición para cerca</label>
                <input
                    type="text"
                    value={data.adicion_cerca ?? ''}
                    onChange={(e) => handleChange('adicion_cerca', e.target.value)}
                    disabled={readOnly}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
                        readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                />
            </div>

            {/* Instrucciones */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Instrucciones</label>
                <textarea
                    value={data.instrucciones ?? ''}
                    onChange={(e) => handleChange('instrucciones', e.target.value)}
                    disabled={readOnly}
                    rows={3}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
                        readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                />
            </div>
        </div>
    );
};

export default RefraccionForm;