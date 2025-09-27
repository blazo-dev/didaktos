import { useCoursesStore } from "@/stores/courses-store";
import { Assignment, Submission } from "@/types/course";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Centralized assignment state management hook
 * Provides consistent methods for updating assignment-related state
 */
export function useAssignmentActions() {
    const queryClient = useQueryClient();
    const { 
        setCurrentAssignment, 
        setCurrentSubmission, 
        setCurrentSubmissions,
        currentAssignment,
        currentSubmission
    } = useCoursesStore();

    /**
     * Update assignment with new submission and sync all related state
     */
    const updateAssignmentWithSubmission = useCallback((
        assignment: Assignment, 
        newSubmission: Submission
    ) => {
        // Create updated assignment with new submission
        const updatedAssignment = {
            ...assignment,
            submissions: [newSubmission]
        };
        
        // Update global state atomically
        setCurrentAssignment(updatedAssignment);
        setCurrentSubmission(newSubmission);
        
        // Invalidate related queries to keep cache fresh
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        queryClient.invalidateQueries({ queryKey: ["assignments"] });
        queryClient.invalidateQueries({ queryKey: ["submissions"] });
        
        return updatedAssignment;
    }, [setCurrentAssignment, setCurrentSubmission, queryClient]);

    /**
     * Update assignment submission with grading information
     */
    const updateSubmissionWithGrade = useCallback((
        submission: Submission,
        grade: number,
        feedback?: string
    ) => {
        const updatedSubmission = {
            ...submission,
            grade,
            feedback,
            gradedAt: new Date().toISOString()
        };

        // Update current submission
        setCurrentSubmission(updatedSubmission);

        // If this submission belongs to current assignment, update assignment too
        if (currentAssignment) {
            const updatedAssignment = {
                ...currentAssignment,
                submissions: currentAssignment.submissions?.map(sub => 
                    sub.id === submission.id ? updatedSubmission : sub
                ) || [updatedSubmission]
            };
            setCurrentAssignment(updatedAssignment);
        }

        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        queryClient.invalidateQueries({ queryKey: ["assignments"] });
        queryClient.invalidateQueries({ queryKey: ["submissions"] });

        return updatedSubmission;
    }, [currentAssignment, setCurrentAssignment, setCurrentSubmission, queryClient]);

    /**
     * Remove assignment and clean up related state
     */
    const removeAssignment = useCallback((assignmentId: string) => {
        // Clear current assignment if it matches deleted one
        if (currentAssignment?.id === assignmentId) {
            setCurrentAssignment(null);
            setCurrentSubmission(null);
        }

        // Clear any submissions for this assignment
        setCurrentSubmissions(null);

        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        queryClient.invalidateQueries({ queryKey: ["assignments"] });
        queryClient.invalidateQueries({ queryKey: ["submissions"] });
    }, [currentAssignment, setCurrentAssignment, setCurrentSubmission, setCurrentSubmissions, queryClient]);

    /**
     * Set current assignment and prepare related state
     */
    const selectAssignment = useCallback((assignment: Assignment | null) => {
        setCurrentAssignment(assignment);
        
        // Set current submission if assignment has one
        if (assignment?.submissions?.[0]) {
            setCurrentSubmission(assignment.submissions[0]);
        } else {
            setCurrentSubmission(null);
        }
    }, [setCurrentAssignment, setCurrentSubmission]);

    /**
     * Bulk update submissions for current assignment (useful for instructor views)
     */
    const updateAssignmentSubmissions = useCallback((submissions: Submission[]) => {
        setCurrentSubmissions(submissions);
        
        // If there's a current assignment, update it with new submissions
        if (currentAssignment) {
            const updatedAssignment = {
                ...currentAssignment,
                submissions
            };
            setCurrentAssignment(updatedAssignment);
        }

        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        queryClient.invalidateQueries({ queryKey: ["submissions"] });
    }, [currentAssignment, setCurrentAssignment, setCurrentSubmissions, queryClient]);

    return {
        // State update methods
        updateAssignmentWithSubmission,
        updateSubmissionWithGrade,
        updateAssignmentSubmissions,
        selectAssignment,
        removeAssignment,
        
        // Current state for convenience
        currentAssignment,
        currentSubmission,
        
        // Computed flags
        hasCurrentAssignment: !!currentAssignment,
        hasCurrentSubmission: !!currentSubmission,
        isSubmissionGraded: !!(currentSubmission?.grade !== undefined)
    };
}