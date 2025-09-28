import { submissionsApi } from "@/lib/api/submission";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook for fetching all submissions within a specific course
 *
 * @description Retrieves all submissions for assignments within a given course.
 * Typically used by instructors to view and grade student submissions. Uses React Query
 * for caching and loading states. Data is cached under ["submissions"] key.
 *
 * @param {string} courseId - The unique identifier of the course to fetch submissions for
 *
 * @returns {UseQueryResult<Submission[]>} React Query result object containing:
 *   - data: Array of Submission objects or undefined while loading
 *   - isLoading: Boolean indicating if the initial load is in progress
 *   - error: Any error from the fetch operation
 *   - refetch: Function to manually refresh the submissions data
 *
 * @example
 * ```tsx
 * const { data: submissions = [], isLoading } = useGetAllSubmissionsByCourse(courseId);
 *
 * if (isLoading) return <Loading />;
 * return <SubmissionsList submissions={submissions} />;
 * ```
 */
export const useGetAllSubmissionsByCourse = (courseId: string) => {
    return useQuery({
        queryKey: ["submissions"],
        queryFn: () => submissionsApi.getCourseSubmissions(courseId),
    });
};
