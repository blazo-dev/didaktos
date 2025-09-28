import { useCourseById } from "@/hooks/courses/use-course-by-id";
import { Assignment, Course, Lesson, Module } from "@/types/course";
import { useParams } from "next/navigation";
import { useMemo } from "react";

/**
 * Hook to extract entity data from URL parameters instead of global state
 * Replaces the need for currentCourse, currentModule, currentLesson, etc.
 */
export function useUrlEntities() {
    const params = useParams();

    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;
    const lessonId = params.lessonId as string;
    const assignmentId = params.assignmentId as string;

    const { course, isLoading: isLoadingCourse } = useCourseById(courseId);

    // Derive nested entities from the course data
    const currentModule = useMemo(() => {
        if (!course || !moduleId) return null;
        return course.modules?.find((m: Module) => m.id === moduleId) || null;
    }, [course, moduleId]);

    const currentLesson = useMemo(() => {
        if (!currentModule || !lessonId) return null;
        return (
            currentModule.lessons?.find((l: Lesson) => l.id === lessonId) ||
            null
        );
    }, [currentModule, lessonId]);

    const currentAssignment = useMemo(() => {
        if (!currentModule || !assignmentId) return null;
        return (
            currentModule.assignments?.find(
                (a: Assignment) => a.id === assignmentId
            ) || null
        );
    }, [currentModule, assignmentId]);

    return {
        // URL parameters
        courseId,
        moduleId,
        lessonId,
        assignmentId,

        // Derived entities
        course,
        currentModule,
        currentLesson,
        currentAssignment,

        // Loading states
        isLoadingCourse,

        // Helper functions
        isValidCourse: !!course,
        isValidModule: !!currentModule,
        isValidLesson: !!currentLesson,
        isValidAssignment: !!currentAssignment,
    };
}

/**
 * Hook for course-level data (when only courseId is in URL)
 */
export function useCourseFromUrl(): {
    course: Course | null;
    courseId: string;
    isLoading: boolean;
    isValid: boolean;
} {
    const params = useParams();
    const courseId = params.courseId as string;
    const { course, isLoading } = useCourseById(courseId);

    return {
        course,
        courseId,
        isLoading,
        isValid: !!course,
    };
}

/**
 * Hook for module-level data
 */
export function useModuleFromUrl(): {
    course: Course | null;
    currentModule: Module | null;
    courseId: string;
    moduleId: string;
    isLoading: boolean;
    isValid: boolean;
} {
    const entities = useUrlEntities();

    return {
        course: entities.course,
        currentModule: entities.currentModule,
        courseId: entities.courseId,
        moduleId: entities.moduleId,
        isLoading: entities.isLoadingCourse,
        isValid: entities.isValidModule,
    };
}

/**
 * Hook for lesson-level data
 */
export function useLessonFromUrl(): {
    course: Course | null;
    currentModule: Module | null;
    currentLesson: Lesson | null;
    courseId: string;
    moduleId: string;
    lessonId: string;
    isLoading: boolean;
    isValid: boolean;
} {
    const entities = useUrlEntities();

    return {
        course: entities.course,
        currentModule: entities.currentModule,
        currentLesson: entities.currentLesson,
        courseId: entities.courseId,
        moduleId: entities.moduleId,
        lessonId: entities.lessonId,
        isLoading: entities.isLoadingCourse,
        isValid: entities.isValidLesson,
    };
}

/**
 * Hook for assignment-level data
 */
export function useAssignmentFromUrl(): {
    course: Course | null;
    currentModule: Module | null;
    currentAssignment: Assignment | null;
    courseId: string;
    moduleId: string;
    assignmentId: string;
    isLoading: boolean;
    isValid: boolean;
} {
    const entities = useUrlEntities();

    return {
        course: entities.course,
        currentModule: entities.currentModule,
        currentAssignment: entities.currentAssignment,
        courseId: entities.courseId,
        moduleId: entities.moduleId,
        assignmentId: entities.assignmentId,
        isLoading: entities.isLoadingCourse,
        isValid: entities.isValidAssignment,
    };
}

/**
 * Hook for submission-level data (when submissionId is in URL)
 */
export function useSubmissionFromUrl(): {
    course: Course | null;
    currentModule: Module | null;
    currentAssignment: Assignment | null;
    currentSubmission: any | null; // TODO: Import Submission type
    courseId: string;
    moduleId: string;
    assignmentId: string;
    submissionId: string;
    isLoading: boolean;
    isValid: boolean;
} {
    const params = useParams();
    const submissionId = params.submissionId as string;
    const entities = useUrlEntities();

    // TODO: Add actual submission data fetching based on submissionId
    // For now, return basic structure
    const currentSubmission = useMemo(() => {
        if (!entities.currentAssignment || !submissionId) return null;
        // This would need actual submission fetching logic
        return null;
    }, [entities.currentAssignment, submissionId]);

    return {
        course: entities.course,
        currentModule: entities.currentModule,
        currentAssignment: entities.currentAssignment,
        currentSubmission,
        courseId: entities.courseId,
        moduleId: entities.moduleId,
        assignmentId: entities.assignmentId,
        submissionId,
        isLoading: entities.isLoadingCourse,
        isValid: entities.isValidAssignment && !!submissionId,
    };
}
