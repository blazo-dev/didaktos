import {
    SubmissionGradeRequestDto,
    submissionsApi,
} from "@/lib/api/submission";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { createCrudHooks } from "@/lib/hooks/use-crud-hooks";
import { Submission } from "@/types/course";

/**
 * CRUD hooks factory for submission management operations
 *
 * @description Creates standardized CRUD hooks for submissions. Note that submissions
 * typically only support create operations (students submitting assignments) and
 * specialized grading operations (instructors grading submissions).
 */
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

/**
 * Hook for creating assignment submissions
 *
 * @description Mutation hook for students to submit assignments. Automatically shows
 * success toast and invalidates course queries to refresh submission data.
 *
 * @returns {UseMutationResult} Mutation object with mutate function accepting submission data
 *
 * @example
 * ```tsx
 * const createSubmission = useCreateSubmission();
 *
 * const handleSubmit = (submissionData: Omit<Submission, "id">) => {
 *   createSubmission.mutate(submissionData);
 * };
 * ```
 */
export const useCreateSubmission = submissionCrudHooks.useCreate!;

/**
 * Hook for grading assignment submissions
 *
 * @description Specialized mutation hook for instructors to grade student submissions.
 * Requires submission ID, grade, and course ID. Automatically shows success toast
 * and invalidates relevant queries.
 *
 * @returns {UseMutationResult} Mutation object with mutate function accepting grade data
 *
 * @example
 * ```tsx
 * const gradeSubmission = useGradeSubmission();
 *
 * const handleGrade = (submissionId: string, grade: number, courseId: string) => {
 *   gradeSubmission.mutate({ id: submissionId, grade, courseId });
 * };
 * ```
 */
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
