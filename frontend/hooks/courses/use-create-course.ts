import { coursesApi } from "@/lib/api/course";
import { useToastStore } from "@/stores/toast-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateCourse = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToastStore();

    return useMutation({
        mutationFn: coursesApi.createCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            addToast({
                type: "success",
                message: "Course created successfully!",
            });
        },
        onError: () => {
            addToast({
                type: "error",
                message: "Failed to create course. Please try again.",
            });
        },
    });
};
