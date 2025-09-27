import { Submission } from "@/types/course";
import { HttpResponse } from "@/types/http";
import { apiGet, apiPost, apiPut } from "./api";

// Request DTOs to match your backend
export interface SubmissionAddRequestDto {
    assignmentId: string;
    content: string;
}

export interface SubmissionGradeRequestDto {
    id: string;
    grade: number;
    courseId: string;
}

export const submissionsApi = {
    // Create a new submission
    async createSubmission(
        submissionData: SubmissionAddRequestDto
    ): Promise<Submission> {
        const response = await apiPost<HttpResponse<Submission>>(
            "/evaluation/create",
            submissionData
        );
        return response.data;
    },

    // Get all submissions for a course
    async getCourseSubmissions(courseId: string): Promise<Submission[]> {
        const response = await apiGet<HttpResponse<Submission[]>>(
            `/evaluation/enrollments?CourseId=${courseId}`
        );
        return response.data ?? [];
    },

    // Grade a submission (instructor only)
    async gradeSubmission(
        gradeData: SubmissionGradeRequestDto
    ): Promise<Submission> {
        const response = await apiPut<HttpResponse<Submission>>(
            "/evaluation/grade",
            gradeData
        );
        return response.data;
    },
};
