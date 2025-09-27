import { useCourseById } from "@/hooks/courses/use-course-by-id";
import { useAuthStore } from "@/stores/auth-store";
import { useMemo } from "react";

/**
 * Centralized course context hook that eliminates prop drilling
 * Provides course data, permissions, and computed stats in one place
 */
export function useCourseContext(courseId: string) {
    const { course, isOwner, isEnrolled, isLoading, isError } = useCourseById(courseId);
    const { user } = useAuthStore();
    
    // Compute course statistics with memoization
    const courseStats = useMemo(() => {
        if (!course) {
            return {
                totalLessons: 0,
                totalAssignments: 0,
                moduleCount: 0,
                enrollmentCount: 0,
                averageModuleLessons: 0,
                averageModuleAssignments: 0
            };
        }

        const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
        const totalAssignments = course.modules.reduce((acc, module) => acc + module.assignments.length, 0);
        const moduleCount = course.modules.length;
        const enrollmentCount = course.enrollments.length;

        return {
            totalLessons,
            totalAssignments,
            moduleCount,
            enrollmentCount,
            averageModuleLessons: moduleCount > 0 ? Math.round(totalLessons / moduleCount) : 0,
            averageModuleAssignments: moduleCount > 0 ? Math.round(totalAssignments / moduleCount) : 0
        };
    }, [course]);

    // Compute user permissions with memoization
    const permissions = useMemo(() => ({
        canView: isOwner || isEnrolled,
        canEdit: isOwner,
        canDelete: isOwner,
        canCreateModule: isOwner,
        canCreateLesson: isOwner,
        canCreateAssignment: isOwner,
        canViewSubmissions: isOwner,
        canGradeSubmissions: isOwner,
        canEnroll: !isOwner && !isEnrolled,
        canSubmitAssignments: isEnrolled && !isOwner
    }), [isOwner, isEnrolled]);

    // Course status information
    const courseStatus = useMemo(() => {
        if (!course) return { status: 'not-found', message: 'Course not found' };
        if (!permissions.canView) return { status: 'access-denied', message: 'Access denied' };
        if (isLoading) return { status: 'loading', message: 'Loading course...' };
        if (isError) return { status: 'error', message: 'Failed to load course' };
        return { status: 'ready', message: 'Course loaded successfully' };
    }, [course, permissions.canView, isLoading, isError]);

    return {
        // Core data
        course,
        user,
        courseId,
        
        // Status flags
        isOwner,
        isEnrolled,
        isLoading,
        isError,
        
        // Computed data
        courseStats,
        permissions,
        courseStatus,
        
        // Derived flags for convenience
        isEmpty: courseStats.moduleCount === 0,
        hasContent: courseStats.totalLessons > 0 || courseStats.totalAssignments > 0
    };
}