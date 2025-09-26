import { coursesApi } from "@/lib/api/course";
import { useToastStore } from "@/stores/toast-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteCourse = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToastStore();

    return useMutation({
        mutationFn: coursesApi.deleteCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            addToast({
                type: "success",
                message: "Course deleted successfully!",
            });
        },
        onError: () => {
            addToast({
                type: "error",
                message: "Failed to delete course. Please try again.",
            });
        },
    });
};
