import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { useToastStore } from "@/stores/ui-store";

export interface ApiMutationOptions<TData, TVariables> {
  successMessage?: string;
  errorMessage?: string;
  invalidateKeys?: string[];
  onSuccess?: (data: TData, variables: TVariables, queryClient: any) => void;
  onError?: (error: Error) => void;
}

export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: ApiMutationOptions<TData, TVariables> = {}
) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const {
    successMessage,
    errorMessage,
    invalidateKeys = [],
    onSuccess,
    onError,
  } = options;

  return useMutation<TData, Error, TVariables>({
    mutationFn,
    onSuccess: (data, variables) => {
      // Invalidate specified query keys
      invalidateKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });

      // Show success toast if message provided
      if (successMessage) {
        addToast({ type: "success", message: successMessage });
      }

      // Call custom onSuccess if provided
      onSuccess?.(data, variables, queryClient);
    },
    onError: (error) => {
      // Show error toast
      const message = errorMessage || `Failed to complete operation. Please try again.`;
      addToast({ type: "error", message });

      // Call custom onError if provided
      onError?.(error);
    },
  });
}