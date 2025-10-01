import { coursesApi } from "@/lib/api/course";
import { lessonsApi } from "@/lib/api/lesson";
import { useToastStore } from "@/stores/toast-store";
import { Lesson } from "@/types/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateLesson = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToastStore();

    return useMutation({
        mutationFn: ({
            moduleId,
            lessonData,
        }: {
            moduleId: string;
            lessonData: Omit<Lesson, "id" | "moduleId">;
        }) => lessonsApi.createLesson(moduleId, lessonData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            addToast({
                type: "success",
                message: "Lesson created successfully!",
            });
        },
        onError: () => {
            addToast({
                type: "error",
                message: "Failed to create lesson. Please try again.",
            });
        },
    });
};
