// Removed: import { useAppStore } from "@/stores/app-store";
import { Submission } from "@/types/course";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Simplified assignment actions hook for cache management
 * Provides methods for invalidating queries after assignment operations
 * Note: Replaced global state management with URL-based entity resolution
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
