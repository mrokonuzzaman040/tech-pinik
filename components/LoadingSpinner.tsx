'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'gray' | 'white';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    primary: 'text-primary-500',
    gray: 'text-gray-600',
    white: 'text-white'
  };

  return (
    <div className={`inline-block animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

// Loading skeleton components for different content types
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
      <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
      <div className="bg-gray-300 h-4 rounded mb-2"></div>
      <div className="bg-gray-300 h-4 rounded w-2/3 mb-2"></div>
      <div className="bg-gray-300 h-6 rounded w-1/3"></div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="bg-gray-300 h-16 w-16 rounded-full mx-auto mb-4"></div>
      <div className="bg-gray-300 h-4 rounded w-3/4 mx-auto mb-2"></div>
      <div className="bg-gray-300 h-3 rounded w-1/2 mx-auto"></div>
    </div>
  );
}

export function SliderSkeleton() {
  return (
    <div className="relative h-64 md:h-96 bg-gray-300 rounded-lg animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gray-400 h-8 w-64 rounded mb-4 mx-auto"></div>
          <div className="bg-gray-400 h-6 w-48 rounded mb-4 mx-auto"></div>
          <div className="bg-gray-400 h-10 w-32 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  );
}