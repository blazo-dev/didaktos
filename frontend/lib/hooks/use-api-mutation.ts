import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { useToastStore } from "@/stores/toast-store";

export interface ApiMutationOptions<TData, TVariables> {
  successMessage?: string;
  errorMessage?: string;
  invalidateKeys?: string[];
  onSuccess?: (data: TData) => void;
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
    onSuccess: (data) => {
      // Invalidate specified query keys
      invalidateKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });

      // Show success toast if message provided
      if (successMessage) {
        addToast({ type: "success", message: successMessage });
      }

      // Call custom onSuccess if provided
      onSuccess?.(data);
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