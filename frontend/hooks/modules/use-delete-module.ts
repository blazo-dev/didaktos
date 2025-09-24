import { coursesApi } from "@/lib/api/course";
import { useToastStore } from "@/stores/toast-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteModule = (courseId: string) => {
    const queryClient = useQueryClient();
    const { addToast } = useToastStore();

    return useMutation({
        mutationFn: (moduleId: string) =>
            coursesApi.deleteModule(courseId, moduleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
            addToast({
                type: "success",
                message: "Module deleted successfully!",
            });
        },
        onError: () => {
            addToast({
                type: "error",
                message: "Failed to delete module. Please try again.",
            });
        },
    });
};
