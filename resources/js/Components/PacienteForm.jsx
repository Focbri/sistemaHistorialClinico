const PacienteForm = ({ data, setData, pacienteEncontrado, buscarPaciente, errors }) => {
    return(
        <div className="mb-4 items-center flex gap-2">
        <input
            type="text"
            value={data.dni}
            onChange={(e) => setData('dni', e.target.value)}
            disabled={pacienteEncontrado}
            className="block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="Ingrese el DNI del paciente"
        />
        <button
            type="button"
            onClick={buscarPaciente}
            disabled={pacienteEncontrado}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
            Buscar
        </button>
        {errors.dni && <p className="text-sm text-red-500">{errors.dni}</p>}
    </div>
    );
};
export default PacienteForm;