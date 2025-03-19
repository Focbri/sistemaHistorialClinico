const ExamenOcular = ({ data, setData }) => {
    return (
        <div className='mb-8'>
        <label className="block text-xl font-medium text-gray-700 uppercase">Examen NUEVO</label>
        <div className='grid grid-cols-2 gap-4 p-4 rounded-md'>
            {/* Agudeza Visual */}
            <div className='flex flex-col justify-center items-center w-full p-4 gap-2 border border-gray-200 rounded-md'>
                <div className='flex justify-center items-center w-full gap-4'>
                    <h4 className='text-xl'>Agudeza Visual</h4>
                </div>
                <div className="flex">
                    <div className="grid grid-rows-3">
                        <label></label>
                        <label className='flex justify-end items-center px-2'>OD</label>
                        <label className='flex justify-end items-center px-2'>OI</label>
                    </div>
                    <div className='grid grid-cols-3 gap-1 grid-rows-3'>
                        <label className='text-center flex items-center justify-center'>SC</label>
                        <label className='text-center flex items-center justify-center'>CAE</label>
                        <label className='text-center flex items-center justify-center'>CC</label>
                        <select
                            value={data.examen_av_sc_od}
                            onChange={(e) => setData('examen_av_sc_od', e.target.value)}
                            className="mt-1 text-xs block w-full rounded-md border-gray-300 shadow-sm max-h-10"                                                    
                        >
                            <option value="">Seleccione...</option>
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
                        <select
                            value={data.examen_av_cae_od}
                            onChange={(e) => setData('examen_av_cae_od', e.target.value)}
                            className="mt-1 text-xs block w-full rounded-md border-gray-300 shadow-sm max-h-10"                                                    
                        >
                            
                            <option value="">Seleccione...</option>
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
                        <select
                            value={data.examen_av_cc_od}
                            onChange={(e) => setData('examen_av_cc_od', e.target.value)}
                            className="mt-1 text-xs block w-full rounded-md border-gray-300 shadow-sm max-h-10"                                                    
                        >
                            
                            <option value="">Seleccione...</option>
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
                        <select
                            value={data.examen_av_sc_oi}
                            onChange={(e) => setData('examen_av_sc_oi', e.target.value)}
                            className="mt-1 text-xs block w-full rounded-md border-gray-300 shadow-sm max-h-10"                                                    
                        >
                            
                            <option value="">Seleccione...</option>
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
                        <select
                            value={data.examen_av_cae_oi}
                            onChange={(e) => setData('examen_av_cae_oi', e.target.value)}
                            className="mt-1 text-xs block w-full rounded-md border-gray-300 shadow-sm max-h-10"                                                    
                        >
                            
                            <option value="">Seleccione...</option>
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
                        <select
                            value={data.examen_av_cc_oi}
                            onChange={(e) => setData('examen_av_cc_oi', e.target.value)}
                            className="mt-1 text-xs block w-full rounded-md border-gray-300 shadow-sm max-h-10"                                                    
                        >
                            
                            <option value="">Seleccione...</option>
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
                    </div>
                </div>
            </div>

            {/* Presión Intraocular */}
            <div className='flex flex-col justify-center items-center w-full p-4 gap-2 border border-gray-200 rounded-md'>
                <div className='flex justify-center items-center w-full gap-4'>
                    <h4 className='text-xl'>Presión Intraocular</h4>
                </div>
                <div className='grid grid-cols-4 gap-1'>
                    <label></label>
                    <label className='text-center'>OD</label>
                    <label className='text-center'>OI</label>
                    <label></label>
                    <label></label>
                    <input
                        type="text"
                        value={data.examen_pi_od}
                        onChange={(e) => setData('examen_pi_od', e.target.value)}
                        className="block w-full rounded-md border-[#8FDBF1] shadow-sm"
                    />
                    <input
                        type="text"
                        value={data.examen_pi_oi}
                        onChange={(e) => setData('examen_pi_oi', e.target.value)}
                        className="block w-full rounded-md border-[#8FDBF1] shadow-sm"
                    />
                    <label></label>
                </div>
            </div>

            {/* Autorefractometria */}
            <div className='flex flex-col justify-center items-center w-full p-4 gap-2 border border-gray-200 rounded-md'>
                <div className='flex justify-center items-center w-full gap-4'>
                    <h4 className='text-xl uppercase'>Autorefractometria</h4>
                </div>
                <div className='grid grid-cols-4 gap-1'>
                    <label></label>
                    <label className='text-center'>Sph</label>
                    <label className='text-center'>Cyl</label>
                    <label className='text-center'>ax</label>
                    <label className='flex justify-end items-center px-2'>OD</label>
                    <input
                        type="text"
                        value={data.examen_ar_sph_od}
                        maxLength={6}
                        minLength={0}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                setData('examen_ar_sph_od', value);
                            }
                        }}
                        className="block w-full rounded-md border-[#8FDBF1] shadow-sm"
                    />
                    <input
                        type="text"
                        value={data.examen_ar_cyl_od}
                        maxLength={6}
                        minLength={0}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                setData('examen_ar_cyl_od', value);
                            }
                        }}
                        className="block w-full rounded-md border-[#8FDBF1] shadow-sm"
                    />
                    <input
                        type="text"
                        value={data.examen_ar_ax_od}
                        maxLength={6}
                        minLength={0}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                setData('examen_ar_ax_od', value);
                            }
                        }}
                        className="block w-full rounded-md border-[#8FDBF1] shadow-sm"
                    />
                    <label className='flex justify-end items-center px-2'>OI</label>
                    <input
                        type="text"
                        value={data.examen_ar_sph_oi}
                        maxLength={6}
                        minLength={0}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                setData('examen_ar_sph_oi', value);
                            }
                        }}
                        className="block w-full rounded-md border-[#8FDBF1] shadow-sm"
                    />
                    <input
                        type="text"
                        value={data.examen_ar_cyl_oi}
                        maxLength={6}
                        minLength={0}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                setData('examen_ar_cyl_oi', value);
                            }
                        }}
                        className="block w-full rounded-md border-[#8FDBF1] shadow-sm"
                    />
                    <input
                        type="text"
                        value={data.examen_ar_ax_oi}
                        maxLength={6}
                        minLength={0}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                setData('examen_ar_ax_oi', value);
                            }
                        }}
                        className="block w-full rounded-md border-[#8FDBF1] shadow-sm"
                    />
                </div>
            </div>

            {/* Keratometria */}
            <div className='flex flex-col justify-center items-center w-full p-4 gap-2 border border-gray-200 rounded-md'>
                <div className='flex justify-center items-center w-full gap-4'>
                    <h4 className='text-xl uppercase'>Keratometria</h4>
                </div>
                <div className='grid grid-cols-4 gap-1'>
                    <label></label>
                    <label className='text-center'>QD1</label>
                    <label className='text-center'>QD2</label>
                    <label className='text-center'>EJE</label>
                    <label className='flex justify-end items-center px-2'>OD</label>
                    <input
                        type="text"
                        value={data.examen_keratometria_qd1_od}
                        maxLength={6}
                        minLength={0}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                setData('examen_keratometria_qd1_od', value);
                            }
                        }}
                        className="block w-full rounded-md border-[#8FDBF1] shadow-sm"
                    />
                    <input
                        type="text"
                        value={data.examen_keratometria_qd2_od}
                        maxLength={6}
                        minLength={0}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                setData('examen_keratometria_qd2_od', value);
                            }
                        }}
                        className="block w-full rounded-md border-[#8FDBF1] shadow-sm"
                    />
                    <input
                        type="text"
                        value={data.examen_keratometria_eje_od}
                        maxLength={6}
                        minLength={0}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                setData('examen_keratometria_eje_od', value);
                            }
                        }}
                        className="block w-full rounded-md border-[#8FDBF1] shadow-sm"
                    />
                    <label className='flex justify-end items-center px-2'>OI</label>
                    <input
                        type="text"
                        value={data.examen_keratometria_qd1_oi}
                        maxLength={6}
                        minLength={0}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                setData('examen_keratometria_qd1_oi', value);
                            }
                        }}
                        className="block w-full rounded-md border-[#8FDBF1] shadow-sm"
                    />
                    <input
                        type="text"
                        value={data.examen_keratometria_qd2_oi}
                        maxLength={6}
                        minLength={0}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                setData('examen_keratometria_qd2_oi', value);
                            }
                        }}
                        className="block w-full rounded-md border-[#8FDBF1] shadow-sm"
                    />
                    <input
                        type="text"
                        value={data.examen_keratometria_eje_oi}
                        maxLength={6}
                        minLength={0}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                setData('examen_keratometria_eje_oi', value);
                            }
                        }}
                        className="block w-full rounded-md border-[#8FDBF1] shadow-sm"
                    />
                </div>
            </div>
        </div>
    </div>
    );
};
export default ExamenOcular;