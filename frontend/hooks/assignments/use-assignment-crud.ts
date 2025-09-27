import { assignmentsApi } from "@/lib/api/assignments";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { useAppStore } from "@/stores/app-store";
import { Assignment } from "@/types/course";

// Define the create input type for assignments
interface CreateAssignmentData {
    title: string;
    description: string;
    dueDate: string;
}

// Create assignment hook
export const useCreateAssignment = () => {
    return useApiMutation(
        ({
            moduleId,
            assignmentData,
        }: {
            moduleId: string;
            assignmentData: CreateAssignmentData;
        }) => assignmentsApi.createAssignment(moduleId, assignmentData),
        {
            successMessage: "Assignment created successfully!",
            errorMessage: "Failed to create assignment. Please try again.",
            invalidateKeys: ["courses"],
        }
    );
};

// Update assignment hook
export const useUpdateAssignment = () => {
    const { setCurrentAssignment } = useAppStore();

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
            onSuccess: (updatedAssignment) => {
                setCurrentAssignment(updatedAssignment);
            },
        }
    );
};

// Delete assignment hook
export const useDeleteAssignment = () => {
    return useApiMutation(assignmentsApi.deleteAssignment, {
        successMessage: "Assignment deleted successfully!",
        errorMessage: "Failed to delete assignment. Please try again.",
        invalidateKeys: ["courses"],
    });
};
