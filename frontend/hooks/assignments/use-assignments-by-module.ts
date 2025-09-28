import { assignmentsApi } from "@/lib/api/assignments";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook for fetching all assignments within a specific module
 *
 * @description Retrieves assignments associated with a given module ID. Uses React Query
 * for caching and loading states. Data is cached under ["assignments", moduleId] key.
 *
 * @param {string} moduleId - The unique identifier of the module to fetch assignments for
 *
 * @returns {UseQueryResult<Assignment[]>} React Query result object containing:
 *   - data: Array of Assignment objects or undefined while loading
 *   - isLoading: Boolean indicating if the initial load is in progress
 *   - error: Any error from the fetch operation
 *   - refetch: Function to manually refresh the assignments data
 *
 * @example
 * ```tsx
 * const { data: assignments = [], isLoading } = useAssignmentsByModule(moduleId);
 *
 * if (isLoading) return <Loading />;
 * return <AssignmentList assignments={assignments} />;
 * ```
 */
export const useAssignmentsByModule = (moduleId: string) => {
    return useQuery({
        queryKey: ["assignments", moduleId],
        queryFn: () => assignmentsApi.getAssignmentsByModule(moduleId),
    });
};
