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
    data = {},
    setData = () => {},
    modoVisualizacion = false
}) => {

    const DIMENSIONES_ESTANDAR = {
        width: 400,  // Ancho base para cálculos
        height: 400, // Alto base para cálculos
        pdfWidth: 200 // Ancho que usaremos en el PDF
    };

    const contenedorODRef = useRef(null);
    const contenedorOIRef = useRef(null);
    const [marcadorArrastrado, setMarcadorArrastrado] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [estaArrastrando, setEstaArrastrando] = useState(false);
    const inputRef = useRef(null);
    const [dimensiones, setDimensiones] = useState({
        width: DIMENSIONES_ESTANDAR.width,
        height: DIMENSIONES_ESTANDAR.height
    });
    const [textAreaAbierto, setTextAreaAbierto] = useState(null);



const escalarCoordenadasParaPDF = (x, y) => {
    const factorEscala = DIMENSIONES_ESTANDAR.pdfWidth / DIMENSIONES_ESTANDAR.width;
    return {
        x: x * factorEscala,
        y: y * factorEscala
    };
};

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

    // Agregamos los nuevos campos al estado inicial si no existen
    useEffect(() => {
        if (!modoVisualizacion) {
            const camposRequeridos = [
                'f_o_dilat_pup_od',
                'f_o_dilat_pup_oi',
                'f_o_locs_tres_od',
                'f_o_locs_tres_oi',
                'f_o_fundoscopia_od',
                'f_o_fundoscopia_oi',
                'f_o_conclusion',
                'f_o_plan'
            ];
            
            camposRequeridos.forEach(campo => {
                if (data[campo] === undefined) {
                    safeSetData(campo, '');
                }
            });
        }
    }, []);

    // Función para obtener posición inicial
    const getInitialPosition = (marcador, tipoOjo) => {
        const posKey = `${tipoOjo}_${marcador.id}`;
        
        if (posicionesGuardadas[posKey]) {
            return {
                x: posicionesGuardadas[posKey].x,
                y: posicionesGuardadas[posKey].y
            };
        }
        
        if (modoVisualizacion) return { x: -100, y: -100 };
        
        const index = tipoOjo === 'OD' 
            ? marcadoresOD.findIndex(m => m.id === marcador.id)
            : marcadoresOI.findIndex(m => m.id === marcador.id);
        
        const spacing = 30;
        const startY = 30;
        
        return {
            x: 10,
            y: startY + (index * spacing)
        };
    };

    // Iniciar arrastre
    const iniciarArrastre = (marcador, e, tipoOjo) => {
        if (modoVisualizacion) return;
        
        e.stopPropagation();
        e.preventDefault();
        
        setEstaArrastrando(true);
        setTextAreaAbierto(null); // Cerrar textarea si estaba abierto
        
        const contenedor = tipoOjo === 'OD' ? contenedorODRef.current : contenedorOIRef.current;
        if (!contenedor) return;

        const rect = contenedor.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const posicionActual = getInitialPosition(marcador, tipoOjo);

        setOffset({
            x: mouseX - posicionActual.x,
            y: mouseY - posicionActual.y
        });

        setMarcadorArrastrado({ ...marcador, tipoOjo });
    };

    // Mover marcador
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

        // Asegurar que los marcadores no salgan de los límites
        nuevaX = Math.max(10, Math.min(390, nuevaX)); // 400 - 10
        nuevaY = Math.max(10, Math.min(390, nuevaY)); // 400 - 10

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
        setEstaArrastrando(false);
        setMarcadorArrastrado(null);
    };

    // Manejar clic en marcador (sin arrastre)
    const handleClicMarcador = (marcador, tipoOjo) => {
        if (estaArrastrando) {
            setEstaArrastrando(false);
            return;
        }
        
        setTextAreaAbierto({
            tipoOjo,
            marcadorId: marcador.id
        });
    };

    // Cerrar textarea
    const cerrarTextarea = () => {
        setTextAreaAbierto(null);
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

    // Enfocar el input cuando se activa un marcador
    useEffect(() => {
        if (inputRef.current && textAreaAbierto && !estaArrastrando) {
            inputRef.current.focus();
        }
    }, [textAreaAbierto, estaArrastrando]);

    // Obtener estilo del marcador
    const obtenerEstiloMarcador = (marcador, tipoOjo) => {
        const posicion = getInitialPosition(marcador, tipoOjo);
        
        return {
            position: 'absolute',
            left: `${posicion.x}px`,
            top: `${posicion.y}px`,
            transform: 'translate(-50%, -50%)',
            cursor: modoVisualizacion ? 'default' : 'move',
            zIndex: marcadorArrastrado?.id === marcador.id ? 10 : 1,
            pointerEvents: modoVisualizacion ? 'none' : 'auto'
        };
    };

    // Obtener clase de color para el subtítulo
    const obtenerColorSubtitulo = (marcador) => {
        return COLORES_TAILWIND[marcador.color] || 'bg-gray-500';
    };


    // Renderizar marcadores
    const renderMarcadores = (marcadores, tipoOjo) => {
        return marcadores.map((marcador) => {
            if (modoVisualizacion && !data[marcador.campo]) {
                return null;
            }
            
            return (
                <div
                    key={`${tipoOjo}_${marcador.id}`}
                    style={obtenerEstiloMarcador(marcador, tipoOjo)}
                    onMouseDown={(e) => iniciarArrastre(marcador, e, tipoOjo)}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClicMarcador(marcador, tipoOjo);
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

    // Renderizar contenedores de texto en modo visualización
    const renderContenedoresVisualizacion = (marcadores, tipoOjo) => {
        return marcadores.map((marcador, index) => {
            if (!data[marcador.campo]) return null;
            
            const posicionesFijas = {
                OD: [
                    { top: '10%', left: '-200px' },
                    { top: '10%', left: '-100px' },
                    { top: '45%', left: '-200px' },
                    { top: '45%', left: '-100px' },
                    { top: '80%', left: '-150px' },
                ],
                OI: [
                    { top: '10%', right: '-200px' },
                    { top: '10%', right: '-100px' },
                    { top: '45%', right: '-200px' },
                    { top: '45%', right: '-100px' },
                    { top: '80%', right: '-150px' },
                ]
            };
    
            const posicion = posicionesFijas[tipoOjo][index] || { 
                top: '50%', 
                [tipoOjo === 'OD' ? 'left' : 'right']: '-150px' 
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
                    <div className='p-2'>
                        {data[marcador.campo]}
                    </div>
                </div>
            );
        });
    };

    // Renderizar textarea
    const renderTextarea = () => {
        if (!textAreaAbierto || modoVisualizacion) return null;

        const marcadores = textAreaAbierto.tipoOjo === 'OD' ? marcadoresOD : marcadoresOI;
        const marcador = marcadores.find(m => m.id === textAreaAbierto.marcadorId);
        
        if (!marcador) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={cerrarTextarea}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
                    onClick={(e) => e.stopPropagation()}>
                    <div className={`p-4 rounded-t-lg ${obtenerColorSubtitulo(marcador)}`}>
                        <h3 className="text-lg font-bold text-white">{marcador.subtitulo}</h3>
                    </div>
                    <div className="p-4">
                        <textarea
                            ref={inputRef}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Escribe tus observaciones..."
                            value={data[marcador.campo] || ''}
                            onChange={(e) => safeSetData(marcador.campo, e.target.value)}
                            rows={6}
                            autoFocus
                        />
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                                onClick={cerrarTextarea}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                onClick={cerrarTextarea}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='flex flex-col justify-center items-center w-full gap-4 relative'>
            <label className="block text-xl font-medium text-gray-700">Fondo de Ojo</label>
            
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
            
            <div className='flex flex-col md:flex-row justify-center gap-8 w-full'>
                {/* Ojo Derecho (OD) */}
                <div className="flex flex-col items-center">
                    <div
                        ref={contenedorODRef}
                        className='relative'
                        style={{ 
                            userSelect: 'none', 
                            touchAction: 'none',
                            width: `${dimensiones.width}px`,
                            height: `${dimensiones.height}px`
                        }}
                    >
                        <img
                            src={fondoOjoD}
                            alt="Fondo de Ojo Derecho"
                            style={{ 
                                width: '400px', 
                                height: '400px',
                                pointerEvents: 'none',
                                objectFit: 'contain'
                            }}
                            draggable="false"
                        />
                        {renderMarcadores(marcadoresOD, 'OD')}
                        {modoVisualizacion && renderContenedoresVisualizacion(marcadoresOD, 'OD')}
                    </div>
                    <span className="mt-2 font-medium">Ojo Derecho (OD)</span>
                </div>

                {/* Ojo Izquierdo (OI) */}
                <div className="flex flex-col items-center">
                    <div
                        ref={contenedorOIRef}
                        className='relative'
                        style={{ 
                            userSelect: 'none', 
                            touchAction: 'none',
                            width: `${dimensiones.width}px`,
                            height: `${dimensiones.height}px`
                        }}
                    >
                        <img
                            src={fondoOjoI}
                            alt="Fondo de Ojo Izquierdo"
                            style={{ 
                                width: '400px', 
                                height: '400px',
                                pointerEvents: 'none',
                                objectFit: 'contain'
                            }}
                            draggable="false"
                        />
                        {renderMarcadores(marcadoresOI, 'OI')}
                        {modoVisualizacion && renderContenedoresVisualizacion(marcadoresOI, 'OI')}
                    </div>
                    <span className="mt-2 font-medium">Ojo Izquierdo (OI)</span>
                </div>
            </div>

            {/* Nuevos campos de texto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Dilatación pupilar OD</label>
                        <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={data.f_o_dilat_pup_od || ''}
                            onChange={(e) => safeSetData('f_o_dilat_pup_od', e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">LOCS III OD</label>
                        <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={data.f_o_locs_tres_od || ''}
                            onChange={(e) => safeSetData('f_o_locs_tres_od', e.target.value)}
                        />
                    </div>                
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Dilatación pupilar OI</label>
                        <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={data.f_o_dilat_pup_oi || ''}
                            onChange={(e) => safeSetData('f_o_dilat_pup_oi', e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">LOCS III OI</label>
                        <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={data.f_o_locs_tres_oi || ''}
                            onChange={(e) => safeSetData('f_o_locs_tres_oi', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Modal de textarea */}
            {renderTextarea()}
        </div>
    );
};

export default FondoOjo;