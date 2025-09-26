import { assignmentsApi } from "@/lib/api/assignments";
import { useQuery } from "@tanstack/react-query";

export const useAssignmentsByModule = (moduleId: string) => {
    return useQuery({
        queryKey: ["assignments", moduleId],
        queryFn: () => assignmentsApi.getAssignmentsByModule(moduleId),
    });
};
