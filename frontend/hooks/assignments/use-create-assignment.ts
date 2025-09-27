import { assignmentsApi } from "@/lib/api/assignments";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { Assignment } from "@/types/course";

export const useCreateAssignment = () => {
  return useApiMutation(
    ({ moduleId, assignmentData }: {
      moduleId: string;
      assignmentData: Omit<Assignment, "id" | "moduleId">;
    }) => assignmentsApi.createAssignment(moduleId, assignmentData),
    {
      successMessage: "Assignment created successfully!",
      errorMessage: "Failed to create assignment. Please try again.",
      invalidateKeys: ["courses"],
    }
  );
};
