import { enrollmentsApi } from "@/lib/api/enrollments";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";

/**
 * Hook for creating course enrollments
 *
 * @description Mutation hook for enrolling users in courses. Automatically shows
 * success/error toasts and invalidates course queries to refresh enrollment data.
 *
 * @returns {UseMutationResult} Mutation object with methods:
 *   - mutate: Function to trigger enrollment with course enrollment data
 *   - isLoading: Boolean indicating if enrollment request is in progress
 *   - error: Any error from the enrollment attempt
 *
 * @example
 * ```tsx
 * const createEnrollment = useCreateEnrollment();
 *
 * const handleEnroll = (courseId: string) => {
 *   createEnrollment.mutate({ courseId, studentId: user.id });
 * };
 * ```
 */
export const useCreateEnrollment = () => {
    return useApiMutation(enrollmentsApi.createEnrollment, {
        successMessage: "Enrollment created successfully!",
        errorMessage: "Failed to create enrollment. Please try again.",
        invalidateKeys: ["courses"],
    });
};
