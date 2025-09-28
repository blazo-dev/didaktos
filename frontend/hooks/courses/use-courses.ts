import { coursesApi } from "@/lib/api/course";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook for fetching all courses available to the current user
 *
 * @description Fetches all courses that the user has access to (either owned or enrolled in).
 * Uses React Query for caching, background updates, and loading states. Data is cached
 * under the "courses" query key.
 *
 * @returns {UseQueryResult<Course[]>} React Query result object containing:
 *   - data: Array of Course objects or undefined while loading
 *   - isLoading: Boolean indicating if the initial load is in progress
 *   - error: Any error from the fetch operation
 *   - refetch: Function to manually refresh the courses data
 *
 * @example
 * ```tsx
 * const { data: courses = [], isLoading, error } = useCourses();
 *
 * if (isLoading) return <Loading />;
 * if (error) return <ErrorMessage error={error} />;
 * return <CourseList courses={courses} />;
 * ```
 */
export const useCourses = () => {
    return useQuery({
        queryKey: ["courses"],
        queryFn: coursesApi.getCourses,
    });
};
