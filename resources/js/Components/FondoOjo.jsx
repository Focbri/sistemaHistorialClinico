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
    setData = () => {}
    }) => {
    const contenedorODRef = useRef(null);
    const contenedorOIRef = useRef(null);
    const [marcadorArrastrado, setMarcadorArrastrado] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

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

    // Función para obtener posición inicial (corregida)
    const getInitialPosition = (marcador, tipoOjo) => {
        const posKey = `${tipoOjo}_${marcador.id}`;
        if (posicionesGuardadas[posKey]) {
            return posicionesGuardadas[posKey];
        }
        
        // Valores por defecto considerando la diferencia entre OD y OI
        let defaultX, defaultY;
        
        if (tipoOjo === 'OD') {
            defaultX = marcador.left ? parseInt(marcador.left.replace('left-', '')) : 24;
        } else {
            // Para OI, usamos right si está definido, o un valor por defecto invertido
            defaultX = marcador.right ? parseInt(marcador.right.replace('right-', '')) : 24;
        }
        
        defaultY = marcador.top ? parseInt(marcador.top.replace('top-', '')) : 16;
        
        return { x: defaultX, y: defaultY };
    };

    // Iniciar arrastre (versión mejorada)
    const iniciarArrastre = (marcador, e, tipoOjo) => {
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
        if (!marcadorArrastrado) return;
        
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
        const handleMouseMove = (e) => moverMarcador(e);
        const handleMouseUp = () => finalizarArrastre();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [marcadorArrastrado, offset]);

    // Obtener estilo del marcador (versión corregida)
    const obtenerEstiloMarcador = (marcador, tipoOjo) => {
        const posicion = getInitialPosition(marcador, tipoOjo);
        
        const estiloBase = {
            position: 'absolute',
            top: `${posicion.y}px`,
            transform: 'translate(-50%, -50%)',
            cursor: 'pointer',
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

    // Renderizar marcadores
    const renderMarcadores = (marcadores, tipoOjo) => {
        return marcadores.map((marcador) => (
            <div
                key={`${tipoOjo}_${marcador.id}`}
                style={obtenerEstiloMarcador(marcador, tipoOjo)}
                onMouseDown={(e) => iniciarArrastre(marcador, e, tipoOjo)}
                onClick={(e) => {
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
        ));

    };

    return (
        <div className='flex flex-col justify-center items-center w-full gap-4'>
            <label className="block text-xl font-medium text-gray-700">Fondo de Ojo</label>
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

                    {marcadorActivoOD && (
                        <div className='absolute bg-white border border-gray-300 rounded-lg shadow-lg opciones-container min-w-40 z-20'
                            style={{
                                top: '50%',
                                left: '-90%',
                                transform: 'translate(10px, -50%)'
                            }}>
                            <span className='block text-lg font-bold rounded-t-lg text-white mb-1 p-3 bg-blue-950'>
                                {marcadoresOD.find(m => m.id === marcadorActivoOD).subtitulo}
                            </span>
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

                    {marcadorActivoOI && (
                        <div className='absolute bg-white border border-gray-300 rounded-lg shadow-lg opciones-container min-w-40 z-20'
                            style={{
                                top: '50%',
                                right: '-90%',
                                transform: 'translate(-10px, -50%)'
                            }}>
                            <span className='block text-lg font-bold rounded-t-lg text-white mb-1 p-3 bg-blue-950'>
                                {marcadoresOI.find(m => m.id === marcadorActivoOI).subtitulo}
                            </span>
                            <div className='space-y-2 p-2'>
                                {marcadoresOI.find(m => m.id === marcadorActivoOI).opciones.map((opcion) => (
                                    <div
                                        key={opcion.id}
                                        className={`cursor-pointer hover:bg-green-200 p-1 rounded-md ${
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