import { assignmentsApi } from "@/lib/api/assignments";
import { useToastStore } from "@/stores/toast-store";
import { Assignment } from "@/types/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateAssignment = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToastStore();

    return useMutation({
        mutationFn: ({
            moduleId,
            assignmentData,
        }: {
            moduleId: string;
            assignmentData: Omit<Assignment, "id" | "moduleId">;
        }) => assignmentsApi.createAssignment(moduleId, assignmentData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            addToast({
                type: "success",
                message: "Assignment created successfully!",
            });
        },
        onError: () => {
            addToast({
                type: "error",
                message: "Failed to create assignment. Please try again.",
            });
        },
    });
};
