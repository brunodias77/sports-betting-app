import React from 'react';
import Button from './Button';

export interface ErrorFallbackProps {
  error?: Error | string | null;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onReset?: () => void;
  showReload?: boolean;
  className?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  title = 'Algo deu errado',
  message,
  onRetry,
  onReset,
  showReload = true,
  className = '',
}) => {
  const errorMessage = typeof error === 'string' ? error : error?.message;
  const displayMessage = message || errorMessage || 'Ocorreu um erro inesperado. Tente novamente.';

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className={`flex flex-col items-center justify-center py-8 px-4 space-y-4 ${className}`}>
      <div className="text-center max-w-md">
        <div className="w-12 h-12 mx-auto mb-4 text-danger-500">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {displayMessage}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="primary"
              className="w-full sm:w-auto"
            >
              Tentar novamente
            </Button>
          )}
          
          {onReset && (
            <Button
              onClick={onReset}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Voltar
            </Button>
          )}
          
          {showReload && !onRetry && (
            <Button
              onClick={handleReload}
              variant="primary"
              className="w-full sm:w-auto"
            >
              Recarregar página
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;