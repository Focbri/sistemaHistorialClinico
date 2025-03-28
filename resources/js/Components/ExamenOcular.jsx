const ExamenOcular = ({ data, setData, edadPaciente }) => {
    
    return (
        <div className='mb-8'>
            <label className="block text-xl font-medium text-gray-700 uppercase">Examen NUEVO</label>
            <div className='grid grid-cols-2 gap-12 p-4 rounded-md'>
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
                                value={data.examen_av_sc_od ?? ''}
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
                                value={data.examen_av_cae_od ?? ''}
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
                                value={data.examen_av_cc_od ?? ''}
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
                                value={data.examen_av_sc_oi ?? ''}
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
                                value={data.examen_av_cae_oi ?? ''}
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
                                value={data.examen_av_cc_oi ?? ''}
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
                <div className='flex flex-col justify-center items-center w-full py-4 gap-6 border border-gray-200 rounded-md'>
                    <div className='flex justify-center items-center w-auto gap-4'>
                            <select
                                value={data.examen_pi_tipo ?? ''}
                                onChange={(e) => setData('examen_pi_tipo', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            >
                                <option value="">Elige el Tipo de Presión Intraocular:</option>
                                <option value="aplanatica">Tipo de Presión Aplanatica</option>
                                <option value="manual">Tipo de Presión Manual</option>
                                <option value="neumatica">Tipo de Presión Neumatica</option>
                            </select>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        {/* Input OD con "mmHg" dentro */}
                        <div className="relative flex flex-col max-w-32 gap-2">
                            <label className='text-center'>OD</label>
                            <input
                                type="text"
                                value={(data.examen_pi_od ?? '').replace(/ mmHg$/, '')} // Elimina "mmHg" al mostrar el valor
                                maxLength={2}
                                minLength={0}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Validar que solo se ingresen números
                                    if (/^\d*$/.test(value)) {
                                        setData('examen_pi_od', value ? `${value} mmHg` : '');
                                    }
                                }}
                                className="block w-full rounded-md border-[#8FDBF1] shadow-sm" // Padding a la derecha
                                placeholder=" "
                            />
                            <span className="absolute flex items-center right-0 bottom-0 mr-3 my-2 pointer-events-none text-gray-400">
                                mmHg
                            </span>
                        </div>

                        {/* Input OI con "mmHg" dentro */}
                        <div className="relative flex flex-col max-w-32 gap-2">
                            <label className='text-center'>OI</label>
                            <input
                                type="text"
                                value={(data.examen_pi_oi ?? '').replace(/ mmHg$/, '')} // Elimina "mmHg" al mostrar el valor
                                maxLength={2}
                                minLength={0}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Validar que solo se ingresen números
                                    if (/^\d*$/.test(value)) {
                                        setData('examen_pi_oi', value ? `${value} mmHg` : '');
                                    }
                                }}
                                className="block w-full rounded-md border-[#8FDBF1] shadow-sm" // Padding a la derecha
                                placeholder=" "
                            />
                            <span className="absolute flex items-center right-0 bottom-0 mr-3 my-2 pointer-events-none text-gray-400">
                                mmHg
                            </span>
                        </div>
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
                            value={data.examen_ar_sph_od ?? ''}
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
                            value={data.examen_ar_cyl_od ?? ''}
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
                            value={data.examen_ar_ax_od ?? ''}
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
                            value={data.examen_ar_sph_oi ?? ''}
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
                            value={data.examen_ar_cyl_oi ?? ''}
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
                            value={data.examen_ar_ax_oi ?? ''}
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
                            value={data.examen_keratometria_qd1_od ?? ''}
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
                            value={data.examen_keratometria_qd2_od ?? ''}
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
                            value={data.examen_keratometria_eje_od ?? ''}
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
                            value={data.examen_keratometria_qd1_oi ?? ''}
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
                            value={data.examen_keratometria_qd2_oi ?? ''}
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
                            value={data.examen_keratometria_eje_oi ?? ''}
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

                {/* EXAMEN ANTIGUO */}
                <div className="flex flex-col">
                    <div className="mb-4 w-full text-center uppercase text-lg">
                        <h2>Examen Antiguo</h2>
                    </div>
                    <div className="flex flex-col mb-8">
                        <div className="flex justify-start uppercase font-bold">
                            <h3>Distancia</h3>
                        </div>
                        <div className="flex">
                            <div className="grid grid-cols-4">
                                <label></label>
                                <label className="text-center uppercase">Esfera</label>
                                <label className="text-center uppercase">Cilindro</label>
                                <label className="text-center uppercase">Eje</label>
                                <label className="border border-[#8FDBF1] py-2  text-center">Ojo Derecho</label>
                                <input
                                    type="text"
                                    value={data.exam_old_distancia_esfera_od ?? ''}
                                    maxLength={6}
                                    minLength={0}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                            setData('exam_old_distancia_esfera_od', value);
                                        }
                                    }}
                                    className="block w-full border-[#8FDBF1] shadow-sm "
                                />
                                <input
                                    type="text"
                                    value={data.exam_old_distancia_cilindro_od ?? ''}
                                    maxLength={6}
                                    minLength={0}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                            setData('exam_old_distancia_cilindro_od', value);
                                        }
                                    }}
                                    className="block w-full border-[#8FDBF1] shadow-sm "
                                />
                                <input
                                    type="text"
                                    value={data.exam_old_distancia_eje_od ?? ''}
                                    maxLength={6}
                                    minLength={0}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                            setData('exam_old_distancia_eje_od', value);
                                        }
                                    }}
                                    className="block w-full border-[#8FDBF1] shadow-sm "
                                />
                                <label className="border border-[#8FDBF1] py-2  text-center">Ojo Izquierdo</label>
                                <input
                                    type="text"
                                    value={data.exam_old_distancia_esfera_oi ?? ''}
                                    maxLength={6}
                                    minLength={0}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                            setData('exam_old_distancia_esfera_oi', value);
                                        }
                                    }}
                                    className="block w-full border-[#8FDBF1] shadow-sm "
                                />
                                <input
                                    type="text"
                                    value={data.exam_old_distancia_cilindro_oi ?? ''}
                                    maxLength={6}
                                    minLength={0}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                            setData('exam_old_distancia_cilindro_oi', value);
                                        }
                                    }}
                                    className="block w-full border-[#8FDBF1] shadow-sm "
                                />
                                <input
                                    type="text"
                                    value={data.exam_old_distancia_eje_oi ?? ''}
                                    maxLength={6}
                                    minLength={0}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                            setData('exam_old_distancia_eje_oi', value);
                                        }
                                    }}
                                    className="block w-full border-[#8FDBF1] shadow-sm "
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="h-[22%]  text-center uppercase">DIP</label>
                                <input
                                        type="text"
                                        value={data.exam_old_distancia_dip ?? ''}
                                        maxLength={6}
                                        minLength={0}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                                setData('exam_old_distancia_dip', value);
                                            }
                                        }}
                                        className="block w-full border-[#8FDBF1] shadow-sm  h-[78%]"
                                    />
                            </div>
                        </div>
                    </div>
                    {/* Mostrar "Cerca" solo si el paciente tiene 30 años o más */}
                    {edadPaciente >= 30 && (
                        <div className="flex flex-col">
                            <div className="flex justify-start uppercase font-bold">
                                <h3>Cerca</h3>
                            </div>
                            <div className="flex">
                                <div className="grid grid-cols-4">
                                    <label></label>
                                    <label className="text-center uppercase">Esfera</label>
                                    <label className="text-center uppercase">Cilindro</label>
                                    <label className="text-center uppercase">Eje</label>
                                    <label className="border border-[#8FDBF1] py-2  text-center">Ojo Derecho</label>
                                    <input
                                        type="text"
                                        value={data.exam_old_cerca_esfera_od ?? ''}
                                        maxLength={6}
                                        minLength={0}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                                setData('exam_old_cerca_esfera_od', value);
                                            }
                                        }}
                                        className="block w-full border-[#8FDBF1] shadow-sm "
                                    />
                                    <input
                                        type="text"
                                        value={data.exam_old_cerca_cilindro_od ?? ''}
                                        maxLength={6}
                                        minLength={0}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                                setData('exam_old_cerca_cilindro_od', value);
                                            }
                                        }}
                                        className="block w-full border-[#8FDBF1] shadow-sm "
                                    />
                                    <input
                                        type="text"
                                        value={data.exam_old_cerca_eje_od ?? ''}
                                        maxLength={6}
                                        minLength={0}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                                setData('exam_old_cerca_eje_od', value);
                                            }
                                        }}
                                        className="block w-full border-[#8FDBF1] shadow-sm "
                                    />
                                    <label className="border border-[#8FDBF1] py-2  text-center">Ojo Izquierdo</label>
                                    <input
                                        type="text"
                                        value={data.exam_old_cerca_esfera_oi ?? ''}
                                        maxLength={6}
                                        minLength={0}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                                setData('exam_old_cerca_esfera_oi', value);
                                            }
                                        }}
                                        className="block w-full border-[#8FDBF1] shadow-sm "
                                    />
                                    <input
                                        type="text"
                                        value={data.exam_old_cerca_cilindro_oi ?? ''}
                                        maxLength={6}
                                        minLength={0}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                                setData('exam_old_cerca_cilindro_oi', value);
                                            }
                                        }}
                                        className="block w-full border-[#8FDBF1] shadow-sm "
                                    />
                                    <input
                                        type="text"
                                        value={data.exam_old_cerca_eje_oi ?? ''}
                                        maxLength={6}
                                        minLength={0}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                                setData('exam_old_cerca_eje_oi', value);
                                            }
                                        }}
                                        className="block w-full border-[#8FDBF1] shadow-sm "
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="h-[22%]  text-center uppercase">DIP</label>
                                    <input
                                            type="text"
                                            value={data.exam_old_cerca_dip ?? ''}
                                            maxLength={6}
                                            minLength={0}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                                    setData('exam_old_cerca_dip', value);
                                                }
                                            }}
                                            className="block w-full border-[#8FDBF1] shadow-sm  h-[78%]"
                                        />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* EXAMEN NUEVO */}
                <div className="flex flex-col">
                    <div className="mb-4 w-full text-center uppercase text-lg">
                        <h2>Examen Nuevo</h2>
                    </div>
                    <div className="flex flex-col mb-8">
                        <div className="flex justify-start uppercase font-bold">
                            <h3>Distancia</h3>
                        </div>
                        <div className="flex">
                            <div className="grid grid-cols-4">
                                <label></label>
                                <label className="text-center uppercase">Esfera</label>
                                <label className="text-center uppercase">Cilindro</label>
                                <label className="text-center uppercase">Eje</label>
                                <label className="border border-[#8FDBF1] py-2  text-center">Ojo Derecho</label>
                                <input
                                    type="text"
                                    value={data.exam_new_distancia_esfera_od ?? ''}
                                    maxLength={6}
                                    minLength={0}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                            setData('exam_new_distancia_esfera_od', value);
                                        }
                                    }}
                                    className="block w-full border-[#8FDBF1] shadow-sm "
                                />
                                <input
                                    type="text"
                                    value={data.exam_new_distancia_cilindro_od ?? ''}
                                    maxLength={6}
                                    minLength={0}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                            setData('exam_new_distancia_cilindro_od', value);
                                        }
                                    }}
                                    className="block w-full border-[#8FDBF1] shadow-sm "
                                />
                                <input
                                    type="text"
                                    value={data.exam_new_distancia_eje_od ?? ''}
                                    maxLength={6}
                                    minLength={0}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                            setData('exam_new_distancia_eje_od', value);
                                        }
                                    }}
                                    className="block w-full border-[#8FDBF1] shadow-sm "
                                />
                                <label className="border border-[#8FDBF1] py-2  text-center">Ojo Izquierdo</label>
                                <input
                                    type="text"
                                    value={data.exam_new_distancia_esfera_oi ?? ''}
                                    maxLength={6}
                                    minLength={0}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                            setData('exam_new_distancia_esfera_oi', value);
                                        }
                                    }}
                                    className="block w-full border-[#8FDBF1] shadow-sm "
                                />
                                <input
                                    type="text"
                                    value={data.exam_new_distancia_cilindro_oi ?? ''}
                                    maxLength={6}
                                    minLength={0}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                            setData('exam_new_distancia_cilindro_oi', value);
                                        }
                                    }}
                                    className="block w-full border-[#8FDBF1] shadow-sm "
                                />
                                <input
                                    type="text"
                                    value={data.exam_new_distancia_eje_oi ?? ''}
                                    maxLength={6}
                                    minLength={0}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                            setData('exam_new_distancia_eje_oi', value);
                                        }
                                    }}
                                    className="block w-full border-[#8FDBF1] shadow-sm "
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="h-[22%]  text-center uppercase">DIP</label>
                                <input
                                        type="text"
                                        value={data.exam_new_distancia_dip ?? ''}
                                        maxLength={6}
                                        minLength={0}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                                setData('exam_new_distancia_dip', value);
                                            }
                                        }}
                                        className="block w-full border-[#8FDBF1] shadow-sm  h-[78%]"
                                    />
                            </div>
                        </div>
                    </div>
                    {edadPaciente >= 30 && (
                        <div className="flex flex-col">
                            <div className="flex justify-start uppercase font-bold">
                                <h3>Cerca</h3>
                            </div>
                            <div className="flex">
                                <div className="grid grid-cols-4">
                                    <label></label>
                                    <label className="text-center uppercase">Esfera</label>
                                    <label className="text-center uppercase">Cilindro</label>
                                    <label className="text-center uppercase">Eje</label>
                                    <label className="border border-[#8FDBF1] py-2  text-center">Ojo Derecho</label>
                                    <input
                                        type="text"
                                        value={data.exam_new_cerca_esfera_od ?? ''}
                                        maxLength={6}
                                        minLength={0}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                                setData('exam_new_cerca_esfera_od', value);
                                            }
                                        }}
                                        className="block w-full border-[#8FDBF1] shadow-sm "
                                    />
                                    <input
                                        type="text"
                                        value={data.exam_new_cerca_cilindro_od ?? ''}
                                        maxLength={6}
                                        minLength={0}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                                setData('exam_new_cerca_cilindro_od', value);
                                            }
                                        }}
                                        className="block w-full border-[#8FDBF1] shadow-sm "
                                    />
                                    <input
                                        type="text"
                                        value={data.exam_new_cerca_eje_od ?? ''}
                                        maxLength={6}
                                        minLength={0}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                                setData('exam_new_cerca_eje_od', value);
                                            }
                                        }}
                                        className="block w-full border-[#8FDBF1] shadow-sm "
                                    />
                                    <label className="border border-[#8FDBF1] py-2  text-center">Ojo Izquierdo</label>
                                    <input
                                        type="text"
                                        value={data.exam_new_cerca_esfera_oi ?? ''}
                                        maxLength={6}
                                        minLength={0}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                                setData('exam_new_cerca_esfera_oi', value);
                                            }
                                        }}
                                        className="block w-full border-[#8FDBF1] shadow-sm "
                                    />
                                    <input
                                        type="text"
                                        value={data.exam_new_cerca_cilindro_oi ?? ''}
                                        maxLength={6}
                                        minLength={0}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                                setData('exam_new_cerca_cilindro_oi', value);
                                            }
                                        }}
                                        className="block w-full border-[#8FDBF1] shadow-sm "
                                    />
                                    <input
                                        type="text"
                                        value={data.exam_new_cerca_eje_oi ?? ''}
                                        maxLength={6}
                                        minLength={0}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                                setData('exam_new_cerca_eje_oi', value);
                                            }
                                        }}
                                        className="block w-full border-[#8FDBF1] shadow-sm "
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="h-[22%]  text-center uppercase">DIP</label>
                                    <input
                                            type="text"
                                            value={data.exam_new_cerca_dip ?? ''}
                                            maxLength={6}
                                            minLength={0}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^[-0-9.]*$/.test(value)) { // Validar con regex
                                                    setData('exam_new_cerca_dip', value);
                                                }
                                            }}
                                            className="block w-full border-[#8FDBF1] shadow-sm  h-[78%]"
                                        />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ExamenOcular;