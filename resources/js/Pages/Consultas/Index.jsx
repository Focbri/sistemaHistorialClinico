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

    const descargarPDF = async (id) => {
        try {
            const response = await fetch(route('consultas.generarPDF', id));
            const result = await response.json();
    
            if (result.success) {
                alert('PDF generado y guardado correctamente.');
            } else {
                alert(result.message || 'Error al generar el PDF');
            }
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            alert('Error al generar el PDF');
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

                                <Link
                                    href={route('consultas.create')}
                                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    Crear Nueva Consulta
                                </Link>
                            </div>

                            {/* Tabla de consultas */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código Consulta</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creada</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {consultas.data.length > 0 ? (
                                            consultas.data.map((consulta) => (
                                                <tr key={consulta.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-4 text-sm text-gray-900">{consulta.codigo_consulta}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-900">{consulta.paciente.dni}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-900">
                                                        {consulta.paciente.nombres} {consulta.paciente.apellido_paterno} {consulta.paciente.apellido_materno}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-900">{consulta.paciente.email}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-900">
                                                        {new Date(consulta.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-900">
                                                        <div className="flex items-center space-x-2">
                                                            <Link
                                                                href={route('consultas.show', consulta.id)}
                                                                className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            >
                                                                Ver
                                                            </Link>
                                                            <Link
                                                                href={route('consultas.edit', consulta.id)}
                                                                className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                            >
                                                                Editar
                                                            </Link>
                                                            {(auth.user.role === 'admin' || auth.user.role === 'root') && (
                                                                <button
                                                                    onClick={() => handleDelete(consulta.id)}
                                                                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => descargarPDF(consulta.id)}
                                                                className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                            >
                                                                PDF
                                                            </button>
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
                            <div className="mt-6 flex justify-between items-center">
                                {links.prev && (
                                    <Link
                                        href={links.prev}
                                        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Anterior
                                    </Link>
                                )}
                                {links.next && (
                                    <Link
                                        href={links.next}
                                        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Siguiente
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}