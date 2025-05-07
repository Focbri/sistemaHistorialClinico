import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, users, roles }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Usuarios</h2>}
        >
            <Head title="Usuarios" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Encabezado y botón "Crear Usuario" */}
                            <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0 mb-6">
                                <h3 className="text-lg font-semibold">Lista de Usuarios</h3>
                                <Link
                                    href={route('admin.users.create')}
                                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Crear Usuario
                                </Link>
                            </div>

                            {/* Tabla de usuarios */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nombre
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rol
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {user.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {roles[user.role] || user.role} {/* Muestra la etiqueta legible */}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={route('admin.users.edit', user.id)}
                                                            className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <Link
                                                            href={route('admin.users.destroy', user.id)}
                                                            method="delete"
                                                            as="button"
                                                            className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        >
                                                            Eliminar
                                                        </Link>
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