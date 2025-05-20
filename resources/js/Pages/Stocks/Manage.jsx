import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function ManageStock({ auth, farmaco, stock, almacenes }) {
    // Definir los almacenes como array de objetos si no viene en el formato correcto
    const almacenesArray = Array.isArray(almacenes) 
        ? almacenes 
        : [
            { key: 'visual', nombre: 'Visual' },
            { key: 'insamed', nombre: 'Insamed' },
            { key: 's_p', nombre: 'S&P' }
          ];

    const { data, setData, put, processing, errors } = useForm({
        visual: stock?.visual || 0,
        insamed: stock?.insamed || 0,
        s_p: stock?.s_p || 0
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('farmacos.stock.update', farmaco.id), data);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Stock</h2>}
        >
            <Head title={`Gestión de Stock - ${farmaco.nombre_comercial}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Fármaco: {farmaco.nombre_comercial}</h3>
                                <p className="text-sm text-gray-500">
                                    {farmaco.componente_activo} - {farmaco.presentacion} {farmaco.concentracion}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    {almacenesArray.map(({key, nombre}) => (
                                        <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 className="text-md font-medium text-gray-700">{nombre}</h4>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Cantidad Actual
                                                </label>
                                                <input
                                                    type="text"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    value={data[key]}
                                                    onChange={e => setData(key, parseInt(e.target.value) || 0)}
                                                />
                                                {errors[key] && (
                                                    <p className="mt-2 text-sm text-red-600">{errors[key]}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
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
                                        {processing ? 'Guardando...' : 'Actualizar Stocks'}
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