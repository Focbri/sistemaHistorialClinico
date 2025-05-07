import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';
import Pagination from '@/Components/Pagination';

export default function ConsultasIndex({ auth, consultas, links }) {
    console.log('Consultas recibidas:', consultas); // Depuración
    console.log('Enlaces de paginación:', links); // Depuración

    const [searchDni, setSearchDni] = useState('');

    const [showPdfNotification, setShowPdfNotification] = useState(false);
    const [pdfNotificationMessage, setPdfNotificationMessage] = useState('');

    // Función para buscar consultas por DNI del paciente
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('consultas.index'), { dni: searchDni || undefined });
    };

    // Función para eliminar una consulta (con modal de confirmación)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [consultaToDelete, setConsultaToDelete] = useState(null);

    const openDeleteModal = (consultaId) => {
        setConsultaToDelete(consultaId);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (consultaToDelete) {
            router.delete(route('consultas.destroy', consultaToDelete), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                }
            });
        }
    };

    // Función para descargar PDF con notificación
    const descargarPDF = async (id) => {
        try {
            const response = await fetch(route('consultas.generarPDF', id));
            const result = await response.json();
    
            if (result.success) {
                setPdfNotificationMessage('PDF generado y guardado correctamente');
                setShowPdfNotification(true);
                
                // Ocultar notificación después de 5 segundos
                setTimeout(() => {
                    setShowPdfNotification(false);
                }, 5000);
            } else {
                setPdfNotificationMessage(result.message || 'Error al generar el PDF');
                setShowPdfNotification(true);
            }
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            setPdfNotificationMessage('Error al generar el PDF');
            setShowPdfNotification(true);
        }
    };

    const descargarPDFReceta = async (consultaId) => {
        try {
            setPdfNotificationMessage('Preparando receta médica...');
            setShowPdfNotification(true);
            
            // 1. Verificar si existe receta para esta consulta
            const response = await fetch(route('recetas.get-by-consulta', { consultaId }));
            
            if (!response.ok) {
                throw new Error('Error al verificar receta');
            }
    
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'No existe receta para esta consulta');
            }
    
            // 2. Generar el PDF - usar el nombre correcto de la ruta
            window.open(route('recetas.generate-pdf', { id: data.id }), '_blank');
            
            setPdfNotificationMessage('Receta generada correctamente');
        } catch (error) {
            console.error('Error al generar receta:', error);
            setPdfNotificationMessage(error.message);
            
            // Redirigir a edición para crear receta si no existe
            if (error.message.includes('No existe receta')) {
                router.visit(route('consultas.edit', consultaId), {
                    data: { activeTab: 'recetas' }
                });
            }
        } finally {
            setTimeout(() => setShowPdfNotification(false), 5000);
        }
    };

    const descargarPDFRefraccion = async (consultaId) => {
        try {
            setPdfNotificationMessage('Generando examen de refracción...');
            setShowPdfNotification(true);
            
            const response = await fetch(route('refracciones.por-consulta', { consultaId }));
            
            if (!response.ok) {
                throw new Error('Error al verificar examen de refracción');
            }
    
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'No existe examen de refracción para esta consulta');
            }
    
            window.open(route('refracciones.pdf', { id: data.data.id }), '_blank');
            
            setPdfNotificationMessage('Examen de refracción generado');
        } catch (error) {
            console.error('Error al generar refracción:', error);
            setPdfNotificationMessage(error.message);
        } finally {
            setTimeout(() => setShowPdfNotification(false), 5000);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Consultas</h2>}
        >
            <Head title="Consultas" />

            {/* Modal de Confirmación para Eliminar */}
            <Dialog
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <DialogTitle className="text-lg font-bold text-gray-900">
                            Confirmar Eliminación
                        </DialogTitle>
                        <Description className="mt-2">
                            ¿Estás seguro de que deseas eliminar esta consulta?
                        </Description>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Notificación de PDF */}
            {showPdfNotification && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center animate-fade-in-up">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{pdfNotificationMessage}</span>
                        <button 
                            onClick={() => setShowPdfNotification(false)}
                            className="ml-4 text-white hover:text-gray-200"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Barra de búsqueda y botones de creación */}
                            <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0 mb-6">
                                <form onSubmit={handleSearch} className="flex items-center w-full md:w-auto">
                                    <input
                                        type="text"
                                        placeholder="Buscar por DNI del paciente"
                                        value={searchDni}
                                        onChange={(e) => setSearchDni(e.target.value)}
                                        className="px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Buscar
                                    </button>
                                </form>

                                <div className="flex space-x-2">
                                    <Link
                                        href={route('cirugias.create')}
                                        className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        Crear Nueva Cirugía
                                    </Link>
                                    <Link
                                        href={route('consultas.create')}
                                        className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        Crear Nueva Consulta
                                    </Link>
                                </div>
                            </div>

                            {/* Tabla de consultas */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalle</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {consultas.data.length > 0 ? (
                                            consultas.data.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-4 text-sm text-gray-900">
                                                        {item.tipo_consulta ? (
                                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                                item.tipo_consulta === 'inicio' ? 'bg-blue-100 text-blue-800' :
                                                                item.tipo_consulta === 'evolucion' ? 'bg-green-100 text-green-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {item.tipo_consulta === 'inicio' ? 'C. Inicio' : 
                                                                item.tipo_consulta === 'evolucion' ? 'C. Evolución' : 'Cirugía'}
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                                                Cirugía
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-900">{item.codigo_historial}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-900">
                                                        {new Date(item.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-900">
                                                        {item.paciente.nombres} {item.paciente.apellido_paterno}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-900">
                                                        {item.paciente.dni}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-900">
                                                        <div className="flex items-center space-x-2">
                                                            <Link
                                                                href={item.tipo_consulta ? 
                                                                    route('consultas.show', item.id) : 
                                                                    route('cirugias.show', item.id)}
                                                                className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                                                            >
                                                                Ver
                                                            </Link>
                                                            <Link
                                                                href={route('consultas.edit', item.id)}
                                                                className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                            >
                                                                Editar
                                                            </Link>
                                                            {(auth.user.role === 'admin' || auth.user.role === 'root') && (
                                                                <button
                                                                    onClick={() => openDeleteModal(item.id)}
                                                                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => descargarPDF(item.id)}
                                                                className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                            >
                                                                PDF Consulta
                                                            </button>
                                                            {/* Botón para PDF de receta (solo si existe) */}
                                                            {item.receta && (
                                                                <button
                                                                    onClick={() => descargarPDFReceta(item.id)}
                                                                    className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                                                                >
                                                                    PDF Receta
                                                                </button>
                                                            )}
                                                            
                                                            {/* Botón para crear receta (si no existe) */}
                                                            {!item.receta && (
                                                                <Link
                                                                    href={route('consultas.edit', item.id)}
                                                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                                    data={{ activeTab: 'recetas' }}
                                                                >
                                                                    Crear Receta
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-4 text-center text-sm text-gray-500">
                                                    No se encontraron consultas.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            <div className="mt-4">
                            <Pagination 
    links={consultas.links} 
    preserveState
    only={['consultas', 'filters']}
/>
                    </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}