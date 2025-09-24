import { enrollmentsApi } from "@/lib/api/enrollments";
import { useQuery } from "@tanstack/react-query";

export const useEnrollments = () => {
    return useQuery({
        queryKey: ["enrollments"],
        queryFn: enrollmentsApi.getEnrollments,
    });
};
