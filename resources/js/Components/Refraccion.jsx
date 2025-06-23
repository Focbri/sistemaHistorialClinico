import React, { useState, useEffect, useCallback, useRef } from 'react';

const Refraccion = ({ data, setData, readOnly = false, edadPaciente, initialData = {} }) => {
    const handleChange = (field, value) => {
        if (!readOnly && setData) {
            setData(field, value);
        }
    };

    useEffect(() => {
  if (initialData) {
    // Actualizar todos los campos del examen con los datos iniciales
    Object.keys(initialData).forEach(key => {
      if (key.startsWith('exam_')) {
        setData(key, initialData[key]);
      }
    });
  }
}, [initialData]);

    return (
    <div className="mb-8">
        <label className="block text-lg md:text-xl font-medium text-gray-700 uppercase mb-2 md:mb-4">Refracción</label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* Columna izquierda - Examen Previo */}
            <div className="border border-gray-200 rounded-md p-2 md:p-4">
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-4 text-center uppercase">Examen Previo</h3>
                
                {/* Distancia */}
                <div className="mb-4 md:mb-6">
                    <h4 className="font-medium mb-1 md:mb-2 text-sm md:text-base uppercase">Distancia</h4>
                    <div className="grid grid-cols-4 gap-1 md:gap-2 mb-1 md:mb-2 text-xs md:text-sm">
                        <div></div>
                        <div className="text-center font-medium">Sph</div>
                        <div className="text-center font-medium">Cyl</div>
                        <div className="text-center font-medium">Eje</div>
                        
                        <div className="text-center">OD</div>
                        <input
                            type="text"
                            value={data.exam_old_distancia_esfera_od || ''}
                            maxLength={4}
                            onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_old_distancia_esfera_od', e.target.value)}
                            disabled={readOnly}
                            className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                        />
                        <input
                            type="text"
                            value={data.exam_old_distancia_cilindro_od || ''}
                            maxLength={4}
                            onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_old_distancia_cilindro_od', e.target.value)}
                            disabled={readOnly}
                            className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                        />
                        <input
                            type="text"
                            value={data.exam_old_distancia_eje_od || ''}
                            maxLength={4}
                            onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_old_distancia_eje_od', e.target.value)}
                            disabled={readOnly}
                            className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                        />
                        
                        <div className="text-center">OI</div>
                        <input
                            type="text"
                            value={data.exam_old_distancia_esfera_oi || ''}
                            maxLength={4}
                            onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_old_distancia_esfera_oi', e.target.value)}
                            disabled={readOnly}
                            className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                        />
                        <input
                            type="text"
                            value={data.exam_old_distancia_cilindro_oi || ''}
                            maxLength={4}
                            onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_old_distancia_cilindro_oi', e.target.value)}
                            disabled={readOnly}
                            className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                        />
                        <input
                            type="text"
                            value={data.exam_old_distancia_eje_oi || ''}
                            maxLength={4}
                            onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_old_distancia_eje_oi', e.target.value)}
                            disabled={readOnly}
                            className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                        <span className="font-medium">DIP:</span>
                        <input
                            type="text"
                            value={data.exam_old_distancia_dip || ''}
                            maxLength={4}
                            onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_old_distancia_dip', e.target.value)}
                            disabled={readOnly}
                            className="border border-gray-300 rounded p-1 text-xs md:text-sm w-12 md:w-20"
                        />
                    </div>
                </div>
                
                {/* Cerca (solo para mayores de 30) */}
                {edadPaciente >= 30 && (
                    <div className="mb-4 md:mb-6">
                        <h4 className="font-medium mb-1 md:mb-2 text-sm md:text-base uppercase">Cerca</h4>
                        <div className="grid grid-cols-4 gap-1 md:gap-2 mb-1 md:mb-2 text-xs md:text-sm">
                            <div></div>
                            <div className="text-center font-medium">Sph</div>
                            <div className="text-center font-medium">Cyl</div>
                            <div className="text-center font-medium">Eje</div>
                            
                            <div className="text-center">OD</div>
                            <input
                                type="text"
                                value={data.exam_old_cerca_esfera_od || ''}
                                maxLength={4}
                                onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_old_cerca_esfera_od', e.target.value)}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                            />
                            <input
                                type="text"
                                value={data.exam_old_cerca_cilindro_od || ''}
                                maxLength={4}
                                onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_old_cerca_cilindro_od', e.target.value)}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                            />
                            <input
                                type="text"
                                value={data.exam_old_cerca_eje_od || ''}
                                maxLength={4}
                                onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_old_cerca_eje_od', e.target.value)}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                            />
                            
                            <div className="text-center">OI</div>
                            <input
                                type="text"
                                value={data.exam_old_cerca_esfera_oi || ''}
                                maxLength={4}
                                onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_old_cerca_esfera_oi', e.target.value)}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                            />
                            <input
                                type="text"
                                value={data.exam_old_cerca_cilindro_oi || ''}
                                maxLength={4}
                                onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_old_cerca_cilindro_oi', e.target.value)}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                            />
                            <input
                                type="text"
                                value={data.exam_old_cerca_eje_oi || ''}
                                maxLength={4}
                                onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_old_cerca_eje_oi', e.target.value)}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                            <span className="font-medium">DIP:</span>
                            <input
                                type="text"
                                value={data.exam_old_cerca_dip || ''}
                                maxLength={4}
                                onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_old_cerca_dip', e.target.value)}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-xs md:text-sm w-12 md:w-20"
                            />
                        </div>
                    </div>
                )}
            </div>
            
            {/* Columna derecha - Examen Actual */}
            <div className="border border-gray-200 rounded-md p-2 md:p-4">
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-4 text-center uppercase">Examen Actual</h3>
                
                {/* Distancia */}
                <div className="mb-4 md:mb-6">
                    <h4 className="font-medium mb-1 md:mb-2 text-sm md:text-base uppercase">Distancia</h4>
                    <div className="grid grid-cols-4 gap-1 md:gap-2 mb-1 md:mb-2 text-xs md:text-sm">
                        <div></div>
                        <div className="text-center font-medium">Sph</div>
                        <div className="text-center font-medium">Cyl</div>
                        <div className="text-center font-medium">Eje</div>
                        
                        <div className="text-center">OD</div>
                        <input
                            type="text"
                            value={data.exam_new_distancia_esfera_od || ''}
                            maxLength={4}
                            onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_new_distancia_esfera_od', e.target.value)}
                            disabled={readOnly}
                            className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                        />
                        <input
                            type="text"
                            value={data.exam_new_distancia_cilindro_od || ''}
                            maxLength={4}
                            onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_new_distancia_cilindro_od', e.target.value)}
                            disabled={readOnly}
                            className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                        />
                        <input
                            type="text"
                            value={data.exam_new_distancia_eje_od || ''}
                            maxLength={4}
                            onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_new_distancia_eje_od', e.target.value)}
                            disabled={readOnly}
                            className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                        />
                        
                        <div className="text-center">OI</div>
                        <input
                            type="text"
                            value={data.exam_new_distancia_esfera_oi || ''}
                            maxLength={4}
                            onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_new_distancia_esfera_oi', e.target.value)}
                            disabled={readOnly}
                            className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                        />
                        <input
                            type="text"
                            value={data.exam_new_distancia_cilindro_oi || ''}
                            maxLength={4}
                            onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_new_distancia_cilindro_oi', e.target.value)}
                            disabled={readOnly}
                            className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                        />
                        <input
                            type="text"
                            value={data.exam_new_distancia_eje_oi || ''}
                            maxLength={4}
                            onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_new_distancia_eje_oi', e.target.value)}
                            disabled={readOnly}
                            className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                        <span className="font-medium">DIP:</span>
                        <input
                            type="text"
                            value={data.exam_new_distancia_dip || ''}
                            maxLength={4}
                            onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_new_distancia_dip', e.target.value)}
                            disabled={readOnly}
                            className="border border-gray-300 rounded p-1 text-xs md:text-sm w-12 md:w-20"
                        />
                    </div>
                </div>
                
                {/* Cerca (solo para mayores de 30) */}
                {edadPaciente >= 30 && (
                    <div className="mb-4 md:mb-6">
                        <h4 className="font-medium mb-1 md:mb-2 text-sm md:text-base uppercase">Cerca</h4>
                        <div className="grid grid-cols-4 gap-1 md:gap-2 mb-1 md:mb-2 text-xs md:text-sm">
                            <div></div>
                            <div className="text-center font-medium">Sph</div>
                            <div className="text-center font-medium">Cyl</div>
                            <div className="text-center font-medium">Eje</div>
                            
                            <div className="text-center">OD</div>
                            <input
                                type="text"
                                value={data.exam_new_cerca_esfera_od || ''}
                                maxLength={4}
                                onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_new_cerca_esfera_od', e.target.value)}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                            />
                            <input
                                type="text"
                                value={data.exam_new_cerca_cilindro_od || ''}
                                maxLength={4}
                                onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_new_cerca_cilindro_od', e.target.value)}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                            />
                            <input
                                type="text"
                                value={data.exam_new_cerca_eje_od || ''}
                                maxLength={4}
                                onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_new_cerca_eje_od', e.target.value)}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                            />
                            
                            <div className="text-center">OI</div>
                            <input
                                type="text"
                                value={data.exam_new_cerca_esfera_oi || ''}
                                maxLength={4}
                                onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_new_cerca_esfera_oi', e.target.value)}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                            />
                            <input
                                type="text"
                                value={data.exam_new_cerca_cilindro_oi || ''}
                                maxLength={4}
                                onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_new_cerca_cilindro_oi', e.target.value)}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                            />
                            <input
                                type="text"
                                value={data.exam_new_cerca_eje_oi || ''}
                                maxLength={4}
                                onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_new_cerca_eje_oi', e.target.value)}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-xs md:text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                            <span className="font-medium">DIP:</span>
                            <input
                                type="text"
                                value={data.exam_new_cerca_dip || ''}
                                maxLength={4}
                                onChange={(e) => /^[-0-9.]*$/.test(e.target.value) && handleChange('exam_new_cerca_dip', e.target.value)}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-xs md:text-sm w-12 md:w-20"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
        
        {/* Campos adicionales */}
        <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
            <div className="md:col-span-1">
                <label className="block font-medium mb-1 text-sm md:text-base">Instrucciones</label>
                <textarea
                    value={data.instrucciones || ''}
                    onChange={(e) => handleChange('instrucciones', e.target.value)}
                    disabled={readOnly}
                    className="w-full border border-gray-300 rounded p-2 h-20 md:h-24 text-xs md:text-sm"
                />
            </div>
            
            <div className="md:col-span-1">
                <label className="block font-medium mb-1 text-sm md:text-base">Adiciones</label>
                <textarea
                    value={data.adiciones || ''}
                    onChange={(e) => handleChange('adiciones', e.target.value)}
                    disabled={readOnly}
                    className="w-full border border-gray-300 rounded p-2 h-20 md:h-24 text-xs md:text-sm"
                />
            </div>
        </div>
    </div>
);
};

export default Refraccion;