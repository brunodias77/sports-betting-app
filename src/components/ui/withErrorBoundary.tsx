import React from 'react';
import type { ComponentType, ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import ErrorFallback from './ErrorFallback';
import type { ErrorFallbackProps } from './ErrorFallback';

export interface WithErrorBoundaryOptions {
  fallback?: ReactNode;
  fallbackProps?: Partial<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
) {
  const WrappedComponent = (props: P) => {
    const { fallback, fallbackProps, onError } = options;

    const defaultFallback = (
      <ErrorFallback
        title="Erro no componente"
        message="Este componente encontrou um erro. Tente recarregar a página."
        showReload={true}
        {...fallbackProps}
      />
    );

    return (
      <ErrorBoundary
        fallback={fallback || defaultFallback}
        onError={onError}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  // Preserve component name for debugging
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

export default withErrorBoundary;