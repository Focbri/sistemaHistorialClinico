import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import fondoOjoD from '../../../public/img/fondo_ojo_derecho.png';
import fondoOjoI from '../../../public/img/fondo_ojo_izquierdo.png';
import { useState, useRef } from 'react';

const FondoOjo = ({
    marcadoresOD,
    marcadoresOI,
    marcadorActivoOD,
    marcadorActivoOI,
    handleMarkerClickOD,
    handleMarkerClickOI,
    handleSeleccionOpcionOD,
    handleSeleccionOpcionOI,
    data,
}) => {
    // Estados para el arrastre de los marcadores de cada ojo
    const [marcadorArrastradoOD, setMarcadorArrastradoOD] = useState(null);
    const [posicionArrastreOD, setPosicionArrastreOD] = useState({ x: 0, y: 0 });

    const [marcadorArrastradoOI, setMarcadorArrastradoOI] = useState(null);
    const [posicionArrastreOI, setPosicionArrastreOI] = useState({ x: 0, y: 0 });

    // Referencias para controlar el tiempo de clic y arrastre
    const tiempoClicRefOD = useRef(null);
    const tiempoClicRefOI = useRef(null);

    // Función para iniciar el arrastre en OD
    const iniciarArrastreOD = (marcador, event) => {
        event.stopPropagation(); // Evitar que el clic se propague a la imagen
        tiempoClicRefOD.current = setTimeout(() => {
            setMarcadorArrastradoOD(marcador);
            const rect = event.currentTarget.getBoundingClientRect();
            setPosicionArrastreOD({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            });
        }, 200); // Retraso de 200 ms para distinguir entre clic y arrastre
    };

    // Función para mover el marcador en OD
    const moverMarcadorOD = (event) => {
        if (marcadorArrastradoOD) {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            // Limitar el movimiento dentro de la imagen
            const nuevaX = Math.max(0, Math.min(rect.width, x));
            const nuevaY = Math.max(0, Math.min(rect.height, y));

            setPosicionArrastreOD({ x: nuevaX, y: nuevaY });
        }
    };

    // Función para detener el arrastre en OD
    const detenerArrastreOD = () => {
        if (tiempoClicRefOD.current) {
            clearTimeout(tiempoClicRefOD.current); // Cancelar el temporizador si el usuario suelta el clic antes de 200 ms
        }
        setMarcadorArrastradoOD(null);
    };

    // Función para manejar el clic en OD
    const manejarClicOD = (marcador, event) => {
        event.stopPropagation(); // Evitar que el clic se propague a la imagen
        if (tiempoClicRefOD.current) {
            clearTimeout(tiempoClicRefOD.current); // Cancelar el temporizador si es un clic rápido
            handleMarkerClickOD(marcador);
        }
    };

    // Función para iniciar el arrastre en OI
    const iniciarArrastreOI = (marcador, event) => {
        event.stopPropagation(); // Evitar que el clic se propague a la imagen
        tiempoClicRefOI.current = setTimeout(() => {
            setMarcadorArrastradoOI(marcador);
            const rect = event.currentTarget.getBoundingClientRect();
            const x = rect.width - (event.clientX - rect.left); // Ajustar para el borde derecho
            const y = event.clientY - rect.top;

            setPosicionArrastreOI({ x, y });
        }, 200); // Retraso de 200 ms para distinguir entre clic y arrastre
    };

    // Función para mover el marcador en OI
    const moverMarcadorOI = (event) => {
        if (marcadorArrastradoOI) {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = rect.width - (event.clientX - rect.left); // Ajustar para el borde derecho
            const y = event.clientY - rect.top;

            // Limitar el movimiento dentro de la imagen
            const nuevaX = Math.max(0, Math.min(rect.width, x));
            const nuevaY = Math.max(0, Math.min(rect.height, y));

            setPosicionArrastreOI({ x: nuevaX, y: nuevaY });
        }
    };

    // Función para detener el arrastre en OI
    const detenerArrastreOI = () => {
        if (tiempoClicRefOI.current) {
            clearTimeout(tiempoClicRefOI.current); // Cancelar el temporizador si el usuario suelta el clic antes de 200 ms
        }
        setMarcadorArrastradoOI(null);
    };

    // Función para manejar el clic en OI
    const manejarClicOI = (marcador, event) => {
        event.stopPropagation(); // Evitar que el clic se propague a la imagen
        if (tiempoClicRefOI.current) {
            clearTimeout(tiempoClicRefOI.current); // Cancelar el temporizador si es un clic rápido
            handleMarkerClickOI(marcador);
        }
    };

    return (
        <div className='flex flex-col justify-center items-center w-full gap-4'>
            <label className="block text-xl font-medium text-gray-700">Fondo de Ojo</label>
            <div className='flex'>
                {/* Ojo Derecho (OD) */}
                <div
                    className='relative inline-block'
                    onMouseMove={moverMarcadorOD}
                    onMouseUp={detenerArrastreOD}
                    style={{ userSelect: 'none' }} // Deshabilitar selección de texto y elementos
                >
                    <img
                        src={fondoOjoD}
                        alt="Fondo de Ojo"
                        className="min-w-64 h-auto"
                        style={{ pointerEvents: 'none' }} // Deshabilitar eventos de ratón en la imagen
                        draggable="false" // Evitar que la imagen se pueda arrastrar
                    />

                    {marcadoresOD.map((marcador) => (
                        <span
                            key={marcador.id}
                            className={`text-2xl absolute cursor-pointer`}
                            style={{
                                top: marcadorArrastradoOD?.id === marcador.id ? `${posicionArrastreOD.y}px` : marcador.top,
                                left: marcadorArrastradoOD?.id === marcador.id ? `${posicionArrastreOD.x}px` : marcador.left,
                            }}
                            onMouseDown={(e) => iniciarArrastreOD(marcador, e)}
                            onClick={(e) => manejarClicOD(marcador, e)}
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
                <div
                    className='relative inline-block'
                    onMouseMove={moverMarcadorOI}
                    onMouseUp={detenerArrastreOI}
                    style={{ userSelect: 'none' }} // Deshabilitar selección de texto y elementos
                >
                    <img
                        src={fondoOjoI}
                        alt="Fondo de Ojo"
                        className="min-w-64 h-auto"
                        style={{ pointerEvents: 'none' }} // Deshabilitar eventos de ratón en la imagen
                        draggable="false" // Evitar que la imagen se pueda arrastrar
                    />

                    {marcadoresOI.map((marcadorOI) => (
                        <span
                            key={marcadorOI.id}
                            className={`text-2xl absolute cursor-pointer`}
                            style={{
                                top: marcadorArrastradoOI?.id === marcadorOI.id ? `${posicionArrastreOI.y}px` : marcadorOI.top,
                                right: marcadorArrastradoOI?.id === marcadorOI.id ? `${posicionArrastreOI.x}px` : marcadorOI.right,
                            }}
                            onMouseDown={(e) => iniciarArrastreOI(marcadorOI, e)}
                            onClick={(e) => manejarClicOI(marcadorOI, e)}
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
                                                ? 'bg-green-400'
                                                : 'bg-white'
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