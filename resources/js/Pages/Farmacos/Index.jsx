import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, farmacos, filters }) {
    const [search, setSearch] = React.useState(filters.search || '');
    const isAdminRec = ['recepcionista', 'admin'].includes(auth.user.role);

    // Sincronizar el estado local cuando los filtros cambian
    React.useEffect(() => {
        setSearch(filters.search || '');
    }, [filters.search]);

    const almacenes = ['visual', 'insamed', 's_p'];
    const nombresAlmacenes = {
        visual: 'Visual',
        insamed: 'Insamed',
        s_p: 'S&P'
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('farmacos.index'), { search }, {
            preserveState: true,
            replace: true
        });
    };

    // Función para resaltar texto coincidente
    const highlightText = (text, searchTerm) => {
        if (!searchTerm || !text) return text;
        
        const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
        return text.toString().split(regex).map((part, index) => 
            regex.test(part) ? (
                <span key={index} className="bg-yellow-200 font-semibold">
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }


return (
    <AuthenticatedLayout 
        user={auth.user} 
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Fármacos</h2>}
    >
        <Head title="Fármacos" />

        <div className="py-4 sm:py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-4">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-4 sm:p-6 bg-white border-b border-gray-200">
                        {/* Barra de búsqueda y botón "Nuevo Fármaco" - Apilados en móviles */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                            <form onSubmit={handleSearch} className="flex-1 sm:mr-4">
                                <input
                                    type="text"
                                    placeholder="Buscar fármaco..."
                                    className="w-full border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </form>
                            {isAdminRec && (
                                <Link 
                                    href={route('farmacos.create')}
                                    className="inline-flex justify-center items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    Nuevo Fármaco
                                </Link>
                            )}
                        </div>

                        {/* Tabla de fármacos - Versión responsive */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
                                {/* Versión escritorio - Tabla completa */}
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="w-[20%] px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="w-[20%] px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Componente</th>
                                        <th className="w-[10%] px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presentación</th>
                                        {almacenes.map(almacen => (
                                            <th key={almacen} className="w-[10%] px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {nombresAlmacenes[almacen]}
                                            </th>
                                        ))}
                                        <th className="w-[10%] px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        {isAdminRec && (
                                            <th className="w-[15%] px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {farmacos.data.map((farmaco) => {
                                        const sumaStocks = almacenes.reduce((total, almacen) => {
                                            return total + (farmaco.stock?.[almacen] || 0);
                                        }, 0);
                                        
                                        return (
                                            <tr key={farmaco.id} className="hover:bg-gray-50">
                                                <td className="w-[20%] px-4 sm:px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 max-w-xs">
                                                    {highlightText(farmaco.nombre_comercial, search)}
                                                </td>
                                                <td className="w-[20%] px-4 sm:px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs">
                                                    {highlightText(farmaco.componente_activo, search)}
                                                </td>
                                                <td className="w-[10%] px-4 sm:px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs">
                                                    {highlightText(farmaco.presentacion, search)} {highlightText(farmaco.concentracion, search)}
                                                </td>
                                                {almacenes.map(almacen => (
                                                    <td key={`${farmaco.id}-${almacen}`} className="w-[10%] px-4 sm:px-6 py-4 whitespace-normal text-sm text-gray-500 text-center">
                                                        {farmaco.stock?.[almacen] || 0}
                                                    </td>
                                                ))}
                                                <td className="w-[10%] px-4 sm:px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 text-center">
                                                    {sumaStocks}
                                                </td>
                                                {isAdminRec && (
                                                    <td className="w-[15%] px-4 sm:px-6 py-4 whitespace-normal text-sm font-medium space-x-2">
                                                        <Link 
                                                            href={route('farmacos.edit', farmaco.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <Link 
                                                            href={route('farmacos.stock.manage', farmaco.id)}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Stock
                                                        </Link>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* Versión móvil - Lista de tarjetas */}
                            <div className="sm:hidden space-y-4">
                                {farmacos.data.map((farmaco) => {
                                    const sumaStocks = almacenes.reduce((total, almacen) => {
                                        return total + (farmaco.stock?.[almacen] || 0);
                                    }, 0);
                                    
                                    return (
                                        <div key={farmaco.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">
                                                        {highlightText(farmaco.nombre_comercial, search)}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {highlightText(farmaco.componente_activo, search)}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {highlightText(farmaco.presentacion, search)} {highlightText(farmaco.concentracion, search)}
                                                    </p>
                                                </div>
                                                <div className="text-sm font-medium text-gray-900 border-l pl-4">
                                                    Total: {sumaStocks}
                                                </div>
                                            </div>
                                            
                                            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-200 pt-4">
                                                {almacenes.map(almacen => (
                                                    <div key={`${farmaco.id}-${almacen}`} className="text-sm">
                                                        <span className="font-medium text-gray-500">{nombresAlmacenes[almacen]}:</span>
                                                        <span className="ml-1 text-gray-900">{farmaco.stock?.[almacen] || 0}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {isAdminRec && (
                                                <div className="mt-3 justify-center pt-3 border-t border-gray-200 flex space-x-4">
                                                    <Link 
                                                        href={route('farmacos.edit', farmaco.id)}
                                                        className="text-[#fff] bg-[#3b82f6] hover:text-blue-900 text-sm font-medium p-2 rounded-md"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <Link 
                                                        href={route('farmacos.stock.manage', farmaco.id)}
                                                        className="text-[#fff] bg-[#10b981] hover:text-green-900 text-sm font-medium p-2 rounded-md"
                                                    >
                                                        Gestionar Stock
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-4">
                            <Pagination 
                                links={farmacos.links} 
                                preserveState
                                only={['farmacos', 'filters']}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </AuthenticatedLayout>
    );
}