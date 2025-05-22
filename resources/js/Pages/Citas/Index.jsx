import { useState, useEffect, useMemo } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import Calendar from 'react-calendar';
import { format, parseISO, isSameDay, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-calendar/dist/Calendar.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdvancedFilters from '@/Components/AdvancedFilters';
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

//FILTRO
  const [filters, setFilters] = useState({
  sex: '',
  minAge: '',
  maxAge: '',
  startDate: '',
  endDate: '',
  procedencia: '',
  searchTerm: '',
  selectedTerms: [],
  activeFilters: {
    sex: false,
    age: false,
    dateRange: false,
    procedencia: false,
    terms: false
  }
});

const handleApplyFilters = async (appliedFilters) => {
  try {
    setLoading(true);
    setFilters(appliedFilters);
    
    // Construye los parámetros para la API
    const params = {};
    
    if (appliedFilters.activeFilters.sex && appliedFilters.sex) {
      params.sex = appliedFilters.sex;
    }
    
    if (appliedFilters.activeFilters.age) {
      if (appliedFilters.minAge) params.min_age = appliedFilters.minAge;
      if (appliedFilters.maxAge) params.max_age = appliedFilters.maxAge;
    }
    
    if (appliedFilters.activeFilters.dateRange) {
      if (appliedFilters.startDate) params.start_date = appliedFilters.startDate;
      if (appliedFilters.endDate) params.end_date = appliedFilters.endDate;
    }
    
    if (appliedFilters.activeFilters.procedencia && appliedFilters.procedencia) {
      params.procedencia = appliedFilters.procedencia;
    }
    
    if (appliedFilters.activeFilters.terms && appliedFilters.selectedTerms.length > 0) {
      params.terms = appliedFilters.selectedTerms.join(',');
    }
    
    // Hacer la petición al backend
    const response = await router.get('/citas', params, {
      preserveState: true,
      onSuccess: (props) => {
        if (props?.citas) {
          // Actualiza las citas con los resultados filtrados
          // Esto depende de cómo manejes los datos en tu backend
        }
      },
      onError: (errors) => {
        setError('Error al aplicar los filtros');
      }
    });
    
  } catch (error) {
    console.error('Error al aplicar filtros:', error);
    setError('Error al aplicar los filtros');
  } finally {
    setLoading(false);
  }
};

const handleResetFilters = async () => {
  try {
    setLoading(true);
    setFilters({
      sex: '',
      minAge: '',
      maxAge: '',
      startDate: '',
      endDate: '',
      procedencia: '',
      searchTerm: '',
      selectedTerms: [],
      activeFilters: {
        sex: false,
        age: false,
        dateRange: false,
        procedencia: false,
        terms: false
      }
    });
    
    // Recargar todas las citas sin filtros
    await router.get('/citas', {}, {
      preserveState: true,
      onSuccess: (props) => {
        if (props?.citas) {
          // Actualiza las citas con todos los resultados
        }
      }
    });
    
  } catch (error) {
    console.error('Error al resetear filtros:', error);
    setError('Error al resetear los filtros');
  } finally {
    setLoading(false);
  }
};

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
              // Filtrar datos antiguos del mismo mes
              const filtered = prev.filter(item => {
                if (!item?.date) return false;
                const itemDate = typeof item.date === 'string' ? parseISO(item.date) : item.date;
                return !(
                  itemDate.getFullYear() === year && 
                  itemDate.getMonth() + 1 === month
                );
              });
              return [...filtered, ...props.calendarData];
            });
            setLoadedMonths(prev => new Set(prev).add(monthKey));
          }
        },
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
      const dayData = calendarData.find(d => {
        if (!d?.date) return false;
        const itemDate = typeof d.date === 'string' ? parseISO(d.date) : d.date;
        return format(itemDate, 'yyyy-MM-dd') === dateStr;
      });
      
      // Si no encontramos datos, buscar en las citas existentes
      if (!dayData || dayData.citas_count === 0) {
        const citasDelDia = citas.filter(cita => {
          const citaDate = new Date(cita.fecha_hora);
          return format(citaDate, 'yyyy-MM-dd') === dateStr;
        });
        
        if (citasDelDia.length > 0) {
          return { citas_count: citasDelDia.length, citas: citasDelDia };
        }
      }
      
      return dayData || { citas_count: 0, citas: [] };
    } catch (err) {
      console.error('Error processing day data:', err);
      return { citas_count: 0, citas: [] };
    }
  };
}, [calendarData, citas]);

  // Contenido de los días
