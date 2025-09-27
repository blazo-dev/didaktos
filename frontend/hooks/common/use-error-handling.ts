import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface AppError {
    id: string;
    message: string;
    details?: string;
    code?: string;
    timestamp: number;
    severity: "low" | "medium" | "high" | "critical";
    context?: {
        component?: string;
        action?: string;
        userId?: string;
        route?: string;
        userAgent?: string;
    };
    stack?: string;
    recovered?: boolean;
}

interface ErrorState {
    errors: AppError[];
    dismissedErrors: Set<string>;

    // Actions
    addError: (error: Omit<AppError, "id" | "timestamp">) => string;
    dismissError: (errorId: string) => void;
    clearAllErrors: () => void;
    markErrorRecovered: (errorId: string) => void;

    // Selectors
    activeErrors: AppError[];
    criticalErrors: AppError[];
    hasActiveErrors: boolean;
    hasCriticalErrors: boolean;
    errorCount: number;
}

/**
 * Global error state management with Zustand
 * Centralized error tracking and recovery
 */
export const useErrorStore = create<ErrorState>()(
    devtools(
        (set, get) => ({
            errors: [],
            dismissedErrors: new Set(),

            addError: (errorData) => {
                const errorId = `error_${Date.now()}_${Math.random()
                    .toString(36)
                    .substr(2, 9)}`;
                const error: AppError = {
                    ...errorData,
                    id: errorId,
                    timestamp: Date.now(),
                };

                set((state) => ({
                    errors: [error, ...state.errors].slice(0, 50), // Keep last 50 errors
                }));

                // Auto-dismiss low severity errors after 10 seconds
                if (error.severity === "low") {
                    setTimeout(() => {
                        get().dismissError(errorId);
                    }, 10000);
                }

                return errorId;
            },

            dismissError: (errorId) => {
                set((state) => ({
                    dismissedErrors: new Set([
                        ...state.dismissedErrors,
                        errorId,
                    ]),
                }));
            },

            clearAllErrors: () => {
                set({ errors: [], dismissedErrors: new Set() });
            },

            markErrorRecovered: (errorId) => {
                set((state) => ({
                    errors: state.errors.map((error) =>
                        error.id === errorId
                            ? { ...error, recovered: true }
                            : error
                    ),
                }));
            },

            // Computed selectors
            get activeErrors() {
                const state = get();
                return state.errors.filter(
                    (error) => !state.dismissedErrors.has(error.id)
                );
            },

            get criticalErrors() {
                return get().activeErrors.filter(
                    (error) => error.severity === "critical"
                );
            },

            get hasActiveErrors() {
                return get().activeErrors.length > 0;
            },

            get hasCriticalErrors() {
                return get().criticalErrors.length > 0;
            },

            get errorCount() {
                return get().activeErrors.length;
            },
        }),
        { name: "error-store" }
    )
);

/**
 * Hook for error handling and reporting
 * Provides convenient methods for error management
 */
export function useErrorHandling() {
    const store = useErrorStore();

    // Enhanced error reporting with automatic context detection
    const reportError = (
        error: Error | string,
        options: {
            severity?: AppError["severity"];
            component?: string;
            action?: string;
            context?: Partial<AppError["context"]>;
            recovery?: () => void;
        } = {}
    ) => {
        const errorMessage = typeof error === "string" ? error : error.message;
        const errorStack =
            typeof error === "object" && error.stack ? error.stack : undefined;

        // Auto-detect context if not provided
        const autoContext = {
            route:
                typeof window !== "undefined"
                    ? window.location.pathname
                    : undefined,
            userAgent:
                typeof navigator !== "undefined"
                    ? navigator.userAgent
                    : undefined,
            ...options.context,
        };

        const errorId = store.addError({
            message: errorMessage,
            details:
                typeof error === "object"
                    ? JSON.stringify(error, null, 2)
                    : undefined,
            stack: errorStack,
            severity: options.severity || "medium",
            context: {
                component: options.component,
                action: options.action,
                ...autoContext,
            },
        });

        // Execute recovery function if provided
        if (options.recovery) {
            try {
                options.recovery();
                store.markErrorRecovered(errorId);
            } catch (recoveryError) {
                console.error("Error recovery failed:", recoveryError);
            }
        }

        return errorId;
    };

    // Specialized error reporting methods
    const reportApiError = (
        error: any,
        endpoint: string,
        method: string = "GET"
    ) => {
        return reportError(error, {
            severity: "high",
            component: "API",
            action: `${method} ${endpoint}`,
        });
    };

    const reportFormError = (
        error: any,
        formName: string,
        fieldName?: string
    ) => {
        return reportError(error, {
            severity: "medium",
            component: "Form",
            action: `Submit ${formName}${fieldName ? ` - ${fieldName}` : ""}`,
        });
    };

    const reportCriticalError = (
        error: any,
        component: string,
        action: string
    ) => {
        return reportError(error, {
            severity: "critical",
            component,
            action,
        });
    };

    // Error boundary integration
    const handleErrorBoundary = (
        error: Error,
        errorInfo: { componentStack: string }
    ) => {
        return reportError(error, {
            severity: "critical",
            component: "ErrorBoundary",
            action: "Component Render Error",
        });
    };

    return {
        // Core state
        errors: store.activeErrors,
        criticalErrors: store.criticalErrors,
        hasActiveErrors: store.hasActiveErrors,
        hasCriticalErrors: store.hasCriticalErrors,
        errorCount: store.errorCount,

        // Actions
        reportError,
        reportApiError,
        reportFormError,
        reportCriticalError,
        handleErrorBoundary,
        dismissError: store.dismissError,
        clearAllErrors: store.clearAllErrors,
        markErrorRecovered: store.markErrorRecovered,

        // Helpers
        getErrorsBySeverity: (severity: AppError["severity"]) =>
            store.activeErrors.filter((error) => error.severity === severity),
        getErrorsByComponent: (component: string) =>
            store.activeErrors.filter(
                (error) => error.context?.component === component
            ),
        getMostRecentError: () => store.activeErrors[0] || null,
        getOldestUnresolvedError: () =>
            store.activeErrors[store.activeErrors.length - 1] || null,
    };
}

/**
 * React hook for wrapping async operations with error handling
 * Automatically reports errors with proper context
 */
export function useAsyncWithErrorHandling<T extends any[], R>(
    operationName: string,
    component: string,
    asyncFn: (...args: T) => Promise<R>
) {
    const { reportError, markErrorRecovered } = useErrorHandling();

    const executeWithErrorHandling = async (...args: T): Promise<R> => {
        try {
            const result = await asyncFn(...args);
            return result;
        } catch (error) {
            const errorId = reportError(error as Error, {
                severity: "high",
                component,
                action: operationName,
                recovery: () => {
                    // Implement retry logic here if needed
                    console.log(
                        `Attempting recovery for operation: ${operationName}`
                    );
                },
            });

            // Re-throw so calling code can handle it appropriately
            throw error;
        }
    };

    return {
        execute: executeWithErrorHandling,
        reportError: (error: Error | string) =>
            reportError(error, { component, action: operationName }),
    };
}
