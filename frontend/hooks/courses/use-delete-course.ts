import { coursesApi } from "@/lib/api/course";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";

export const useDeleteCourse = () => {
    return useApiMutation(coursesApi.deleteCourse, {
        successMessage: "Course deleted successfully!",
        errorMessage: "Failed to delete course. Please try again.",
        invalidateKeys: ["courses"],
    });
};
