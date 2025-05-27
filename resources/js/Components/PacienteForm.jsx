import { useState } from "react";
import axios from 'axios'; // Importar axios

const PacienteForm = ({ data, setData, pacienteEncontrado, setPacienteEncontrado, errors }) => {
    const [buscando, setBuscando] = useState(false);

    const buscarPaciente = async () => {
        if (!data.dni) {
            alert('Por favor ingrese un DNI o Carnet de Extranjería');
            return;
        }

        if (!/^\d{8,12}$/.test(data.dni.trim())) {
            alert('El documento debe tener entre 8 y 12 dígitos');
            return;
        }

        setBuscando(true);
        
        try {
            const response = await axios.post('/consultas/buscar-paciente', {
                dni: data.dni.trim()
            });

            // Con axios, los datos vienen directamente en response.data
            const result = response.data;

            if (result.success && result.paciente) {
                setData(prev => ({
                    ...prev,
                    paciente_id: result.paciente.id,
                    tipo_documento: result.paciente.tipo_documento,
                    dni: result.paciente.dni,
                    nombres: result.paciente.nombres,
                    apellido_paterno: result.paciente.apellido_paterno,
                    apellido_materno: result.paciente.apellido_materno,
                    fecha_nacimiento: result.paciente.fecha_nacimiento,
                    sexo: result.paciente.sexo,
                    telefono: result.paciente.telefono,
                    tipo_consulta: result.tieneConsultaInicial ? 'evolucion' : 'inicio',
                    edad: result.paciente.edad,
                    foto_perfil: result.paciente.foto_perfil || '', 
                }));
                
                setPacienteEncontrado && setPacienteEncontrado(true);
            } else {
                throw new Error(result.message || 'Paciente no encontrado');
            }
        } catch (error) {
            console.error('Error al buscar paciente:', error);
            // Con axios, el mensaje de error puede estar en error.response.data
            const errorMessage = error.response?.data?.message || error.message || 'Error al buscar paciente';
            alert(errorMessage);
            setPacienteEncontrado && setPacienteEncontrado(false);
        } finally {
            setBuscando(false);
        }
    };

    return (
        <div className="mb-4 items-center flex gap-2">
            <input
                type="text"
                value={data.dni || ''}
                maxLength={12}
                minLength={0}
                onChange={(e) => {
                    const value = e.target.value;
                    if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                        setData('dni', e.target.value);
                    }
                }}
                disabled={pacienteEncontrado}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ingrese DNI o Carnet de Extranjería"
            />
            <button
                type="button"
                onClick={buscarPaciente}
                disabled={pacienteEncontrado || !data.dni || buscando}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {buscando ? 'Buscando...' : 'Buscar'}
            </button>
            {errors.dni && <p className="text-sm text-red-500">{errors.dni}</p>}
        </div>
    );
};

export default PacienteForm;