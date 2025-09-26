import { HttpResponse } from "@/types/http";
import { Submission } from "@/types/course";
import { apiFetch, getAuthHeaders } from "./api";

// Request DTOs to match your backend
export interface SubmissionAddRequestDto {
    assignmentId: string;
    content: string;
}

export interface SubmissionGradeRequestDto {
    submissionId: string;
    grade: number;
    feedback?: string;
}

export const submissionsApi = {
    // Create a new submission
    async createSubmission(submissionData: SubmissionAddRequestDto): Promise<Submission> {
        const response = await apiFetch<HttpResponse<Submission>>("/evaluation/create", {
            method: "POST",
            headers: {
                ...getAuthHeaders(),
            },
            body: JSON.stringify(submissionData),
        });
        return response.data;
    },

    // Get all submissions for a course
    async getCourseSubmissions(courseId: string): Promise<Submission[]> {
        const response = await apiFetch<HttpResponse<Submission[]>>(
            `/evaluation/enrollments?CourseId=${courseId}`,
            {
                method: "GET",
                headers: {
                    ...getAuthHeaders(),
                },
            }
        );
        return response.data ?? [];
    },

    // Grade a submission (instructor only)
    async gradeSubmission(gradeData: SubmissionGradeRequestDto): Promise<Submission> {
        const response = await apiFetch<HttpResponse<Submission>>("/evaluation/grade", {
            method: "PUT",
            headers: {
                ...getAuthHeaders(),
            },
            body: JSON.stringify(gradeData),
        });
        return response.data;
    },


};