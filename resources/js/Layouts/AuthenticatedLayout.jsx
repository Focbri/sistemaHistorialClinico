import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { flash } = usePage().props;
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    useEffect(() => {
        if (flash.success) {
            setNotificationMessage(flash.success);
            setShowNotification(true);
            
            const timer = setTimeout(() => {
                setShowNotification(false);
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [flash]);
    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            {/* Notificación Flash */}
            {showNotification && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center">
                        <span>{notificationMessage}</span>
                        <button 
                            onClick={() => setShowNotification(false)}
                            className="ml-4 text-white hover:text-gray-200"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}

            <nav className=" bg-[#005B96]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between 2xl:h-24">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className='flex items-center h-14 2xl:h-20'>
                                    <ApplicationLogo />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('inicio')}
                                    active={route().current('inicio')}
                                >
                                    Inicio
                                </NavLink>
                                <NavLink
                                    href={route('pacientes.index')}
                                    active={route().current('pacientes.index')}
                                >
                                    Pacientes
                                </NavLink>
                                <NavLink
                                    href={route('consultas.index')}
                                    active={route().current('consultas.index')}
                                >
                                    Consultas
                                </NavLink>
                                <NavLink
                                    href={route('citas.index')}
                                    active={route().current('citas.index')}
                                >
                                    Citas
                                </NavLink>
                                <NavLink
                                    href={route('farmacos.index')}
                                    active={route().current('farmacos.index')}
                                >
                                    Farmacia
                                </NavLink>
                                {(user.role === 'admin' || user.role === 'medico') && (
                                <NavLink
                                    href={route('dashboard.index')}
                                    active={route().current('dashboard.index')}
                                >
                                    Reportes
                                </NavLink>
                                )}
                                {/* Mostrar opción de "Crear Usuario" solo para administradores */}
                                {(user.role === 'admin' || user.role === 'root') && (
                                    <NavLink
                                        href={route('admin.users.index')}
                                        active={route().current('admin.users.index')}
                                    >
                                        Crear Usuario
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2 ">
                        <ResponsiveNavLink
                            href={route('inicio')}
                            active={route().current('inicio')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('pacientes.index')}
                            active={route().current('pacientes.index')}
                        >
                            Pacientes
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('consultas.index')}
                            active={route().current('consultas.index')}
                        >
                            Consultas
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('citas.index')}
                            active={route().current('citas.index')}
                        >
                            Citas
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('farmacos.index')}
                            active={route().current('farmacos.index')}
                        >
                            Farmacia
                        </ResponsiveNavLink>
                        {(user.role === 'admin' || user.role === 'medico') && (
                        <ResponsiveNavLink
                            href={route('dashboard.index')}
                            active={route().current('dashboard.index')}
                        >
                            Reportes
                        </ResponsiveNavLink>
                        )}
                        {/* Mostrar opción de "Crear Usuario" solo para administradores */}
                        {(user.role === 'admin' || user.role === 'medico') && (
                            <ResponsiveNavLink
                                href={route('admin.users.index')}
                                active={route().current('admin.users.index')}
                            >
                                Crear Usuario
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="pb-1">                        

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}