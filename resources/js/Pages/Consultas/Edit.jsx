import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import fondoOjo from '../../../assets/fondo_ojo.png';
import { useEffect } from 'react';

export default function ConsultasEdit({ auth }) {
    // Obtener la consulta actual desde las props
    const { consulta } = usePage().props;

    // Inicializar el formulario con los datos de la consulta
    const { data, setData, put, errors, processing } = useForm({
        paciente_id: consulta.paciente_id || '',
        antecedentes_personales_hta: consulta.antecedentes_personales_hta === 'HTA',
        antecedentes_personales_alergias: consulta.antecedentes_personales_alergias === 'ALERGIAS',
        antecedentes_personales_dm: consulta.antecedentes_personales_dm === 'DM',
        antecedentes_personales_otros: consulta.antecedentes_personales_otros || '',
        antecedentes_patologicos_familiares: consulta.antecedentes_patologicos_familiares || '',
        cirugias_previas: consulta.cirugias_previas || '',
        motivo_consulta: consulta.motivo_consulta || '',
        impresion_diagnostica: consulta.impresion_diagnostica || '',
        rp: consulta.rp || '',
        plan: consulta.plan || '',
        examenes_indicados: consulta.examenes_indicados || '',
        evoluciones: consulta.evoluciones || '',
        fondo_ojo: consulta.fondo_ojo || '',
    });

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        // Transformar los valores de los checkboxes a strings
        const formData = {
            ...data,
            antecedentes_personales_hta: data.antecedentes_personales_hta ? 'HTA' : '',
            antecedentes_personales_alergias: data.antecedentes_personales_alergias ? 'ALERGIAS' : '',
            antecedentes_personales_dm: data.antecedentes_personales_dm ? 'DM' : '',
        };

        console.log('Datos enviados:', formData); // Depuración

        // Enviar los datos actualizados al servidor
        put(route('consultas.update', consulta.id), formData);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Editar Consulta</h2>}
        >
            <Head title="Editar Consulta" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Fecha de Consulta</label>
                                <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{new Date(consulta.created_at).toLocaleDateString()}</p>
                            </div>
                                {/* Mostrar información del paciente */}
                                <div className="mb-4">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Paciente</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">
                                            {consulta.paciente.nombres} {consulta.paciente.apellido_paterno} {consulta.paciente.apellido_materno}
                                        </p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">DNI del Paciente</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{consulta.paciente.dni}</p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Teléfono del Paciente</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{consulta.paciente.telefono}</p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Email del Paciente</label>
                                        <p className="mt-1 block w-full rounded-md bg-gray-100 p-2">{consulta.paciente.email}</p>
                                    </div>
                                </div>

                                {/* Resto del formulario */}
                                <div className="mb-4">
                                    <label className="block text-xl font-medium text-gray-700">Antecedentes Personales</label>
                                    <p className="text-sm text-gray-500">Marque las opciones que correspondan</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border border-gray-200 p-4 rounded-md mb-8">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">HTA</label>
                                        <input
                                            type="checkbox"
                                            checked={data.antecedentes_personales_hta}
                                            onChange={(e) => setData('antecedentes_personales_hta', e.target.checked)}
                                            className="mt-1"
                                        />
                                        {errors.antecedentes_personales_hta && <p className="text-sm text-red-500">{errors.antecedentes_personales_hta}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Alergias</label>
                                        <input
                                            type="checkbox"
                                            checked={data.antecedentes_personales_alergias}
                                            onChange={(e) => setData('antecedentes_personales_alergias', e.target.checked)}
                                            className="mt-1"
                                        />
                                        {errors.antecedentes_personales_alergias && <p className="text-sm text-red-500">{errors.antecedentes_personales_alergias}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">DM</label>
                                        <input
                                            type="checkbox"
                                            checked={data.antecedentes_personales_dm}
                                            onChange={(e) => setData('antecedentes_personales_dm', e.target.checked)}
                                            className="mt-1"
                                        />
                                        {errors.antecedentes_personales_dm && <p className="text-sm text-red-500">{errors.antecedentes_personales_dm}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Otros</label>
                                        <input
                                            type="text"
                                            value={data.antecedentes_personales_otros}
                                            onChange={(e) => setData('antecedentes_personales_otros', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                        {errors.antecedentes_personales_otros && <p className="text-sm text-red-500">{errors.antecedentes_personales_otros}</p>}
                                    </div>
                                </div>

                                {/* Resto de los campos del formulario */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Antecedentes Patológicos Familiares</label>
                                    <input
                                        type="text"
                                        value={data.antecedentes_patologicos_familiares}
                                        onChange={(e) => setData('antecedentes_patologicos_familiares', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.antecedentes_patologicos_familiares && <p className="text-sm text-red-500">{errors.antecedentes_patologicos_familiares}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Cirugías Previas</label>
                                    <input
                                        type="text"
                                        value={data.cirugias_previas}
                                        onChange={(e) => setData('cirugias_previas', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.cirugias_previas && <p className="text-sm text-red-500">{errors.cirugias_previas}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Motivo de Consulta</label>
                                    <input
                                        type="text"
                                        value={data.motivo_consulta}
                                        onChange={(e) => setData('motivo_consulta', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.motivo_consulta && <p className="text-sm text-red-500">{errors.motivo_consulta}</p>}
                                </div>
                                
                                <div className='flex flex-col justify-center items-center w-full gap-4'>
                                    <label className="block text-xl font-medium text-gray-700">Fondo de Ojo</label>
                                    <div className='flex gap-4'>
                                        <div>
                                            <img src={fondoOjo} alt="Fondo de Ojo" className="w-full h-auto" />
                                        </div>
                                        <div className="mb-4">
                                            <textarea
                                                type="text"
                                                value={data.fondo_ojo}
                                                onChange={(e) => setData('fondo_ojo', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                style={{
                                                    width: '20rem', // Ajusta el ancho según tus necesidades
                                                    height: '12rem', // Ajusta la altura para que coincida con la imagen
                                                    resize: 'none'  // Deshabilita la redimensión manual
                                                }}
                                            />
                                            {errors.fondo_ojo && <p className="text-sm text-red-500">{errors.fondo_ojo}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Impresión Diagnóstica</label>
                                    <input
                                        type="text"
                                        value={data.impresion_diagnostica}
                                        onChange={(e) => setData('impresion_diagnostica', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.impresion_diagnostica && <p className="text-sm text-red-500">{errors.impresion_diagnostica}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">RP</label>
                                    <input
                                        type="text"
                                        value={data.rp}
                                        onChange={(e) => setData('rp', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.rp && <p className="text-sm text-red-500">{errors.rp}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Plan</label>
                                    <input
                                        type="text"
                                        value={data.plan}
                                        onChange={(e) => setData('plan', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.plan && <p className="text-sm text-red-500">{errors.plan}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Exámenes Indicados</label>
                                    <input
                                        type="text"
                                        value={data.examenes_indicados}
                                        onChange={(e) => setData('examenes_indicados', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.examenes_indicados && <p className="text-sm text-red-500">{errors.examenes_indicados}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Evoluciones</label>
                                    <input
                                        type="text"
                                        value={data.evoluciones}
                                        onChange={(e) => setData('evoluciones', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.evoluciones && <p className="text-sm text-red-500">{errors.evoluciones}</p>}
                                </div>

                                {/* Repite este bloque para los demás campos */}

                                <div className="flex items-center justify-end">
                                    <Link
                                        href={route('consultas.index')}
                                        className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="ml-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                    >
                                        {processing ? 'Guardando...' : 'Guardar'}
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