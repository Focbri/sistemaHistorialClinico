import { router } from '@inertiajs/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CitasIndex({ calendarData, currentMonth, currentYear, medicos, citas }) {
    // Definir nombres de meses
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                       "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    // Estados para los modales
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCita, setSelectedCita] = useState(null);

    // Formulario y estados relacionados
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        id: '',
        paciente_id: '',
        medico_id: '',
        fecha_hora: '',
        motivo: '',
        dni: '',
    });

    const [pacienteEncontrado, setPacienteEncontrado] = useState(false);
    const [pacienteInfo, setPacienteInfo] = useState(null);
    const [activeTab, setActiveTab] = useState('calendario');
    const [errorMessage, setErrorMessage] = useState('');

    const [localCitas, setLocalCitas] = useState(citas);

    // Función para navegar entre meses
    const navigateMonth = (increment) => {
        let newMonth = parseInt(currentMonth) + increment;
        let newYear = parseInt(currentYear);
        
        if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        }
        
        router.get('/citas', { month: newMonth, year: newYear });
    };

    // Función para buscar paciente por DNI
    const buscarPaciente = async () => {
        if (!data.dni) return;        
        try {
            const response = await fetch('/consultas/buscar-paciente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ dni: data.dni.trim() }),
            });
    
            if (!response.ok) throw new Error('Paciente no encontrado');
    
            const result = await response.json();
            
            if (result.success && result.paciente) {
                setData({
                    ...data,
                    paciente_id: result.paciente.id,
                });
                
                setPacienteInfo(result.paciente);
                setPacienteEncontrado(true);
                setErrorMessage('');
            } else {
                throw new Error(result.message || 'Datos del paciente incompletos');
            }
        } catch (error) {
            console.error('Error al buscar paciente:', error);
            setErrorMessage(error.message);
            setPacienteEncontrado(false);
            setPacienteInfo(null);
        }
    };

    // Llamar a buscarPaciente cuando el DNI tenga 8 caracteres
    useEffect(() => {
        if (data.dni && data.dni.length === 8) {
            buscarPaciente();
        }
    }, [data.dni]);

    // Función para verificar disponibilidad con diferencia de 1 hora
    const verificarDisponibilidad = () => {
        if (!data.fecha_hora) return true;
        
        const fechaHora = new Date(data.fecha_hora);
        const horaInicio = new Date(fechaHora.getTime() - 60 * 60 * 1000); // Restar 1 hora
        const horaFin = new Date(fechaHora.getTime() + 60 * 60 * 1000); // Sumar 1 hora
    
        const citasEnRango = citas.filter(cita => {
            const citaFechaHora = new Date(cita.fecha_hora);
            // Permitir exactamente 1 hora de diferencia (11:30 si hay una a 10:30)
            return citaFechaHora.getTime() !== fechaHora.getTime() && // No misma hora exacta
                   citaFechaHora > horaInicio && 
                   citaFechaHora < horaFin && 
                   cita.id !== (selectedCita?.id || data.id);
        });
    
        if (citasEnRango.length > 0) {
            setErrorMessage('Debe haber al menos 1 hora de diferencia entre citas (excepto para horas exactas)');
            return false;
        }
        
        setErrorMessage('');
        return true;
    };
    

    // Handlers para los modales
    const openViewModal = (cita) => {
        setSelectedCita(cita);
        setShowViewModal(true);
    };

    const openEditModal = (cita) => {
        setSelectedCita(cita);
        setData({
            id: cita.id,
            paciente_id: cita.paciente_id,
            medico_id: cita.medico_id,
            fecha_hora: cita.fecha_hora.split(' ').join('T'),
            motivo: cita.motivo,
            estado: cita.estado, // Añadimos el estado
            dni: cita.paciente.dni,
        });
        setPacienteInfo(cita.paciente);
        setPacienteEncontrado(true);
        setShowEditModal(true);
    };

    const openDeleteModal = (cita) => {
        setSelectedCita(cita);
        setShowDeleteModal(true);
    };

    // Handlers para los formularios
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!pacienteEncontrado) {
            setErrorMessage('Debe buscar y seleccionar un paciente válido');
            return;
        }
        
        if (!verificarDisponibilidad()) {
            return;
        }

        post('/citas', {
            onSuccess: () => {
                reset();
                setShowModal(false);
                setPacienteEncontrado(false);
                setPacienteInfo(null);
                setErrorMessage('');
            },
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!verificarDisponibilidad()) return;
    
        try {
            // 1. Cerrar el modal inmediatamente
            setShowEditModal(false);
            
            // 2. Realizar la actualización
            await put(`/citas/${data.id}`, {
                medico_id: data.medico_id,
                fecha_hora: data.fecha_hora,
                motivo: data.motivo,
                estado: data.estado
            }, {
                preserveScroll: true
            });
    
            // 3. Recargar los datos después de cerrar el modal
            router.reload({ 
                only: ['citas'],
                preserveScroll: true,
                onFinish: () => {
                    reset();
                    setSelectedCita(null);
                }
            });
            
        } catch (error) {
            // Manejo de errores
            if (error.response?.data?.errors?.fecha_hora) {
                setErrorMessage(error.response.data.errors.fecha_hora);
            }
            // Reabrir el modal si hay error
            setShowEditModal(true);
        }
    };

    const handleDelete = () => {
        if (!selectedCita) return;
        
        destroy(`/citas/${selectedCita.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedCita(null);
                router.reload({ only: ['citas'] });
            }
        });
    };

    useEffect(() => {
        setLocalCitas(citas);
    }, [citas]);

    // Función para formatear la fecha
    const formatFecha = (fechaHora) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(fechaHora).toLocaleDateString('es-ES', options);
    };

    const getDayColor = (citasCount) => {
        if (citasCount === 0) return 'gray';
        if (citasCount >= 16) return 'red';
        if (citasCount >= 12) return 'orange';
        return 'green';
    };

    return (
        <AuthenticatedLayout>
            <div className="container mx-auto px-4 py-8">
                <Head title="Calendario de Citas" />
                
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Gestión de Citas</h1>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Nueva Cita
                    </button>
                </div>

                {/* Pestañas para cambiar entre vistas */}
                <div className="flex border-b mb-6">
                    <button
                        className={`py-2 px-4 ${activeTab === 'calendario' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
                        onClick={() => setActiveTab('calendario')}
                    >
                        Calendario
                    </button>
                    <button
                        className={`py-2 px-4 ${activeTab === 'lista' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
                        onClick={() => setActiveTab('lista')}
                    >
                        Lista de Citas
                    </button>
                </div>

                {activeTab === 'calendario' ? (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <button 
                                onClick={() => navigateMonth(-1)}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                &lt; Anterior
                            </button>
                            <h2 className="text-xl font-semibold">
                                {monthNames[currentMonth - 1]} {currentYear}
                            </h2>
                            <button 
                                onClick={() => navigateMonth(1)}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Siguiente &gt;
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                                <div key={day} className="text-center font-bold py-2">
                                    {day}
                                </div>
                            ))}
                            
                            {calendarData.map((dayData) => {
                                const dayColor = getDayColor(dayData.citas_count);
                                const colorClasses = {
                                    gray: 'bg-gray-100 hover:bg-gray-200',
                                    green: 'bg-green-100 hover:bg-green-200',
                                    orange: 'bg-orange-100 hover:bg-orange-200',
                                    red: 'bg-red-100 hover:bg-red-200'
                                };
                                
                                return (
                                    <div 
                                        key={dayData.date}
                                        className={`p-2 border rounded-lg text-center cursor-pointer ${colorClasses[dayColor]}`}
                                        onClick={() => {
                                            setData({ 
                                                ...data,
                                                fecha_hora: dayData.date + 'T09:00' 
                                            });
                                            setShowModal(true);
                                        }}
                                    >
                                        <div className="font-bold">{dayData.day}</div>
                                        <div className="text-sm">
                                            {dayData.citas_count}/16 citas
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border">Paciente</th>
                                    <th className="py-2 px-4 border">DNI</th>
                                    <th className="py-2 px-4 border">Médico</th>
                                    <th className="py-2 px-4 border">Fecha y Hora</th>
                                    <th className="py-2 px-4 border">Motivo</th>
                                    <th className="py-2 px-4 border">Estado</th>
                                    <th className="py-2 px-4 border">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {localCitas.map((cita) => (
                                    <tr key={cita.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border">
                                            {cita.paciente.nombres} {cita.paciente.apellido_paterno} {cita.paciente.apellido_materno}
                                        </td>
                                        <td className="py-2 px-4 border">{cita.paciente.dni}</td>
                                        <td className="py-2 px-4 border">
                                            {cita.medico.name}
                                        </td>
                                        <td className="py-2 px-4 border">{formatFecha(cita.fecha_hora)}</td>
                                        <td className="py-2 px-4 border">{cita.motivo}</td>
                                        <td className="py-2 px-4 border">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                cita.estado === 'programada' ? 'bg-blue-100 text-blue-800' :
                                                cita.estado === 'completada' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border">
                                            <div className="flex space-x-2">
                                                <button 
                                                onClick={() => openViewModal(cita)}
                                                className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                                                >
                                                Ver
                                                </button>
                                                <button 
                                                onClick={() => openEditModal(cita)}
                                                className="px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
                                                >
                                                Editar
                                                </button>
                                                <button 
                                                onClick={() => openDeleteModal(cita)}
                                                className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                            >
                                                Eliminar
                                            </button>
                                            </div>
                                            </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal para crear cita */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-bold mb-4">Nueva Cita</h3>
                            {errorMessage && (
                                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                                    {errorMessage}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block mb-2">Buscar Paciente por DNI</label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            value={data.dni}
                                            onChange={(e) => setData('dni', e.target.value)}
                                            className="w-full p-2 border rounded"
                                            placeholder="Ingrese DNI (8 dígitos)"
                                            maxLength="8"
                                        />
                                        <button
                                            type="button"
                                            onClick={buscarPaciente}
                                            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Buscar
                                        </button>
                                    </div>
                                </div>

                                {pacienteEncontrado && pacienteInfo && (
                                    <div className="mb-4 p-3 bg-gray-50 rounded">
                                        <h4 className="font-bold">Paciente encontrado:</h4>
                                        <p>{pacienteInfo.nombres} {pacienteInfo.apellido_paterno} {pacienteInfo.apellido_materno}</p>
                                        <p>DNI: {pacienteInfo.dni}</p>
                                        <p>Teléfono: {pacienteInfo.telefono}</p>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="block mb-2">Médico</label>
                                    <select
                                        value={data.medico_id}
                                        onChange={(e) => setData('medico_id', e.target.value)}
                                        className="w-full p-2 border rounded"
                                        required
                                    >
                                        <option value="">Seleccionar médico</option>
                                        {medicos.map(medico => (
                                            <option key={medico.id} value={medico.id}>
                                                {medico.name.split(' - ')[0]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block mb-2">Fecha y Hora</label>
                                    <input
                                        type="datetime-local"
                                        value={data.fecha_hora}
                                        onChange={(e) => {
                                            setData('fecha_hora', e.target.value);
                                            verificarDisponibilidad();
                                        }}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block mb-2">Motivo</label>
                                    <input
                                        type="text"
                                        value={data.motivo}
                                        onChange={(e) => setData('motivo', e.target.value)}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            reset();
                                            setPacienteEncontrado(false);
                                            setPacienteInfo(null);
                                            setErrorMessage('');
                                        }}
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        disabled={!pacienteEncontrado || processing}
                                    >
                                        {processing ? 'Guardando...' : 'Guardar Cita'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal para ver cita */}
                {showViewModal && selectedCita && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-bold mb-4">Detalles de la Cita</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold">Paciente:</h4>
                                    <p>{selectedCita.paciente.nombres} {selectedCita.paciente.apellido_paterno} {selectedCita.paciente.apellido_materno}</p>
                                    <p>DNI: {selectedCita.paciente.dni}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Médico:</h4>
                                    <p>{selectedCita.medico.name} - {selectedCita.medico.especialidad}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Fecha y Hora:</h4>
                                    <p>{formatFecha(selectedCita.fecha_hora)}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Motivo:</h4>
                                    <p>{selectedCita.motivo}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Estado:</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        selectedCita.estado === 'programada' ? 'bg-blue-100 text-blue-800' :
                                        selectedCita.estado === 'completada' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {selectedCita.estado.charAt(0).toUpperCase() + selectedCita.estado.slice(1)}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal para editar cita */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-bold mb-4">Editar Cita</h3>
                            {errorMessage && (
                                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                                    {errorMessage}
                                </div>
                            )}
                            <form onSubmit={handleUpdate}>
                                <div className="mb-4">
                                    <label className="block mb-2">Paciente</label>
                                    <div className="p-2 bg-gray-100 rounded">
                                        {pacienteInfo?.nombres} {pacienteInfo?.apellido_paterno} {pacienteInfo?.apellido_materno}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block mb-2">Médico</label>
                                    <select
                                        value={data.medico_id}
                                        onChange={(e) => setData('medico_id', e.target.value)}
                                        className="w-full p-2 border rounded"
                                        required
                                    >
                                        <option value="">Seleccionar médico</option>
                                        {medicos.map(medico => (
                                            <option key={medico.id} value={medico.id}>
                                                {medico.name.split(' - ')[0]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block mb-2">Fecha y Hora</label>
                                    <input
                                        type="datetime-local"
                                        value={data.fecha_hora}
                                        onChange={(e) => {
                                            setData('fecha_hora', e.target.value);
                                            verificarDisponibilidad();
                                        }}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block mb-2">Motivo</label>
                                    <input
                                        type="text"
                                        value={data.motivo}
                                        onChange={(e) => setData('motivo', e.target.value)}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block mb-2">Estado</label>
                                    <select
                                        value={data.estado}
                                        onChange={(e) => setData('estado', e.target.value)}
                                        className="w-full p-2 border rounded"
                                        required
                                    >
                                        <option value="programada">Programada</option>
                                        <option value="completada">Completada</option>
                                        <option value="cancelada">Cancelada</option>
                                    </select>
                                </div>

                                
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            reset();
                                            setErrorMessage('');
                                        }}
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        disabled={processing}
                                    >
                                        {processing ? 'Actualizando...' : 'Actualizar Cita'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal para eliminar cita */}
                {showDeleteModal && selectedCita && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Confirmar Eliminación</h3>
                        <p className="mb-4">¿Estás seguro que deseas eliminar la cita de {selectedCita.paciente.nombres} programada para el {formatFecha(selectedCita.fecha_hora)}?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </AuthenticatedLayout>
    );
}