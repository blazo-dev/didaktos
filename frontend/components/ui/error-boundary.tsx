import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useErrorHandling } from '@/hooks/common/use-error-handling';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
  componentName?: string;
}

/**
 * Enhanced Error Boundary with automatic error reporting
 * Integrates with global error handling system
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, componentName = 'Unknown' } = this.props;
    
    // Report to our error handling system
    if (typeof window !== 'undefined') {
      // Access the error store directly for server-side compatibility
      import('@/hooks/common/use-error-handling').then(({ useErrorStore }) => {
        const store = useErrorStore.getState();
        const errorId = store.addError({
          message: error.message,
          details: JSON.stringify({ 
            stack: error.stack, 
            componentStack: errorInfo.componentStack 
          }, null, 2),
          severity: 'critical',
          context: {
            component: componentName,
            action: 'Component Render',
            route: window.location.pathname,
            userAgent: navigator.userAgent,
          },
          stack: error.stack,
        });
        
        this.setState({ errorId, errorInfo });
      });
    }

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error);
      console.error('Error Info:', errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback {...this.props} error={this.state.error} />;
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component with recovery options
 */
interface ErrorFallbackProps {
  error?: Error;
  level?: 'page' | 'section' | 'component';
  componentName?: string;
  onRetry?: () => void;
}

function ErrorFallback({ error, level = 'component', componentName = 'Component' }: ErrorFallbackProps) {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  };

  const levelConfig = {
    page: {
      title: 'Oops! Something went wrong with this page',
      description: 'We encountered an unexpected error while loading this page.',
      showHomeButton: true,
      showReloadButton: true,
      containerClass: 'min-h-screen flex items-center justify-center p-4',
      contentClass: 'max-w-lg w-full',
    },
    section: {
      title: 'Unable to load this section',
      description: 'This section encountered an error and could not be displayed.',
      showHomeButton: false,
      showReloadButton: true,
      containerClass: 'min-h-64 flex items-center justify-center p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800',
      contentClass: 'max-w-md w-full text-center',
    },
    component: {
      title: `${componentName} Error`,
      description: 'This component encountered an error and could not be displayed.',
      showHomeButton: false,
      showReloadButton: false,
      containerClass: 'p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800',
      contentClass: 'text-center',
    },
  };

  const config = levelConfig[level];

  return (
    <div className={config.containerClass}>
      <div className={config.contentClass}>
        <div className="text-red-600 dark:text-red-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {config.title}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {config.description}
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Error Details (Development)
            </summary>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs text-gray-800 dark:text-gray-200 overflow-auto max-h-32">
              {error.message}
              {error.stack && `\n\nStack trace:\n${error.stack}`}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {config.showReloadButton && (
            <button
              onClick={handleReload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          )}
          
          {config.showHomeButton && (
            <button
              onClick={handleGoHome}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Hook-based error boundary for functional components
 * Usage: const ErrorBoundaryWrapper = withErrorBoundary(MyComponent);
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

/**
 * Error notification component for displaying active errors
 */
export function ErrorNotifications() {
  const { errors, dismissError, criticalErrors, hasCriticalErrors } = useErrorHandling();

  if (!hasCriticalErrors) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {criticalErrors.map((error) => (
        <div
          key={error.id}
          className="bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-start justify-between"
        >
          <div className="flex-1 pr-3">
            <h4 className="font-semibold text-sm">Critical Error</h4>
            <p className="text-sm opacity-90">{error.message}</p>
            {error.context?.component && (
              <p className="text-xs opacity-75 mt-1">
                Component: {error.context.component}
              </p>
            )}
          </div>
          <button
            onClick={() => dismissError(error.id)}
            className="text-white hover:text-gray-200 text-lg leading-none"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}