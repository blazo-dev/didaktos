'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Card className="p-6 m-4 border-destructive/50 bg-destructive/5">
                    <div className="flex items-center space-x-3 mb-4">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                        <h3 className="text-lg font-semibold text-destructive">
                            Something went wrong
                        </h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                        We encountered an unexpected error. You can try refreshing the page or contact support if the problem persists.
                    </p>

                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details className="mb-4 p-3 bg-muted rounded-md">
                            <summary className="cursor-pointer text-sm font-medium">
                                Error Details (Development)
                            </summary>
                            <pre className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
                                {this.state.error.stack}
                            </pre>
                        </details>
                    )}

                    <div className="flex space-x-2">
                        <Button variant="outline" onClick={this.handleReset}>
                            Try Again
                        </Button>
                        <Button variant="secondary" onClick={this.handleReload}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reload Page
                        </Button>
                    </div>
                </Card>
            );
        }

        return this.props.children;
    }
}

// Hook version for functional components that need error boundaries
export function withErrorBoundary<T extends {}>(
    Component: React.ComponentType<T>,
    errorFallback?: ReactNode,
    onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
    const WrappedComponent = (props: T) => (
        <ErrorBoundary fallback={errorFallback} onError={onError}>
            <Component {...props} />
        </ErrorBoundary>
    );
    
    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
    
    return WrappedComponent;
}