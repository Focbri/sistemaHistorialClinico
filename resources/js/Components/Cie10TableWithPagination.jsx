import { useState, useEffect } from 'react';

export default function Cie10TableWithPagination({ topCie10, mobileMode = false }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPage = mobileMode ? 5 : 8;
  
  // Detectar si es móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const entries = Object.entries(topCie10);
  const totalPages = Math.ceil(entries.length / itemsPerPage);
  const paginatedEntries = entries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={`px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${mobileMode ? 'w-3/4' : ''}`}>
                Código
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Frecuencia
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedEntries.map(([code, count]) => (
              <tr key={code} className="hover:bg-gray-50">
                <td 
                  className={`px-3 py-2 text-sm font-medium text-gray-900 ${
                    isMobile || mobileMode ? 'whitespace-normal break-all' : 'whitespace-nowrap'
                  }`}
                >
                  {code}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {count}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className={`flex ${mobileMode ? 'flex-col' : 'justify-between'} items-center mt-4 space-y-2 ${!mobileMode ? 'space-y-0' : ''}`}>
          <div className={`flex ${mobileMode ? 'justify-between w-full' : ''} items-center space-x-4`}>
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 ${
                mobileMode ? 'flex-1' : ''
              }`}
            >
              Anterior
            </button>
            {!mobileMode && (
              <span className="text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
            )}
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 ${
                mobileMode ? 'flex-1' : ''
              }`}
            >
              Siguiente
            </button>
          </div>
          {mobileMode && (
            <span className="text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
          )}
        </div>
      )}
    </div>
  );
}