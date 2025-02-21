import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function PacientesIndex({ auth, pacientes }) {
    const [searchDni, setSearchDni] = useState('');

    // Función para buscar pacientes por DNI
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('pacientes.index'), { dni: searchDni });
    };

    // Función para eliminar un paciente
    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
            router.delete(route('pacientes.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Pacientes</h2>}
        >
            <Head title="Pacientes" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Barra de búsqueda y botón "Crear Nuevo Paciente" */}
                            <div className="flex justify-between items-center mb-4">
                                <form onSubmit={handleSearch} className="flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Buscar por DNI"
                                        value={searchDni}
                                        onChange={(e) => setSearchDni(e.target.value)}
                                        className="px-4 py-2 border rounded-l focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
                                    >
                                        Buscar
                                    </button>
                                </form>

                                <Link
                                    href={route('pacientes.create')}
                                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                                >
                                    Crear Nuevo Paciente
                                </Link>
                            </div>

                            {/* Tabla de pacientes */}
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">DNI</th>
                                        <th className="px-4 py-2">Nombre</th>
                                        <th className="px-4 py-2">Apellido Paterno</th>
                                        <th className="px-4 py-2">Apellido Materno</th>
                                        <th className="px-4 py-2">Telefono</th>
                                        <th className="px-4 py-2">Email</th>
                                        <th className="px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pacientes.map((paciente) => (
                                        <tr key={paciente.id}>
                                            <td className="px-4 py-2">{paciente.dni}</td>
                                            <td className="px-4 py-2">{paciente.nombres}</td>
                                            <td className="px-4 py-2">{paciente.apellido_paterno}</td>
                                            <td className="px-4 py-2">{paciente.apellido_materno}</td>
                                            <td className="px-4 py-2">{paciente.telefono}</td>
                                            <td className="px-4 py-2">{paciente.email}</td>
                                            <td className="px-4 py-2 flex items-center gap-2">
                                                <Link
                                                    href={route('pacientes.show', paciente.id)}
                                                    className="px-4 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                                                >
                                                    Ver
                                                </Link>
                                                <Link
                                                    href={route('pacientes.edit', paciente.id)}
                                                    className="px-2 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(paciente.id)}
                                                    className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}