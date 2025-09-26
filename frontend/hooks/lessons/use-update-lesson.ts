import { lessonsApi } from "@/lib/api/lesson";
import { useCoursesStore } from "@/stores/courses-store";
import { useToastStore } from "@/stores/toast-store";
import { Lesson } from "@/types/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateLesson = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToastStore();
    const { setCurrentLesson } = useCoursesStore();

    return useMutation({
        mutationFn: ({
            id,
            lessonData,
        }: {
            id: string;
            lessonData: Partial<Lesson>;
        }) => lessonsApi.updateLesson(id, lessonData),
        onSuccess: (lesson, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            setCurrentLesson(lesson);
            addToast({
                type: "success",
                message: "Lesson updated successfully!",
            });
        },
        onError: () => {
            addToast({
                type: "error",
                message: "Failed to update lesson. Please try again.",
            });
        },
    });
};
