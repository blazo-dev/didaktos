import { lessonsApi } from "@/lib/api/lesson";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { useAppStore } from "@/stores/app-store";
import { Lesson } from "@/types/course";

// Create lesson hook
export const useCreateLesson = () => {
    return useApiMutation(
        ({
            moduleId,
            lessonData,
        }: {
            moduleId: string;
            lessonData: Omit<Lesson, "id" | "moduleId">;
        }) => lessonsApi.createLesson(moduleId, lessonData),
        {
            successMessage: "Lesson created successfully!",
            errorMessage: "Failed to create lesson. Please try again.",
            invalidateKeys: ["courses"],
        }
    );
};

// Update lesson hook
export const useUpdateLesson = () => {
    const { setCurrentLesson } = useAppStore();

    return useApiMutation(
        ({ id, lessonData }: { id: string; lessonData: Partial<Lesson> }) =>
            lessonsApi.updateLesson(id, lessonData),
        {
            successMessage: "Lesson updated successfully!",
            errorMessage: "Failed to update lesson. Please try again.",
            invalidateKeys: ["courses"],
            onSuccess: (updatedLesson) => {
                setCurrentLesson(updatedLesson);
            },
        }
    );
};

// Delete lesson hook
export const useDeleteLesson = () => {
    return useApiMutation(lessonsApi.deleteLesson, {
        successMessage: "Lesson deleted successfully!",
        errorMessage: "Failed to delete lesson. Please try again.",
        invalidateKeys: ["courses"],
    });
};
