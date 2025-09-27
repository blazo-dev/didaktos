import { submissionsApi } from "@/lib/api/submission";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { Submission } from "@/types/course";

export const useCreateSubmission = () => {
    return useApiMutation(
        ({ submissionData }: { submissionData: Omit<Submission, "id"> }) =>
            submissionsApi.createSubmission(submissionData),
        {
            successMessage: "Submission created successfully!",
            errorMessage: "Failed to create submission. Please try again.",
            invalidateKeys: ["courses"],
        }
    );
};
