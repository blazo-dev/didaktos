import { coursesApi } from "@/lib/api/course";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { Module } from "@/types/course";

/**
 * Hook for creating modules within a specific course
 *
 * @description Mutation hook for module creation. Requires courseId parameter and
 * module data. Automatically shows success toast and invalidates course queries.
 *
 * @param {string} courseId - The unique identifier of the parent course
 *
 * @returns {UseMutationResult} Mutation object with mutate function accepting module data
 *
 * @example
 * ```tsx
 * const createModule = useCreateModule(courseId);
 *
 * const handleSubmit = (data: Omit<Module, "id" | "courseId">) => {
 *   createModule.mutate(data);
 * };
 * ```
 */
export const useCreateModule = (courseId: string) => {
    return useApiMutation(
        (moduleData: Omit<Module, "id" | "courseId">) =>
            coursesApi.createModule(courseId, moduleData),
        {
            successMessage: "Module created successfully!",
            errorMessage: "Failed to create module. Please try again.",
            invalidateKeys: ["courses"],
        }
    );
};

/**
 * Hook for updating existing modules within a specific course
 *
 * @description Mutation hook for module updates. Requires both courseId and moduleId.
 * Automatically shows success toast and invalidates course queries.
 *
 * @param {string} courseId - The unique identifier of the parent course
 *
 * @returns {UseMutationResult} Mutation object with mutate function accepting {moduleId, data}
 *
 * @example
 * ```tsx
 * const updateModule = useUpdateModule(courseId);
 *
 * const handleUpdate = (moduleId: string, updates: Partial<Module>) => {
 *   updateModule.mutate({ moduleId, data: updates });
 * };
 * ```
 */
export const useUpdateModule = (courseId: string) => {
    return useApiMutation(
        ({ moduleId, data }: { moduleId: string; data: Partial<Module> }) =>
            coursesApi.updateModule(courseId, moduleId, data),
        {
            successMessage: "Module updated successfully!",
            errorMessage: "Failed to update module. Please try again.",
            invalidateKeys: ["courses"],
        }
    );
};

/**
 * Hook for deleting modules within a specific course
 *
 * @description Mutation hook for module deletion. Only requires moduleId for deletion
 * but needs courseId for context. Automatically shows success toast and invalidates course queries.
 *
 * @param {string} courseId - The unique identifier of the parent course (for context)
 *
 * @returns {UseMutationResult} Mutation object with mutate function accepting moduleId
 *
 * @example
 * ```tsx
 * const deleteModule = useDeleteModule(courseId);
 *
 * const handleDelete = (moduleId: string) => {
 *   deleteModule.mutate(moduleId);
 * };
 * ```
 */
export const useDeleteModule = (courseId: string) => {
    return useApiMutation(
        (moduleId: string) => coursesApi.deleteModule(moduleId),
        {
            successMessage: "Module deleted successfully!",
            errorMessage: "Failed to delete module. Please try again.",
            invalidateKeys: ["courses"],
        }
    );
};
