import { useErrorHandling } from "@/hooks/common/use-error-handling";
import { useGlobalLoading } from "@/hooks/common/use-global-loading";
import { useOptimisticUpdates } from "@/hooks/common/use-optimistic-updates";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export interface EnhancedFormMutationOptions<TData, TVariables> {
    createFn?: (variables: TVariables) => Promise<TData>;
    updateFn?: (variables: TVariables) => Promise<TData>;
    deleteFn?: (id: string) => Promise<void>;

    // Query invalidation
    queryKeys?: string[][];

    // Optimistic updates
    optimisticType?: string;
    getOptimisticData?: (variables: TVariables) => TData;
    getOriginalData?: (variables: TVariables) => TData;

    // Loading and error handling
    loadingMessage?: string;
    componentName?: string;

    // Success/error callbacks
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
}

/**
 * Enhanced form mutation hook with global loading, error handling, and optimistic updates
 * Next generation of form state management with advanced patterns
 */
export function useEnhancedFormMutation<
    TData,
    TVariables extends { id?: string }
>(options: EnhancedFormMutationOptions<TData, TVariables>) {
    const queryClient = useQueryClient();
    const { startLoading, finishLoading } = useGlobalLoading();
    const { reportFormError } = useErrorHandling();
    const { optimisticCreate, optimisticUpdate, optimisticDelete } =
        useOptimisticUpdates();

    const {
        createFn,
        updateFn,
        deleteFn,
        queryKeys = [],
        optimisticType,
        getOptimisticData,
        getOriginalData,
        loadingMessage = "Processing...",
        componentName = "Form",
        onSuccess,
        onError,
    } = options;

    // Create mutation with enhanced error handling and loading
    const createMutation = useMutation({
        mutationFn: createFn!,
        onMutate: async (variables) => {
            const loadingId = `create_${
                optimisticType || "item"
            }_${Date.now()}`;
            startLoading(loadingId, loadingMessage);

            // Optimistic update if configured
            if (optimisticType && getOptimisticData) {
                const optimisticData = getOptimisticData(variables);
                return await optimisticCreate(
                    optimisticType,
                    optimisticData,
                    async () => {
                        const result = await createFn!(variables);
                        finishLoading(loadingId);
                        return result;
                    }
                );
            }

            return { loadingId };
        },
        onSuccess: (data, variables, context: any) => {
            // Invalidate queries
            queryKeys.forEach((queryKey) => {
                queryClient.invalidateQueries({ queryKey });
            });

            if (context?.loadingId) {
                finishLoading(context.loadingId);
            }

            onSuccess?.(data, variables);
        },
        onError: (error: Error, variables, context: any) => {
            reportFormError(error, `${componentName} Create`, variables.id);

            if (context?.loadingId) {
                finishLoading(context.loadingId);
            }

            onError?.(error, variables);
        },
    });

    // Update mutation with optimistic updates
    const updateMutation = useMutation({
        mutationFn: updateFn!,
        onMutate: async (variables) => {
            const loadingId = `update_${optimisticType || "item"}_${
                variables.id
            }`;
            startLoading(loadingId, `Updating ${optimisticType || "item"}...`);

            // Optimistic update if configured
            if (optimisticType && getOptimisticData && getOriginalData) {
                const optimisticData = getOptimisticData(variables);
                const originalData = getOriginalData(variables);

                return await optimisticUpdate(
                    optimisticType,
                    variables.id!,
                    optimisticData,
                    originalData,
                    async () => {
                        const result = await updateFn!(variables);
                        finishLoading(loadingId);
                        return result;
                    }
                );
            }

            return { loadingId };
        },
        onSuccess: (data, variables, context: any) => {
            queryKeys.forEach((queryKey) => {
                queryClient.invalidateQueries({ queryKey });
            });

            if (context?.loadingId) {
                finishLoading(context.loadingId);
            }

            onSuccess?.(data, variables);
        },
        onError: (error: Error, variables, context: any) => {
            reportFormError(error, `${componentName} Update`, variables.id);

            if (context?.loadingId) {
                finishLoading(context.loadingId);
            }

            onError?.(error, variables);
        },
    });

    // Delete mutation with optimistic updates
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => deleteFn!(id),
        onMutate: async (id: string) => {
            const loadingId = `delete_${optimisticType || "item"}_${id}`;
            startLoading(loadingId, `Deleting ${optimisticType || "item"}...`);

            // Optimistic delete if configured
            if (optimisticType && getOriginalData) {
                const originalData = getOriginalData({ id } as TVariables);

                return await optimisticDelete(
                    optimisticType,
                    id,
                    originalData,
                    async () => {
                        await deleteFn!(id);
                        finishLoading(loadingId);
                    }
                );
            }

            return { loadingId };
        },
        onSuccess: (data, id, context: any) => {
            queryKeys.forEach((queryKey) => {
                queryClient.invalidateQueries({ queryKey });
            });

            if (context?.loadingId) {
                finishLoading(context.loadingId);
            }
        },
        onError: (error: Error, id, context: any) => {
            reportFormError(error, `${componentName} Delete`, id);

            if (context?.loadingId) {
                finishLoading(context.loadingId);
            }
        },
    });

    // Helper methods for form handling
    const handleSubmit = useMemo(
        () => ({
            create: (data: TVariables) => createMutation.mutate(data),
            update: (data: TVariables) => updateMutation.mutate(data),
            delete: (id: string) => deleteMutation.mutate(id),
        }),
        [createMutation, updateMutation, deleteMutation]
    );

    const resetMutations = () => {
        createMutation.reset();
        updateMutation.reset();
        deleteMutation.reset();
    };

    return {
        // Individual mutations
        createMutation,
        updateMutation,
        deleteMutation,

        // Helper methods
        handleSubmit,
        resetMutations,

        // Status checks
        isLoading:
            createMutation.isPending ||
            updateMutation.isPending ||
            deleteMutation.isPending,
        isError:
            createMutation.isError ||
            updateMutation.isError ||
            deleteMutation.isError,
        isSuccess:
            createMutation.isSuccess ||
            updateMutation.isSuccess ||
            deleteMutation.isSuccess,

        // Individual statuses
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,

        // Error states
        createError: createMutation.error,
        updateError: updateMutation.error,
        deleteError: deleteMutation.error,

        // Success states
        createSuccess: createMutation.isSuccess,
        updateSuccess: updateMutation.isSuccess,
        deleteSuccess: deleteMutation.isSuccess,

        // Form validation helpers
        canSubmit: !createMutation.isPending && !updateMutation.isPending,
        canDelete: !deleteMutation.isPending,
        hasChanges: updateMutation.isIdle || createMutation.isIdle,
    };
}
