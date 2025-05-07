import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links, only = [], ...props }) {
    // Si no hay links o no es un array, no mostrar nada
    if (!links || !Array.isArray(links)) {
        return null;
    }

    // Solo mostrar paginación si hay más de un link (incluyendo anterior/siguiente)
    if (links.length <= 1) {
        return null;
    }

    return (
        <nav className="flex items-center justify-between px-4 sm:px-0 mt-4">
            {/* Botón "Anterior" */}
            <div className="flex flex-1 w-0 -mt-px">
                {links[0].url && (
                    <Link
                        href={links[0].url}
                        preserveScroll
                        preserveState
                        only={only}
                        className="inline-flex items-center pt-4 pr-1 text-sm font-medium text-gray-500 border-t-2 border-transparent hover:text-gray-700 hover:border-gray-300"
                    >
                        &laquo; Anterior
                    </Link>
                )}
            </div>

            {/* Números de página */}
            <div className="hidden md:-mt-px md:flex">
                {links.slice(1, -1).map((link, index) => (
                    <Link
                        key={index}
                        href={link.url || '#'}
                        preserveScroll
                        preserveState
                        only={only}
                        className={`inline-flex items-center px-4 pt-4 text-sm font-medium border-t-2 ${
                            link.active
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            {/* Botón "Siguiente" */}
            <div className="flex justify-end flex-1 w-0 -mt-px">
                {links[links.length - 1].url && (
                    <Link
                        href={links[links.length - 1].url}
                        preserveScroll
                        preserveState
                        only={only}
                        className="inline-flex items-center pt-4 pl-1 text-sm font-medium text-gray-500 border-t-2 border-transparent hover:text-gray-700 hover:border-gray-300"
                    >
                        Siguiente &raquo;
                    </Link>
                )}
            </div>
        </nav>
    );
}