import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function EditCirugia({ auth, cirugia, pacientes }) {
    const { data, setData, put, errors, processing } = useForm({ 
        paciente_id: cirugia.paciente_id,
        cita_id: cirugia.cita_id,
        diagnostico_preoperatorio: cirugia.diagnostico_preoperatorio,
        diagnostico_postoperatorio: cirugia.diagnostico_postoperatorio,
        cirugia: cirugia.cirugia,
        cirujano_principal: cirugia.cirujano_principal,
        cirujano_ayudante: cirugia.cirujano_ayudante,
        anestesiologo: cirugia.anestesiologo,
        tipo_anestesia: cirugia.tipo_anestesia,
        personal_enfermeria: Array.isArray(cirugia.personal_enfermeria) ? 
                            cirugia.personal_enfermeria : 
                            JSON.parse(cirugia.personal_enfermeria || '[]'),
        hallazgos: cirugia.hallazgos,
        procedimiento: cirugia.procedimiento,
        fecha_cirugia: cirugia.fecha_cirugia ? 
            new Date(cirugia.fecha_cirugia).toISOString().split('T')[0] : 
            new Date().toISOString().split('T')[0],
        hora_inicio: cirugia.hora_inicio || '',
        hora_fin: cirugia.hora_fin || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('cirugias.update', cirugia.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Editar Cirugía</h2>}
        >
            <Head title="Editar Cirugía" />
            
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Selección de Paciente */}
                                <div>
                                    <InputLabel htmlFor="paciente_id" value="Paciente *" />
                                    <select
                                        id="paciente_id"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.paciente_id}
                                        onChange={(e) => setData('paciente_id', e.target.value)}
                                        required
                                        disabled
                                    >
                                        {pacientes.map((paciente) => (
                                            <option key={paciente.id} value={paciente.id}>
                                                {paciente.nombres} {paciente.apellido_paterno} - {paciente.dni}
                                            </option>
                                        ))}
                                    </select>
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
                                        {processing ? 'Actualizando...' : 'Actualizar Cirugía'}
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