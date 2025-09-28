import { useCourseById } from "@/hooks/courses/use-course-by-id";
import { Assignment, Course, Lesson, Module } from "@/types/course";
import { useParams } from "next/navigation";
import { useMemo } from "react";

/**
 * Base hook to extract and resolve nested entity data from URL parameters
 *
 * @description Replaces global state-based entity management with URL-based entity resolution.
 * Automatically extracts course, module, lesson, and assignment IDs from URL parameters and
 * resolves the corresponding entity objects from the course data hierarchy.
 *
 * @returns {Object} Object containing:
 *   - courseId, moduleId, lessonId, assignmentId: URL parameter strings
 *   - course: Resolved Course object or null
 *   - currentModule, currentLesson, currentAssignment: Resolved nested entities or null
 *   - isLoading: Boolean indicating if course data is loading
 *   - isValid: Boolean indicating if all required entities are found
 *
 * @example
 * ```tsx
 * const {
 *   course,
 *   currentModule,
 *   currentLesson,
 *   isLoading,
 *   isValid
 * } = useUrlEntities();
 *
 * if (isLoading) return <Loading />;
 * if (!isValid) return <NotFound />;
 * return <EntityView course={course} lesson={currentLesson} />;
 * ```
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
 * Hook for course-level data extraction from URL parameters
 *
 * @description Specialized hook for pages that only need course-level data.
 * Extracts courseId from URL parameters and resolves the course object.
 *
 * @returns {Object} Object containing:
 *   - course: Course object or null if not found
 *   - courseId: Course ID string from URL parameters
 *   - isLoading: Boolean indicating if course data is loading
 *   - isValid: Boolean indicating if course was found and loaded
 *
 * @example
 * ```tsx
 * const { course, isLoading, isValid } = useCourseFromUrl();
 *
 * if (isLoading) return <Loading />;
 * if (!isValid) return <CourseNotFound />;
 * return <CourseDetailView course={course} />;
 * ```
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
 * Hook for module-level data extraction from URL parameters
 *
 * @description Specialized hook for pages that need course and module context.
 * Extracts courseId and moduleId from URL parameters and resolves both entities.
 *
 * @returns {Object} Object containing:
 *   - course: Parent Course object or null
 *   - currentModule: Module object or null if not found
 *   - courseId, moduleId: ID strings from URL parameters
 *   - isLoading: Boolean indicating if course data is loading
 *   - isValid: Boolean indicating if both course and module were found
 *
 * @example
 * ```tsx
 * const { course, currentModule, isLoading, isValid } = useModuleFromUrl();
 *
 * if (isLoading) return <Loading />;
 * if (!isValid) return <ModuleNotFound />;
 * return <ModuleView course={course} module={currentModule} />;
 * ```
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
 * Hook for lesson-level data extraction from URL parameters
 *
 * @description Specialized hook for pages that need course, module, and lesson context.
 * Extracts courseId, moduleId, and lessonId from URL parameters and resolves all entities.
 *
 * @returns {Object} Object containing:
 *   - course: Parent Course object or null
 *   - currentModule: Parent Module object or null
 *   - currentLesson: Lesson object or null if not found
 *   - courseId, moduleId, lessonId: ID strings from URL parameters
 *   - isLoading: Boolean indicating if course data is loading
 *   - isValid: Boolean indicating if course, module, and lesson were found
 *
 * @example
 * ```tsx
 * const {
 *   course,
 *   currentModule,
 *   currentLesson,
 *   isLoading,
 *   isValid
 * } = useLessonFromUrl();
 *
 * if (isLoading) return <Loading />;
 * if (!isValid) return <LessonNotFound />;
 * return <LessonView course={course} module={currentModule} lesson={currentLesson} />;
 * ```
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
 * Hook for assignment-level data extraction from URL parameters
 *
 * @description Specialized hook for pages that need course, module, and assignment context.
 * Extracts courseId, moduleId, and assignmentId from URL parameters and resolves all entities.
 *
 * @returns {Object} Object containing:
 *   - course: Parent Course object or null
 *   - currentModule: Parent Module object or null
 *   - currentAssignment: Assignment object or null if not found
 *   - courseId, moduleId, assignmentId: ID strings from URL parameters
 *   - isLoading: Boolean indicating if course data is loading
 *   - isValid: Boolean indicating if course, module, and assignment were found
 *
 * @example
 * ```tsx
 * const {
 *   course,
 *   currentModule,
 *   currentAssignment,
 *   isLoading,
 *   isValid
 * } = useAssignmentFromUrl();
 *
 * if (isLoading) return <Loading />;
 * if (!isValid) return <AssignmentNotFound />;
 * return <AssignmentView assignment={currentAssignment} course={course} />;
 * ```
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
 * Hook for submission-level data extraction from URL parameters
 *
 * @description Specialized hook for pages that need complete entity hierarchy including
 * submissions. Extracts all relevant IDs from URL parameters and resolves the full
 * entity chain. Note: Currently requires additional API call for submission data.
 *
 * @returns {Object} Object containing:
 *   - course: Parent Course object or null
 *   - currentModule: Parent Module object or null
 *   - currentAssignment: Parent Assignment object or null
 *   - currentSubmission: Submission object or null (TODO: requires API integration)
 *   - courseId, moduleId, assignmentId, submissionId: ID strings from URL parameters
 *   - isLoading: Boolean indicating if course data is loading
 *   - isValid: Boolean indicating if course, module, and assignment were found
 *
 * @example
 * ```tsx
 * const {
 *   course,
 *   currentAssignment,
 *   currentSubmission,
 *   isLoading,
 *   isValid
 * } = useSubmissionFromUrl();
 *
 * if (isLoading) return <Loading />;
 * if (!isValid) return <SubmissionNotFound />;
 * return <SubmissionView submission={currentSubmission} assignment={currentAssignment} />;
 * ```
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
