import { lessonsApi } from "@/lib/api/lesson";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { Lesson } from "@/types/course";

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
