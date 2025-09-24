import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "../../lib/api/course";
import { Course } from "../../types/course";

export const useCourse = (id: string) => {
    return useQuery<Course>({
        queryKey: ["courses", id],
        queryFn: () => coursesApi.getCourse(id),
        enabled: !!id,
    });
};
