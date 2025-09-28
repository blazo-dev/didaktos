import { useCourseById } from "@/hooks/courses/use-course-by-id";
import { useAuthStore } from "@/stores/auth-store";
import { useMemo } from "react";

export function useCourseContext(courseId: string) {
    const { course, isOwner, isEnrolled, isLoading, isError } =
        useCourseById(courseId);
    const { user } = useAuthStore();

    const courseStats = useMemo(() => {
        if (!course) {
            return {
                totalLessons: 0,
                totalAssignments: 0,
                moduleCount: 0,
                enrollmentCount: 0,
                averageModuleLessons: 0,
                averageModuleAssignments: 0,
            };
        }

        const moduleCount = course.modules?.length || 0;
        const enrollmentCount = course.enrollments?.length || 0;

        const totalLessons =
            course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 0;

        const totalAssignments =
            course.modules?.reduce((acc, m) => acc + m.assignments.length, 0) ||
            0;

        return {
            totalLessons,
            totalAssignments,
            moduleCount,
            enrollmentCount,
            averageModuleLessons: moduleCount
                ? Math.round(totalLessons / moduleCount)
                : 0,
            averageModuleAssignments: moduleCount
                ? Math.round(totalAssignments / moduleCount)
                : 0,
        };
    }, [course]);

    const permissions = useMemo(() => {
        const ownerOnly = isOwner;
        return {
            canView: isOwner || isEnrolled,
            canEdit: ownerOnly,
            canDelete: ownerOnly,
            canCreateModule: ownerOnly,
            canCreateLesson: ownerOnly,
            canCreateAssignment: ownerOnly,
            canViewSubmissions: ownerOnly,
            canGradeSubmissions: ownerOnly,
            canEnroll: !isOwner && !isEnrolled,
            canSubmitAssignments: isEnrolled && !isOwner,
        };
    }, [isOwner, isEnrolled]);

    const courseStatus = useMemo(() => {
        if (isLoading)
            return { status: "loading", message: "Loading course..." };
        if (isError)
            return { status: "error", message: "Failed to load course" };
        if (!course)
            return { status: "not-found", message: "Course not found" };
        if (!permissions.canView)
            return { status: "access-denied", message: "Access denied" };
        return { status: "ready", message: "Course loaded successfully" };
    }, [isLoading, isError, course, permissions.canView]);

    return {
        course,
        user,
        courseId,
        isOwner,
        isEnrolled,
        isLoading,
        isError,
        courseStats,
        permissions,
        courseStatus,
        isEmpty: courseStats.moduleCount === 0,
        hasContent:
            courseStats.totalLessons > 0 || courseStats.totalAssignments > 0,
    };
}
