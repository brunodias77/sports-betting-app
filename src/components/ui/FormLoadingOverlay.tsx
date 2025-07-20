import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export interface FormLoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
  className?: string;
}

const FormLoadingOverlay: React.FC<FormLoadingOverlayProps> = ({
  isLoading,
  message = 'Processando...',
  children,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center space-y-3">
            <LoadingSpinner size="md" />
            <p className="text-sm text-gray-600 font-medium">
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormLoadingOverlay;