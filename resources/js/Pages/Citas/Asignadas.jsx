import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function CitasAsignadas({ auth, citas, citasAtendidas }) {
    const [selectedCita, setSelectedCita] = useState(null);
    const [showActionModal, setShowActionModal] = useState(false);
    const [hasPreviousConsultas, setHasPreviousConsultas] = useState(false);
      const [activeTab, setActiveTab] = useState('calendario');

    const openActionModal = async (cita) => {
        setSelectedCita(cita);
                
        setShowActionModal(true);
    };

    const marcarComoAtendida = (citaId) => {
        if (confirm('¿Está seguro de marcar esta cita como atendida?')) {
            router.put(route('citas.update-status', citaId), {
                estado: 'completada'
            }, {
                onSuccess: () => {
                    router.reload();
                }
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Mis Citas" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    <div className="flex border-b mb-6">
                        <button
                            className={`py-2 px-4 font-medium ${activeTab === 'calendario' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('calendario')}
                        >
                            CITAS ASIGNADAS
                        </button>
                        <button
                            className={`py-2 px-4 font-medium ${activeTab === 'lista' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('lista')}
                        >
                            CITAS ATENDIDAS
                        </button>
                    </div>
                    {activeTab === 'calendario' ? (
                    
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-6">Mis Citas Asignadas</h1>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI/CE</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {citas.map(cita => (
                                            <tr key={cita.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {cita.paciente?.nombres} {cita.paciente?.apellido_paterno}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {cita.paciente?.dni || cita.paciente?.carnet_extranjeria || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {new Date(cita.fecha_hora).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {cita.motivo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${cita.estado === 'completada' ? 'bg-green-100 text-green-800' : 
                                                          cita.estado === 'cancelada' ? 'bg-red-100 text-red-800' : 
                                                          'bg-blue-100 text-blue-800'}`}>
                                                        {cita.estado === 'completada' ? 'Atendida' : 
                                                         cita.estado === 'cancelada' ? 'Cancelada' : 'Programada'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                                    <button 
                                                        onClick={() => openActionModal(cita)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Atender
                                                    </button>
                                                    {cita.estado === 'programada' && (
                                                        <button 
                                                            onClick={() => marcarComoAtendida(cita.id)}
                                                            className="text-purple-600 hover:text-purple-900"
                                                        >
                                                            Marcar como atendida
                                                        </button>
                                                    )}
                                                    <Link 
                                                        href={route('citas.edit', cita.id)}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        Editar
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    ) : (

                    
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-6">Mis Citas Atendidas</h1>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI/CE</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {citasAtendidas.map(cita => (
                                            <tr key={cita.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {cita.paciente?.nombres} {cita.paciente?.apellido_paterno}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {cita.paciente?.dni || cita.paciente?.carnet_extranjeria || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {new Date(cita.fecha_hora).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {cita.motivo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Atendida
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                                    <Link 
                                                        href={route('citas.edit', cita.id)}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        Editar
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>

            {/* Modal de Acciones con Detalles */}
            <Modal show={showActionModal} onClose={() => setShowActionModal(false)}>
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Atención de Cita</h2>
                    
                    {selectedCita && (
                        <div className="space-y-6">
                            {/* Sección de Detalles */}
                            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-medium">Detalles de la Cita</h3>
                                <div>
                                    <p className="font-medium">Paciente:</p>
                                    <p>{selectedCita.paciente?.nombres} {selectedCita.paciente?.apellido_paterno}</p>
                                    <p>DNI: {selectedCita.paciente?.dni || 'N/A'}</p>
                                </div>
                                
                                <div>
                                    <p className="font-medium">Fecha y Hora:</p>
                                    <p>{new Date(selectedCita.fecha_hora).toLocaleString()}</p>
                                </div>
                                
                                <div>
                                    <p className="font-medium">Motivo:</p>
                                    <p>{selectedCita.motivo}</p>
                                </div>
                            </div>

                            {/* Sección de Opciones */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Opciones de Atención</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {!hasPreviousConsultas ? (
                                       <Link 
                                            href={route('consultas.create', { 
                                                paciente_id: selectedCita.paciente_id, 
                                                cita_id: selectedCita.id,
                                                tipo: 'inicio',
                                                dni: selectedCita.paciente?.dni || selectedCita.paciente?.carnet_extranjeria // Añade esta línea
                                            })}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center"
                                        >
                                            Consulta Inicial
                                        </Link>
                                    ) : (
                                        <Link 
                                            href={route('consultas.create', { 
                                                paciente_id: selectedCita.paciente_id, 
                                                cita_id: selectedCita.id,
                                                tipo: 'evolucion',
                                                dni: selectedCita.paciente?.dni || selectedCita.paciente?.carnet_extranjeria // Añade esta línea
                                            })}
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-center"
                                        >
                                            Consulta de Evolución
                                        </Link>
                                    )}
                                    
                                    <Link 
                                        href={route('cirugias.create', { 
                                            paciente_id: selectedCita.paciente_id, 
                                            cita_id: selectedCita.id
                                        })}
                                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded text-center"
                                    >
                                        Registrar Cirugía
                                    </Link>
                                    
                                    <button 
                                        onClick={() => marcarComoAtendida(selectedCita.id)}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-center"
                                    >
                                        Marcar como atendida
                                    </button>
                                    
                                    <button 
                                        onClick={() => setShowActionModal(false)}
                                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}