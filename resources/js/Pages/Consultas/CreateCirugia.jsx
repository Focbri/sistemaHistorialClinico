import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState, useEffect } from 'react';

// Componente para buscar pacientes por DNI (versión simplificada)
const BuscadorPacienteDNI = ({ onPacienteSelect, pacienteInicial }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(pacienteInicial || null);
  const [errorBusqueda, setErrorBusqueda] = useState(null);

  // Efecto para manejar cambios en pacienteInicial
  useEffect(() => {
    if (pacienteInicial) {
      setPacienteSeleccionado(pacienteInicial);
      onPacienteSelect(pacienteInicial);
    } else {
      setPacienteSeleccionado(null);
      onPacienteSelect(null);
    }
  }, [pacienteInicial]);

const handleBuscarPaciente = async (dni) => {
  try {
    // Obtener el token CSRF de las props de Inertia
    const csrfToken = document.head.querySelector('meta[name="csrf-token"]').content;
    
    if (!csrfToken) {
      throw new Error('No se pudo obtener el token CSRF');
    }

    const response = await fetch('/pacientes/buscar-por-dni', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include', // Importante para incluir cookies
      body: JSON.stringify({ dni })
    });

    if (response.status === 419) {
      // Token CSRF expirado, recargar la página
      window.location.reload();
      return;
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al buscar paciente');
    }

    if (data.paciente) {
      setPacienteSeleccionado(data.paciente);
      onPacienteSelect(data.paciente);
      setErrorBusqueda(null);
    } else {
      throw new Error('Paciente no encontrado');
    }
  } catch (error) {
    console.error('Error al buscar paciente:', error);
    setPacienteSeleccionado(null);
    onPacienteSelect(null);
    setErrorBusqueda(error.message);
  }
};
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <TextInput
          type="number"
          value={searchTerm}
          max={99999999}
          maxLength={9}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Ingrese DNI del paciente"
          className="flex-1"
        />
        <button
          type="button"
          onClick={() => handleBuscarPaciente(searchTerm)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Buscar
        </button>
      </div>

      {errorBusqueda && (
        <div className="text-red-500 text-sm">{errorBusqueda}</div>
      )}

      {pacienteSeleccionado && (
    <div className="p-4 bg-blue-50 rounded-md border border-blue-100 mt-2">
        <h3 className="font-bold text-blue-800 mb-2">Información del Paciente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <p><span className="font-semibold">Nombre:</span> {pacienteSeleccionado.nombres} {pacienteSeleccionado.apellido_paterno} {pacienteSeleccionado.apellido_materno}</p>
        <p><span className="font-semibold">DNI:</span> {pacienteSeleccionado.dni}</p>
        <p><span className="font-semibold">Edad:</span> {pacienteSeleccionado.edad} años</p>
        <p><span className="font-semibold">Teléfono:</span> {pacienteSeleccionado.telefono || 'No registrado'}</p>
        </div>
    </div>
    )}
    </div>
  );
};

