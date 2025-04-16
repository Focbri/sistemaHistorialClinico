import { router } from '@inertiajs/react';
import { Head, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CitasIndex({ calendarData, currentMonth, currentYear, medicos }) {
    // Definir nombres de meses
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                       "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const { data, setData, post, processing, errors } = useForm({
        paciente_id: '',
        medico_id: '',
        fecha_hora: '',
        motivo: '',
        dni: '',
    });
    
    const [showModal, setShowModal] = useState(false);
    const [pacienteEncontrado, setPacienteEncontrado] = useState(false);
    const [pacienteInfo, setPacienteInfo] = useState(null);

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
            } else {
                throw new Error(result.message || 'Datos del paciente incompletos');
            }
        } catch (error) {
            console.error('Error al buscar paciente:', error);
            alert(error.message);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!pacienteEncontrado) {
            alert('Debe buscar y seleccionar un paciente válido');
            return;
        }
        
        post('/citas', {
            onSuccess: () => {
                setShowModal(false);
                setData({
                    paciente_id: '',
                    medico_id: '',
                    fecha_hora: '',
                    motivo: '',
                    dni: '',
                });
                setPacienteEncontrado(false);
                setPacienteInfo(null);
            },
        });
    };


    return (
        
        <AuthenticatedLayout>
            <div className="container mx-auto px-4 py-8">
                <Head title="Calendario de Citas" />
                
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Calendario de Citas</h1>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Nueva Cita
                    </button>
                </div>

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
                    
                    {calendarData.map((dayData) => (
                        <div 
                            key={dayData.date}
                            className={`p-2 border rounded-lg text-center cursor-pointer
                                ${dayData.status === 'green' ? 'bg-green-100 hover:bg-green-200' : 
                                  dayData.status === 'orange' ? 'bg-orange-100 hover:bg-orange-200' : 
                                  'bg-red-100 hover:bg-red-200'}`}
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
                    ))}
                </div>

            {/* Modal para crear cita */}
            {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-bold mb-4">Nueva Cita</h3>
                            <form onSubmit={handleSubmit}>
                                {/* Campo de búsqueda por DNI */}
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

                                {/* Mostrar información del paciente encontrado */}
                                {pacienteEncontrado && pacienteInfo && (
                                    <div className="mb-4 p-3 bg-gray-50 rounded">
                                        <h4 className="font-bold">Paciente encontrado:</h4>
                                        <p>{pacienteInfo.nombres} {pacienteInfo.apellido_paterno} {pacienteInfo.apellido_materno}</p>
                                        <p>DNI: {pacienteInfo.dni}</p>
                                        <p>Teléfono: {pacienteInfo.telefono}</p>
                                    </div>
                                )}

                                {/* Resto del formulario */}
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
                                                {medico.name} - {medico.especialidad}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block mb-2">Fecha y Hora</label>
                                    <input
                                        type="datetime-local"
                                        value={data.fecha_hora}
                                        onChange={(e) => setData('fecha_hora', e.target.value)}
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
                                            setPacienteEncontrado(false);
                                            setPacienteInfo(null);
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
        </div>
        </AuthenticatedLayout>
    );
}