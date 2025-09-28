import { coursesApi } from "@/lib/api/course";
import { createCrudHooks } from "@/lib/hooks/use-crud-hooks";
import { Course } from "@/types/course";

/**
 * CRUD hooks factory for course management operations
 *
 * @description Creates standardized Create, Read, Update, Delete hooks for courses.
 * All hooks include automatic success/error toasts, query invalidation, and consistent
 * error handling. Generated hooks follow the useApiMutation pattern.
 */
const courseCrudHooks = createCrudHooks<Course>({
    entityName: "Course",
    invalidateKeys: ["courses"],
    api: {
        create: coursesApi.createCourse,
        update: (id: string, data: Partial<Course>) =>
            coursesApi.updateCourse(id, data),
        delete: coursesApi.deleteCourse,
    },
});

/**
 * Hook for creating new courses
 *
 * @description Mutation hook for course creation. Automatically shows success toast
 * and invalidates course queries on successful creation.
 *
 * @returns {UseMutationResult} Mutation object with mutate function that accepts course data
 *
 * @example
 * ```tsx
 * const createCourse = useCreateCourse();
 *
 * const handleSubmit = (data: Omit<Course, 'id'>) => {
 *   createCourse.mutate(data);
 * };
 * ```
 */
export const useCreateCourse = courseCrudHooks.useCreate!;

/**
 * Hook for updating existing courses
 *
 * @description Mutation hook for course updates. Automatically shows success toast
 * and invalidates course queries on successful update.
 *
 * @returns {UseMutationResult} Mutation object with mutate function that accepts {id, input}
 *
 * @example
 * ```tsx
 * const updateCourse = useUpdateCourse();
 *
 * const handleUpdate = (courseId: string, updates: Partial<Course>) => {
 *   updateCourse.mutate({ id: courseId, input: updates });
 * };
 * ```
 */
export const useUpdateCourse = courseCrudHooks.useUpdate!;

/**
 * Hook for deleting courses
 *
 * @description Mutation hook for course deletion. Automatically shows success toast
 * and invalidates course queries on successful deletion.
 *
 * @returns {UseMutationResult} Mutation object with mutate function that accepts course ID
 *
 * @example
 * ```tsx
 * const deleteCourse = useDeleteCourse();
 *
 * const handleDelete = (courseId: string) => {
 *   deleteCourse.mutate(courseId);
 * };
 * ```
 */
export const useDeleteCourse = courseCrudHooks.useDelete!;
