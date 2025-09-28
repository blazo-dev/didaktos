import { assignmentsApi } from "@/lib/api/assignments";
import { createNestedCrudHooks } from "@/lib/hooks/use-crud-hooks";
import { Assignment } from "@/types/course";

// Define the create input type for assignments
interface CreateAssignmentData {
    title: string;
    description: string;
    dueDate: string;
}

// Create standardized CRUD hooks for assignments
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

// Export individual hooks for backward compatibility
export const useCreateAssignment = assignmentCrudHooks.useCreate!;
export const useUpdateAssignment = assignmentCrudHooks.useUpdate!;
export const useDeleteAssignment = assignmentCrudHooks.useDelete!;
