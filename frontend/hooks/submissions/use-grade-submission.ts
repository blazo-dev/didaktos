import {
    SubmissionGradeRequestDto,
    submissionsApi,
} from "@/lib/api/submission";
import { useToastStore } from "@/stores/toast-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useGradeSubmission = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToastStore();

    return useMutation({
        mutationFn: ({ id, grade, courseId }: SubmissionGradeRequestDto) =>
            submissionsApi.gradeSubmission({ id, grade, courseId }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["submissions"],
            });
            queryClient.invalidateQueries({
                queryKey: ["courses"],
            });
            addToast({
                type: "success",
                message: "Submission graded successfully!",
            });
        },
        onError: () => {
            addToast({
                type: "error",
                message: "Failed to grade submission. Please try again.",
            });
        },
    });
};
