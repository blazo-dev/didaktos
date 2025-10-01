import { assignmentsApi } from "@/lib/api/assignments";
import { useToastStore } from "@/stores/toast-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteAssignment = (moduleId: string) => {
    const queryClient = useQueryClient();
    const { addToast } = useToastStore();

    return useMutation({
        mutationFn: assignmentsApi.deleteAssignment,
        onSuccess: () => {
            queryClient.invalidateQueries({
                // queryKey: ["assignments", moduleId], // original
                queryKey: ["courses"], // updated to refresh entire courses data
            });
            addToast({
                type: "success",
                message: "Assignment deleted successfully!",
            });
        },
        onError: () => {
            addToast({
                type: "error",
                message: "Failed to delete assignment. Please try again.",
            });
        },
    });
};
