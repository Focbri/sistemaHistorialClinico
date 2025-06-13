import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function PacientesEdit({ auth, paciente }) {
    const [files, setFiles] = useState({
        foto_perfil: paciente.foto_perfil ? [{
            path: paciente.foto_perfil,
            name: 'foto_perfil.jpg',
            type: 'image',
            isNew: false,
            file: null
        }] : []
    });
    const [filesToDelete, setFilesToDelete] = useState([]);

    const { data, setData, put, processing, errors } = useForm({
        ...paciente,
        foto_perfil: null, // Para nueva imagen
        foto_perfil_existente: files.foto_perfil.length > 0 ? files.foto_perfil[0].path : null,
    });

    const handleFileChange = (e) => {
        const newFile = e.target.files[0];
        if (!newFile) return;
        
        // Validar archivo
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(newFile.type)) {
            alert('Solo se permiten imágenes JPG, PNG o JPEG');
            return;
        }
        
        if (newFile.size > 2 * 1024 * 1024) {
            alert('La imagen no debe exceder los 2MB');
            return;
        }
        
        // Procesar archivo
        const processedFile = {
            path: URL.createObjectURL(newFile),
            name: newFile.name,
            type: 'image',
            isNew: true,
            file: newFile
        };
        
        setFiles({
            foto_perfil: [processedFile]
        });
    };

    const handleRemoveFile = () => {
        if (files.foto_perfil.length === 0) return;
        
        const fileToRemove = files.foto_perfil[0];
        
        if (fileToRemove.isNew) {
            URL.revokeObjectURL(fileToRemove.path);
        } else {
            setFilesToDelete([fileToRemove.path]);
        }
        
        setFiles({ foto_perfil: [] });
        setData('foto_perfil_existente', null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('_method', 'PUT');
        
        // Agregar datos del formulario
        Object.keys(data).forEach(key => {
            if (key !== 'foto_perfil') {
                const value = data[key];
                if (value !== null && typeof value !== 'object') {
                    formData.append(key, value);
                }
            }
        });
    
        // Agregar archivos a eliminar
        if (filesToDelete.length > 0) {
            formData.append('files_to_delete', JSON.stringify(filesToDelete));
        }
    
        // Agregar nueva foto si existe
        if (files.foto_perfil.length > 0 && files.foto_perfil[0].isNew) {
            formData.append('foto_perfil', files.foto_perfil[0].file);
        }
        
        router.post(route('pacientes.update', paciente.id), formData, {
            preserveScroll: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onSuccess: () => {
                setFilesToDelete([]);
            },
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

        <div className="py-6 sm:py-12">
            <div className="mx-auto sm:max-w-7xl sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="p-4 sm:p-6 bg-white border-b border-gray-200">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            {/* Foto de perfil - Modificado para móvil */}
                            <div className="mb-6 border border-gray-200 rounded-md p-4">
                                <h3 className="text-lg font-medium text-gray-700 mb-4">Foto de Perfil</h3>
                                
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
                                    {/* Vista previa de la foto */}
                                    <div className="flex justify-center sm:block">
                                        <div className="relative">
                                            {files.foto_perfil.length > 0 ? (
                                                <>
                                                    <img
                                                        src={files.foto_perfil[0].isNew ? 
                                                            files.foto_perfil[0].path : 
                                                            `/storage/${files.foto_perfil[0].path}`}
                                                        alt="Foto de perfil"
                                                        className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 mx-auto sm:mx-0"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveFile}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 mx-auto sm:mx-0">
                                                    <span className="text-gray-500">Sin foto</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Botón para subir foto */}
                                    <div className="w-full">
                                        <label className="block">
                                            <span className="sr-only">Elegir foto de perfil</span>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/jpg"
                                                onChange={handleFileChange}
                                                className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100"
                                            />
                                        </label>
                                        <p className="mt-2 text-xs text-gray-500">
                                            Formatos aceptados: JPG, PNG. Tamaño máximo: 2MB.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* SECCIÓN DE DATOS PERSONALES */}
                            <div className='mb-6'>
                                <h3 className="text-xl sm:text-2xl uppercase font-semibold leading-tight text-gray-800 border-b">Datos Personales</h3>
                            </div>
                            
                            {/* Cambiado a 1 columna en móvil */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12'>
                                <div className='flex flex-col'>
                                    <div className="mb-4">
                                        <label className="block text-sm uppercase font-medium text-gray-700">Apellido Paterno</label>
                                        <input
                                            type="text"
                                            value={data.apellido_paterno}
                                            onChange={(e) => setData('apellido_paterno', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                        {errors.apellido_paterno && <p className="text-sm text-red-500">{errors.apellido_paterno}</p>}
                                    </div>                                           
                                    <div className="mb-4">
                                        <label className="block text-sm uppercase font-medium text-gray-700">Apellido Materno</label>
                                        <input
                                            type="text"
                                            value={data.apellido_materno}
                                            onChange={(e) => setData('apellido_materno', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                        {errors.apellido_materno && <p className="text-sm text-red-500">{errors.apellido_materno}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm uppercase font-medium text-gray-700">Nombres</label>
                                        <input 
                                            type="text"
                                            value={data.nombres}
                                            onChange={(e) => setData('nombres', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                        {errors.nombres && <p className="text-sm text-red-500">{errors.nombres}</p>}
                                    </div>
                                </div>
                                
                                {/*SEGUNDO BLOQUE DE DATOS PERSONALES*/ }
                                <div className='flex flex-col'>
                                    <div className="mb-4">
                                        <label className="block text-sm uppercase font-medium text-gray-700">Fecha Nacimiento</label>
                                        <input 
                                            type="date"
                                            value={data.fecha_nacimiento}
                                            onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                        {errors.fecha_nacimiento && <p className="text-sm text-red-500">{errors.fecha_nacimiento}</p>}
                                    </div>

                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                        <div className="mb-4">
                                            <label className="block text-sm uppercase font-medium text-gray-700">Edad</label>
                                            <input 
                                                type="number"
                                                min={0}
                                                max={999}
                                                maxLength={3}
                                                value={data.edad}
                                                onChange={(e) => {
                                                    if (e.target.value.length <= 3) {
                                                        setData('edad', e.target.value);
                                                    }
                                                }}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                            {errors.edad && <p className="text-sm text-red-500">{errors.edad}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm uppercase font-medium text-gray-700">Peso Kg</label>
                                            <input
                                                type="number"
                                                min={0}
                                                max={999.99}
                                                value={data.peso}
                                                step={0.01}
                                                onChange={(e) => {
                                                    if (e.target.value.length <= 6) {
                                                        setData('peso', e.target.value);
                                                    }
                                                }}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                            {errors.peso && <p className="text-sm text-red-500">{errors.peso}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm uppercase font-medium text-gray-700">Sexo</label>
                                                <select 
                                                    value={data.sexo}
                                                    onChange={(e) => setData('sexo', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                >
                                                    <option value="">Seleccione...</option>
                                                    <option value="M">Masculino</option>
                                                    <option value="F">Femenino</option>
                                                </select>
                                                {errors.sexo && <p className="text-sm text-red-500">{errors.sexo}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm uppercase font-medium text-gray-700">DNI</label>
                                            <input 
                                                type="number"
                                                min={8}
                                                max={99999999}
                                                maxLength={8}
                                                onChange={(e) => {
                                                    if (e.target.value.length <= 8) {
                                                        setData('dni', e.target.value);
                                                    }
                                                }}
                                                value={data.dni}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                            {errors.dni && <p className="text-sm text-red-500">{errors.dni}</p>}
                                        </div>
                                    </div>                                            
                                </div>
                            </div>

                            <hr className='my-6 sm:my-8'/>
                            
                            {/* Cambiado a 1 columna en móvil */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12'>
                                <div className='flex flex-col'>
                                    <div className="mb-4">
                                    <label className="block text-sm uppercase font-medium text-gray-700">Estado Civil</label>
                                        <select
                                            value={data.estado_civil}
                                            onChange={(e) => setData('estado_civil', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                                        <label className="block text-sm uppercase font-medium text-gray-700">Ocupación</label>
                                        <input
                                            type="text"
                                            value={data.ocupacion}
                                            onChange={(e) => setData('ocupacion', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                        {errors.ocupacion && <p className="text-sm text-red-500">{errors.ocupacion}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm uppercase font-medium text-gray-700">Procedencia</label>
                                            <select 
                                                value={data.procedencia}
                                                onChange={(e) => setData('procedencia', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                                            {errors.referido && <p className="text-sm text-red-500">{errors.referido}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm uppercase font-medium text-gray-700">Domicilio</label>
                                        <input 
                                            type="text"
                                            value={data.direccion}
                                            onChange={(e) => setData('direccion', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                        {errors.direccion && <p className="text-sm text-red-500">{errors.direccion}</p>}
                                    </div>
                                </div>

                                <div className='flex flex-col'>
                                    <div className="mb-4">
                                        <label className="block text-sm uppercase font-medium text-gray-700">Teléfono</label>
                                        <input
                                            type="number"                                                
                                            value={data.telefono}
                                            max={9999999999}
                                            maxLength={9}
                                            onChange={(e) => {
                                                if (e.target.value.length <= 10) {
                                                    setData('telefono', e.target.value);
                                                }
                                            }}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                        {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm uppercase font-medium text-gray-700">Acompañante</label>
                                        <input 
                                            type="text"
                                            maxLength={9}
                                            value={data.acompañante}
                                            onChange={(e) => setData('acompañante', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                        {errors.acompañante && <p className="text-sm text-red-500">{errors.acompañante}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm uppercase font-medium text-gray-700">Referido</label>
                                            <select
                                                value={data.referido}
                                                onChange={(e) => setData('referido', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"                                                    
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
                                            {errors.referido && <p className="text-sm text-red-500">{errors.referido}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm uppercase font-medium text-gray-700">Email</label>
                                        <input 
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                    </div>
                                </div>          
                            </div>         
                            
                            {/* BOTONES DE ACCIÓN - Ajustado para móvil */}
                            <div className="flex flex-col-reverse sm:flex-row items-center justify-end mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link
                                    href={route('pacientes.index')}
                                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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