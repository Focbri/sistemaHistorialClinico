import logoVO from '../../assets/logoVisualO.jpeg';
import Footer from '@/Components/Footer';
import { router } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import SelectInput from '@/Components/SelectInput';
import { Head, Link, useForm } from '@inertiajs/react';
import doctorImage from '../../assets/oftalmologo.jpg';

export default function ({ auth, status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        sede: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onSuccess: () => {
                sessionStorage.setItem('justLoggedIn', 'true');
            },
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar Sesión" />
            
            {/* Contenedor principal responsive */}
            <div className="flex flex-col md:flex-row min-h-[600px]">
                {/* Sección izquierda - Imagen */}
                <div className="md:w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
                    <div className="max-w-lg w-full">
                        <div className="mb-8 text-center md:text-left">
                            <h1 className="text-3xl text-center text-blue-900">Sistema de Historias Clínicas</h1>
                        </div>
                        <div className="rounded-xl overflow-hidden shadow-2xl">
                            <img 
                                src={doctorImage} 
                                alt="Médico oftalmólogo" 
                                className="w-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Sección derecha - Formulario */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-4 bg-white">
                    <div className="w-full max-w-md mx-auto">
                        <div className="flex justify-center">
                            <img 
                                src={logoVO} 
                                alt="Logo Visual Ophthalmics" 
                                className="h-14 md:h-20"
                            />
                        </div>

                        {status && (
                            <div className="mb-4 p-3 rounded-md bg-green-50 text-green-700 text-sm text-center">
                                {status}
                            </div>
                        )}

                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <InputLabel htmlFor="sede" value="Sede" className="block text-sm font-medium text-gray-700 mb-1" />
                                <SelectInput
                                    id="sede"
                                    name="sede"
                                    value={data.sede}
                                    className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    onChange={(e) => setData('sede', e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione una sede</option>
                                    <option value="ate">Ate</option>
                                    <option value="pueblo_libre">Pueblo Libre</option>
                                    <option value="abubillas">Abubillas</option>
                                </SelectInput>
                                <InputError message={errors.sede} className="mt-1 text-sm text-red-600" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Correo electrónico" className="block text-sm font-medium text-gray-700 mb-1" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    autoComplete="email"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-1 text-sm text-red-600" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Contraseña" className="block text-sm font-medium text-gray-700 mb-1" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-1 text-sm text-red-600" />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ms-2 text-sm text-gray-600">
                                        Recordar sesión
                                    </span>
                                </label>

                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>

                            <div className='w-full flex justify-center'>
                                <PrimaryButton 
                                    className="max-w-60 justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    disabled={processing}
                                >
                                    Iniciar Sesión
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}