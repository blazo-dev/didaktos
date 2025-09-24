import { coursesApi } from "@/lib/api/course";
import { useToastStore } from "@/stores/toast-store";
import { Module } from "@/types/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateModule = (courseId: string) => {
    const queryClient = useQueryClient();
    const { addToast } = useToastStore();

    return useMutation({
        mutationFn: (moduleData: Omit<Module, "id" | "courseId">) =>
            coursesApi.createModule(courseId, moduleData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
            addToast({
                type: "success",
                message: "Module created successfully!",
            });
        },
        onError: () => {
            addToast({
                type: "error",
                message: "Failed to create module. Please try again.",
            });
        },
    });
};