import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import fondoOjoD from '../../../public/img/fondo_ojo_derecho.png';
import fondoOjoI from '../../../public/img/fondo_ojo_izquierdo.png';
import { useState, useRef, useEffect } from 'react';

const FondoOjo = ({ 
    marcadoresOD,
    marcadoresOI,
    marcadorActivoOD,
    marcadorActivoOI,
    handleMarkerClickOD,
    handleMarkerClickOI,
    handleSeleccionOpcionOD,
    handleSeleccionOpcionOI,
    data = {},
    setData = () => {},
    modoVisualizacion = false // Nueva prop para modo de visualización
    }) => {
    const contenedorODRef = useRef(null);
    const contenedorOIRef = useRef(null);
    const [marcadorArrastrado, setMarcadorArrastrado] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // Mapeo de colores CSS a clases de Tailwind
    const COLORES_TAILWIND = {
        blue: 'bg-blue-500',
        red: 'bg-red-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500'
    };

    // Leyenda de colores de marcadores
    const LEYENDA_MARCADORES = [
        { color: 'text-red-500', texto: 'Mácula' },
        { color: 'text-orange-500', texto: 'Vasos Sanguíneos' },
        { color: 'text-green-500', texto: 'Retina Periférica' },
        { color: 'text-blue-500', texto: 'Vítreo' },
        { color: 'text-purple-500', texto: 'Disco Óptico' }
    ];

    // Parsear las posiciones guardadas
    const posicionesGuardadas = (() => {
        try {
            return data.fondo_ojo_posiciones 
                ? JSON.parse(data.fondo_ojo_posiciones)
                : {};
        } catch {
            return {};
        }
    })();

    const safeSetData = (key, value) => {
        if (typeof setData === 'function') {
            setData(key, value);
        }
    };

    // Función para obtener posición inicial (modificada para ordenar en fila)
    const getInitialPosition = (marcador, tipoOjo) => {
        const posKey = `${tipoOjo}_${marcador.id}`;
        
        // Si hay posición guardada, usarla
        if (posicionesGuardadas[posKey]) {
            return posicionesGuardadas[posKey];
        }
        
        // En modo visualización, no mostrar marcadores sin posición
        if (modoVisualizacion) return { x: -100, y: -100 };
        
        // Posiciones iniciales ordenadas en fila
        const index = tipoOjo === 'OD' 
            ? marcadoresOD.findIndex(m => m.id === marcador.id)
            : marcadoresOI.findIndex(m => m.id === marcador.id);
        
        const spacing = 30; // Espacio entre marcadores
        const startY = 30;  // Posición Y inicial
        
        // Para OD: alineados a la izquierda
        if (tipoOjo === 'OD') {
            return {
                x: 0,
                y: startY + (index * spacing)
            };
        }
        // Para OI: alineados a la derecha
        else {
            return {
                x: 0, // Esto será invertido en el renderizado
                y: startY + (index * spacing)
            };
        }
    };

    // Iniciar arrastre (versión mejorada)
    const iniciarArrastre = (marcador, e, tipoOjo) => {
        if (modoVisualizacion) return;
        
        e.stopPropagation();
        e.preventDefault();
        
        const contenedor = tipoOjo === 'OD' ? contenedorODRef.current : contenedorOIRef.current;
        if (!contenedor) return;
    
        const rect = contenedor.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
    
        const posicionActual = getInitialPosition(marcador, tipoOjo);
    
        // Ajuste especial para el ojo izquierdo
        let posX = posicionActual.x;
        if (tipoOjo === 'OI') {
            posX = rect.width - posX; // Invertir la coordenada X
        }
    
        setOffset({
            x: mouseX - posX, // Usar la posición ajustada
            y: mouseY - posicionActual.y
        });
    
        setMarcadorArrastrado({ ...marcador, tipoOjo });
    };

    // Mover marcador (versión corregida para OI)
    const moverMarcador = (e) => {
        if (!marcadorArrastrado || modoVisualizacion) return;
        
        const tipoOjo = marcadorArrastrado.tipoOjo;
        const contenedor = tipoOjo === 'OD' ? contenedorODRef.current : contenedorOIRef.current;
        if (!contenedor) return;
    
        const rect = contenedor.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
    
        let nuevaX = mouseX - offset.x;
        let nuevaY = mouseY - offset.y;
    
        // Ajuste para el ojo izquierdo
        if (tipoOjo === 'OI') {
            nuevaX = rect.width - nuevaX; // Invertir la coordenada X
        }
    
        // Limitar al área del contenedor
        nuevaX = Math.max(10, Math.min(rect.width - 10, nuevaX));
        nuevaY = Math.max(10, Math.min(rect.height - 10, nuevaY));
    
        // Actualizar posiciones
        const nuevasPosiciones = {
            ...posicionesGuardadas,
            [`${tipoOjo}_${marcadorArrastrado.id}`]: { 
                x: nuevaX, 
                y: nuevaY 
            }
        };
    
        safeSetData('fondo_ojo_posiciones', JSON.stringify(nuevasPosiciones));
    };
    
    // Finalizar arrastre
    const finalizarArrastre = () => {
        setMarcadorArrastrado(null);
    };

    // Configurar event listeners
    useEffect(() => {
        if (modoVisualizacion) return;
        
        const handleMouseMove = (e) => moverMarcador(e);
        const handleMouseUp = () => finalizarArrastre();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [marcadorArrastrado, offset, modoVisualizacion]);

    // Obtener estilo del marcador (versión corregida)
    const obtenerEstiloMarcador = (marcador, tipoOjo) => {
        const posicion = getInitialPosition(marcador, tipoOjo);
        
        const estiloBase = {
            position: 'absolute',
            top: `${posicion.y}px`,
            transform: 'translate(-50%, -50%)',
            cursor: modoVisualizacion ? 'default' : 'pointer',
            zIndex: marcadorArrastrado?.id === marcador.id ? 10 : 1
        };
    
        if (tipoOjo === 'OD') {
            estiloBase.left = `${posicion.x}px`;
        } else {
            // Para OI, usamos right y la posición ya está invertida
            estiloBase.right = `${posicion.x}px`;
        }
    
        return estiloBase;
    };

    // Obtener clase de color para el subtítulo
    const obtenerColorSubtitulo = (marcador) => {
        return COLORES_TAILWIND[marcador.color] || 'bg-gray-500';
    };

    // Renderizar marcadores
    const renderMarcadores = (marcadores, tipoOjo) => {
        return marcadores.map((marcador) => {
            // En modo visualización, solo mostrar marcadores con opción seleccionada
            if (modoVisualizacion && !data[marcador.campo]) {
                return null;
            }
            
            return (
                <div
                    key={`${tipoOjo}_${marcador.id}`}
                    style={obtenerEstiloMarcador(marcador, tipoOjo)}
                    onMouseDown={modoVisualizacion ? undefined : (e) => iniciarArrastre(marcador, e, tipoOjo)}
                    onClick={modoVisualizacion ? undefined : (e) => {
                        e.stopPropagation();
                        tipoOjo === 'OD' ? handleMarkerClickOD(marcador) : handleMarkerClickOI(marcador);
                    }}
                >
                    <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        style={{ 
                            color: marcador.color, 
                            fontSize: '24px',
                            filter: marcadorArrastrado?.id === marcador.id ? 
                                'drop-shadow(0 0 5px rgba(0,0,0,0.5))' : 'none'
                        }}
                    />
                </div>
            );
        });
    };

    // Renderizar contenedores de opciones en modo visualización
    const renderContenedoresVisualizacion = (marcadores, tipoOjo) => {
        return marcadores.map((marcador, index) => {
            // Solo mostrar si hay una opción seleccionada
            if (!data[marcador.campo]) return null;
            
            // Posiciones fijas basadas en el índice
            const posicionesFijas = {
                OD: [
                    { top: '10%', left: '-340px' },  // Posición para el primer marcador OD
                    { top: '10%', left: '-170px' },
                    { top: '45%', left: '-340px' },  // Posición para el primer marcador OD
                    { top: '45%', left: '-170px' },
                    { top: '80%', left: '-260px' },  // Posición para el segundo marcador OD
                    // Añade más posiciones según necesites
                ],
                OI: [
                    { top: '10%', right: '-340px' },  // Posición para el primer marcador OD
                    { top: '10%', right: '-170px' },
                    { top: '45%', right: '-340px' },  // Posición para el primer marcador OD
                    { top: '45%', right: '-170px' },
                    { top: '80%', right: '-260px' },
                ]
            };
    
            // Obtener posición fija según el índice
            const posicion = posicionesFijas[tipoOjo][index] || { 
                top: '50%', 
                [tipoOjo === 'OD' ? 'left' : 'right']: '-180px' 
            };
    
            return (
                <div 
                    key={`visualizacion_${tipoOjo}_${marcador.id}`}
                    className='absolute bg-white border border-gray-300 rounded-lg shadow-lg opciones-container min-w-40 z-20'
                    style={{
                        ...posicion,
                        transform: 'translateY(-50%)'
                    }}
                >
                    <span 
                        className={`block text-lg font-bold rounded-t-lg text-white p-2 ${obtenerColorSubtitulo(marcador)}`}
                    >
                        {marcador.subtitulo}
                    </span>
                    <div className=' p-0'>
                        <div className="p-2">
                            {data[marcador.campo]}
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className='flex flex-col justify-center items-center w-full gap-4'>
            <label className="block text-xl font-medium text-gray-700">Fondo de Ojo</label>
            
            {/* Leyenda de colores */}
            {!modoVisualizacion && (
                <div className="flex justify-center gap-6 mb-4 border p-3">
                    {LEYENDA_MARCADORES.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className={item.color} />
                            <span className="text-sm">{item.texto}</span>
                        </div>
                    ))}
                </div>
            )}
            
            <div className='flex'>
                {/* Ojo Derecho (OD) */}
                <div
                    ref={contenedorODRef}
                    className='relative inline-block'
                    style={{ userSelect: 'none', touchAction: 'none' }}
                >
                    <img
                        src={fondoOjoD}
                        alt="Fondo de Ojo Derecho"
                        className="min-w-64 h-auto"
                        style={{ pointerEvents: 'none' }}
                        draggable="false"
                    />
                    {renderMarcadores(marcadoresOD, 'OD')}
                    
                    {/* Mostrar contenedores en modo visualización */}
                    {modoVisualizacion && renderContenedoresVisualizacion(marcadoresOD, 'OD')}

                    {!modoVisualizacion && marcadorActivoOD && (
                        <div className='absolute bg-white border border-gray-300 rounded-lg shadow-lg opciones-container min-w-40 z-20'
                            style={{
                                top: '50%',
                                left: '-90%',
                                transform: 'translate(10px, -50%)'
                            }}>
                            <span 
                                className={`block text-lg font-bold rounded-t-lg text-white mb-1 p-3 ${obtenerColorSubtitulo(marcadoresOD.find(m => m.id === marcadorActivoOD))}`}
                            >
                                {marcadoresOD.find(m => m.id === marcadorActivoOD).subtitulo}
                            </span>
                            <div className='space-y-2 p-2'>
                                {marcadoresOD.find(m => m.id === marcadorActivoOD).opciones.map((opcion) => (
                                    <div
                                        key={opcion.id}
                                        className={`cursor-pointer hover:bg-green-200 p-2 rounded-md ${
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
                <div
                    ref={contenedorOIRef}
                    className='relative inline-block'
                    style={{ userSelect: 'none', touchAction: 'none' }}
                >
                    <img
                        src={fondoOjoI}
                        alt="Fondo de Ojo Izquierdo"
                        className="min-w-64 h-auto"
                        style={{ pointerEvents: 'none' }}
                        draggable="false"
                    />
                    {renderMarcadores(marcadoresOI, 'OI')}
                    
                    {/* Mostrar contenedores en modo visualización */}
                    {modoVisualizacion && renderContenedoresVisualizacion(marcadoresOI, 'OI')}

                    {!modoVisualizacion && marcadorActivoOI && (
                        <div className='absolute bg-white border border-gray-300 rounded-lg shadow-lg opciones-container min-w-40 z-20'
                            style={{
                                top: '50%',
                                right: '-90%',
                                transform: 'translate(-10px, -50%)'
                            }}>
                            <span 
                                className={`block text-lg font-bold rounded-t-lg text-white mb-1 p-3 ${obtenerColorSubtitulo(marcadoresOI.find(m => m.id === marcadorActivoOI))}`}
                            >
                                {marcadoresOI.find(m => m.id === marcadorActivoOI).subtitulo}
                            </span>
                            <div className='space-y-2 p-2'>
                                {marcadoresOI.find(m => m.id === marcadorActivoOI).opciones.map((opcion) => (
                                    <div
                                        key={opcion.id}
                                        className={`cursor-pointer hover:bg-green-200 p-2 rounded-md ${
                                            data[marcadoresOI.find(m => m.id === marcadorActivoOI).campo] === opcion.nombre
                                                ? 'bg-green-400'
                                                : 'bg-white'
                                        }`}
                                        onClick={() => handleSeleccionOpcionOI(opcion)}
                                    >
                                        {opcion.nombre}
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