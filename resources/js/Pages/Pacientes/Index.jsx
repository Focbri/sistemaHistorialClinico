import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';
import Pagination from '@/Components/Pagination';
import axios from 'axios'; // Asegúrate de importar axios

export default function PacientesIndex({ auth, pacientes }) {
    const [searchDni, setSearchDni] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [pacienteToDelete, setPacienteToDelete] = useState(null);
    const [showConsultasModal, setShowConsultasModal] = useState(false);
    const [pacienteConsultas, setPacienteConsultas] = useState({
    nombres: '',
    apellido_paterno: '',
    dni: '',
    consultas: []
});
    
    const [loadingConsultas, setLoadingConsultas] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('pacientes.index'), { dni: searchDni });
    };

    const openDeleteModal = (paciente) => {
        setPacienteToDelete(paciente);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setPacienteToDelete(null);
    };

    const confirmDelete = () => {
        if (pacienteToDelete) {
            router.delete(route('pacientes.destroy', pacienteToDelete.id), {
                onSuccess: () => closeDeleteModal(),
                onError: () => closeDeleteModal(),
            });
        }
    };

    const openConsultasModal = async (paciente) => {
    setLoadingConsultas(true);
    try {
        const response = await axios.get(route('pacientes.consultas', paciente.id));
        
        if (response.data && response.data.consultas) {
            setPacienteConsultas({
                nombres: response.data.paciente.nombres,
                apellido_paterno: response.data.paciente.apellido_paterno,
                dni: response.data.paciente.dni,
                consultas: response.data.consultas
            });
            setShowConsultasModal(true);
        } else {
            console.error('Estructura de datos inesperada:', response.data);
            alert('No se pudieron cargar las consultas. La estructura de datos es inesperada.');
        }
    } catch (error) {
        console.error('Error al cargar consultas:', error);
        alert('Error al cargar las consultas: ' + error.message);
    } finally {
        setLoadingConsultas(false);
    }
};

    const closeConsultasModal = () => {
        setShowConsultasModal(false);
        setPacienteConsultas({
            nombres: '',
            apellido_paterno: '',
            dni: '',
            consultas: []
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Pacientes</h2>}
        >
            <Head title="Pacientes" />

            {/* Modal de Confirmación de Eliminación */}
            <Dialog
                open={isDeleteModalOpen}
                onClose={closeDeleteModal}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <DialogTitle className="text-lg font-bold text-gray-900">
                            Confirmar Eliminación
                        </DialogTitle>
                        
                        <Description className="mt-2">
                            ¿Estás seguro de que deseas eliminar al paciente {pacienteToDelete?.nombres} {pacienteToDelete?.apellido_paterno} (DNI: {pacienteToDelete?.dni}) y todas sus consultas relacionadas?
                        </Description>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Eliminar
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
            {/* Modal de Historial de Consultas */}
            <Dialog
                open={showConsultasModal}
                onClose={closeConsultasModal}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-6xl rounded-lg bg-white p-6 shadow-xl max-h-[80vh] overflow-y-auto">
                        <DialogTitle className="text-lg font-bold text-gray-900">
                            Historial Clínico - {pacienteConsultas?.nombres} {pacienteConsultas?.apellido_paterno} (DNI: {pacienteConsultas?.dni})
                        </DialogTitle>
                        
                        {loadingConsultas ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className="mt-4">
                                {pacienteConsultas.consultas && pacienteConsultas.consultas.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border border-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código Historial</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnóstico</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {pacienteConsultas.consultas.map(item => (
                                                    <tr key={`${item.tipo}-${item.id}`} className="hover:bg-gray-50">
                                                        <td className="px-4 py-4 text-sm text-gray-900">
                                                            {item.tipo === 'cirugia' ? 'Cirugía' : item.tipo_consulta}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-900">
                                                            {item.codigo_historial || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-900">
                                                            {new Date(item.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-900">
                                                            {item.impresion_diagnostica || item.diagnostico_preoperatorio || 'Sin diagnóstico'}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-900">
                                                            <Link
                                                                href={route(item.tipo === 'cirugia' ? 'cirugias.show' : 'consultas.show', item.id)}
                                                                className="text-blue-500 hover:text-blue-700"
                                                            >
                                                                Ver detalles
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 mt-2">No hay registros clínicos para este paciente.</p>
                                )}
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={closeConsultasModal}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Cerrar
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            <div className="lg:py-12 py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Barra de búsqueda y botón "Crear Nuevo Paciente" */}
                            <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0 mb-6">
                                <form onSubmit={handleSearch} className="flex items-center w-full md:w-auto">
                                    <input
                                        type="text"
                                        placeholder="Buscar por DNI"
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

                                <Link
                                    href={route('pacientes.create')}
                                    className="px-4 py-2 flex justify-center items-center gap-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16"><path fill="#fff" d="M7.5 4a.5.5 0 0 1 .5.5V7h2.5a.5.5 0 0 1 0 1H8v2.5a.5.5 0 0 1-1 0V8H4.5a.5.5 0 0 1 0-1H7V4.5a.5.5 0 0 1 .5-.5"></path><path fill="#fff" fillRule="evenodd" d="M0 6.4c0-2.24 0-3.36.436-4.22A4.03 4.03 0 0 1 2.186.43c.856-.436 1.98-.436 4.22-.436h2.2c2.24 0 3.36 0 4.22.436c.753.383 1.36.995 1.75 1.75c.436.856.436 1.98.436 4.22v2.2c0 2.24 0 3.36-.436 4.22a4.03 4.03 0 0 1-1.75 1.75c-.856.436-1.98.436-4.22.436h-2.2c-2.24 0-3.36 0-4.22-.436a4.03 4.03 0 0 1-1.75-1.75C0 11.964 0 10.84 0 8.6zM6.4 1h2.2c1.14 0 1.93 0 2.55.051c.605.05.953.142 1.22.276a3.02 3.02 0 0 1 1.31 1.31c.134.263.226.611.276 1.22c.05.617.051 1.41.051 2.55v2.2c0 1.14 0 1.93-.051 2.55c-.05.605-.142.953-.276 1.22a3 3 0 0 1-1.31 1.31c-.263.134-.611.226-1.22.276c-.617.05-1.41.051-2.55.051H6.4c-1.14 0-1.93 0-2.55-.05c-.605-.05-.953-.143-1.22-.277a3 3 0 0 1-1.31-1.31c-.134-.263-.226-.61-.276-1.22c-.05-.617-.051-1.41-.051-2.55v-2.2c0-1.14 0-1.93.051-2.55c.05-.605.142-.953.276-1.22a3.02 3.02 0 0 1 1.31-1.31c.263-.134.611-.226 1.22-.276C4.467 1.001 5.26 1 6.4 1" clipRule="evenodd"></path></svg>
                                    </span>
                                    <span>Paciente</span>
                                </Link>
                            </div>

                            {/* Tabla de pacientes */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido Paterno</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido Materno</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {pacientes.map((paciente) => (
                                            <tr key={paciente.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-4 text-sm text-gray-900">{paciente.dni}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900">{paciente.nombres}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900">{paciente.apellido_paterno}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900">{paciente.apellido_materno}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900">{paciente.telefono}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900">{paciente.email}</td>
                                                <td className="px-4 py-4 h-full">
                                                    <div className="flex items-center space-x-2 h-full">
                                                        <Link
                                                            href={route('pacientes.show', paciente.id)}
                                                            className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#fff" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"/></svg>
                                                        </Link>
                                                        <Link
                                                            href={route('pacientes.edit', paciente.id)}
                                                            className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.8 20.199A2.73 2.73 0 0 1 6.869 21H3v-3.844c0-.724.288-1.419.8-1.931m5 4.974l-5-4.974m5 4.974l9.974-9.978M3.8 15.225l9.984-9.995m0 0l1.426-1.428a2.733 2.733 0 0 1 3.867-.001l1.126 1.127a2.733 2.733 0 0 1 0 3.865l-1.428 1.428M13.783 5.23l4.991 4.991"/></svg>
                                                        </Link>
                                                        
                                                        {/* Botón para ver historial de consultas */}
                                                        <button
                                                            onClick={() => openConsultasModal(paciente)}
                                                            className="px-3 py-1 text-white bg-purple-500 rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                            title="Ver historial de consultas"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#fff" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/><path fill="#fff" d="M7 12h2v5H7zm4-7h2v12h-2zm4 5h2v7h-2z"/></svg>
                                                        </button>

                                                        {(auth.user.role === 'admin' || auth.user.role === 'root') && (
                                                            <button
                                                                onClick={() => openDeleteModal(paciente)}
                                                                className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#fff" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}