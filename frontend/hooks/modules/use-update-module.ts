import { coursesApi } from "@/lib/api/course";
import { useToastStore } from "@/stores/toast-store";
import { Module } from "@/types/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateModule = (courseId: string) => {
    const queryClient = useQueryClient();
    const { addToast } = useToastStore();

    return useMutation({
        mutationFn: ({
            moduleId,
            data,
        }: {
            moduleId: string;
            data: Partial<Module>;
        }) => coursesApi.updateModule(courseId, moduleId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
            addToast({
                type: "success",
                message: "Module updated successfully!",
            });
        },
        onError: () => {
            addToast({
                type: "error",
                message: "Failed to update module. Please try again.",
            });
        },
    });
};
