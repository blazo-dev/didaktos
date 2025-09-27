import { assignmentsApi } from "@/lib/api/assignments";
import { useCoursesStore } from "@/stores/courses-store";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { Assignment } from "@/types/course";

export const useUpdateAssignment = () => {
  const { setCurrentAssignment } = useCoursesStore();

  return useApiMutation(
    ({ assignmentId, assignmentData }: {
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
