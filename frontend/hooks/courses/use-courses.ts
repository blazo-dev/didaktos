import { coursesApi } from "@/lib/api/course";
import { useQuery } from "@tanstack/react-query";

export const useCourses = () => {
    return useQuery({
        queryKey: ["courses"],
        queryFn: coursesApi.getCourses,
    });
};
