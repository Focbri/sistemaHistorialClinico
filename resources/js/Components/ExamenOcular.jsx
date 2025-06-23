const ExamenOcular = ({ data, setData, readOnly = false, edadPaciente }) => {
    console.log('Edad recibida:', edadPaciente, 'Tipo:', typeof edadPaciente);
    // Función dummy para cuando esté en modo lectura
    const handleChange = (field, value) => {
        if (!readOnly && setData) {
            setData(field, value);
        }
    };
 
    return (
    <div className='mb-8'>
        <label className="block text-xl font-medium text-gray-700 uppercase">Examen</label>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 p-2 md:p-4 rounded-md'>
            {/* Agudeza Visual */}
            <div className='flex flex-col justify-center items-center w-full p-2 md:p-4 gap-2 border border-gray-200 rounded-md'>
                <div className='flex justify-center items-center w-full gap-4'>
                    <h4 className='text-lg md:text-xl'>Agudeza Visual</h4>
                </div>
                <div className="flex w-full">
                    <div className="grid grid-rows-3">
                        <label></label>
                        <label className='flex justify-end items-center px-1 md:px-2 text-sm md:text-base'>OD</label>
                        <label className='flex justify-end items-center px-1 md:px-2 text-sm md:text-base'>OI</label>
                    </div>
                    <div className='grid grid-cols-3 gap-1 grid-rows-3 w-full'>
                        <label className='text-center flex items-center justify-center text-xs md:text-sm'>SC</label>
                        <label className='text-center flex items-center justify-center text-xs md:text-sm'>CAE</label>
                        <label className='text-center flex items-center justify-center text-xs md:text-sm'>CC</label>
                        
                        {/* Selects para OD */}
                        {['sc_od', 'cae_od', 'cc_od'].map((type) => (
                            <select
                                key={`od_${type}`}
                                value={data[`examen_av_${type}`] ?? ''}
                                onChange={(e) => handleChange(`examen_av_${type}`, e.target.value)}
                                disabled={readOnly}
                                className={`text-xs md:text-sm block w-full rounded-md border-gray-300 shadow-sm max-h-10 ${
                                    readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                            >
                                <option value="">...</option>
                                <option value="CD">CD</option>
                                <option value="MB">MB</option>
                                <option value="PPL">PPL</option>
                                <option value="NPL">NPL</option>
                                <option value="20/200">20/200</option>
                                <option value="20/100">20/100</option>
                                <option value="20/70">20/70</option>
                                <option value="20/50">20/50</option>
                                <option value="20/40">20/40</option>
                                <option value="20/30">20/30</option>
                                <option value="20/25">20/25</option>
                                <option value="20/20">20/20</option>
                                <option value="N/M">N/M</option>
                            </select>
                        ))}
                        
                        {/* Selects para OI */}
                        {['sc_oi', 'cae_oi', 'cc_oi'].map((type) => (
                            <select
                                key={`oi_${type}`}
                                value={data[`examen_av_${type}`] ?? ''}
                                onChange={(e) => handleChange(`examen_av_${type}`, e.target.value)}
                                disabled={readOnly}
                                className={`text-xs md:text-sm block w-full rounded-md border-gray-300 shadow-sm max-h-10 ${
                                    readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                            >
                                <option value="">...</option>
                                <option value="CD">CD</option>
                                <option value="MB">MB</option>
                                <option value="PPL">PPL</option>
                                <option value="NPL">NPL</option>
                                <option value="20/200">20/200</option>
                                <option value="20/100">20/100</option>
                                <option value="20/70">20/70</option>
                                <option value="20/50">20/50</option>
                                <option value="20/40">20/40</option>
                                <option value="20/30">20/30</option>
                                <option value="20/25">20/25</option>
                                <option value="20/20">20/20</option>
                                <option value="N/M">N/M</option>
                            </select>
                        ))}
                    </div>
                </div>
            </div>

            {/* Presión Intraocular */}
            <div className='flex flex-col justify-center items-center w-full py-2 md:py-4 gap-4 md:gap-6 border border-gray-200 rounded-md'>
                <div className='flex justify-center items-center w-full'>
                    <select
                        value={data.examen_pi_tipo ?? ''}
                        onChange={(e) => handleChange('examen_pi_tipo', e.target.value)}
                        disabled={readOnly}
                        className={`text-xs md:text-sm block md:w-auto w-full rounded-md border-gray-300 shadow-sm max-h-10 ${
                            readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                    >
                        <option value="">Tipo de Presión Intraocular</option>
                        <option value="Aplanatica">Aplanatica</option>
                        <option value="Manual">Manual</option>
                        <option value="Neumatica">Neumatica</option>
                    </select>
                </div>
                <div className='grid grid-cols-2 gap-2 md:gap-4 w-full px-2 md:px-16'>
                    {/* Input OD */}
                    <div className="relative flex flex-col w-full gap-1 md:gap-2">
                        <label className='text-center text-sm md:text-base'>OD</label>
                        <input
                            type="text"
                            value={(data.examen_pi_od ?? '').replace(/ mmHg$/, '')}
                            maxLength={2}
                            minLength={0}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^-?\d*$/.test(value)) {
                                    handleChange('examen_pi_od', value ? `${value} mmHg` : '');
                                }
                            }}
                            disabled={readOnly}
                            className={`text-xs md:text-sm block w-full md:w-auto rounded-md border-gray-300 shadow-sm max-h-10 ${
                                readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                            placeholder=" "
                        />
                        <span className="absolute flex items-center right-0 bottom-0 mr-2 md:mr-3 my-1 md:my-2 pointer-events-none text-gray-400 text-xs md:text-sm">
                            mmHg
                        </span>
                    </div>

                    {/* Input OI */}
                    <div className="relative flex flex-col w-full gap-1 md:gap-2">
                        <label className='text-center text-sm md:text-base'>OI</label>
                        <input
                            type="text"
                            value={(data.examen_pi_oi ?? '').replace(/ mmHg$/, '')}
                            maxLength={2}
                            minLength={0}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^-?\d*$/.test(value)) {
                                    handleChange('examen_pi_oi', value ? `${value} mmHg` : '');
                                }
                            }}
                            disabled={readOnly}
                            className={`text-xs md:text-sm block w-full rounded-md border-gray-300 shadow-sm max-h-10 ${
                                readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                            placeholder=" "
                        />
                        <span className="absolute flex items-center right-0 bottom-0 mr-2 md:mr-3 my-1 md:my-2 pointer-events-none text-gray-400 text-xs md:text-sm">
                            mmHg
                        </span>
                    </div>
                </div>
            </div>

            {/* Autorefractometria */}
            <div className='flex flex-col justify-center items-center w-full p-2 md:p-4 gap-1 md:gap-2 border border-gray-200 rounded-md'>
                <div className='flex justify-center items-center w-full gap-4'>
                    <h4 className='text-lg md:text-xl uppercase'>Autorefractometria</h4>
                </div>
                <div className='grid grid-cols-4 gap-1 w-full'>
                    <label className='text-xs md:text-sm'></label>
                    <label className='text-center text-xs md:text-sm'>Sph</label>
                    <label className='text-center text-xs md:text-sm'>Cyl</label>
                    <label className='text-center text-xs md:text-sm'>ax</label>
                    
                    <label className='flex justify-end items-center px-1 text-xs md:text-sm'>OD</label>
                    {['sph_od', 'cyl_od', 'ax_od'].map((field) => (
                        <input
                            key={`ar_od_${field}`}
                            type="text"
                            value={data[`examen_ar_${field}`] ?? ''}
                            maxLength={4}
                            minLength={0}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^[-0-9.]*$/.test(value)) {
                                    handleChange(`examen_ar_${field}`, value);
                                }
                            }}
                            disabled={readOnly}
                            className={`text-xs md:text-sm block w-full rounded-md border-gray-300 shadow-sm max-h-10 ${
                                readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                        />
                    ))}
                    
                    <label className='flex justify-end items-center px-1 text-xs md:text-sm'>OI</label>
                    {['sph_oi', 'cyl_oi', 'ax_oi'].map((field) => (
                        <input
                            key={`ar_oi_${field}`}
                            type="text"
                            value={data[`examen_ar_${field}`] ?? ''}
                            maxLength={4}
                            minLength={0}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^[-0-9.]*$/.test(value)) {
                                    handleChange(`examen_ar_${field}`, value);
                                }
                            }}
                            disabled={readOnly}
                            className={`text-xs md:text-sm block w-full rounded-md border-gray-300 shadow-sm max-h-10 ${
                                readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Keratometria */}
            <div className='flex flex-col justify-center items-center w-full p-2 md:p-4 gap-1 md:gap-2 border border-gray-200 rounded-md'>
                <div className='flex justify-center items-center w-full gap-4'>
                    <h4 className='text-lg md:text-xl uppercase'>Queratometria</h4>
                </div>
                <div className='grid grid-cols-4 gap-1 w-full'>
                    <label className='text-xs md:text-sm'></label>
                    <label className='text-center text-xs md:text-sm'>QD1</label>
                    <label className='text-center text-xs md:text-sm'>QD2</label>
                    <label className='text-center text-xs md:text-sm'>EJE</label>
                    
                    <label className='flex justify-end items-center px-1 text-xs md:text-sm'>OD</label>
                    {['qd1_od', 'qd2_od', 'eje_od'].map((field) => (
                        <input
                            key={`ker_od_${field}`}
                            type="text"
                            value={data[`examen_keratometria_${field}`] ?? ''}
                            maxLength={4}
                            minLength={0}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^[-0-9.]*$/.test(value)) {
                                    handleChange(`examen_keratometria_${field}`, value);
                                }
                            }}
                            disabled={readOnly}
                            className={`text-xs md:text-sm block w-full rounded-md border-gray-300 shadow-sm max-h-10 ${
                                readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                        />
                    ))}
                    
                    <label className='flex justify-end items-center px-1 text-xs md:text-sm'>OI</label>
                    {['qd1_oi', 'qd2_oi', 'eje_oi'].map((field) => (
                        <input
                            key={`ker_oi_${field}`}
                            type="text"
                            value={data[`examen_keratometria_${field}`] ?? ''}
                            maxLength={4}
                            minLength={0}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^[-0-9.]*$/.test(value)) {
                                    handleChange(`examen_keratometria_${field}`, value);
                                }
                            }}
                            disabled={readOnly}
                            className={`text-xs md:text-sm block w-full rounded-md border-gray-300 shadow-sm max-h-10 ${
                                readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
);
};
export default ExamenOcular;