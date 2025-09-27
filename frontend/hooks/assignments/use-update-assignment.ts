import { assignmentsApi } from "@/lib/api/assignments";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { useCoursesStore } from "@/stores/courses-store";
import { Assignment } from "@/types/course";

export const useUpdateAssignment = () => {
    const { setCurrentAssignment } = useCoursesStore();

    return useApiMutation(
        ({
            assignmentId,
            assignmentData,
        }: {
            assignmentId: string;
            assignmentData: Partial<Assignment>;
        }) => assignmentsApi.updateAssignment(assignmentId, assignmentData),
        {
            successMessage: "Assignment updated successfully!",
            errorMessage: "Failed to update assignment. Please try again.",
            invalidateKeys: ["courses"],
            onSuccess: (assignment) => {
                setCurrentAssignment(assignment);
            },
        }
    );
};
