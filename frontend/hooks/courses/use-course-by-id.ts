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
        if (!coursesData)
            return { course: null, isOwner: false, isEnrolled: false };

        const isOwner = coursesData.some(
            (course) => course.instructor.id === user?.id
        );
        const isEnrolled = coursesData.some((course) =>
            course.enrollments.includes(user?.id || "")
        );

        return {
            course: coursesData.find((course) => course.id === id),
            isOwner,
            isEnrolled,
        };
    }, [coursesData]);

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
