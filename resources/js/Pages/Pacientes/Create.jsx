import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useRef, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { te } from 'date-fns/locale';

export default function PacientesCreate({ auth, dni }) {
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [documentos, setDocumentos] = useState([]);
    const [documentosPreview, setDocumentosPreview] = useState([]);

    const [tipoDocumento, setTipoDocumento] = useState('dni'); // Estado para el tipo de documento

    const { data, setData, post, errors, processing } = useForm({
        apellido_paterno: '',
        apellido_materno: '',
        nombres: '',
        fecha_nacimiento: '',
        edad: '',
        peso: '',
        tipo_documento: 'dni', // Nuevo campo para tipo de documento
        dni: dni || '',
        sexo: '',
        estado_civil: '',
        ocupacion: '',
        direccion: '',
        telefono: '',
        telefonoE: '', // Nuevo campo para teléfono de emergencia
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

    // Función para manejar el cambio de tipo de documento
    const handleTipoDocumentoChange = (e) => {
        const tipo = e.target.value;
        setTipoDocumento(tipo);
        setData('tipo_documento', tipo);
        setData('dni', ''); // Limpiar el campo al cambiar el tipo
    };

    // Función para validar y formatear el número de documento
    const handleDocumentoChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Solo números
        let maxLength = 8; // Por defecto para DNI
        
        if (tipoDocumento === 'ce') {
            maxLength = 12; // Carnet de extranjería puede tener hasta 12 dígitos
        }
        
        if (value.length <= maxLength) {
            setData('dni', value);
        }
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

        post(route('pacientes.store'), {
            data: formData,
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                // Limpiar previsualizaciones después del envío exitoso
                setPreviewImage(null);
                setDocumentos([]);
                setDocumentosPreview([]);
            },
            onError: (errors) => {
                console.log('Errores del servidor:', errors);
            }
        });
    };

    // Función mejorada para calcular edad
useEffect(() => {
    if (data.fecha_nacimiento) {
        const calculateAge = (birthDate) => {
            const today = new Date();
            const birth = new Date(birthDate);
            
            // Verificar que la fecha sea válida
            if (isNaN(birth.getTime())) return '';
            
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            
            // Ajustar edad si aún no ha pasado el mes de cumpleaños
            // o si es el mes pero no ha pasado el día
            if (monthDiff < 0 || 
                (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            
            // Validar que la edad no sea negativa (fecha futura)
            return age < 0 ? 0 : age;
        };
        
        const age = calculateAge(data.fecha_nacimiento);
        setData('edad', age.toString());
    }
}, [data.fecha_nacimiento]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Crear Nuevo Paciente</h2>}
        >
            <Head title="Crear Nuevo Paciente" />

            <div className="py-6 sm:py-12">
                <div className="mx-auto sm:max-w-7xl sm:px-6 lg:px-8">
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
                                <div className='mb-6 sm:mb-8'>
                                    <h3 className="text-xl sm:text-2xl uppercase font-semibold leading-tight text-gray-800 border-b">Datos Personales</h3>
                                </div>
                                <div className='flex flex-col sm:grid sm:grid-cols-2 sm:gap-12'>
                                    <div className='flex flex-col'>
                                        <div className="mb-4">
                                            <label className="block text-xs sm:text-sm uppercase font-medium text-gray-700">Apellido Paterno*</label>
                                            <input required
                                                type="text"
                                                value={data.apellido_paterno}
                                                onChange={(e) => setData('apellido_paterno', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                            />
                                            {errors.apellido_paterno && <p className="text-xs sm:text-sm text-red-500">{errors.apellido_paterno}</p>}
                                        </div>                                           
                                        <div className="mb-4">
                                            <label className="block text-xs sm:text-sm uppercase font-medium text-gray-700">Apellido Materno*</label>
                                            <input required
                                                type="text"
                                                value={data.apellido_materno}
                                                onChange={(e) => setData('apellido_materno', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                            />
                                            {errors.apellido_materno && <p className="text-xs sm:text-sm text-red-500">{errors.apellido_materno}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-xs sm:text-sm uppercase font-medium text-gray-700">Nombres*</label>
                                            <input required
                                                type="text"
                                                value={data.nombres}
                                                onChange={(e) => setData('nombres', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                            />
                                            {errors.nombres && <p className="text-xs sm:text-sm text-red-500">{errors.nombres}</p>}
                                        </div>
                                    </div>
                                    
                                    <div className='flex flex-col'>
                                        <div className="mb-4">
                                            <label className="block text-xs sm:text-sm uppercase font-medium text-gray-700">Fecha Nacimiento*</label>
                                            <input required
                                                type="date"
                                                value={data.fecha_nacimiento || ''}
                                                onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                            />
                                            {errors.fecha_nacimiento && <p className="text-xs sm:text-sm text-red-500">{errors.fecha_nacimiento}</p>}
                                        </div>

                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                            <div className="mb-4">
                                                <label className="block text-xs sm:text-sm uppercase font-medium text-gray-700">Edad</label>
                                                <input required
                                                    type="number"
                                                    min={0}
                                                    max={999}
                                                    maxLength={3}
                                                    value={data.edad || ''}
                                                    onChange={(e) => {
                                                        if (e.target.value.length <= 3) {
                                                            setData('edad', e.target.value);
                                                        }
                                                    }}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                                />
                                                {errors.edad && <p className="text-xs sm:text-sm text-red-500">{errors.edad}</p>}
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-xs sm:text-sm uppercase font-medium text-gray-700">Peso Kg</label>
                                                <input
                                                    type="number"
                                                    value={data.peso || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                            setData('peso', value);
                                                        }
                                                    }}
                                                    step="0.01"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                                />
                                                {errors.peso && <p className="text-xs sm:text-sm text-red-500">{errors.peso}</p>}
                                            </div> 

                                            <div className="mb-4">
                                                <label className="block text-xs sm:text-sm uppercase font-medium text-gray-700">Género</label>
                                                    <select 
                                                        value={data.sexo || ''}
                                                        onChange={(e) => setData('sexo', e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                                    >
                                                        <option value="">Seleccione...</option>
                                                        <option value="M">Masculino</option>
                                                        <option value="F">Femenino</option>
                                                    </select>
                                                    {errors.sexo && <p className="text-xs sm:text-sm text-red-500">{errors.sexo}</p>}
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-xs sm:text-sm uppercase font-medium text-gray-700">Tipo de Documento</label>
                                                <select 
                                                    value={tipoDocumento}
                                                    onChange={handleTipoDocumentoChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                                >
                                                    <option value="dni">DNI</option>
                                                    <option value="ce">Carnet de Extranjería</option>
                                                </select>
                                            </div>
                                        </div>
                                            
                                        <div className="mb-4">
                                            <label className="block text-xs sm:text-sm uppercase font-medium text-gray-700">
                                                {tipoDocumento === 'dni' ? 'DNI*' : 'Carnet de Extranjería*'}
                                            </label>
                                            <input
                                                type="text"
                                                value={data.dni}
                                                onChange={handleDocumentoChange}
                                                maxLength={tipoDocumento === 'dni' ? 8 : 12}
                                                placeholder={tipoDocumento === 'dni' ? 'Ingrese 8 dígitos' : 'Ingrese hasta 12 dígitos'}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                            />
                                            {errors.dni && <p className="text-xs sm:text-sm text-red-500">{errors.dni}</p>}
                                        </div>
                                    </div>
                                </div>

                                <hr className='my-6 sm:my-8'/>
                                <div className='flex flex-col sm:grid sm:grid-cols-2 sm:gap-12'>
                                    <div className='flex flex-col'>
                                        <div className="mb-4">
                                        <label className="block text-xs sm:text-sm uppercase font-medium text-gray-700">Estado Civil</label>
                                            <select
                                                value={data.estado_civil}
                                                onChange={(e) => setData('estado_civil', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                            >
                                                <option value="">Seleccione...</option>
                                                <option value="soltero">Soltero</option>
                                                <option value="casado">Casado</option>
                                                <option value="divorciado">Divorciado</option>
                                                <option value="viudo">Viudo</option>
                                            </select>
                                            {errors.estado_civil && <p className="text-xs sm:text-sm text-red-500">{errors.estado_civil}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-xs sm:text-sm uppercase font-medium text-gray-700">Ocupación</label>
                                            <input
                                                type="text"
                                                value={data.ocupacion}
                                                onChange={(e) => setData('ocupacion', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                            />
                                            {errors.ocupacion && <p className="text-xs sm:text-sm text-red-500">{errors.ocupacion}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-xs sm:text-sm uppercase font-medium text-gray-700">Distrito de Procedencia</label>
                                                <select 
                                                    value={data.procedencia}
                                                    onChange={(e) => setData('procedencia', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
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
                                                {errors.referido && <p className="text-xs sm:text-sm text-red-500">{errors.referido}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-xs sm:text-sm uppercase font-medium text-gray-700">Domicilio*</label>
                                            <input
                                                type="text"
                                                value={data.direccion}
                                                onChange={(e) => setData('direccion', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                            />
                                            {errors.direccion && <p className="text-xs sm:text-sm text-red-500">{errors.direccion}</p>}
                                        </div>
                                    </div>

                                    <div className='flex flex-col'>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
                                            <div >
                                                <label className="block text-xs sm:text-sm uppercase font-medium text-gray-700">Teléfono*</label> 
                                                <input required
                                                    type="tel"                                                
                                                    value={data.telefono}
                                                    max={9999999999}
                                                    maxLength={10}
                                                    onChange={(e) => {
                                                        if (e.target.value.length <= 10) {
                                                            setData('telefono', e.target.value);
                                                        }
                                                    }}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs sm:text-sm uppercase font-medium text-gray-700">Teléfono Emergencia</label>
                                                <input
                                                    type="tel"                                                
                                                    value={data.telefonoE}
                                                    max={9999999999}
                                                    maxLength={10}
                                                    onChange={(e) => {
                                                        if (e.target.value.length <= 10) {
                                                            setData('telefonoE', e.target.value);
                                                        }
                                                    }}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-xs sm:text-sm uppercase font-medium text-gray-700">Acompañante</label>
                                            <input 
                                                type="text"
                                                value={data.acompañante}
                                                onChange={(e) => setData('acompañante', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                            />
                                            {errors.acompañante && <p className="text-xs sm:text-sm text-red-500">{errors.acompañante}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-xs sm:text-sm uppercase font-medium text-gray-700">Referido</label>
                                                <select
                                                    value={data.referido}
                                                    onChange={(e) => setData('referido', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"                                                    
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
                                                {errors.referido && <p className="text-xs sm:text-sm text-red-500">{errors.referido}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-xs sm:text-sm uppercase font-medium text-gray-700">Correo*</label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                            />
                                            {errors.email && <p className="text-xs sm:text-sm text-red-500">{errors.email}</p>}
                                        </div>
                                    </div>          
                                </div>                    
                                
                                {/* BOTONES DE ACCIÓN */}
                                <div className="flex flex-col-reverse sm:flex-row items-center justify-end mt-3 sm:mt-8 space-y-3 gap-4 sm:gap-0 sm:space-y-0 sm:space-x-4">
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