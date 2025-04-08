import { useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function PacienteImagenPerfil({ paciente }) {
    const { data, setData, post, processing, errors } = useForm({
        foto_perfil: null,
        _method: 'PUT' // Esto convertirá el POST en PUT en el backend
    });
    
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (paciente.foto_perfil_url) {
            const imageUrl = `${paciente.foto_perfil_url}?t=${new Date().getTime()}`;
            const img = new Image();
            img.src = imageUrl;
            
            img.onload = () => setPreviewImage(imageUrl);
            img.onerror = () => {
                console.error('La imagen no pudo cargarse');
                setPreviewImage(null);
            };
        }
    }, [paciente.foto_perfil_url]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            alert('Solo se permiten archivos de imagen (JPEG, PNG)');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('La imagen no debe exceder los 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);

        setData('foto_perfil', file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('foto_perfil', data.foto_perfil);
        formData.append('_method', 'PUT');
    
        axios.post(route('pacientes.update.imagen', paciente.id), formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            setIsUploading(false);
            setPreviewImage(prev => `${prev.split('?')[0]}?t=${new Date().getTime()}`);
        })
        .catch(error => {
            setIsUploading(false);
            console.error('Error:', error);
        });
    };

    const handleDeleteImage = () => {
        if (!confirm('¿Estás seguro de eliminar la imagen de perfil?')) return;
        
        // También usa POST para la eliminación
        post(route('pacientes.delete.imagen', paciente.id), {
            preserveScroll: true,
            onSuccess: () => {
                setPreviewImage(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Imagen de Perfil</h2>
            
            <div className="flex items-center space-x-6">
                <div className="shrink-0">
                    {previewImage ? (
                        <img 
                            src={previewImage} 
                            alt="Foto de perfil" 
                            className="h-32 w-32 object-cover rounded-full border-2 border-gray-300"
                            onError={() => setPreviewImage(null)}
                        />
                    ) : (
                        <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            Sin imagen
                        </div>
                    )}
                </div>
                
                <div className="space-y-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                            disabled={processing || isUploading}
                        >
                            {previewImage ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                        </button>
                        
                        {previewImage && (
                            <button
                                type="button"
                                onClick={handleDeleteImage}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                disabled={processing || isUploading}
                            >
                                Eliminar
                            </button>
                        )}
                    </div>
                    
                    {(data.foto_perfil || previewImage) && (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                            disabled={processing || isUploading}
                        >
                            {isUploading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    )}
                    
                    <p className="text-sm text-gray-500">
                        Formatos aceptados: JPG, PNG. Tamaño máximo: 2MB.
                    </p>
                </div>
            </div>
            
            {errors.foto_perfil && (
                <p className="mt-2 text-sm text-red-500">{errors.foto_perfil}</p>
            )}
        </div>
    );
}