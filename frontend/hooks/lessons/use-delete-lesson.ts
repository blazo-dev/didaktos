import { lessonsApi } from "@/lib/api/lesson";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";

export const useDeleteLesson = () => {
  return useApiMutation(
    lessonsApi.deleteLesson,
    {
      successMessage: "Lesson deleted successfully!",
      errorMessage: "Failed to delete lesson. Please try again.",
      invalidateKeys: ["courses"],
    }
  );
};
