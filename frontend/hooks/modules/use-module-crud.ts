import { coursesApi } from "@/lib/api/course";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { Module } from "@/types/course";

// Create module hook - uses courseId as parentId
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

// Update module hook - needs both courseId and moduleId
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

// Delete module hook - only needs moduleId
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
