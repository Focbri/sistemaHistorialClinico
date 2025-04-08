import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import PacienteImagenPerfil from '@/Components/PacienteImagenPerfil';
import { useState, useEffect, useRef } from 'react';

export default function PacientesEdit({ auth, paciente }) {

    // Formulario con los datos del paciente
    const { data, setData, put, processing, errors } = useForm({
        nombres: paciente.nombres || '',
        apellido_paterno: paciente.apellido_paterno || '',
        apellido_materno: paciente.apellido_materno || '',
        dni: paciente.dni || '',
        fecha_nacimiento: paciente.fecha_nacimiento || '',
        sexo: paciente.sexo || '',
        edad: paciente.edad || '',
        peso: paciente.peso || '',
        estado_civil: paciente.estado_civil || '',
        ocupacion: paciente.ocupacion || '',
        procedencia: paciente.procedencia || '',
        direccion: paciente.direccion || '',
        telefono: paciente.telefono || '',
        email: paciente.email || '',
        acompañante: paciente.acompañante || '',
        referido: paciente.referido || '',
    });

     // Enviar formulario (sin la parte de imagen)
     const handleSubmit = (e) => {
        e.preventDefault();
        put(route('pacientes.update', paciente.id), {
            preserveScroll: true,
            onError: (errors) => {
                console.error('Error al actualizar:', errors);
            }
        });
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
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
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

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Procedencia</label>
                                            <select required
                                                    value={data.procedencia}
                                                    onChange={(e) => setData('procedencia', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                >
                                                    <option value="">Seleccione...</option>
                                                    <option value="Ancon">Ancon</option>
                                                    <option value="Ate">Ate</option>
                                                    <option value="Barranco">Barranco</option>
                                                    <option value="Breña">Breña</option>
                                                    <option value="Carabayllo">Carabayllo</option>
                                                    <option value="Chaclacayo">Chaclacayo</option>
                                                    <option value="Chorrillos">Chorrillos</option>
                                                    <option value="Cienegilla">Cienegilla</option>
                                                    <option value="Comas">Comas</option>
                                                    <option value="El Agustino">El Agustino</option>
                                                    <option value="Independencia">Independencia</option>
                                                    <option value="Jesús María">Jesús María</option>
                                                    <option value="La Molina">La Molina</option>
                                                    <option value="La Victoria">La Victoria</option>
                                                    <option value="Lima">Lima</option>
                                                    <option value="Lince">Lince</option>
                                                    <option value="Los Olivos">Los Olivos</option>
                                                    <option value="Lurigancho">Lurigancho</option>
                                                    <option value="Lurín">Lurín</option>
                                                    <option value="Magdalena del Mar">Magdalena del Mar</option>
                                                    <option value="Miraflores">Miraflores</option>
                                                    <option value="Pachacamac">Pachacamac</option>
                                                    <option value="Pucusana">Pucusana</option>
                                                    <option value="Pueblo Libre">Pueblo Libre</option>
                                                    <option value="Puente Piedra">Puente Piedra</option>
                                                    <option value="Punta Hermosa">Punta Hermosa</option>
                                                    <option value="Punta Negra">Punta Negra</option>
                                                    <option value="Rimac">Rimac</option>
                                                    <option value="San Bartolo">San Bartolo</option>
                                                    <option value="San Borja">San Borja</option>
                                                    <option value="San Isidro">San Isidro</option>
                                                    <option value="San Juan de Lurigancho">San Juan de Lurigancho</option>
                                                    <option value="San Juan de Miraflores">San Juan de Miraflores</option>
                                                    <option value="San Luis">San Luis</option>
                                                    <option value="San Martín de Porres">San Martín de Porres</option>
                                                    <option value="San Miguel">San Miguel</option>
                                                    <option value="Santa Anita">Santa Anita</option>
                                                    <option value="Santa María del Mar">Santa María del Mar</option>
                                                    <option value="Santa Rosa">Santa Rosa</option>
                                                    <option value="Santiago de Surco">Santiago de Surco</option>
                                                    <option value="Surquillo">Surquillo</option>
                                                    <option value="Villa El Salvador">Villa El Salvador</option>
                                                    <option value="Villa María del Triunfo">Villa María del Triunfo</option>
                                                </select>
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
                                                type="number"
                                                value={data.telefono}
                                                min={0}
                                                max={999999999}
                                                maxLength={9}
                                                onChange={(e) => {
                                                    if (e.target.value.length <= 9) {
                                                        setData('telefono', e.target.value);
                                                    }
                                                }}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                            {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Acompañante</label>
                                            <input required
                                                type="text"
                                                value={data.acompañante}
                                                onChange={(e) => setData('acompañante', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                            {errors.acompañante && <p className="text-sm text-red-500">{errors.acompañante}</p>}
                                        </div>    

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Referido</label>
                                            <select
                                                    value={data.referido}
                                                    onChange={(e) => setData('referido', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm max-h-10"                                                    
                                                >
                                                    <option value="">Seleccione...</option>
                                                    <option value="Recomendación de un amigo o familiar">Recomendación de un amigo o familiar</option>
                                                    <option value="Facebook">Facebook</option>
                                                    <option value="Instagram">Instagram</option>
                                                    <option value="TikTok">TikTok</option>
                                                    <option value="WhatsApp">WhatsApp</option>
                                                    <option value="Búsqueda en Google">Búsqueda en Google</option>
                                                    <option value="Publicidad en línea">Publicidad en línea</option>
                                                    <option value="Boca a boca">Boca a boca</option>
                                                    <option value="Sitio web o blog">Sitio web o blog</option>
                                                    <option value="Reseñas en línea">Reseñas en línea</option>
                                                    <option value="Correo electrónico">Correo electrónico</option>
                                                    <option value="Eventos o ferias">Eventos o ferias</option>
                                                </select>
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
                                        disabled={processing}
                                    >
                                        {processing ? 'Guardando...' : 'Guardar Cambios'}
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