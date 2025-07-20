import { useCallback, useState } from 'react';
import { useBettingStore } from '../stores/bettingStore';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export interface UseErrorHandlerReturn {
  error: string | null;
  hasError: boolean;
  handleError: (error: unknown, options?: ErrorHandlerOptions) => void;
  clearError: () => void;
  retryWithErrorHandling: <T>(
    asyncFn: () => Promise<T>,
    options?: ErrorHandlerOptions
  ) => Promise<T | null>;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<string | null>(null);
  const { setError: setStoreError } = useBettingStore();

  const handleError = useCallback((
    error: unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = false,
      logError = true,
      fallbackMessage = 'Ocorreu um erro inesperado'
    } = options;

    let errorMessage: string;

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      errorMessage = fallbackMessage;
    }

    // Set local error state
    setError(errorMessage);

    // Log error if enabled
    if (logError) {
      console.error('Error handled by useErrorHandler:', error);
    }

    // Show toast notification if enabled
    if (showToast) {
      // This would integrate with a toast system like react-hot-toast
      // For now, we'll just log it
      console.warn('Toast notification would show:', errorMessage);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retryWithErrorHandling = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> => {
    try {
      clearError();
      const result = await asyncFn();
      return result;
    } catch (error) {
      handleError(error, options);
      return null;
    }
  }, [handleError, clearError]);

  return {
    error,
    hasError: error !== null,
    handleError,
    clearError,
    retryWithErrorHandling,
  };
};

export default useErrorHandler;