import { UseMutationResult } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

interface UseFormWithMutationOptions<TData, TVariables> {
    createMutation?: UseMutationResult<TData, Error, TVariables>;
    updateMutation?: UseMutationResult<TData, Error, TVariables>;
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
}

/**
 * Standardized form state hook for mutations
 * Handles success/error states consistently across all forms
 */
export function useFormWithMutation<TData, TVariables>({
    createMutation,
    updateMutation,
    onSuccess,
    onError,
}: UseFormWithMutationOptions<TData, TVariables>) {
    // Determine which mutation is active
    const activeMutation = createMutation?.isPending
        ? createMutation
        : updateMutation?.isPending
        ? updateMutation
        : createMutation || updateMutation;

    const isLoading =
        createMutation?.isPending || updateMutation?.isPending || false;
    const error = createMutation?.error || updateMutation?.error;

    // Handle success automatically
    useEffect(() => {
        if (createMutation?.isSuccess && createMutation.data) {
            onSuccess?.(createMutation.data);
        }
    }, [createMutation?.isSuccess, createMutation?.data, onSuccess]);

    useEffect(() => {
        if (updateMutation?.isSuccess && updateMutation.data) {
            onSuccess?.(updateMutation.data);
        }
    }, [updateMutation?.isSuccess, updateMutation?.data, onSuccess]);

    // Handle errors automatically
    useEffect(() => {
        if (createMutation?.isError && createMutation.error) {
            onError?.(createMutation.error);
        }
    }, [createMutation?.isError, createMutation?.error, onError]);

    useEffect(() => {
        if (updateMutation?.isError && updateMutation.error) {
            onError?.(updateMutation.error);
        }
    }, [updateMutation?.isError, updateMutation?.error, onError]);

    // Submit handler helper
    const handleSubmit = useCallback(
        async (data: TVariables, isEdit: boolean = false) => {
            if (isEdit && updateMutation) {
                return await updateMutation.mutateAsync(data);
            } else if (createMutation) {
                return await createMutation.mutateAsync(data);
            }
            throw new Error("No appropriate mutation available");
        },
        [createMutation, updateMutation]
    );

    // Reset mutations helper
    const resetMutations = useCallback(() => {
        createMutation?.reset();
        updateMutation?.reset();
    }, [createMutation, updateMutation]);

    // Check if form can be submitted
    const canSubmit = useCallback(
        (isEdit: boolean = false) => {
            if (isLoading) return false;
            if (isEdit) return !!updateMutation && !updateMutation.isPending;
            return !!createMutation && !createMutation.isPending;
        },
        [isLoading, createMutation, updateMutation]
    );

    return {
        // State
        isLoading,
        error,

        // Success flags
        isCreateSuccess: createMutation?.isSuccess || false,
        isUpdateSuccess: updateMutation?.isSuccess || false,
        isSuccess:
            createMutation?.isSuccess || updateMutation?.isSuccess || false,

        // Data
        createData: createMutation?.data,
        updateData: updateMutation?.data,
        data: createMutation?.data || updateMutation?.data,

        // Helpers
        handleSubmit,
        resetMutations,
        canSubmit,

        // Individual mutation states for advanced use
        createMutation,
        updateMutation,
        activeMutation,
    };
}
