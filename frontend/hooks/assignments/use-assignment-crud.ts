import { assignmentsApi } from "@/lib/api/assignments";
import { createNestedCrudHooks } from "@/lib/hooks/use-crud-hooks";
import { Assignment } from "@/types/course";

// Define the create input type for assignments
interface CreateAssignmentData {
    title: string;
    description: string;
    dueDate: string;
}

/**
 * CRUD hooks factory for assignment management operations
 *
 * @description Creates standardized Create, Update, Delete hooks for assignments using
 * the nested CRUD pattern (assignments belong to modules). All hooks include automatic
 * success/error toasts, query invalidation, and consistent error handling.
 */
const assignmentCrudHooks = createNestedCrudHooks<
    Assignment,
    CreateAssignmentData,
    Partial<Assignment>
>({
    entityName: "Assignment",
    invalidateKeys: ["courses"],
    api: {
        create: assignmentsApi.createAssignment,
        update: assignmentsApi.updateAssignment,
        delete: assignmentsApi.deleteAssignment,
    },
});

/**
 * Hook for creating new assignments within a module
 *
 * @description Mutation hook for assignment creation. Requires parentId (moduleId) and
 * assignment data. Automatically shows success toast and invalidates course queries.
 *
 * @returns {UseMutationResult} Mutation object with mutate function accepting {parentId, input}
 *
 * @example
 * ```tsx
 * const createAssignment = useCreateAssignment();
 *
 * const handleSubmit = (moduleId: string, data: CreateAssignmentData) => {
 *   createAssignment.mutate({ parentId: moduleId, input: data });
 * };
 * ```
 */
export const useCreateAssignment = assignmentCrudHooks.useCreate!;

/**
 * Hook for updating existing assignments
 *
 * @description Mutation hook for assignment updates. Automatically shows success toast
 * and invalidates course queries on successful update.
 *
 * @returns {UseMutationResult} Mutation object with mutate function accepting {id, input}
 *
 * @example
 * ```tsx
 * const updateAssignment = useUpdateAssignment();
 *
 * const handleUpdate = (assignmentId: string, updates: Partial<Assignment>) => {
 *   updateAssignment.mutate({ id: assignmentId, input: updates });
 * };
 * ```
 */
export const useUpdateAssignment = assignmentCrudHooks.useUpdate!;

/**
 * Hook for deleting assignments
 *
 * @description Mutation hook for assignment deletion. Automatically shows success toast
 * and invalidates course queries on successful deletion.
 *
 * @returns {UseMutationResult} Mutation object with mutate function accepting assignment ID
 *
 * @example
 * ```tsx
 * const deleteAssignment = useDeleteAssignment();
 *
 * const handleDelete = (assignmentId: string) => {
 *   deleteAssignment.mutate(assignmentId);
 * };
 * ```
 */
export const useDeleteAssignment = assignmentCrudHooks.useDelete!;
