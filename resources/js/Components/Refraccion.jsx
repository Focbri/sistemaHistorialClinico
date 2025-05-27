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
            <label className="block text-xl font-medium text-gray-700 uppercase mb-4">Refracción</label>
            
            <div className="grid grid-cols-2 gap-8">
                {/* Columna izquierda - Examen Previo */}
                <div className="border border-gray-200 rounded-md p-4">
                    <h3 className="text-lg font-semibold mb-4 text-center uppercase">Examen Previo</h3>
                    
                    {/* Distancia */}
                    <div className="mb-6">
                        <h4 className="font-medium mb-2 uppercase">Distancia</h4>
                        <div className="grid grid-cols-4 gap-2 mb-2">
                            <div></div>
                            <div className="text-center font-medium">Esfera</div>
                            <div className="text-center font-medium">Cilindro</div>
                            <div className="text-center font-medium">Eje</div>
                            
                            <div className="text-center">OD</div>
                            <input
                                type="text"
                                value={data.exam_old_distancia_esfera_od || ''}
                                maxLength={4}
                                minLength={0}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_old_distancia_esfera_od', value);
                                    }
                                }}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-sm"
                            />
                            <input
                                type="text"
                                value={data.exam_old_distancia_cilindro_od || ''}
                                maxLength={4}
                                minLength={0}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_old_distancia_cilindro_od', value);
                                    }
                                }}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-sm"
                            />
                            <input
                                type="text"
                                value={data.exam_old_distancia_eje_od || ''}
                                maxLength={4}
                                minLength={0}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_old_distancia_eje_od', value);
                                    }
                                }}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-sm"
                            />
                            
                            <div className="text-center">OI</div>
                            <input
                                type="text"
                                value={data.exam_old_distancia_esfera_oi || ''}
                                maxLength={4}
                                minLength={0}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_old_distancia_esfera_oi', value);
                                    }
                                }}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-sm"
                            />
                            <input
                                type="text"
                                value={data.exam_old_distancia_cilindro_oi || ''}
                                maxLength={4}
                                minLength={0}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_old_distancia_cilindro_oi', value);
                                    }
                                }}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-sm"
                            />
                            <input
                                type="text"
                                value={data.exam_old_distancia_eje_oi || ''}
                                maxLength={4}
                                minLength={0}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_old_distancia_eje_oi', value);
                                    }
                                }}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">DIP:</span>
                            <input
                                type="text"
                                value={data.exam_old_distancia_dip || ''}
                                maxLength={4}
                                minLength={0}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_old_distancia_dip', value); 
                                    }
                                }}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-sm w-20"
                            />
                        </div>
                    </div>
                    
                    {/* Cerca (solo para mayores de 30) */}
                    {edadPaciente >= 30 && (
                        <div className="mb-6">
                            <h4 className="font-medium mb-2 uppercase">Cerca</h4>
                            <div className="grid grid-cols-4 gap-2 mb-2">
                                <div></div>
                                <div className="text-center font-medium">Esfera</div>
                                <div className="text-center font-medium">Cilindro</div>
                                <div className="text-center font-medium">Eje</div>
                                
                                <div className="text-center">OD</div>
                                <input
                                    type="text"
                                    value={data.exam_old_cerca_esfera_od || ''}
                                    maxLength={4}
                                    minLength={0}
                                    onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_old_cerca_esfera_od', value); 
                                    }
                                }}
                                    disabled={readOnly}
                                    className="border border-gray-300 rounded p-1 text-sm"
                                />
                                <input
                                    type="text"
                                    value={data.exam_old_cerca_cilindro_od || ''}
                                    maxLength={4}
                                    minLength={0}
                                    onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_old_cerca_cilindro_od', value); 
                                    }
                                }}
                                    disabled={readOnly}
                                    className="border border-gray-300 rounded p-1 text-sm"
                                />
                                <input
                                    type="text"
                                    value={data.exam_old_cerca_eje_od || ''}
                                    maxLength={4}
                                    minLength={0}
                                    onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_old_cerca_eje_od', value); 
                                    }
                                }}
                                    disabled={readOnly}
                                    className="border border-gray-300 rounded p-1 text-sm"
                                />
                                
                                <div className="text-center">OI</div>
                                <input
                                    type="text"
                                    value={data.exam_old_cerca_esfera_oi || ''}
                                    maxLength={4}
                                    minLength={0}
                                    onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_old_cerca_esfera_oi', value); 
                                    }
                                }}
                                    disabled={readOnly}
                                    className="border border-gray-300 rounded p-1 text-sm"
                                />
                                <input
                                    type="text"
                                    value={data.exam_old_cerca_cilindro_oi || ''}
                                    maxLength={4}
                                    minLength={0}
                                    onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_old_cerca_cilindro_oi', value); 
                                    }
                                }}
                                    disabled={readOnly}
                                    className="border border-gray-300 rounded p-1 text-sm"
                                />
                                <input
                                    type="text"
                                    value={data.exam_old_cerca_eje_oi || ''}
                                    maxLength={4}
                                    minLength={0}
                                    onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_old_cerca_eje_oi', value); 
                                    }
                                }}
                                    disabled={readOnly}
                                    className="border border-gray-300 rounded p-1 text-sm"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">DIP:</span>
                                <input
                                    type="text"
                                    value={data.exam_old_cerca_dip || ''}
                                    maxLength={4}
                                    minLength={0}
                                    onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_old_cerca_dip', value); 
                                    }
                                }}
                                    disabled={readOnly}
                                    className="border border-gray-300 rounded p-1 text-sm w-20"
                                />
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Columna derecha - Examen Actual */}
                <div className="border border-gray-200 rounded-md p-4">
                    <h3 className="text-lg font-semibold mb-4 text-center uppercase">Examen Actual</h3>
                    
                    {/* Distancia */}
                    <div className="mb-6">
                        <h4 className="font-medium mb-2 uppercase">Distancia</h4>
                        <div className="grid grid-cols-4 gap-2 mb-2">
                            <div></div>
                            <div className="text-center font-medium">Esfera</div>
                            <div className="text-center font-medium">Cilindro</div>
                            <div className="text-center font-medium">Eje</div>
                            
                            <div className="text-center">OD</div>
                            <input
                                type="text"
                                value={data.exam_new_distancia_esfera_od || ''}
                                maxLength={4}
                                minLength={0}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_new_distancia_esfera_od', value); 
                                    }
                                }}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-sm"
                            />
                            <input
                                type="text"
                                value={data.exam_new_distancia_cilindro_od || ''}
                                maxLength={4}
                                minLength={0}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_new_distancia_cilindro_od', value); 
                                    }
                                }}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-sm"
                            />
                            <input
                                type="text"
                                value={data.exam_new_distancia_eje_od || ''}
                                maxLength={4}
                                minLength={0}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_new_distancia_eje_od', value); 
                                    }
                                }}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-sm"
                            />
                            
                            <div className="text-center">OI</div>
                            <input
                                type="text"
                                value={data.exam_new_distancia_esfera_oi || ''}
                                maxLength={4}
                                minLength={0}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_new_distancia_esfera_oi', value); 
                                    }
                                }}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-sm"
                            />
                            <input
                                type="text"
                                value={data.exam_new_distancia_cilindro_oi || ''}
                                maxLength={4}
                                minLength={0}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_new_distancia_cilindro_oi', value); 
                                    }
                                }}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-sm"
                            />
                            <input
                                type="text"
                                value={data.exam_new_distancia_eje_oi || ''}
                                maxLength={4}
                                minLength={0}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_new_distancia_eje_oi', value); 
                                    }
                                }}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">DIP:</span>
                            <input
                                type="text"
                                value={data.exam_new_distancia_dip || ''}
                                maxLength={4}
                                minLength={0}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                        handleChange('exam_new_distancia_dip', value); 
                                    }
                                }}
                                disabled={readOnly}
                                className="border border-gray-300 rounded p-1 text-sm w-20"
                            />
                        </div>
                    </div>
                    
                    {/* Cerca (solo para mayores de 30) */}
                    {edadPaciente >= 30 && (
                        <div className="mb-6">
                            <h4 className="font-medium mb-2 uppercase">Cerca</h4>
                            <div className="grid grid-cols-4 gap-2 mb-2">
                                <div></div>
                                <div className="text-center font-medium">Esfera</div>
                                <div className="text-center font-medium">Cilindro</div>
                                <div className="text-center font-medium">Eje</div>
                                
                                <div className="text-center">OD</div>
                                <input
                                    type="text"
                                    value={data.exam_new_cerca_esfera_od || ''}
                                    maxLength={4}
                                    minLength={0}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                            handleChange('exam_new_cerca_esfera_od', value); 
                                        }
                                    }}
                                    disabled={readOnly}
                                    className="border border-gray-300 rounded p-1 text-sm"
                                />
                                <input
                                    type="text"
                                    value={data.exam_new_cerca_cilindro_od || ''}
                                    maxLength={4}
                                    minLength={0}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                            handleChange('exam_new_cerca_cilindro_od', value); 
                                        }
                                    }}
                                    disabled={readOnly}
                                    className="border border-gray-300 rounded p-1 text-sm"
                                />
                                <input
                                    type="text"
                                    value={data.exam_new_cerca_eje_od || ''}
                                    maxLength={4}
                                    minLength={0}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                            handleChange('exam_new_cerca_eje_od', value); 
                                        }
                                    }}
                                    disabled={readOnly}
                                    className="border border-gray-300 rounded p-1 text-sm"
                                />
                                
                                <div className="text-center">OI</div>
                                <input
                                    type="text"
                                    value={data.exam_new_cerca_esfera_oi || ''}
                                    maxLength={4}
                                    minLength={0}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                            handleChange('exam_new_cerca_esfera_oi', value); 
                                        }
                                    }}
                                    disabled={readOnly}
                                    className="border border-gray-300 rounded p-1 text-sm"
                                />
                                <input
                                    type="text"
                                    value={data.exam_new_cerca_cilindro_oi || ''}
                                    maxLength={4}
                                    minLength={0}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                            handleChange('exam_new_cerca_cilindro_oi', value); 
                                        }
                                    }}
                                    disabled={readOnly}
                                    className="border border-gray-300 rounded p-1 text-sm"
                                />
                                <input
                                    type="text"
                                    value={data.exam_new_cerca_eje_oi || ''}
                                    maxLength={4}
                                    minLength={0}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                            handleChange('exam_new_cerca_eje_oi', value); 
                                        }
                                    }}
                                    disabled={readOnly}
                                    className="border border-gray-300 rounded p-1 text-sm"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">DIP:</span>
                                <input
                                    type="text"
                                    value={data.exam_new_cerca_dip || ''}
                                    maxLength={4}
                                    minLength={0}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                            handleChange('exam_new_cerca_dip', value); 
                                        }
                                    }}
                                    disabled={readOnly}
                                    className="border border-gray-300 rounded p-1 text-sm w-20"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Campos adicionales */}
            <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="col-span-1">
                    <label className="block font-medium mb-1">Instrucciones</label>
                    <textarea
                        value={data.instrucciones|| ''}
                        onChange={(e) => handleChange('instrucciones', e.target.value)}
                        disabled={readOnly}
                        className="w-full border border-gray-300 rounded p-2 h-24"
                    />
                </div>
                
                
                <div className="col-span-1">
                    <label className="block font-medium mb-1">Adiciones</label>
                    <textarea
                        value={data.adiciones || ''}
                        onChange={(e) => handleChange('adiciones', e.target.value)}
                        disabled={readOnly}
                        className="w-full border border-gray-300 rounded p-2 h-24"
                    />
                </div>
            </div>
        </div>
    );
};

export default Refraccion;