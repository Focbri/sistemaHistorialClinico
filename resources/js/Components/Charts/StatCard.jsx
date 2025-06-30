// En Components/Charts/StatCard.jsx
import React from 'react';

const trendIcons = {
  up: (
    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  ),
  down: (
    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  ),
  stable: (
    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
    </svg>
  ),
  none: null
};

export default function StatCard({ title, value, icon, trend = 'none', highlight = 'normal', onClick, clickable = false, compact = false }) {
  // Definir las clases base del contenedor
  const baseClasses = 'bg-white rounded-lg shadow overflow-hidden';
  
  // Clases para el highlight
  const highlightClasses = {
    normal: '',
    warning: 'border-l-4 border-yellow-400',
    danger: 'border-l-4 border-red-500',
    success: 'border-l-4 border-green-500',
    citas: 'bg-indigo-150 border-l-4 border-indigo-400'
  };
  
  // Clases para tamaño compacto
  const sizeClasses = compact ? 'p-3' : 'p-5';
  
  // Combinar todas las clases
  const containerClasses = `${baseClasses} ${highlightClasses[highlight]} ${sizeClasses}`;

  return (
    <div 
      onClick={onClick} 
      className={`${containerClasses} ${clickable ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
    >
      <div className={compact ? 'p-2' : 'p-4'}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="ml-3 w-0 flex-1">
            <dl>
              <dt className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-gray-500 truncate`}>
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className={`${compact ? 'text-lg' : 'text-2xl'} font-semibold text-gray-900`}>
                  {value}
                </div>
                {trend !== 'none' && (
                  <div className="ml-1 flex items-baseline text-sm font-semibold">
                    {trendIcons[trend]}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}