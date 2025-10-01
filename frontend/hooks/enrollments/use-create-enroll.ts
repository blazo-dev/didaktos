import { enrollmentsApi } from "@/lib/api/enrollments";
import { useToastStore } from "@/stores/toast-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateEnrollment = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToastStore();

    return useMutation({
        mutationFn: enrollmentsApi.createEnrollment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["enrollments"] });
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            addToast({
                type: "success",
                message: "Enrollment created successfully!",
            });
        },
        onError: () => {
            addToast({
                type: "error",
                message: "Failed to create enrollment. Please try again.",
            });
        },
    });
};
