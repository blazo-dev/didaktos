import { coursesApi } from "@/lib/api/course";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";

export const useCreateCourse = () => {
  return useApiMutation(
    coursesApi.createCourse,
    {
      successMessage: "Course created successfully!",
      errorMessage: "Failed to create course. Please try again.",
      invalidateKeys: ["courses"],
    }
  );
};
