import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';
import Pagination from '@/Components/Pagination';
import AdvancedFilters from '@/Components/AdvancedFilters';

export default function ConsultasIndex({ auth, consultas, links, filters }) {

    const [searchDni, setSearchDni] = useState(filters.dni || '');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [showPdfNotification, setShowPdfNotification] = useState(false);
    const [pdfNotificationMessage, setPdfNotificationMessage] = useState('');

    // Función para buscar consultas por DNI del paciente
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('consultas.index'), 
            { dni: searchDni || undefined }, 
            {
                preserveState: true,
                replace: true,
                only: ['consultas', 'filters'] // Asegúrate de incluir filters
            }
        );
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
    //FILTRO

const handleApplyFilters = async (appliedFilters) => {
    try {
        setLoading(true);
        setError(null);
        
        // Mapear los filtros al formato esperado por el backend
        const params = {
            dni: searchDni || undefined,
            startDate: appliedFilters.startDate || undefined,
            endDate: appliedFilters.endDate || undefined,
            sex: appliedFilters.sex || undefined,
            minAge: appliedFilters.minAge || undefined,
            maxAge: appliedFilters.maxAge || undefined,
            procedencia: appliedFilters.procedencia || undefined,
            // Puedes agregar más filtros aquí si es necesario
        };
        
        router.get(route('consultas.index'), params, {
            preserveState: true,
            replace: true,
            only: ['consultas', 'filters']
        });
        
    } catch (error) {
        console.error('Error al aplicar filtros:', error);
        setError('Error al aplicar los filtros');
    } finally {
        setLoading(false);
    }
};
    // Función para manejar el reset de filtros
const handleResetFilters = async () => {
    try {
        setLoading(true);
        setError(null);
        
        // Solo mantener el DNI si estaba en la búsqueda
        await router.get(route('consultas.index'), 
            { dni: searchDni || undefined }, 
            {
                preserveState: true,
                replace: true,
                only: ['consultas', 'filters']
            }
        );
        
    } catch (error) {
        console.error('Error al resetear filtros:', error);
        setError('Error al resetear los filtros');
    } finally {
        setLoading(false);
    }
};

