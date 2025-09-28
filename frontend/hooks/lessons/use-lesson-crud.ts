import { lessonsApi } from "@/lib/api/lesson";
import { createNestedCrudHooks } from "@/lib/hooks/use-crud-hooks";
import { Lesson } from "@/types/course";

const lessonCrudHooks = createNestedCrudHooks<
    Lesson,
    Omit<Lesson, "id" | "moduleId">,
    Partial<Lesson>
>({
    entityName: "Lesson",
    invalidateKeys: ["courses"],
    api: {
        create: (
            moduleId: string,
            lessonData: Omit<Lesson, "id" | "moduleId">
        ) => lessonsApi.createLesson(moduleId, lessonData),
        update: lessonsApi.updateLesson,
        delete: lessonsApi.deleteLesson,
    },
});

export const useCreateLesson = lessonCrudHooks.useCreate!;
export const useUpdateLesson = lessonCrudHooks.useUpdate!;
export const useDeleteLesson = lessonCrudHooks.useDelete!;