export default function CreateCirugia({ auth, paciente, pacientes = [], cita_id }) {
  const pacienteInicial = paciente || (pacientes.length > 0 ? pacientes[0] : null);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(paciente || null);

  const { data, setData, post, errors, processing } = useForm({ 
    paciente_id: paciente?.id || '',
    cita_id: cita_id || '',
    diagnostico_preoperatorio: '',
    diagnostico_postoperatorio: '',
    cirugia: '',
    cirujano_principal: auth.user.name,
    cirujano_ayudante: '',
    anestesiologo: '',
    tipo_anestesia: '',
    personal_enfermeria: [],
    hallazgos: '',
    procedimiento: '',
    fecha_cirugia: new Date().toISOString().split('T')[0],
    hora_inicio: '',
    hora_fin: ''
  });

  useEffect(() => {
    if (pacienteSeleccionado) {
      setData('paciente_id', pacienteSeleccionado.id);
    }
  }, [pacienteSeleccionado]);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('cirugias.store'));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Registrar Nueva Cirugía</h2>}
    >
      <Head title="Registrar Cirugía" />
      
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selección de Paciente */}
                <div>
                  <InputLabel htmlFor="paciente_id" value="Paciente *" />
                  <BuscadorPacienteDNI 
                    pacientes={pacientes}
                    onPacienteSelect={setPacienteSeleccionado}
                    pacienteInicial={pacienteInicial}  // Añade esta línea
                  />
                  <input
                    type="hidden"
                    id="paciente_id"
                    value={data.paciente_id}
                  />
                  <InputError message={errors.paciente_id} className="mt-2" />
                </div>

                                {/* Diagnóstico Preoperatorio */}
                                <div>
                                    <InputLabel htmlFor="diagnostico_preoperatorio" value="Diagnóstico Preoperatorio *" />
                                    <textarea
                                        id="diagnostico_preoperatorio"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={3}
                                        value={data.diagnostico_preoperatorio}
                                        onChange={(e) => setData('diagnostico_preoperatorio', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.diagnostico_preoperatorio} className="mt-2" />
                                </div>

                                {/* Diagnóstico Postoperatorio */}
                                <div>
                                    <InputLabel htmlFor="diagnostico_postoperatorio" value="Diagnóstico Postoperatorio" />
                                    <textarea
                                        id="diagnostico_postoperatorio"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={3}
                                        value={data.diagnostico_postoperatorio}
                                        onChange={(e) => setData('diagnostico_postoperatorio', e.target.value)}
                                    />
                                    <InputError message={errors.diagnostico_postoperatorio} className="mt-2" />
                                </div>

                                {/* Información de la Cirugía */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="cirugia" value="Cirugía *" />
                                        <TextInput
                                            id="cirugia"
                                            className="mt-1 block w-full"
                                            value={data.cirugia}
                                            onChange={(e) => setData('cirugia', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.cirugia} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="fecha_cirugia" value="Fecha de Cirugía *" />
                                        <TextInput
                                            id="fecha_cirugia"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={data.fecha_cirugia}
                                            onChange={(e) => setData('fecha_cirugia', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.fecha_cirugia} className="mt-2" />
                                    </div>
                                </div>

                                {/* Personal Médico */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="cirujano_principal" value="Cirujano Principal *" />
                                        <TextInput
                                            id="cirujano_principal"
                                            className="mt-1 block w-full"
                                            value={data.cirujano_principal}
                                            onChange={(e) => setData('cirujano_principal', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.cirujano_principal} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="cirujano_ayudante" value="Cirujano Ayudante" />
                                        <TextInput
                                            id="cirujano_ayudante"
                                            className="mt-1 block w-full"
                                            value={data.cirujano_ayudante}
                                            onChange={(e) => setData('cirujano_ayudante', e.target.value)}
                                        />
                                        <InputError message={errors.cirujano_ayudante} className="mt-2" />
                                    </div>
                                </div>

                                {/* Anestesia */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="anestesiologo" value="Anestesiólogo *" />
                                        <TextInput
                                            id="anestesiologo"
                                            className="mt-1 block w-full"
                                            value={data.anestesiologo}
                                            onChange={(e) => setData('anestesiologo', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.anestesiologo} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="tipo_anestesia" value="Tipo de Anestesia *" />
                                        <TextInput
                                            id="tipo_anestesia"
                                            className="mt-1 block w-full"
                                            value={data.tipo_anestesia}
                                            onChange={(e) => setData('tipo_anestesia', e.target.value)}
                                            placeholder="Ej: General, Regional, Local, etc."
                                            required
                                        />
                                        <InputError message={errors.tipo_anestesia} className="mt-2" />
                                    </div>
                                </div>

                                {/* Horarios */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="hora_inicio" value="Hora de Inicio *" />
                                        <TextInput
                                            id="hora_inicio"
                                            type="time"
                                            className="mt-1 block w-full"
                                            value={data.hora_inicio}
                                            onChange={(e) => setData('hora_inicio', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.hora_inicio} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="hora_fin" value="Hora de Finalización" />
                                        <TextInput
                                            id="hora_fin"
                                            type="time"
                                            className="mt-1 block w-full"
                                            value={data.hora_fin}
                                            onChange={(e) => setData('hora_fin', e.target.value)}
                                        />
                                        <InputError message={errors.hora_fin} className="mt-2" />
                                    </div>
                                </div>

                                {/* Procedimiento y Hallazgos */}
                                <div>
                                    <InputLabel htmlFor="procedimiento" value="Procedimiento *" />
                                    <textarea
                                        id="procedimiento"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={4}
                                        value={data.procedimiento}
                                        onChange={(e) => setData('procedimiento', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.procedimiento} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="hallazgos" value="Hallazgos" />
                                    <textarea
                                        id="hallazgos"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={3}
                                        value={data.hallazgos}
                                        onChange={(e) => setData('hallazgos', e.target.value)}
                                    />
                                    <InputError message={errors.hallazgos} className="mt-2" />
                                </div>

                                {/* Personal de Enfermería */}
                                <div>
                                    <InputLabel htmlFor="personal_enfermeria" value="Personal de Enfermería (separar por comas)" />
                                    <TextInput
                                        id="personal_enfermeria"
                                        className="mt-1 block w-full"
                                        value={data.personal_enfermeria.join(', ')}
                                        onChange={(e) => setData('personal_enfermeria', e.target.value.split(',').map(item => item.trim()))}
                                        placeholder="Ej: Enfermero 1, Enfermero 2, Auxiliar 1"
                                    />
                                    <InputError message={errors.personal_enfermeria} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end gap-4">
                                    <Link
                                        href={route('consultas.index')}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Cancelar
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Registrando...' : 'Registrar Cirugía'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}