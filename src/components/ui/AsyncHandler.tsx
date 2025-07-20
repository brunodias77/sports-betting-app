import React from 'react';
import type { ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorFallback from './ErrorFallback';

export interface AsyncHandlerProps {
  loading?: boolean;
  error?: string | Error | null;
  children: ReactNode;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  onRetry?: () => void;
  emptyState?: ReactNode;
  isEmpty?: boolean;
  className?: string;
}

const AsyncHandler: React.FC<AsyncHandlerProps> = ({
  loading = false,
  error = null,
  children,
  loadingComponent,
  errorComponent,
  onRetry,
  emptyState,
  isEmpty = false,
  className = '',
}) => {
  // Loading state
  if (loading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <div className={`flex flex-col items-center justify-center py-8 space-y-4 ${className}`}>
        <LoadingSpinner />
        <p className="text-gray-600 text-center">Carregando...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }

    return (
      <ErrorFallback
        error={error}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  // Empty state
  if (isEmpty && emptyState) {
    return <>{emptyState}</>;
  }

  // Success state - render children
  return <>{children}</>;
};

export default AsyncHandler;