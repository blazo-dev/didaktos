import { assignmentsApi } from "@/lib/api/assignments";
import { useCoursesStore } from "@/stores/courses-store";
import { useToastStore } from "@/stores/toast-store";
import { Assignment } from "@/types/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateAssignment = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToastStore();
    const { setCurrentAssignment } = useCoursesStore();

    return useMutation({
        mutationFn: ({
            assignmentId,
            assignmentData,
        }: {
            assignmentId: string;
            assignmentData: Partial<Assignment>;
        }) => assignmentsApi.updateAssignment(assignmentId, assignmentData),
        onSuccess: (assignment) => {
            queryClient.invalidateQueries({
                // queryKey: ["assignments", assignment.moduleId], // TODO: refactor to use this query to render assignments list after update
                queryKey: ["courses"], // updated to refresh entire courses data
            });
            setCurrentAssignment(assignment);
            addToast({
                type: "success",
                message: "Assignment updated successfully!",
            });
        },
        onError: () => {
            addToast({
                type: "error",
                message: "Failed to update assignment. Please try again.",
            });
        },
    });
};
