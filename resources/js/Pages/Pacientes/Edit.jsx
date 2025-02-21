import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function PacientesEdit({ auth, paciente }) {
    const { data, setData, put, errors } = useForm({
        apellido_paterno: paciente.apellido_paterno,
        apellido_materno: paciente.apellido_materno,
        nombres: paciente.nombres,
        fecha_nacimiento: paciente.fecha_nacimiento,
        edad: paciente.edad,
        peso: paciente.peso,
        dni: paciente.dni,
        sexo: paciente.sexo,
        estado_civil: paciente.estado_civil,
        ocupacion: paciente.ocupacion,
        direccion: paciente.direccion,
        telefono: paciente.telefono,
        email: paciente.email,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('pacientes.update', paciente.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Editar Paciente</h2>}
        >
            <Head title="Editar Paciente" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='flex flex-col'>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Apellido Paterno</label>
                                            <input
                                                type="text"
                                                value={data.apellido_paterno}
                                                onChange={(e) => setData('apellido_paterno', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                            {errors.apellido_paterno && <p className="text-sm text-red-500">{errors.apellido_paterno}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Apellido Materno</label>
                                            <input
                                                type="text"
                                                value={data.apellido_materno}
                                                onChange={(e) => setData('apellido_materno', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                            {errors.apellido_materno && <p className="text-sm text-red-500">{errors.apellido_materno}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Nombres</label>
                                            <input required
                                                type="text"
                                                value={data.nombres}
                                                onChange={(e) => setData('nombres', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                            {errors.nombres && <p className="text-sm text-red-500">{errors.nombres}</p>}
                                        </div>
                                    </div>

                                    <div className='flex flex-col'>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Fecha Nacimiento</label>
                                            <input required
                                                type="date"
                                                value={data.fecha_nacimiento}
                                                onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                            {errors.fecha_nacimiento && <p className="text-sm text-red-500">{errors.fecha_nacimiento}</p>}
                                        </div>

                                        <div className='grid grid-cols-2 gap-4'>
                                            <div className='flex flex-col'>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700">Edad</label>
                                                    <input required
                                                        type="number"
                                                        min={0}
                                                        value={data.edad}
                                                        onChange={(e) => setData('edad', e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                    />
                                                    {errors.edad && <p className="text-sm text-red-500">{errors.edad}</p>}
                                                </div>

                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700">Peso Kg</label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        value={data.peso}
                                                        step={0.01}
                                                        onChange={(e) => setData('peso', e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                    />
                                                    {errors.peso && <p className="text-sm text-red-500">{errors.peso}</p>}
                                                </div>
                                            </div>

                                            <div className='flex flex-col'>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700">Sexo</label>
                                                    <select required
                                                        value={data.sexo}
                                                        onChange={(e) => setData('sexo', e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                    >
                                                        <option value="">Seleccione...</option>
                                                        <option value="M">Masculino</option>
                                                        <option value="F">Femenino</option>
                                                    </select>
                                                    {errors.sexo && <p className="text-sm text-red-500">{errors.sexo}</p>}
                                                </div>

                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700">DNI</label>
                                                    <input required
                                                        type="text"
                                                        maxLength={8}
                                                        minLength={8}
                                                        value={data.dni}
                                                        onChange={(e) => setData('dni', e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                    />
                                                    {errors.dni && <p className="text-sm text-red-500">{errors.dni}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr className='my-8'/>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='flex flex-col'>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Estado Civil</label>
                                            <select
                                                value={data.estado_civil}
                                                onChange={(e) => setData('estado_civil', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            >
                                                <option value="">Seleccione...</option>
                                                <option value="soltero">Soltero</option>
                                                <option value="casado">Casado</option>
                                                <option value="divorciado">Divorciado</option>
                                                <option value="viudo">Viudo</option>
                                            </select>
                                            {errors.estado_civil && <p className="text-sm text-red-500">{errors.estado_civil}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Ocupación</label>
                                            <input
                                                type="text"
                                                value={data.ocupacion}
                                                onChange={(e) => setData('ocupacion', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                            {errors.ocupacion && <p className="text-sm text-red-500">{errors.ocupacion}</p>}
                                        </div>
                                    </div>

                                    <div className='flex flex-col'>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Domicilio</label>
                                            <input required
                                                type="text"
                                                value={data.direccion}
                                                onChange={(e) => setData('direccion', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                            {errors.direccion && <p className="text-sm text-red-500">{errors.direccion}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                            <input required
                                                type="text"
                                                value={data.telefono}
                                                onChange={(e) => setData('telefono', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                            {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
                                        </div>    

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <input required
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                        </div>
                                    </div>          
                                </div>                    

                                <div className="flex items-center justify-end">
                                    <Link
                                        href={route('pacientes.index')}
                                        className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        className="ml-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                    >
                                        Actualizar
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