const descargarPDFConsulta = async (consultaId) => {
    try {
        setPdfNotificationMessage('Generando PDF de consulta...');
        setShowPdfNotification(true);
        
        // Primero verificar si la consulta existe
        const response = await fetch(route('consultas.show', consultaId));
        if (!response.ok) {
            throw new Error('Consulta no encontrada');
        }
        
        // Luego descargar el PDF
        const pdfWindow = window.open(route('consultas.pdf', { consulta: consultaId }), '_blank');
        
        if (!pdfWindow || pdfWindow.closed) {
            // Fallback para navegadores que bloquean popups
            window.location.href = route('consultas.pdf', { consulta: consultaId });
        }
        
        setPdfNotificationMessage('PDF generado con éxito');
    } catch (error) {
        console.error('Error:', error);
        setPdfNotificationMessage(error.message || 'Error al generar el PDF');
    } finally {
        setTimeout(() => setShowPdfNotification(false), 5000);
    }
};

    const descargarPDFCirugia = async (cirugiaId) => {
        try {
            setPdfNotificationMessage('Generando reporte de cirugía...');
            setShowPdfNotification(true);
            
            window.open(route('cirugias.pdf', { cirugia: cirugiaId }), '_blank');
            
            setPdfNotificationMessage('Reporte de cirugía generado');
        } catch (error) {
            console.error('Error al generar PDF de cirugía:', error);
            setPdfNotificationMessage('Error al generar el reporte');
        } finally {
            setTimeout(() => setShowPdfNotification(false), 5000);
        }
    };

    const descargarPDFReceta = async (consultaId) => {
        try {
            setPdfNotificationMessage('Preparando receta médica...');
            setShowPdfNotification(true);
            
            // 1. Verificar si existe receta
            const response = await fetch(route('recetas.get-by-consulta', { consultaId }), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
    
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al verificar receta');
            }
    
            const data = await response.json();
            
            // Verificar estructura de respuesta
            if (!data.success || !data.receta) {
                throw new Error(data.message || 'No existe receta para esta consulta');
            }
    
            // 2. Generar el PDF - verificar que data.receta.id existe
            if (!data.receta.id) {
                throw new Error('ID de receta no válido');
            }
    
            // Abrir en nueva pestaña
            window.open(route('recetas.generate-pdf', { id: data.receta.id }), '_blank');
            
            setPdfNotificationMessage('Receta generada correctamente');
        } catch (error) {
            console.error('Error al generar receta:', error);
            setPdfNotificationMessage(error.message);
            
            if (error.message.includes('No existe receta')) {
                router.visit(route('consultas.edit', consultaId), {
                    data: { activeTab: 'recetas' },
                    preserveScroll: true
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
                                        className="px-4 py-2 flex justify-center items-center gap-2 text-white bg-orange-500 rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16"><path fill="#fff" d="M7.5 4a.5.5 0 0 1 .5.5V7h2.5a.5.5 0 0 1 0 1H8v2.5a.5.5 0 0 1-1 0V8H4.5a.5.5 0 0 1 0-1H7V4.5a.5.5 0 0 1 .5-.5"></path><path fill="#fff" fillRule="evenodd" d="M0 6.4c0-2.24 0-3.36.436-4.22A4.03 4.03 0 0 1 2.186.43c.856-.436 1.98-.436 4.22-.436h2.2c2.24 0 3.36 0 4.22.436c.753.383 1.36.995 1.75 1.75c.436.856.436 1.98.436 4.22v2.2c0 2.24 0 3.36-.436 4.22a4.03 4.03 0 0 1-1.75 1.75c-.856.436-1.98.436-4.22.436h-2.2c-2.24 0-3.36 0-4.22-.436a4.03 4.03 0 0 1-1.75-1.75C0 11.964 0 10.84 0 8.6zM6.4 1h2.2c1.14 0 1.93 0 2.55.051c.605.05.953.142 1.22.276a3.02 3.02 0 0 1 1.31 1.31c.134.263.226.611.276 1.22c.05.617.051 1.41.051 2.55v2.2c0 1.14 0 1.93-.051 2.55c-.05.605-.142.953-.276 1.22a3 3 0 0 1-1.31 1.31c-.263.134-.611.226-1.22.276c-.617.05-1.41.051-2.55.051H6.4c-1.14 0-1.93 0-2.55-.05c-.605-.05-.953-.143-1.22-.277a3 3 0 0 1-1.31-1.31c-.134-.263-.226-.61-.276-1.22c-.05-.617-.051-1.41-.051-2.55v-2.2c0-1.14 0-1.93.051-2.55c.05-.605.142-.953.276-1.22a3.02 3.02 0 0 1 1.31-1.31c.263-.134.611-.226 1.22-.276C4.467 1.001 5.26 1 6.4 1" clipRule="evenodd"></path></svg>
                                        </span>
                                        <span>Cirugía</span>
                                    </Link>
                                    <Link
                                        href={route('consultas.create')}
                                        className="px-4 py-2 flex justify-center items-center gap-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16"><path fill="#fff" d="M7.5 4a.5.5 0 0 1 .5.5V7h2.5a.5.5 0 0 1 0 1H8v2.5a.5.5 0 0 1-1 0V8H4.5a.5.5 0 0 1 0-1H7V4.5a.5.5 0 0 1 .5-.5"></path><path fill="#fff" fillRule="evenodd" d="M0 6.4c0-2.24 0-3.36.436-4.22A4.03 4.03 0 0 1 2.186.43c.856-.436 1.98-.436 4.22-.436h2.2c2.24 0 3.36 0 4.22.436c.753.383 1.36.995 1.75 1.75c.436.856.436 1.98.436 4.22v2.2c0 2.24 0 3.36-.436 4.22a4.03 4.03 0 0 1-1.75 1.75c-.856.436-1.98.436-4.22.436h-2.2c-2.24 0-3.36 0-4.22-.436a4.03 4.03 0 0 1-1.75-1.75C0 11.964 0 10.84 0 8.6zM6.4 1h2.2c1.14 0 1.93 0 2.55.051c.605.05.953.142 1.22.276a3.02 3.02 0 0 1 1.31 1.31c.134.263.226.611.276 1.22c.05.617.051 1.41.051 2.55v2.2c0 1.14 0 1.93-.051 2.55c-.05.605-.142.953-.276 1.22a3 3 0 0 1-1.31 1.31c-.263.134-.611.226-1.22.276c-.617.05-1.41.051-2.55.051H6.4c-1.14 0-1.93 0-2.55-.05c-.605-.05-.953-.143-1.22-.277a3 3 0 0 1-1.31-1.31c-.134-.263-.226-.61-.276-1.22c-.05-.617-.051-1.41-.051-2.55v-2.2c0-1.14 0-1.93.051-2.55c.05-.605.142-.953.276-1.22a3.02 3.02 0 0 1 1.31-1.31c.263-.134.611-.226 1.22-.276C4.467 1.001 5.26 1 6.4 1" clipRule="evenodd"></path></svg>
                                        </span>
                                        <span>Consulta</span>
                                    </Link>
                                </div>
                            </div>
                            <AdvancedFilters
                                initialFilters={{
                                    sex: filters.sex || '',
                                    minAge: filters.minAge || '',
                                    maxAge: filters.maxAge || '',
                                    startDate: filters.startDate || '',
                                    endDate: filters.endDate || '',
                                    procedencia: filters.procedencia || '',
                                    activeFilters: {
                                        sex: !!filters.sex,
                                        age: !!(filters.minAge || filters.maxAge),
                                        dateRange: !!(filters.startDate || filters.endDate),
                                        procedencia: !!filters.procedencia,
                                        terms: false
                                    }
                                }}
                                onApplyFilters={handleApplyFilters}
                                onResetFilters={handleResetFilters}
                                disabledSections={{ 
                                    terms: true // Deshabilitar la sección de términos si no la usas
                                }}
                                showActiveFilters={true}
                            />

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
        consultas.data.map((item) => {
            const horasTranscurridas = (new Date() - new Date(item.created_at)) / (1000 * 60 * 60);
            const puedeEditar = ['admin', 'medico'].includes(auth.user.role) || horasTranscurridas <= 48;
            
            return (
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
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#fff" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"></path></svg>
                            </Link>
                            {puedeEditar ? (
                                <Link
                                    href={route('consultas.edit', item.id)}
                                    className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.8 20.199A2.73 2.73 0 0 1 6.869 21H3v-3.844c0-.724.288-1.419.8-1.931m5 4.974l-5-4.974m5 4.974l9.974-9.978M3.8 15.225l9.984-9.995m0 0l1.426-1.428a2.733 2.733 0 0 1 3.867-.001l1.126 1.127a2.733 2.733 0 0 1 0 3.865l-1.428 1.428M13.783 5.23l4.991 4.991"></path></svg>
                                </Link>
                            ) : (
                                <button
                                    onClick={() => {
                                        alert(`No puedes editar esta consulta porque han pasado ${Math.floor(horasTranscurridas)} horas desde su creación.\n\nSolo los administradores y médicos pueden editar consultas después de 48 horas.`);
                                    }}
                                    className="px-3 py-1 text-white bg-gray-400 rounded cursor-not-allowed"
                                    title="No puedes editar después de 48 horas"
                                >
                                    Editar
                                </button>
                            )}
                            {(auth.user.role === 'admin' || auth.user.role === 'medico') && (
                                <button
                                    onClick={() => openDeleteModal(item.id)}
                                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#fff" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"></path></svg>
                                </button>
                            )}
                            <button
                                onClick={() => descargarPDFConsulta(item.id)}
                                className="px-3 py-1 flex justify-center items-center text-white bg-green-500 rounded hover:bg-green-600 disabled:bg-green-300"
                                title="Descargar PDF de consulta"
                                disabled={showPdfNotification && pdfNotificationMessage.includes('Generando')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                                    <path fill="#fff" d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-6 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"/>
                                </svg>
                                <span className="ml-1">Consulta</span>
                            </button>
                            {item.receta && (
                                <button
                                    onClick={() => descargarPDFReceta(item.id)}
                                    className="px-3 py-1 flex justify-center items-center bg-purple-500 text-white rounded hover:bg-purple-600"
                                >
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#fff" d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-6 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"></path></svg>
                                    </span>
                                    <span>Receta</span>
                                </button>
                            )}
                            {/* Botón para descargar PDF de refracción */}
                            {item.refraccion && (
                                <button
                                    onClick={() => descargarPDFRefraccion(item.id)}
                                    className="px-3 py-1 flex justify-center items-center text-white bg-teal-500 rounded hover:bg-teal-600"
                                    title="Descargar examen de refracción"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                                        <path fill="#fff" d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-6 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"/>
                                    </svg>
                                    <span className="ml-1">Refracción</span>
                                </button>
                            )}
                            {!item.receta && (
                                <span className='hidden'>crear receta</span>
                            )}
                            {!item.tipo_consulta && (
                                <button
                                    onClick={() => descargarPDFCirugia(item.id)}
                                    className="px-3 py-1 flex justify-center items-center text-white bg-indigo-500 rounded hover:bg-indigo-600"
                                >
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#fff" d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-6 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"></path></svg>
                                    </span>
                                    <span>Cirugía</span>
                                </button>
                            )}
                        </div>
                    </td>
                </tr>
            );
        })
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