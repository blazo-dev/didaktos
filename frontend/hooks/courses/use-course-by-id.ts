import { useMemo } from "react";
import { useAuth } from "../auth/use-auth";
import { useCourses } from "./use-courses";

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

        const isOwner = Boolean(course && course.instructor.id === user?.id);
        const isEnrolled = Boolean(
            course && course.enrollments.includes(user?.id || "")
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
