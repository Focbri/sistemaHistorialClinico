import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function ConsultasIndex({ auth, consultas, links }) {
    console.log('Consultas recibidas:', consultas); // Depuración
    console.log('Enlaces de paginación:', links); // Depuración
    
    const [searchDni, setSearchDni] = useState('');

    // Función para buscar consultas por DNI del paciente
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('consultas.index'), { dni: searchDni || undefined });
    };

    // Función para eliminar una consulta
    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta consulta?')) {
            router.delete(route('consultas.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Consultas</h2>}
        >
            <Head title="Consultas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Barra de búsqueda y botón "Crear Nueva Consulta" */}
                            <div className="flex justify-between items-center mb-4">
                                <form onSubmit={handleSearch} className="flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Buscar por DNI del paciente"
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
                                    href={route('consultas.create')}
                                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                                >
                                    Crear Nueva Consulta
                                </Link>
                            </div>

                            {/* Tabla de consultas */}
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Código Consulta</th>
                                        <th className="px-4 py-2">DNI</th>
                                        <th className="px-4 py-2">Paciente</th>
                                        <th className="px-4 py-2">Email</th>
                                        <th className="px-4 py-2">Fecha Creada</th>
                                        <th className="px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {consultas.data.length > 0 ? (
                                        consultas.data.map((consulta) => (
                                            <tr key={consulta.id}>
                                                <td className="px-4 py-2">{consulta.codigo_consulta}</td>
                                                <td className="px-4 py-2">{consulta.paciente.dni}</td>
                                                <td className="px-4 py-2">
                                                    {consulta.paciente.nombres} {consulta.paciente.apellido_paterno} {consulta.paciente.apellido_materno}
                                                </td>
                                                <td className="px-4 py-2">{consulta.paciente.email}</td>
                                                <td className="px-4 py-2">
                                                    {new Date(consulta.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-2 flex items-center gap-2">
                                                    <Link
                                                        href={route('consultas.show', consulta.id)}
                                                        className="px-4 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                                                    >
                                                        Ver
                                                    </Link>
                                                    <Link
                                                        href={route('consultas.edit', consulta.id)}
                                                        className="px-2 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(consulta.id)}
                                                        className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-2 text-center">
                                                No se encontraron consultas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Paginación */}
                            <div className="mt-4">
                                <nav className="flex justify-between">
                                    {links.prev && (
                                        <Link
                                            href={links.prev}
                                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                        >
                                            Anterior
                                        </Link>
                                    )}
                                    {links.next && (
                                        <Link
                                            href={links.next}
                                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                        >
                                            Siguiente
                                        </Link>
                                    )}
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}