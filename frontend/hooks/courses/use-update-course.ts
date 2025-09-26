import { coursesApi } from "@/lib/api/course";
import { useToastStore } from "@/stores/toast-store";
import { Course } from "@/types/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateCourse = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToastStore();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) =>
            coursesApi.updateCourse(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            queryClient.invalidateQueries({ queryKey: ["courses", id] });
            addToast({
                type: "success",
                message: "Course updated successfully!",
            });
        },
        onError: () => {
            addToast({
                type: "error",
                message: "Failed to update course. Please try again.",
            });
        },
    });
};