const tileContent = useMemo(() => ({ date, view }) => {
  if (view === 'month') {
    const dayData = getDayData(date);
    const count = dayData.citas_count || 0;
    const isFull = count >= 16;
    
    return (
      <div className={`text-xs mt-1 text-center ${isFull ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
        {count}/16
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
    setPacienteEncontrado(false);
    setPacienteInfo(null);
    setErrorMessage('');
    setShowModal(true);
  };

  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  // Función para buscar paciente por DNI
  const [buscandoPaciente, setBuscandoPaciente] = useState(false);

const buscarPaciente = async () => {
  if (!data.dni || data.dni.length !== 8) {
    setErrorMessage('El DNI debe tener exactamente 8 dígitos');
    return;
  }

  setBuscandoPaciente(true);
  setErrorMessage('');
  setBusquedaRealizada(true); // <-- Añade esta línea
  
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
      setErrorMessage('Paciente no encontrado');
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
  setErrorMessage('');
  
  // Validaciones básicas de fecha
  const now = new Date();
  const selectedDate = new Date(data.fecha_hora);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const twoMonthsLater = new Date(today);
  twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);
  
  const selectedDateOnly = new Date(
    selectedDate.getFullYear(), 
    selectedDate.getMonth(), 
    selectedDate.getDate()
  );

  if (selectedDateOnly < today) {
    return {
      isValid: false,
      adjustedTime: null,
      message: 'No se pueden programar citas para fechas pasadas'
    };
  }

  if (selectedDateOnly > twoMonthsLater) {
    return {
      isValid: false,
      adjustedTime: null,
      message: 'Solo se pueden programar citas hasta 2 meses en el futuro'
    };
  }

  if (selectedDateOnly.getTime() === today.getTime() && selectedDate < now) {
    return {
      isValid: false,
      adjustedTime: null,
      message: 'Para citas de hoy, la hora debe ser mayor a la hora actual'
    };
  }

  // Resto de validaciones (médico, disponibilidad, etc.)
  if (!data.fecha_hora || !data.medico_id) {
    return { isValid: true, adjustedTime: null, message: '' };
  }

  // Validar médico seleccionado
  if (!data.medico_id) {
    return { isValid: true, adjustedTime: null, message: '' };
  }

  // Filtrar citas del mismo médico en el mismo día
  const citasMismoDiaMismoMedico = citas.filter(cita => {
    try {
      const citaFechaHora = new Date(cita.fecha_hora);
      if (isNaN(citaFechaHora.getTime())) return false;
      
      return (
        cita.medico_id === data.medico_id &&
        format(citaFechaHora, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') &&
        cita.id !== (selectedCita?.id || data.id)
      );
    } catch (err) {
      console.error('Error procesando fecha de cita:', err);
      return false;
    }
  });

  // Validar límite de citas por día
  if (citasMismoDiaMismoMedico.length >= 16) {
    return { 
      isValid: false, 
      adjustedTime: null,
      message: 'Se ha alcanzado el límite de 16 citas para este médico en el día seleccionado'
    };
  }

  // Validar diferencia de 20 minutos (sin importar el minuto exacto)
  const citasCercanas = citasMismoDiaMismoMedico.filter(cita => {
    try {
      const citaFechaHora = new Date(cita.fecha_hora);
      const diferenciaMinutos = Math.abs((selectedDate - citaFechaHora) / (1000 * 60));
      return diferenciaMinutos < 20;
    } catch (err) {
      console.error('Error calculando diferencia:', err);
      return false;
    }
  });

  if (citasCercanas.length > 0) {
    // Ordenar citas cercanas por proximidad
    citasCercanas.sort((a, b) => {
      const diffA = Math.abs(new Date(a.fecha_hora) - selectedDate);
      const diffB = Math.abs(new Date(b.fecha_hora) - selectedDate);
      return diffA - diffB;
    });

    const citaMasCercana = citasCercanas[0];
    const citaFechaHora = new Date(citaMasCercana.fecha_hora);
    const diferencia = Math.abs((selectedDate - citaFechaHora) / (1000 * 60));
    
    // Calcular próximo horario disponible (20 minutos después de la cita más cercana)
    let nextAvailableTime = new Date(citaFechaHora);
    nextAvailableTime.setMinutes(nextAvailableTime.getMinutes() + 20);
    
    return { 
      isValid: false, 
      adjustedTime: format(nextAvailableTime, "yyyy-MM-dd'T'HH:mm"),
      message: `Debe haber al menos 20 minutos entre citas. La cita más cercana es a ${format(citaFechaHora, 'HH:mm')} (faltan ${Math.floor(20 - diferencia)} minutos). ¿Quieres cambiar a ${format(nextAvailableTime, 'HH:mm')}?`
    };
  }
  
  return { isValid: true, adjustedTime: null, message: '' };
};

const formatDateTimeWithoutSeconds = (dateTimeString) => {
  if (!dateTimeString) return '';
  
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) return dateTimeString;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
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

  useEffect(() => {
  if (!showModal && !showEditModal) {
    setErrorMessage('');
  }
  }, [showModal, showEditModal]);


  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!pacienteEncontrado) {
    setErrorMessage('Debe buscar y seleccionar un paciente válido');
    return;
  }
  
  // Primero obtener el resultado de la validación
  const validation = verificarDisponibilidad();
  
  // Luego usar este resultado
  if (!validation.isValid) {
    if (validation.adjustedTime) {
      setErrorMessage(
        <div>
          {validation.message}
          <button 
            onClick={() => {
              setData('fecha_hora', validation.adjustedTime);
              setErrorMessage('');
            }}
            className="ml-2 text-blue-600 underline"
          >
            Ajustar automáticamente
          </button>
        </div>
      );
    } else {
      setErrorMessage(validation.message);
    }
    return;
  }

  try {
    await post(route('citas.store'), {
      onSuccess: () => {
        reset();
        setShowModal(false);
        setPacienteEncontrado(false);
        setPacienteInfo(null);
        setErrorMessage('');
      },
      onError: (errors) => {
        if (errors.fecha_hora) {
          setErrorMessage(errors.fecha_hora);
        } else if (errors.limite) {
          setErrorMessage(errors.limite);
        } else {
          setErrorMessage('Error al crear la cita. Por favor verifique los datos.');
        }
      }
    });
  } catch (err) {
    console.error('Error al enviar formulario:', err);
    setErrorMessage('Error de conexión con el servidor');
  }
};

  const handleUpdate = (e) => {
    e.preventDefault();
    
    // Validar disponibilidad
    const validation = verificarDisponibilidad();
    
    if (!validation.isValid) {
      if (validation.adjustedTime) {
        // Mostrar mensaje con opción de ajustar automáticamente
        setErrorMessage(
          <div>
            {validation.message}
            <button 
              onClick={() => {
                setData('fecha_hora', validation.adjustedTime);
                setErrorMessage(''); // Limpiar el mensaje después de ajustar
              }}
              className="ml-2 text-blue-600 underline"
            >
              Ajustar automáticamente
            </button>
          </div>
        );
      } else {
        setErrorMessage(validation.message || 'Error en la validación');
      }
      return;
    }

    put(route('citas.update', selectedCita.id), {
      onSuccess: () => {
        reset();
        setShowEditModal(false);
        setSelectedCita(null);
        
        // Forzar recarga del mes actual
        const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
        setLoadedMonths(prev => new Set(prev).delete(monthKey));
        loadMonthData(currentDate);
      },
    });
  };

  const handleDelete = () => {
    destroy(route('citas.destroy', selectedCita.id), {
      onSuccess: () => {
        setShowDeleteModal(false);
        setSelectedCita(null);
        
        // Forzar recarga del mes actual
        const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
        setLoadedMonths(prev => new Set(prev).delete(monthKey));
        loadMonthData(currentDate);
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
              minDate={new Date()} // No permite seleccionar fechas anteriores a hoy
              maxDate={new Date(new Date().setMonth(new Date().getMonth() + 2))} // Permite hasta 2 meses en el futuro
            />
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <div className="mb-6">
              <AdvancedFilters
                initialFilters={filters}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
                disabledSections={{
                  all: activeTab === 'calendario',
                  terms: true // Deshabilitar en vista de calendario
                }}
                exportEnabled={activeTab === 'lista'}
                showActiveFilters={true}
              />
            </div>
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Nueva Cita</h2>
                
                {errorMessage && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-red-800">No se puede programar la cita</h4>
                        <div className="mt-1 text-red-700">
                          {typeof errorMessage === 'string' ? (
                            <p>{errorMessage}</p>
                          ) : (
                            errorMessage
                          )}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setErrorMessage('')}
                      className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Entendido
                    </button>
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

                  {pacienteEncontrado && pacienteInfo ? (
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
                  ) : (
                    busquedaRealizada && data.dni && data.dni.length === 8 && !pacienteEncontrado && !buscandoPaciente && (
                      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-yellow-800">Paciente no encontrado</h4>
                            <p className="text-gray-800 mt-2">
                              No se encontró un paciente con DNI {data.dni} en el sistema.
                            </p>
                            <div className="mt-4">
                              <a
                                href={route('pacientes.create', { dni: data.dni })}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block"
                              >
                                Registrar Nuevo Paciente
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  <div className='flex justify-center gap-2'>
                    <div className="mb-4 w-1/2">
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

                    <div className="mb-4 w-1/2">
                      <label className="block text-gray-700 mb-2">Fecha y Hora</label>
                      <input
  type="datetime-local"
  value={formatDateTimeWithoutSeconds(data.fecha_hora)}
  onChange={(e) => {
    const newDate = e.target.value;
    setData('fecha_hora', newDate);
    
    // Validación en tiempo real
    const now = new Date();
    const selectedDate = new Date(newDate);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const twoMonthsLater = new Date(today);
    twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);
    
    const selectedDateOnly = new Date(
      selectedDate.getFullYear(), 
      selectedDate.getMonth(), 
      selectedDate.getDate()
    );

    if (selectedDateOnly < today) {
      setErrorMessage('No se pueden programar citas para fechas pasadas');
      return;
    }

    if (selectedDateOnly > twoMonthsLater) {
      setErrorMessage('Solo se pueden programar citas hasta 2 meses en el futuro');
      return;
    }

                          // Validación de disponibilidad con médico
                          if (data.medico_id) {
                            const validation = verificarDisponibilidad();
                            if (!validation.isValid) {
                              setErrorMessage(validation.message);
                            } else {
                              setErrorMessage('');
                            }
                          }
                        }}
                          className="w-full p-2 border rounded"
                          required
                          step="60"
                          min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                          max={format(new Date(new Date().setMonth(new Date().getMonth() + 2)), "yyyy-MM-dd'T'23:59")}
                        />
                    </div>
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
                      onChange={(e) => {
                        setData('medico_id', e.target.value);
                        // Limpiar error al cambiar
                        setErrorMessage('');
                        // Validar solo si hay fecha seleccionada
                        if (data.fecha_hora) {
                          verificarDisponibilidad();
                        }
                      }}
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

                  <div className="mb-4 w-1/2">
                    <label className="block text-gray-700 mb-2">Fecha y Hora</label>
                    <input
                      type="datetime-local"
                      value={formatDateTimeWithoutSeconds(data.fecha_hora)}
                      onChange={(e) => {
                        setData('fecha_hora', e.target.value);
                                            
                        // Validación en tiempo real si hay médico seleccionado
                        if (data.medico_id) {
                          const validation = verificarDisponibilidad();
                          if (!validation.isValid) {
                            setErrorMessage(validation.message);
                          } else {
                            setErrorMessage('');
                          }
                        }
                      }}
                      className="w-full p-2 border rounded"
                      required
                      step="60"
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