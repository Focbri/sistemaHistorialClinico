import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, farmacos }) {
    // Define los almacenes disponibles
    const almacenes = ['visual', 'insamed', 's_p'];
    const nombresAlmacenes = {
        visual: 'Visual',
        insamed: 'Insamed',
        s_p: 'S&P'
    };

    const [filters, setFilters] = React.useState({
        search: ''
    });
    
    const setFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        
        router.get(route('farmacos.index'), {
            search: key === 'search' ? value : filters.search
        }, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Fármacos</h2>}
        >
            <Head title="Fármacos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between mb-6">
                                <h3 className="text-lg font-medium">Inventario Completo</h3>
                                <Link 
                                    href={route('farmacos.create')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    Nuevo Fármaco
                                </Link>
                            </div>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Buscar fármaco o componente..."
                                    className="border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm"
                                    value={filters.search}
                                    onChange={e => setFilter('search', e.target.value)}
                                />
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Comercial</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Componente</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presentación</th>
                                            {almacenes.map(almacen => (
                                                <th key={almacen} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {nombresAlmacenes[almacen]}
                                                </th>
                                            ))}
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {farmacos.map((farmaco) => (
                                            <tr key={farmaco.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{farmaco.nombre_comercial}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{farmaco.componente_activo}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {farmaco.presentacion} {farmaco.concentracion}
                                                </td>
                                                {almacenes.map(almacen => (
                                                    <td key={`${farmaco.id}-${almacen}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                        {farmaco.stock?.[almacen] || 0}
                                                    </td>
                                                ))}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                                    {farmaco.stock ? (
                                                        almacenes.reduce((total, almacen) => total + (farmaco.stock[almacen] || 0), 0)
                                                    ) : 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link 
                                                        href={route('farmacos.edit', farmaco.id)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <Link 
                                                        href={route('stocks.manage', farmaco.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Stock
                                                    </Link>
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