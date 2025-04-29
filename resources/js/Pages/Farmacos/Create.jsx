import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth, presentaciones }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre_comercial: '',
        componente_activo: '',
        presentacion: '',
        concentracion: '',
        stocks: {
            visual: 0,
            insamed: 0,
            s_p: 0
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Preparamos los datos para enviar
        const formData = {
            nombre_comercial: data.nombre_comercial,
            componente_activo: data.componente_activo,
            presentacion: data.presentacion,
            concentracion: data.concentracion,
            stocks: data.stocks
        };

        post(route('farmacos.store'), formData);
    };

    const handleStockChange = (almacen, value) => {
        setData('stocks', {
            ...data.stocks,
            [almacen]: parseInt(value) || 0
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Nuevo Fármaco</h2>}
        >
            <Head title="Crear Fármaco" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nombre Comercial */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nombre Comercial*
                                        </label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={data.nombre_comercial}
                                            onChange={e => setData('nombre_comercial', e.target.value)}
                                        />
                                        {errors.nombre_comercial && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nombre_comercial}</p>
                                        )}
                                    </div>

                                    {/* Componente Activo */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Componente Activo*
                                        </label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={data.componente_activo}
                                            onChange={e => setData('componente_activo', e.target.value)}
                                            placeholder="Ingrese el principio activo"
                                        />
                                        {errors.componente_activo && (
                                            <p className="mt-1 text-sm text-red-600">{errors.componente_activo}</p>
                                        )}
                                    </div>

                                    {/* Presentación */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Presentación*
                                        </label>
                                        <select
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={data.presentacion}
                                            onChange={e => setData('presentacion', e.target.value)}
                                        >
                                            <option value="">Seleccione una presentación</option>
                                            {presentaciones.map((presentacion) => (
                                                <option key={presentacion} value={presentacion}>
                                                    {presentacion}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.presentacion && (
                                            <p className="mt-1 text-sm text-red-600">{errors.presentacion}</p>
                                        )}
                                    </div>

                                    {/* Concentración */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Concentración
                                        </label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={data.concentracion}
                                            onChange={e => setData('concentracion', e.target.value)}
                                            placeholder="Ej: 500mg, 20mg/ml"
                                        />
                                        {errors.concentracion && (
                                            <p className="mt-1 text-sm text-red-600">{errors.concentracion}</p>
                                        )}
                                    </div>

                                    {/* Stocks para cada almacén */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Stock Visual
                                        </label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={data.stocks.visual}
                                            onChange={e => handleStockChange('visual', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Stock Insamed
                                        </label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={data.stocks.insamed}
                                            onChange={e => handleStockChange('insamed', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Stock S&P
                                        </label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={data.stocks.s_p}
                                            onChange={e => handleStockChange('s_p', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end mt-6 space-x-2">
                                    <Link
                                        href={route('farmacos.index')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-800 uppercase tracking-widest hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        disabled={processing}
                                    >
                                        {processing ? 'Guardando...' : 'Guardar Fármaco'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}