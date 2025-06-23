import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function SelectSede({ sedes }) {
    const { data, setData, post, processing } = useForm({
        sede: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('guardar-sede'));
    };

    return (
        <GuestLayout>
            <Head title="Seleccionar Sede" />
            
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">Selecciona una sede</h2>
                
                <form onSubmit={submit}>
                    <div className="mb-4">
                        <select
                            value={data.sede}
                            onChange={(e) => setData('sede', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        >
                            <option value="">Selecciona una sede</option>
                            {sedes.map(sede => (
                                <option key={sede} value={sede}>
                                    {sede === 'ate' ? 'Ate' : 'Pueblo Libre'}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                        disabled={processing}
                    >
                        Continuar
                    </button>
                </form>
            </div>
        </GuestLayout>
    );
}