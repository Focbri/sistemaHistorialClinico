import { useState, useEffect, useMemo } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import Calendar from 'react-calendar';
import { format, parseISO, isSameDay, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-calendar/dist/Calendar.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function CitasIndex({ calendarData: initialCalendarData = [], medicos = [], citas = [] }) {
  // Estados
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 1));
  const [calendarData, setCalendarData] = useState(initialCalendarData);
  const [loadedMonths, setLoadedMonths] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados de UI
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [pacienteEncontrado, setPacienteEncontrado] = useState(false);
  const [pacienteInfo, setPacienteInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('calendario');
  const [errorMessage, setErrorMessage] = useState('');

  // Formulario
  const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
    id: '',
    paciente_id: '',
    medico_id: '',
    fecha_hora: '',
    motivo: '',
    dni: '',
    estado: 'programada'
  });

  // Carga de datos optimizada
 const loadMonthData = async (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthKey = `${year}-${month}`;

    if (!loadedMonths.has(monthKey)) {
      setLoading(true);
      setError(null);
      
      try {
        const response = await router.get('/citas', { year, month }, {
          preserveState: true,
          only: ['calendarData'],
          onSuccess: (props) => {
            if (props?.calendarData) {
              setCalendarData(prev => {
                const filtered = prev.filter(item => {
                  const itemDate = new Date(item.date);
                  return itemDate.getFullYear() !== year || itemDate.getMonth() + 1 !== month;
                });
                return [...filtered, ...props.calendarData];
              });
              setLoadedMonths(prev => new Set(prev).add(monthKey));
            }
          },
          onError: (errors) => {
            console.error('Error loading month data:', errors);
            setError('Error al cargar los datos del mes');
          }
        });
      } catch (err) {
        console.error('Error loading month data:', err);
        setError('Error al cargar los datos del mes');
      } finally {
        setLoading(false);
      }
    }
  };
  // Precarga de datos
  useEffect(() => {
    const loadInitialData = async () => {
      await loadMonthData(currentDate);
      
      // Precargar meses adyacentes
      const prevMonth = new Date(currentDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      
      const nextMonth = new Date(currentDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      await loadMonthData(prevMonth);
      await loadMonthData(nextMonth);
    };

    loadInitialData();
  }, [currentDate]);

  // Funciones auxiliares
  const getDayColor = (citasCount) => {
    if (citasCount === 0) return 'gray';
    if (citasCount >= 16) return 'red';
    if (citasCount >= 12) return 'orange';
    return 'green';
  };

  const getDayData = useMemo(() => {
    return (date) => {
      try {
        const dateStr = format(date, 'yyyy-MM-dd');
        return calendarData.find(d => 
          d?.date && format(parseISO(d.date), 'yyyy-MM-dd') === dateStr
        ) || { citas_count: 0 };
      } catch (err) {
        console.error('Error processing day data:', err);
        return { citas_count: 0 };
      }
    };
  }, [calendarData]);

  // Contenido de los días
  const tileContent = useMemo(() => ({ date, view }) => {
    if (view === 'month') {
      const dayData = getDayData(date);
      return (
        <div className="text-xs mt-1 text-center">
          {dayData.citas_count}/16 citas
        </div>
      );
    }
    return null;
  }, [getDayData]);

  // Clases CSS para los días
  const tileClassName = useMemo(() => ({ date, view }) => {
    if (view !== 'month') return '';
    
    const isCurrentMonth = isSameMonth(date, currentDate);
    const isToday = isSameDay(date, new Date());
    const { citas_count } = getDayData(date);

    const classes = ['calendar-day'];
    if (isToday) classes.push('calendar-day-today');
    if (isCurrentMonth) {
      classes.push('calendar-day-current', `calendar-day-${getDayColor(citas_count)}`);
    } else {
      classes.push('calendar-day-other');
    }

    return classes.join(' ');
  }, [currentDate, getDayData]);

  // Manejo de clic en día
  const handleDayClick = (date) => {
    setData({ 
      ...data,
      fecha_hora: format(date, "yyyy-MM-dd'T'09:00") // Hora por defecto a las 9:00 AM
    });
    setShowModal(true);
  };

  // Función para buscar paciente por DNI
  const [buscandoPaciente, setBuscandoPaciente] = useState(false);

const buscarPaciente = async () => {
  if (!data.dni || data.dni.length !== 8) {
    setErrorMessage('El DNI debe tener exactamente 8 dígitos');
    return;
  }

  setBuscandoPaciente(true);
  setErrorMessage('');
  
  try {
    const response = await axios.get(route('citas.buscar-paciente'), {
      params: { dni: data.dni }
    });

    if (response?.data?.success) {
      setData(prev => ({
        ...prev,
        paciente_id: response.data.paciente.id,
        dni: response.data.paciente.dni
      }));
      
      setPacienteInfo(response.data.paciente);
      setPacienteEncontrado(true);
    } else {
      setPacienteEncontrado(false);
      setPacienteInfo(null);
      setErrorMessage(response?.data?.message || 'Paciente no encontrado');
    }
  } catch (err) {
    console.error('Error al buscar paciente:', err);
    setPacienteEncontrado(false);
    setPacienteInfo(null);
    setErrorMessage('Error al conectar con el servidor');
  } finally {
    setBuscandoPaciente(false);
  }
};
  // Verificar disponibilidad de cita
  const verificarDisponibilidad = () => {
    if (!data.fecha_hora) return true;
    
    // Verificar que sea en intervalos de 20 minutos
    const fechaHora = new Date(data.fecha_hora);
    const minutes = fechaHora.getMinutes();
    if (minutes % 20 !== 0) {
      setErrorMessage('Las citas deben programarse en intervalos de 20 minutos (ej: 08:00, 08:20, 08:40)');
      return false;
    }
    
    // Verificar disponibilidad en ±20 minutos
    const horaInicio = new Date(fechaHora.getTime() - 20 * 60 * 1000);
    const horaFin = new Date(fechaHora.getTime() + 20 * 60 * 1000);
    
    const citasEnRango = citas.filter(cita => {
      const citaFechaHora = new Date(cita.fecha_hora);
      return citaFechaHora > horaInicio && 
             citaFechaHora < horaFin && 
             cita.id !== (selectedCita?.id || data.id);
    });
    
    if (citasEnRango.length > 0) {
      setErrorMessage('Debe haber al menos 20 minutos de diferencia entre citas');
      return false;
    }
    
    setErrorMessage('');
    return true;
  };

  // Handlers para los modales
  const openViewModal = (cita) => {
    setSelectedCita(cita);
    setShowViewModal(true);
  };

  const openEditModal = (cita) => {
    setSelectedCita(cita);
    setData({
      id: cita.id,
      paciente_id: cita.paciente_id,
      medico_id: cita.medico_id,
      fecha_hora: format(new Date(cita.fecha_hora), "yyyy-MM-dd'T'HH:mm"),
      motivo: cita.motivo,
      estado: cita.estado,
      dni: cita.paciente.dni
    });
    setPacienteInfo(cita.paciente);
    setPacienteEncontrado(true);
    setShowEditModal(true);
  };

  const openDeleteModal = (cita) => {
    setSelectedCita(cita);
    setShowDeleteModal(true);
  };

  // Handlers para los formularios
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!pacienteEncontrado) {
      setErrorMessage('Debe buscar y seleccionar un paciente válido');
      return;
    }
    
    if (!verificarDisponibilidad()) {
      return;
    }

    post(route('citas.store'), {
      onSuccess: () => {
        reset();
        setShowModal(false);
        setPacienteEncontrado(false);
        setPacienteInfo(null);
        setErrorMessage('');
      },
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    
    if (!verificarDisponibilidad()) {
      return;
    }

    put(route('citas.update', selectedCita.id), {
      onSuccess: () => {
        reset();
        setShowEditModal(false);
        setSelectedCita(null);
      },
    });
  };

  const handleDelete = () => {
    destroy(route('citas.destroy', selectedCita.id), {
      onSuccess: () => {
        setShowDeleteModal(false);
        setSelectedCita(null);
      },
    });
  };

  // Formatear fecha para mostrar
  const formatFecha = (fechaHora) => {
    return format(new Date(fechaHora), 'dd/MM/yyyy HH:mm');
  };

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        <Head title="Calendario de Citas" />
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Citas</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
            disabled={loading}
          >
            Nueva Cita
          </button>
        </div>

        <div className="flex border-b mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'calendario' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('calendario')}
          >
            Calendario
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'lista' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('lista')}
          >
            Lista de Citas
          </button>
        </div>

        {activeTab === 'calendario' ? (
          <div className="bg-white p-4 rounded-lg shadow">
             <Calendar
                value={currentDate}
                onChange={setCurrentDate}
                onClickDay={handleDayClick}
                locale="es"
                minDetail="month"
                next2Label={null}
                prev2Label={null}
                tileContent={tileContent}
                tileClassName={tileClassName}
                className="border-none w-full"
                showNeighboringMonth={false}
                />
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médico</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {citas.map(cita => (
                  <tr key={cita.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cita.paciente.nombres} {cita.paciente.apellido_paterno}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cita.paciente.dni}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatFecha(cita.fecha_hora)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cita.medico.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        cita.estado === 'programada' ? 'bg-blue-100 text-blue-800' :
                        cita.estado === 'completada' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {cita.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button 
                        onClick={() => openViewModal(cita)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Ver
                      </button>
                      <button 
                        onClick={() => openEditModal(cita)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => openDeleteModal(cita)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal para nueva cita */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Nueva Cita</h2>
                
                {errorMessage && (
                  <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    {errorMessage}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">DNI del Paciente</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={data.dni}
                        onChange={(e) => {
                          setData('dni', e.target.value);
                          if (e.target.value.length !== 8) {
                            setPacienteEncontrado(false);
                          }
                        }}
                        className="flex-1 p-2 border rounded-l"
                        placeholder="Ingrese DNI (8 dígitos)"
                        maxLength="8"
                        disabled={buscandoPaciente}
                      />
                      <button
                        type="button"
                        onClick={buscarPaciente}
                        disabled={!data.dni || data.dni.length !== 8 || buscandoPaciente}
                        className={`ml-2 px-4 py-2 rounded-r ${
                          buscandoPaciente 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        {buscandoPaciente ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Buscando...
                          </span>
                        ) : 'Buscar'}
                      </button>
                    </div>
                    {data.dni && data.dni.length !== 8 && (
                      <p className="text-red-500 text-xs mt-1">El DNI debe tener 8 dígitos</p>
                    )}
                  </div>

                  {pacienteEncontrado && pacienteInfo && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-green-800">Paciente encontrado:</h4>
                          <p className="text-gray-800">
                            {pacienteInfo.nombres} {pacienteInfo.apellido_paterno} {pacienteInfo.apellido_materno}
                          </p>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                            <div>
                              <span className="font-medium">DNI:</span> {pacienteInfo.dni}
                            </div>
                            <div>
                              <span className="font-medium">Teléfono:</span> {pacienteInfo.telefono}
                            </div>
                            <div>
                              <span className="font-medium">Edad:</span> {pacienteInfo.edad}
                            </div>
                            <div>
                              <span className="font-medium">Nacimiento:</span> {pacienteInfo.fecha_nacimiento}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPacienteEncontrado(false);
                            setPacienteInfo(null);
                            setData('dni', '');
                            setData('paciente_id', '');
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Médico</label>
                    <select
                      value={data.medico_id}
                      onChange={(e) => setData('medico_id', e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Seleccione un médico</option>
                      {medicos.map(medico => (
                        <option key={medico.id} value={medico.id}>
                          {medico.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Fecha y Hora</label>
                    <input
                      type="datetime-local"
                      value={data.fecha_hora}
                      onChange={(e) => {
                        setData('fecha_hora', e.target.value);
                        verificarDisponibilidad();
                      }}
                      className="w-full p-2 border rounded"
                      required
                      step="1200" // 20 minutos en segundos
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Motivo</label>
                    <textarea
                      value={data.motivo}
                      onChange={(e) => setData('motivo', e.target.value)}
                      className="w-full p-2 border rounded"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        reset();
                        setPacienteEncontrado(false);
                        setPacienteInfo(null);
                        setErrorMessage('');
                      }}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={!pacienteEncontrado || processing}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                      {processing ? 'Guardando...' : 'Guardar Cita'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal para ver cita */}
        {showViewModal && selectedCita && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Detalles de la Cita</h2>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Paciente:</h4>
                    <p>{selectedCita.paciente.nombres} {selectedCita.paciente.apellido_paterno}</p>
                    <p>DNI: {selectedCita.paciente.dni}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Médico:</h4>
                    <p>{selectedCita.medico.name}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Fecha y Hora:</h4>
                    <p>{formatFecha(selectedCita.fecha_hora)}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Motivo:</h4>
                    <p>{selectedCita.motivo}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Estado:</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedCita.estado === 'programada' ? 'bg-blue-100 text-blue-800' :
                      selectedCita.estado === 'completada' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedCita.estado}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal para editar cita */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Editar Cita</h2>
                
                {errorMessage && (
                  <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    {errorMessage}
                  </div>
                )}
                
                <form onSubmit={handleUpdate}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Paciente</label>
                    <div className="p-2 bg-gray-100 rounded">
                      {pacienteInfo?.nombres} {pacienteInfo?.apellido_paterno}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Médico</label>
                    <select
                      value={data.medico_id}
                      onChange={(e) => setData('medico_id', e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Seleccione un médico</option>
                      {medicos.map(medico => (
                        <option key={medico.id} value={medico.id}>
                          {medico.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Fecha y Hora</label>
                    <input
                      type="datetime-local"
                      value={data.fecha_hora}
                      onChange={(e) => {
                        setData('fecha_hora', e.target.value);
                        verificarDisponibilidad();
                      }}
                      className="w-full p-2 border rounded"
                      required
                      step="1200" // 20 minutos en segundos
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Motivo</label>
                    <textarea
                      value={data.motivo}
                      onChange={(e) => setData('motivo', e.target.value)}
                      className="w-full p-2 border rounded"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Estado</label>
                    <select
                      value={data.estado}
                      onChange={(e) => setData('estado', e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="programada">Programada</option>
                      <option value="completada">Completada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        reset();
                        setErrorMessage('');
                      }}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                      {processing ? 'Actualizando...' : 'Actualizar Cita'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal para eliminar cita */}
        {showDeleteModal && selectedCita && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
                <p className="mb-6">¿Estás seguro de que deseas eliminar la cita de {selectedCita.paciente.nombres} programada para el {formatFecha(selectedCita.fecha_hora)}?</p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .react-calendar {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-family: inherit;
        }
        
        .react-calendar__navigation {
          display: flex;
          margin-bottom: 1em;
          padding: 0.5rem;
        }
        
        .react-calendar__navigation button {
          background: none;
          border: none;
          font-weight: 600;
          font-size: 1rem;
          min-width: 44px;
          padding: 0.5rem;
          color: #2d3748;
        }
        
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #edf2f7;
        }
        
        .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: 600;
          font-size: 0.75em;
          color: #4a5568;
          padding-bottom: 0.5em;
        }
        
        .react-calendar__month-view__days__day--neighboringMonth {
          display: none !important;
        }
        
        .react-calendar__month-view__days__day--weekend {
          color: #d53f8c;
        }
        
        .react-calendar__tile {
          padding: 0.75em 0.5em;
          height: auto;
          position: relative;
          background: white;
          border-radius: 0.25rem;
        }
        
        .react-calendar__tile:enabled:hover {
          background-color: #ebf8ff;
          transform: scale(1.02);
          z-index: 1;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .react-calendar__tile--now {
          background-color: #ebf8ff;
        }
        
        .calendar-day {
          transition: all 0.2s ease;
        }
        
        .calendar-day-current {
          background-color: white;
        }
        
        .calendar-day-current abbr {
          color: #2d3748;
          font-weight: 500;
        }
        
        .calendar-day-gray { background-color: #f7fafc; }
        .calendar-day-green { background-color: #f0fff4; }
        .calendar-day-orange { background-color: #fffaf0; }
        .calendar-day-red { background-color: #fff5f5; }
        
        .calendar-day-today::after {
          content: '';
          position: absolute;
          bottom: 0.25rem;
          left: 50%;
          transform: translateX(-50%);
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background: ${isSameMonth(new Date(), currentDate) ? '#4299e1' : '#a0aec0'};
        }
      `}</style>
    </AuthenticatedLayout>
  );
}