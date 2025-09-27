import { coursesApi } from "@/lib/api/course";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { Course } from "@/types/course";

export const useUpdateCourse = () => {
    return useApiMutation(
        ({ id, data }: { id: string; data: Partial<Course> }) =>
            coursesApi.updateCourse(id, data),
        {
            successMessage: "Course updated successfully!",
            errorMessage: "Failed to update course. Please try again.",
            invalidateKeys: ["courses"],
            onSuccess: (_, variables, queryClient) => {
                // Additional invalidation for specific course
                queryClient.invalidateQueries({
                    queryKey: ["courses", variables.id],
                });
            },
        }
    );
};
