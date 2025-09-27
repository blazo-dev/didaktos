import { assignmentsApi } from "@/lib/api/assignments";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";

interface CreateAssignmentData {
  title: string;
  description: string;
  dueDate: string;
}

export const useCreateAssignment = () => {
  return useApiMutation(
    ({ moduleId, assignmentData }: {
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
