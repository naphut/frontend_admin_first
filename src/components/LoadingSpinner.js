import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary',
  text = '',
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-gray-600',
    white: 'border-white',
    success: 'border-green-600',
    danger: 'border-red-600',
    warning: 'border-yellow-600'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full border-2 ${colorClasses[color]} border-t-transparent ${sizeClasses[size]}`}></div>
      {text && (
        <p className={`mt-3 text-sm ${
          color === 'white' ? 'text-white' : 'text-gray-600'
        }`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 shadow-xl">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

// Button loading state
export const ButtonLoader = ({ loading, children, ...props }) => (
  <button
    {...props}
    disabled={loading || props.disabled}
    className={`relative ${props.className || ''}`}
  >
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner size="small" color="white" />
      </div>
    )}
    <span className={loading ? 'opacity-0' : ''}>
      {children}
    </span>
  </button>
);

// Table loading skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="bg-white shadow rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-6 py-3 text-left">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Card loading skeleton
export const CardSkeleton = ({ count = 1 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    ))}
  </div>
);

export default LoadingSpinner;
