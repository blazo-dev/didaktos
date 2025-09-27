import {
    SubmissionGradeRequestDto,
    submissionsApi,
} from "@/lib/api/submission";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { Submission } from "@/types/course";

// Create submission hook
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

// Grade submission hook (specialized action for submissions)
export const useGradeSubmission = () => {
    return useApiMutation(
        ({ id, grade, courseId }: SubmissionGradeRequestDto) =>
            submissionsApi.gradeSubmission({ id, grade, courseId }),
        {
            successMessage: "Submission graded successfully!",
            errorMessage: "Failed to grade submission. Please try again.",
            invalidateKeys: ["submissions", "courses"],
        }
    );
};
