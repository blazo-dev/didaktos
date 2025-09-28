import { useMemo } from "react";
import { useAuth } from "../auth/use-auth";
import { useCourses } from "./use-courses";

/**
 * Hook for retrieving a specific course by ID with user relationship context
 *
 * @description Fetches a course by ID from the cached courses data and determines
 * the user's relationship to the course (owner or enrolled). Efficiently uses
 * memoization to compute relationships only when dependencies change.
 *
 * @param {string} id - The unique identifier of the course to retrieve
 *
 * @returns {Object} Object containing:
 *   - course: Course object or null if not found
 *   - isOwner: Boolean indicating if current user owns/instructs the course
 *   - isEnrolled: Boolean indicating if current user is enrolled in the course
 *   - isLoading: Boolean indicating if courses data is loading
 *   - isError: Boolean indicating if there was an error fetching courses
 *   - error: Error object if there was a fetch error
 *   - isFetching: Boolean indicating if data is being refetched
 *
 * @example
 * ```tsx
 * const { course, isOwner, isEnrolled, isLoading } = useCourseById(courseId);
 *
 * if (isLoading) return <Loading />;
 * if (!course) return <CourseNotFound />;
 *
 * return (
 *   <CourseDetail
 *     course={course}
 *     canEdit={isOwner}
 *     showEnrollButton={!isOwner && !isEnrolled}
 *   />
 * );
 * ```
 */
export function useCourseById(id: string) {
    const {
        data: coursesData,
        isLoading,
        isError,
        error,
        isFetching,
    } = useCourses();

    const { user } = useAuth();

    const { course, isOwner, isEnrolled } = useMemo(() => {
        if (!coursesData || !id) {
            return { course: null, isOwner: false, isEnrolled: false };
        }

        const course = coursesData.find((c) => c.id === id) || null;

        const isOwner = Boolean(course && course.instructor?.id === user?.id);
        const isEnrolled = Boolean(
            course && course.enrollments?.includes(user?.id || "")
        );

        return { course, isOwner, isEnrolled };
    }, [coursesData, id, user?.id]);

    return {
        course,
        isOwner,
        isEnrolled,
        isLoading,
        isError,
        error,
        isFetching,
    };
}
