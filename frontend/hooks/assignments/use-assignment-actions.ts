// Removed: import { useAppStore } from "@/stores/app-store";
import { Submission } from "@/types/course";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Assignment-related actions and query cache management hook
 *
 * @description Provides utility functions for managing assignment-related queries and
 * performing common assignment operations like grading submissions and cache invalidation.
 * Replaced global state management with URL-based entity resolution pattern.
 *
 * @returns {Object} Object containing:
 *   - invalidateAssignmentQueries: Function to invalidate all assignment-related queries
 *   - updateSubmissionWithGrade: Function to update submission with grade and return updated object
 *   - handleAssignmentDeletion: Function to clean up after assignment deletion
 *
 * @example
 * ```tsx
 * const { invalidateAssignmentQueries, updateSubmissionWithGrade } = useAssignmentActions();
 *
 * const handleGradeSubmission = (submission: Submission, grade: number) => {
 *   const updated = updateSubmissionWithGrade(submission, grade, "Good work!");
 *   // Components will re-fetch via URL-based hooks
 * };
 * ```
 */
export function useAssignmentActions() {
    const queryClient = useQueryClient();

    /**
     * Invalidate all assignment-related queries after mutations
     */
    const invalidateAssignmentQueries = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        queryClient.invalidateQueries({ queryKey: ["assignments"] });
        queryClient.invalidateQueries({ queryKey: ["submissions"] });
    }, [queryClient]);

    /**
     * Update assignment submission with grading information
     * Returns the updated submission for local state updates
     */
    const updateSubmissionWithGrade = useCallback(
        (
            submission: Submission,
            grade: number,
            feedback?: string
        ): Submission => {
            const updatedSubmission = {
                ...submission,
                grade,
                feedback,
                gradedAt: new Date().toISOString(),
            };

            // Invalidate related queries - components will re-fetch via URL-based hooks
            invalidateAssignmentQueries();

            return updatedSubmission;
        },
        [invalidateAssignmentQueries]
    );

    /**
     * Clean up after assignment deletion
     */
    const handleAssignmentDeletion = useCallback(
        (assignmentId: string) => {
            // Invalidate queries to refresh components
            invalidateAssignmentQueries();
        },
        [invalidateAssignmentQueries]
    );

    return {
        // Query management
        invalidateAssignmentQueries,

        // Specific actions
        updateSubmissionWithGrade,
        handleAssignmentDeletion,
    };
}
