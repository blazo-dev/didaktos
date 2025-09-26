import { lessonsApi } from "@/lib/api/lesson";
import { useToastStore } from "@/stores/toast-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteLesson = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToastStore();

    return useMutation({
        mutationFn: lessonsApi.deleteLesson,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            addToast({
                type: "success",
                message: "Lesson deleted successfully!",
            });
        },
        onError: () => {
            addToast({
                type: "error",
                message: "Failed to delete lesson. Please try again.",
            });
        },
    });
};
