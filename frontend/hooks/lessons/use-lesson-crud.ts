import { lessonsApi } from "@/lib/api/lesson";
import { createNestedCrudHooks } from "@/lib/hooks/use-crud-hooks";
import { Lesson } from "@/types/course";

/**
 * CRUD hooks factory for lesson management operations
 *
 * @description Creates standardized Create, Update, Delete hooks for lessons using
 * the nested CRUD pattern (lessons belong to modules). All hooks include automatic
 * success/error toasts, query invalidation, and consistent error handling.
 */
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

/**
 * Hook for creating new lessons within a module
 *
 * @description Mutation hook for lesson creation. Requires parentId (moduleId) and
 * lesson data. Automatically shows success toast and invalidates course queries.
 *
 * @returns {UseMutationResult} Mutation object with mutate function accepting {parentId, input}
 *
 * @example
 * ```tsx
 * const createLesson = useCreateLesson();
 *
 * const handleSubmit = (moduleId: string, lessonData: Omit<Lesson, "id" | "moduleId">) => {
 *   createLesson.mutate({ parentId: moduleId, input: lessonData });
 * };
 * ```
 */
export const useCreateLesson = lessonCrudHooks.useCreate!;

/**
 * Hook for updating existing lessons
 *
 * @description Mutation hook for lesson updates. Automatically shows success toast
 * and invalidates course queries on successful update.
 *
 * @returns {UseMutationResult} Mutation object with mutate function accepting {id, input}
 *
 * @example
 * ```tsx
 * const updateLesson = useUpdateLesson();
 *
 * const handleUpdate = (lessonId: string, updates: Partial<Lesson>) => {
 *   updateLesson.mutate({ id: lessonId, input: updates });
 * };
 * ```
 */
export const useUpdateLesson = lessonCrudHooks.useUpdate!;

/**
 * Hook for deleting lessons
 *
 * @description Mutation hook for lesson deletion. Automatically shows success toast
 * and invalidates course queries on successful deletion.
 *
 * @returns {UseMutationResult} Mutation object with mutate function accepting lesson ID
 *
 * @example
 * ```tsx
 * const deleteLesson = useDeleteLesson();
 *
 * const handleDelete = (lessonId: string) => {
 *   deleteLesson.mutate(lessonId);
 * };
 * ```
 */
export const useDeleteLesson = lessonCrudHooks.useDelete!;
