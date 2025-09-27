import { create } from "zustand";

interface LoadingOperation {
    id: string;
    message: string;
    progress?: number;
    startTime: number;
}

interface GlobalLoadingState {
    operations: Record<string, LoadingOperation>;

    // Actions
    startLoading: (id: string, message: string) => void;
    finishLoading: (id: string) => void;
    updateProgress: (id: string, progress: number) => void;
    clearAllLoading: () => void;

    // Computed properties
    isLoading: boolean;
    activeOperations: LoadingOperation[];
    primaryMessage: string;
    totalProgress: number;
}

/**
 * Global loading state store with Zustand
 * Manages multiple concurrent loading operations
 */
export const useGlobalLoadingStore = create<GlobalLoadingState>((set, get) => ({
    operations: {},

    startLoading: (id: string, message: string) => {
        set((state) => ({
            operations: {
                ...state.operations,
                [id]: {
                    id,
                    message,
                    startTime: Date.now(),
                    progress: undefined,
                },
            },
        }));
    },

    finishLoading: (id: string) => {
        set((state) => {
            const { [id]: removed, ...rest } = state.operations;
            return { operations: rest };
        });
    },

    updateProgress: (id: string, progress: number) => {
        set((state) => ({
            operations: {
                ...state.operations,
                [id]: {
                    ...state.operations[id],
                    progress: Math.max(0, Math.min(100, progress)),
                },
            },
        }));
    },

    clearAllLoading: () => {
        set({ operations: {} });
    },

    // Computed properties
    get isLoading() {
        return Object.keys(get().operations).length > 0;
    },

    get activeOperations() {
        return Object.values(get().operations).sort(
            (a, b) => a.startTime - b.startTime
        );
    },

    get primaryMessage() {
        const operations = get().activeOperations;
        return operations.length > 0 ? operations[0].message : "";
    },

    get totalProgress() {
        const operations = get().activeOperations;
        if (operations.length === 0) return 0;

        const withProgress = operations.filter(
            (op) => op.progress !== undefined
        );
        if (withProgress.length === 0) return -1; // Indeterminate

        return Math.round(
            withProgress.reduce((sum, op) => sum + (op.progress || 0), 0) /
                withProgress.length
        );
    },
}));

/**
 * Hook for managing global loading states
 * Provides convenient methods for starting/stopping loading operations
 */
export function useGlobalLoading() {
    const store = useGlobalLoadingStore();

    // Auto-cleanup helper that returns a cleanup function
    const startLoadingWithCleanup = (id: string, message: string) => {
        store.startLoading(id, message);
        return () => store.finishLoading(id);
    };

    // Progress tracking helper
    const startProgressLoading = (
        id: string,
        message: string,
        totalSteps: number
    ) => {
        store.startLoading(id, message);

        let currentStep = 0;
        const updateStep = () => {
            currentStep++;
            const progress = Math.round((currentStep / totalSteps) * 100);
            store.updateProgress(id, progress);
            return progress >= 100;
        };

        const finish = () => store.finishLoading(id);

        return { updateStep, finish };
    };

    return {
        // Core state
        isLoading: store.isLoading,
        activeOperations: store.activeOperations,
        primaryMessage: store.primaryMessage,
        totalProgress: store.totalProgress,

        // Actions
        startLoading: store.startLoading,
        finishLoading: store.finishLoading,
        updateProgress: store.updateProgress,
        clearAllLoading: store.clearAllLoading,

        // Helpers
        startLoadingWithCleanup,
        startProgressLoading,

        // Status checks
        isLoadingOperation: (id: string) => id in store.operations,
        hasMultipleOperations: store.activeOperations.length > 1,
        longestRunningTime:
            store.activeOperations.length > 0
                ? Date.now() -
                  Math.min(...store.activeOperations.map((op) => op.startTime))
                : 0,
    };
}

/**
 * React hook that automatically manages loading state for async operations
 * Usage: const { execute, isLoading } = useAsyncWithLoading('operation-id', 'Loading...');
 */
export function useAsyncWithLoading<T extends any[], R>(
    operationId: string,
    loadingMessage: string,
    asyncFn: (...args: T) => Promise<R>
) {
    const { startLoading, finishLoading, isLoadingOperation } =
        useGlobalLoading();

    const execute = async (...args: T): Promise<R> => {
        try {
            startLoading(operationId, loadingMessage);
            const result = await asyncFn(...args);
            return result;
        } finally {
            finishLoading(operationId);
        }
    };

    return {
        execute,
        isLoading: isLoadingOperation(operationId),
    };
}
