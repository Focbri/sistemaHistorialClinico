import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useRef, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function PacientesCreate({ auth }) {
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [documentos, setDocumentos] = useState([]);
    const [documentosPreview, setDocumentosPreview] = useState([]);

    const { data, setData, post, errors, processing } = useForm({
        apellido_paterno: '',
        apellido_materno: '',
        nombres: '',
        fecha_nacimiento: '',
        edad: '',
        peso: '',
        dni: '',
        sexo: '',
        estado_civil: '',
        ocupacion: '',
        direccion: '',
        telefono: '',
        email: '',
        procedencia: '',
        acompañante: '',
        referido: '',
        foto_perfil: null, // Cambiado a null para manejar archivos
    });

     // Manejar cambio de imagen de perfil
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tamaño máximo (2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('La imagen no debe superar los 2MB');
                return;
            }

            setData('foto_perfil', file);
            
            // Crear vista previa
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Eliminar imagen seleccionada
    const removeImage = () => {
        setData('foto_perfil', null);
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Manejar cambio de documentos adjuntos
    const handleDocumentosChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Validar cantidad máxima (5 documentos)
        if (files.length + documentos.length > 5) {
            alert('Solo puedes subir un máximo de 5 documentos');
            return;
        }

        const newDocumentos = files.map(file => {
            // Validar tamaño máximo por documento (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert(`El documento ${file.name} supera el límite de 5MB`);
                return null;
            }
            return file;
        }).filter(Boolean); // Filtrar los documentos que pasaron la validación

        // Crear previsualizaciones para imágenes
        const newPreviews = newDocumentos.map(file => ({
            file,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
            name: file.name
        }));

        setData('documentos', [...documentos, ...newDocumentos]);
        setDocumentos([...documentos, ...newDocumentos]);
        setDocumentosPreview([...documentosPreview, ...newPreviews]);
    };

    // Eliminar documento adjunto
    const removeDocumento = (index) => {
        const updatedDocumentos = [...documentos];
        updatedDocumentos.splice(index, 1);

        const updatedPreviews = [...documentosPreview];
        updatedPreviews.splice(index, 1);

        setData('documentos', updatedDocumentos);
        setDocumentos(updatedDocumentos);
        setDocumentosPreview(updatedPreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Crear FormData para enviar archivos
        const formData = new FormData();
        
        // Agregar todos los campos excepto archivos
        Object.keys(data).forEach(key => {
            if (key !== 'foto_perfil' && key !== 'documentos') {
                formData.append(key, data[key]);
            }
        });

        // Agregar foto de perfil si existe
        if (data.foto_perfil) {
            formData.append('foto_perfil', data.foto_perfil);
        }

        // Agregar documentos si existen
        if (data.documentos && data.documentos.length > 0) {
            data.documentos.forEach((file, index) => {
                formData.append(`documentos[${index}]`, file);
            });
        }

        post(route('pacientes.store'), {
            data: formData,
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                // Limpiar previsualizaciones después del envío exitoso
                setPreviewImage(null);
                setDocumentos([]);
                setDocumentosPreview([]);
            }
        });
    };

    // Calcular edad automáticamente cuando cambia la fecha de nacimiento
    useEffect(() => {
        if (data.fecha_nacimiento) {
            const birthDate = new Date(data.fecha_nacimiento);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            setData('edad', age.toString());
        }
    }, [data.fecha_nacimiento]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Crear Nuevo Paciente</h2>}
        >
            <Head title="Crear Nuevo Paciente" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                {/* SECCIÓN DE FOTO DE PERFIL */}
                                <div className="mb-8 bg-white shadow rounded-lg p-6">
                                    <h3 className="text-lg font-medium mb-4">Foto de Perfil</h3>
                                    <div className="flex items-center space-x-6">
                                        <div className="shrink-0">
                                            {previewImage ? (
                                                <img 
                                                    className="h-24 w-24 object-cover rounded-full" 
                                                    src={previewImage} 
                                                    alt="Preview" 
                                                />
                                            ) : (
                                                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-500">Sin foto</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <label className="block">
                                                <span className="sr-only">Seleccionar foto</span>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleImageChange}
                                                    accept="image/jpeg,image/png,image/jpg"
                                                    className="block w-full text-sm text-gray-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-md file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-blue-50 file:text-blue-700
                                                    hover:file:bg-blue-100"
                                                />
                                                <p className="mt-1 text-sm text-gray-500">JPEG, JPG o PNG (Max. 2MB)</p>
                                                {errors.foto_perfil && <p className="mt-1 text-sm text-red-600">{errors.foto_perfil}</p>}
                                            </label>
                                            {previewImage && (
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="text-sm text-red-600 hover:text-red-800"
                                                >
                                                    Eliminar imagen
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN DE DATOS PERSONALES */}
                                <div className='mb-8'>
                                    <h3 className="text-2xl uppercase font-semibold leading-tight text-gray-800 border-b">Datos Personales</h3>
                                </div>
                                <div className='grid grid-cols-2 gap-12'>
                                    <div className='flex flex-col'>
                                        <div className="mb-4">
                                            <label className="block text-sm uppercase font-medium text-gray-700">Apellido Paterno</label>
                                            <input
                                                type="text"
                                                value={data.apellido_paterno}
                                                onChange={(e) => setData('apellido_paterno', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                            {errors.apellido_paterno && <p className="text-sm text-red-500">{errors.apellido_paterno}</p>}
                                        </div>                                           
                                        <div className="mb-4">
                                            <label className="block text-sm uppercase font-medium text-gray-700">Apellido Materno</label>
                                            <input
                                                type="text"
                                                value={data.apellido_materno}
                                                onChange={(e) => setData('apellido_materno', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                            {errors.apellido_materno && <p className="text-sm text-red-500">{errors.apellido_materno}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm uppercase font-medium text-gray-700">Nombres</label>
                                            <input required
                                                type="text"
                                                value={data.nombres}
                                                onChange={(e) => setData('nombres', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                            {errors.nombres && <p className="text-sm text-red-500">{errors.nombres}</p>}
                                        </div>
                                    </div>
                                    {/*SEGUNDO BLOQUE DE DATOS PERSONALES*/ }
                                    
                                    <div className='flex flex-col'>
                                        <div className="mb-4">
                                            <label className="block text-sm uppercase font-medium text-gray-700">Fecha Nacimiento</label>
                                            <input required
                                                type="date"
                                                value={data.fecha_nacimiento}
                                                onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                            {errors.fecha_nacimiento && <p className="text-sm text-red-500">{errors.fecha_nacimiento}</p>}
                                        </div>

                                        <div className='grid grid-cols-2'>
                                            <div className="mb-4 mr-4">
                                                <label className="block text-sm uppercase font-medium text-gray-700">Edad</label>
                                                <input required
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
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                                                        // Limitar a 6 caracteres (incluyendo el punto decimal)
                                                        if (e.target.value.length <= 6) {
                                                            setData('peso', e.target.value);
                                                        }
                                                    }}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                                {errors.peso && <p className="text-sm text-red-500">{errors.peso}</p>}
                                            </div>

                                            <div className="mr-4">
                                                <label className="block text-sm uppercase font-medium text-gray-700">Sexo</label>
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
                                                <label className="block text-sm uppercase font-medium text-gray-700">DNI</label>
                                                <input required
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
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                                {errors.dni && <p className="text-sm text-red-500">{errors.dni}</p>}
                                            </div>
                                        </div>                                            
                                    </div>
                                </div>

                                <hr className='my-8'/>
                                <div className='grid grid-cols-2 gap-12'>
                                    <div className='flex flex-col'>
                                        <div className="mb-4">
                                        <label className="block text-sm uppercase font-medium text-gray-700">Estado Civil</label>
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
                                            <label className="block text-sm uppercase font-medium text-gray-700">Ocupación</label>
                                            <input
                                                type="text"
                                                value={data.ocupacion}
                                                onChange={(e) => setData('ocupacion', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                            {errors.ocupacion && <p className="text-sm text-red-500">{errors.ocupacion}</p>}
                                        </div>

                                        <div className="mr-4">
                                            <label className="block text-sm uppercase font-medium text-gray-700">Procedencia</label>
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
                                                {errors.referido && <p className="text-sm text-red-500">{errors.referido}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm uppercase font-medium text-gray-700">Domicilio</label>
                                            <input required
                                                type="text"
                                                value={data.direccion}
                                                onChange={(e) => setData('direccion', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                            {errors.direccion && <p className="text-sm text-red-500">{errors.direccion}</p>}
                                        </div>
                                    </div>

                                    <div className='flex flex-col'>
                                        <div className="mb-4">
                                            <label className="block text-sm uppercase font-medium text-gray-700">Teléfono</label>
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
                                            <label className="block text-sm uppercase font-medium text-gray-700">Acompañante</label>
                                            <input required
                                                type="text"
                                                maxLength={9}
                                                value={data.acompañante}
                                                onChange={(e) => setData('acompañante', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                            {errors.acompañante && <p className="text-sm text-red-500">{errors.acompañante}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm uppercase font-medium text-gray-700">Referido</label>
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
                                                {errors.referido && <p className="text-sm text-red-500">{errors.referido}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm uppercase font-medium text-gray-700">Email</label>
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
                                
                                {/* BOTONES DE ACCIÓN */}
                                <div className="flex items-center justify-end mt-8 space-x-4">
                                    <Link
                                        href={route('pacientes.index')}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        {processing ? 'Guardando...' : 'Guardar Paciente'}
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