import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';

export default function PacientesIndex({ auth, pacientes }) {
    const [searchDni, setSearchDni] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [pacienteToDelete, setPacienteToDelete] = useState(null);

    // Función para buscar pacientes por DNI
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('pacientes.index'), { dni: searchDni });
    };

    // Abrir modal de confirmación
    const openDeleteModal = (paciente) => {
        setPacienteToDelete(paciente);
        setIsDeleteModalOpen(true);
    };

    // Cerrar modal
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setPacienteToDelete(null);
    };

     // Confirmar eliminación
     const confirmDelete = () => {
        if (pacienteToDelete) {
            router.delete(route('pacientes.destroy', pacienteToDelete.id), {
                onSuccess: () => {
                    closeDeleteModal();
                    // Inertia manejará automáticamente la recarga de la página
                },
                onError: () => {
                    closeDeleteModal();
                    // Puedes agregar aquí un toast de error si lo deseas
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar este paciente y todas sus consultas relacionadas?')) {
            console.log('Eliminando paciente con ID:', id); // Depuración
            router.delete(route('pacientes.destroy', id), {
                onSuccess: () => {
                    console.log('Paciente eliminado correctamente'); // Depuración
                    router.visit(route('pacientes.index'));
                },
                onError: () => {
                    console.log('Error al eliminar paciente'); // Depuración
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Pacientes</h2>}
        >
            <Head title="Pacientes" />

            {/* Modal de Confirmación */}
            <Dialog
                open={isDeleteModalOpen}
                onClose={closeDeleteModal}
                className="relative z-50"
            >
                {/* Fondo oscuro */}
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                {/* Contenedor del modal centrado */}
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

            <div className="py-12">
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
                                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    Crear Nuevo Paciente
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
                                                            Ver
                                                        </Link>
                                                        <Link
                                                            href={route('pacientes.edit', paciente.id)}
                                                            className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                        >
                                                            Editar
                                                        </Link>

                                                        {/* Modifica solo el botón de eliminar para usar el nuevo modal */}
                                                        {(auth.user.role === 'admin' || auth.user.role === 'root') && (
                                                            <button
                                                                onClick={() => openDeleteModal(paciente)}
                                                                className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                            >
                                                                Eliminar
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