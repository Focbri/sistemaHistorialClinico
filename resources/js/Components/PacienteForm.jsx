const PacienteForm = ({ data, setData, pacienteEncontrado, buscarPaciente, errors }) => {
    return(
        <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">DNI del Paciente</label>
        <input
            type="text"
            value={data.dni}
            onChange={(e) => setData('dni', e.target.value)}
            disabled={pacienteEncontrado}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        <button
            type="button"
            onClick={buscarPaciente}
            disabled={pacienteEncontrado}
            className="mt-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
            Buscar Paciente
        </button>
        {errors.dni && <p className="text-sm text-red-500">{errors.dni}</p>}
    </div>
    );
};
export default PacienteForm;