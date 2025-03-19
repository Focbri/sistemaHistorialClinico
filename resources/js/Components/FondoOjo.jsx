import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import fondoOjo from '../../../public/img/fondo_ojo.png'; // Importar imagen de fondo de ojo
import fondoOjoD from '../../../public/img/fondo_ojo_derecho.png'
import fondoOjoI from '../../../public/img/fondo_ojo_izquierdo.png'
import { useState, useEffect } from 'react';

const FondoOjo = ({ marcadoresOD, marcadoresOI, marcadorActivoOD, marcadorActivoOI, handleMarkerClickOD, handleMarkerClickOI, handleSeleccionOpcionOD, handleSeleccionOpcionOI, data }) => {
    return (
        <div className='flex flex-col justify-center items-center w-full gap-4'>
            <label className="block text-xl font-medium text-gray-700">Fondo de Ojo</label>
            <div className='flex'>
                {/* Ojo Derecho (OD) */}
                <div className='relative inline-block'>
                    <img src={fondoOjoD} alt="Fondo de Ojo" className="w-full h-auto" />
                    
                    {marcadoresOD.map((marcador) => (
                        <span
                            key={marcador.id}
                            className={`text-2xl absolute cursor-pointer ${marcador.top} ${marcador.left}`}
                            onClick={() => handleMarkerClickOD(marcador)}
                        >
                            <FontAwesomeIcon
                                icon={faMapMarkerAlt}
                                style={{ color: marcador.color, fontSize: '24px' }}
                            />
                        </span>
                    ))}

                    {marcadorActivoOD && (
                        <div
                            className='absolute bg-white border border-gray-300 rounded-lg shadow-lg opciones-container min-w-40'
                            style={{
                                top: '0',
                                left: '-60%',
                                transform: 'translateX(-60%)',
                            }}
                        >
                            {marcadoresOD.find(m => m.id === marcadorActivoOD).subtitulo && (
                                <span className='block text-lg font-bold rounded-t-lg text-white mb-1 p-3 bg-blue-950'>
                                    {marcadoresOD.find(m => m.id === marcadorActivoOD).subtitulo}
                                </span>
                            )}
                            <div className='space-y-2 p-2'>
                                {marcadoresOD.find(m => m.id === marcadorActivoOD).opciones.map((opcion) => (
                                    <div
                                        key={opcion.id}
                                        className={`cursor-pointer hover:bg-green-200 p-1 text-sm rounded-md ${
                                            data[marcadoresOD.find(m => m.id === marcadorActivoOD).campo] === opcion.nombre
                                                ? 'bg-green-400'
                                                : 'bg-white'
                                        }`}
                                        onClick={() => handleSeleccionOpcionOD(opcion)}
                                    >
                                        {opcion.nombre}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Ojo Izquierdo (OI) */}
                <div className='relative inline-block'>
                    <img src={fondoOjoI} alt="Fondo de Ojo" className="w-full h-auto" />
                    
                    {marcadoresOI.map((marcadorOI) => (
                        <span
                            key={marcadorOI.id}
                            className={`text-2xl absolute cursor-pointer ${marcadorOI.top} ${marcadorOI.right}`}
                            onClick={() => handleMarkerClickOI(marcadorOI)}
                        >
                            <FontAwesomeIcon
                                icon={faMapMarkerAlt}
                                style={{ color: marcadorOI.color, fontSize: '24px' }}
                            />
                        </span>
                    ))}

                    {marcadorActivoOI && (
                        <div
                            className='absolute bg-white border border-gray-300 rounded-lg shadow-lg opciones-container min-w-40'
                            style={{
                                top: '0',
                                right: '-60%',
                                transform: 'translateX(60%)',
                            }}
                        >
                            {marcadoresOI.find(mOI => mOI.id === marcadorActivoOI).subtitulo && (
                                <span className='block text-lg font-bold rounded-t-lg text-white mb-1 p-3 bg-blue-950'>
                                    {marcadoresOI.find(mOI => mOI.id === marcadorActivoOI).subtitulo}
                                </span>
                            )}                            
                            <div className='space-y-2 p-2'>
                            {marcadoresOI.find(mOI => mOI.id === marcadorActivoOI).opciones.map((opcionOI) => (
                                <div
                                    key={opcionOI.id}
                                    className={`cursor-pointer hover:bg-green-200 p-1 rounded-md ${
                                        data[marcadoresOI.find(mOI => mOI.id === marcadorActivoOI).campo] === opcionOI.nombre
                                            ? 'bg-green-400' // Estilo para la opción seleccionada
                                            : 'bg-white' // Estilo por defecto
                                    }`}
                                    onClick={() => handleSeleccionOpcionOI(opcionOI)}
                                >
                                    {opcionOI.nombre}
                                </div>
                            ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FondoOjo;