import {
    SubmissionGradeRequestDto,
    submissionsApi,
} from "@/lib/api/submission";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { createCrudHooks } from "@/lib/hooks/use-crud-hooks";
import { Submission } from "@/types/course";

// Create standardized CRUD hooks for submissions
const submissionCrudHooks = createCrudHooks<Submission, Omit<Submission, "id">>(
    {
        entityName: "Submission",
        invalidateKeys: ["courses"],
        api: {
            create: submissionsApi.createSubmission,
            // Note: submissions typically don't have update operations, only grading
        },
    }
);

// Export the create hook from the factory
export const useCreateSubmission = submissionCrudHooks.useCreate!;

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
