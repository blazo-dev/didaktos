import { submissionsApi } from "@/lib/api/submission";
import { useToastStore } from "@/stores/toast-store";
import { Submission } from "@/types/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateSubmission = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToastStore();

    return useMutation({
        mutationFn: ({
            submissionData,
        }: {
            submissionData: Omit<Submission, "id">;
        }) => submissionsApi.createSubmission(submissionData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            addToast({
                type: "success",
                message: "Submission created successfully!",
            });
        },
        onError: () => {
            addToast({
                type: "error",
                message: "Failed to create submission. Please try again.",
            });
        },
    });
};
