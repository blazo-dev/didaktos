import { submissionsApi } from "@/lib/api/submission";
import { useQuery } from "@tanstack/react-query";

export const useGetAllSubmissionsByCourse = (courseId: string) => {
    return useQuery({
        queryKey: ["submissions", courseId],
        queryFn: () => submissionsApi.getCourseSubmissions(courseId),
    });
};
