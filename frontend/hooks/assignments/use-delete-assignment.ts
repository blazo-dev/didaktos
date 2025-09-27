import { assignmentsApi } from "@/lib/api/assignments";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";

export const useDeleteAssignment = () => {
    return useApiMutation(assignmentsApi.deleteAssignment, {
        successMessage: "Assignment deleted successfully!",
        errorMessage: "Failed to delete assignment. Please try again.",
        invalidateKeys: ["courses"],
    });
};
